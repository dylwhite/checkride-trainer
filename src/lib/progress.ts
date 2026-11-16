// Progress, spaced repetition, and readiness — all computed from the saved answer log,
// so there's one source of truth and nothing to get out of sync.
import { bank } from '../data/bank';
import { OUTLINE } from '../data/outline';
import type { Item, Pave } from '../data/types';
import { load } from './storage';

export type Verdict = 'ok' | 'partial' | 'miss';
export interface AnswerLog { id: string; v: Verdict; at: number; topic?: string; xp?: number }

// Topic boxes 0–5. Interval before a topic is due again, by box.
const MIN = 60_000, DAY = 86_400_000;
const INTERVAL = [10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY];

export interface TopicState { box: number; due: number; seen: number; ok: number; lastItem: string; lastAt: number }

let topicOfCache: Map<string, string> | null = null;
function topicOf(id: string, fallback?: string) {
  if (!topicOfCache) topicOfCache = new Map(bank().map((i) => [i.id, i.topic]));
  return fallback ?? topicOfCache.get(id);
}

export function replay(log: AnswerLog[]): Map<string, TopicState> {
  const m = new Map<string, TopicState>();
  for (const a of log) {
    const t = topicOf(a.id, a.topic);
    if (!t) continue;
    const s = m.get(t) ?? { box: 0, due: 0, seen: 0, ok: 0, lastItem: '', lastAt: 0 };
    if (a.v === 'ok') s.box = Math.min(5, s.box + 1);
    else if (a.v === 'partial') s.box = Math.max(0, s.box - 1);
    else s.box = 0;
    const wait = a.v === 'partial' ? Math.max(DAY, INTERVAL[s.box]) : INTERVAL[s.box];
    s.due = a.at + wait;
    s.seen++;
    if (a.v === 'ok') s.ok++;
    s.lastItem = a.id;
    s.lastAt = a.at;
    m.set(t, s);
  }
  return m;
}

export async function getLog() {
  return load<AnswerLog[]>('answers', []);
}

// Mastery of one topic, 0–1: box 4+ counts as mastered.
export const mastery = (s?: TopicState) => (s ? Math.min(1, s.box / 4) : 0);

export interface Readiness {
  pave: Record<Pave, number>;
  areas: { area: string; name: string; pct: number; topics: number }[];
  topics: Map<string, TopicState>;
  xp: number;
  answered: number;
  streak: number;
  dueCount: number;
  nextDue: string | null;
}

const AREA_NAMES: Record<string, string> = {
  I: 'Preflight Preparation', II: 'Preflight Procedures', III: 'Airport Operations', IV: 'Takeoffs, Landings & Go-Arounds',
  V: 'Performance & Ground Reference', VI: 'Navigation', VII: 'Slow Flight & Stalls', VIII: 'Basic Instrument Maneuvers',
  IX: 'Emergency Operations', XI: 'Night Operations', XII: 'Postflight Procedures'
};

const areaOf = (code: string) => code.split('.')[1];

// Consecutive days (ending today or yesterday) with at least one answer.
export function streakOf(log: AnswerLog[], now = Date.now()) {
  const days = new Set(log.map((a) => new Date(a.at).toDateString()));
  let streak = 0;
  const d = new Date(now);
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

const XP_DEFAULT = { ok: 10, partial: 5, miss: 0 };

export function readiness(log: AnswerLog[], now = Date.now()): Readiness {
  const topics = replay(log);
  const outlineTopics = OUTLINE.map((t) => t);
  const pave = { P: 0, A: 0, V: 0, E: 0 } as Record<Pave, number>;
  for (const p of ['P', 'A', 'V', 'E'] as Pave[]) {
    const ts = outlineTopics.filter((t) => t.pave === p);
    pave[p] = ts.length ? Math.round((ts.reduce((s, t) => s + mastery(topics.get(t.id)), 0) / ts.length) * 100) : 0;
  }
  // ACS areas: each topic counts toward every area its questions are tagged with.
  const areaTopics = new Map<string, Set<string>>();
  for (const i of bank()) for (const c of i.acs) {
    const a = areaOf(c);
    if (!AREA_NAMES[a]) continue;
    if (!areaTopics.has(a)) areaTopics.set(a, new Set());
    areaTopics.get(a)!.add(i.topic);
  }
  const order = Object.keys(AREA_NAMES);
  const areas = [...areaTopics.entries()]
    .sort((x, y) => order.indexOf(x[0]) - order.indexOf(y[0]))
    .map(([area, set]) => ({
      area, name: AREA_NAMES[area], topics: set.size,
      pct: Math.round(([...set].reduce((s, t) => s + mastery(topics.get(t)), 0) / set.size) * 100)
    }));
  const xp = log.reduce((s, a) => s + (a.xp ?? XP_DEFAULT[a.v]), 0);
  const dueCount = [...topics.values()].filter((s) => s.due <= now).length;
  const upcoming = [...topics.values()].map((s) => s.due).filter((d) => d > now).sort((a, b) => a - b)[0];
  const mins = upcoming ? Math.round((upcoming - now) / MIN) : 0;
  const nextDue = upcoming ? (mins < 60 ? `in ${Math.max(1, mins)} min` : mins < 24 * 60 ? `in ${Math.round(mins / 60)} h` : `in ${Math.round(mins / 1440)} days`) : null;
  return { pave, areas, topics, xp, answered: log.length, streak: streakOf(log, now), dueCount, nextDue };
}

// Pick lead items for a session: overdue topics first (most overdue first), then new topics,
// then the rest. Within a topic, avoid the question you saw last time.
export function prioritize(pool: Item[], topics: Map<string, TopicState>, now = Date.now()): Item[] {
  const byTopic = new Map<string, Item[]>();
  for (const i of pool) {
    if (!byTopic.has(i.topic)) byTopic.set(i.topic, []);
    byTopic.get(i.topic)!.push(i);
  }
  const rank = (t: string) => {
    const s = topics.get(t);
    if (!s) return 1; // new
    if (s.due <= now) return 0 - (now - s.due) / DAY - 1; // overdue first
    return 2 + (s.due - now) / DAY; // not due: soonest first
  };
  const order = [...byTopic.keys()].map((t) => [t, rank(t) + Math.random() * 0.5] as const).sort((a, b) => a[1] - b[1]);
  const out: Item[] = [];
  for (const [t] of order) {
    const items = byTopic.get(t)!;
    const last = topics.get(t)?.lastItem;
    const fresh = items.filter((i) => i.id !== last);
    const choice = (fresh.length ? fresh : items)[Math.floor(Math.random() * (fresh.length || items.length))];
    out.push(choice);
  }
  return out;
}
