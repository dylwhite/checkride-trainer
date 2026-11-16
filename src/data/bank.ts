// The whole question bank. Add new batches here.
import { FACT_ITEMS } from './facts';
import { ITEMS } from './items';
import { SCENARIOS } from './scenarios';
import type { Item } from './types';
import { wbItem } from './wb';

const STATIC: Item[] = [...ITEMS, ...SCENARIOS, ...FACT_ITEMS];

// Returns the bank with fresh copies of generated items (e.g. a new W&B problem).
export function bank(): Item[] {
  return [...STATIC, wbItem()];
}

export function byId(id: string, from: Item[] = STATIC): Item | undefined {
  return from.find((i) => i.id === id);
}

export const BANK_SIZE = STATIC.length + 1;
