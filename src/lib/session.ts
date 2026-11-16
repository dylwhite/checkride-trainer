// Builds short study sessions from the item bank and fills in scenario variables.
import { bank, byId } from '../data/bank';
import type { Item } from '../data/types';
import { load, save } from './storage';

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

export function buildSession(leads = 5, filter: (i: Item) => boolean = () => true): SessionStep[] {
  const all = bank();
  const fu = followUpIds(all);
  const pool = shuffle(all.filter((i) => !fu.has(i.id) && filter(i)));
  const steps: SessionStep[] = [];
  for (const lead of pool.slice(0, leads)) {
    const s = step(lead);
    steps.push(s);
    const f = lead.next && byId(lead.next, all);
    if (f) steps.push(step(f, s.vars));
  }
  return steps;
}

export type Verdict = 'ok' | 'partial' | 'miss';
export interface AnswerLog {
  id: string;
  v: Verdict;
  at: number;
}

// Every answer is saved immediately, so quitting mid-session loses nothing.
export async function logAnswer(id: string, v: Verdict) {
  const log = await load<AnswerLog[]>('answers', []);
  log.push({ id, v, at: Date.now() });
  await save('answers', log);
}
