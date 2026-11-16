// Builds short study sessions from the item bank and fills in scenario variables.
import { bank, byId } from '../data/bank';
import type { Item } from '../data/types';
import { prioritize, type AnswerLog, type TopicState, type Verdict } from './progress';
import { load, save } from './storage';
export type { Verdict, AnswerLog };

export interface SessionStep {
  item: Item;
  vars: Record<string, string>;
}

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
function shuffle<T>(a: T[]) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

function step(item: Item, shared: Record<string, string> = {}): SessionStep {
  const vars: Record<string, string> = { ...shared };
  for (const [k, opts] of Object.entries(item.vars ?? {})) if (!(k in vars)) vars[k] = pick(opts);
  return { item, vars };
}

// Items that are someone's follow-up only appear right after their lead item.
function followUpIds(items: Item[]) {
  return new Set(items.map((i) => i.next).filter(Boolean) as string[]);
}

export function buildSession(leads = 5, filter: (i: Item) => boolean = () => true, topics?: Map<string, TopicState>): SessionStep[] {
  const all = bank();
  const fu = followUpIds(all);
  const eligible = all.filter((i) => !fu.has(i.id) && filter(i));
  // With spaced-repetition data: due topics first, one question per topic, then fill randomly.
  const ordered = topics ? prioritize(eligible, topics) : [];
  const rest = shuffle(eligible.filter((i) => !ordered.includes(i)));
  const pool = [...ordered, ...rest];
  const steps: SessionStep[] = [];
  for (const lead of pool.slice(0, leads)) {
    const s = step(lead);
    steps.push(s);
    const f = lead.next && byId(lead.next, all);
    if (f) steps.push(step(f, s.vars));
  }
  return steps;
}

// Every answer is saved immediately, so quitting mid-session loses nothing.
export async function logAnswer(id: string, v: Verdict, extra: { topic?: string; xp?: number } = {}) {
  const log = await load<AnswerLog[]>('answers', []);
  log.push({ id, v, at: Date.now(), ...extra });
  await save('answers', log);
}

export const DRILL_LABEL: Record<string, string> = {
  mixed: 'Mixed drill', scenario: 'Scenario drill', recall: 'Quick-recall drill', chart: 'Chart drill',
  emergency: 'Emergency drill', P: 'Pilot drill', A: 'Aircraft drill', V: 'enVironment drill', E: 'External drill', weak: 'Weak-spot drill'
};

// Topics you've missed most (miss = 1, partial = 0.5), from the saved answer log.
export async function weakTopics(limit = 4): Promise<string[]> {
  const log = await load<AnswerLog[]>('answers', []);
  const all = bank();
  const topicOf = new Map(all.map((i) => [i.id, i.topic]));
  const score = new Map<string, { bad: number; n: number }>();
  for (const a of log) {
    const t = a.topic ?? topicOf.get(a.id);
    if (!t) continue;
    const s = score.get(t) ?? { bad: 0, n: 0 };
    s.n++;
    s.bad += a.v === 'miss' ? 1 : a.v === 'partial' ? 0.5 : 0;
    score.set(t, s);
  }
  return [...score.entries()]
    .filter(([, s]) => s.bad > 0)
    .sort((a, b) => b[1].bad / b[1].n - a[1].bad / a[1].n || b[1].bad - a[1].bad)
    .slice(0, limit)
    .map(([t]) => t);
}

export async function drillFilter(kind: string): Promise<(i: Item) => boolean> {
  switch (kind) {
    case 'scenario': return (i) => i.kind === 'scenario';
    case 'recall': return (i) => i.kind === 'recall';
    case 'chart': return (i) => i.kind === 'chart';
    case 'emergency': return (i) => !!i.emergency;
    case 'P': case 'A': case 'V': case 'E': return (i) => i.pave === kind;
    case 'weak': {
      const t = new Set(await weakTopics());
      return (i) => t.has(i.topic);
    }
    default:
      if (kind.startsWith('topic:')) { const id = kind.slice(6); return (i) => i.topic === id; }
      return () => true;
  }
}
