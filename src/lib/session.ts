// Builds short study sessions from the item bank and fills in scenario variables.
import { ITEMS, itemById } from '../data/items';
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
const followUps = new Set(ITEMS.map((i) => i.next).filter(Boolean) as string[]);

export function buildSession(leads = 5): SessionStep[] {
  const pool = shuffle(ITEMS.filter((i) => !followUps.has(i.id)));
  const steps: SessionStep[] = [];
  for (const lead of pool.slice(0, leads)) {
    const s = step(lead);
    steps.push(s);
    const f = lead.next && itemById(lead.next);
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
