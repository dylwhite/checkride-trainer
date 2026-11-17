// How a mixed session splits between scenarios, quick recall, and charts.
// Saved on the device with the rest of your progress (and included in backups).
import type { Item } from '../data/types';
import { load, save } from './storage';

export interface Mix { scenario: number; recall: number; chart: number }
export const DEFAULT_MIX: Mix = { scenario: 60, recall: 25, chart: 15 };

export const getMix = () => load<Mix>('mix', DEFAULT_MIX);
export const setMix = (m: Mix) => save('mix', m);

// Turn the mix into whole-question counts for a session of n questions (largest remainder).
export function quotas(m: Mix, n: number): Mix {
  const keys = ['scenario', 'recall', 'chart'] as const;
  const total = keys.reduce((s, k) => s + m[k], 0) || 1;
  const raw = keys.map((k) => (m[k] / total) * n);
  const out = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - out[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (let j = 0; out.reduce((s, v) => s + v, 0) < n; j++) out[order[j % 3][1]]++;
  return { scenario: out[0], recall: out[1], chart: out[2] };
}

// Pick n items from an already-prioritized list so the kinds follow the mix.
// If a kind runs short, the remaining slots go to whatever is next in priority.
export function applyMix(pool: Item[], m: Mix, n: number): Item[] {
  const q = quotas(m, n);
  const left = { ...q };
  const picked: Item[] = [];
  for (const i of pool) {
    if (picked.length >= n) break;
    const k = i.kind as keyof Mix;
    if (left[k] > 0) { left[k]--; picked.push(i); }
  }
  for (const i of pool) {
    if (picked.length >= n) break;
    if (!picked.includes(i)) picked.push(i);
  }
  // Shuffle so the kinds are mixed instead of arriving in blocks.
  return picked.map((i) => [Math.random(), i] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}
