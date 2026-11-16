import { useEffect, useState } from 'preact/hooks';
import { getLog, readiness, type Readiness } from './progress';

export const LEVELS = [
  { name: 'Student', xp: 0 },
  { name: 'Solo', xp: 1000 },
  { name: 'Cross-Country', xp: 2500 },
  { name: 'Checkride Ready', xp: 5000 }
];

export function levelFor(xp: number) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++;
  const next = LEVELS[i + 1];
  return { name: LEVELS[i].name, floor: LEVELS[i].xp, next: next?.name ?? null, ceil: next?.xp ?? LEVELS[i].xp };
}

export function useProgress(): Readiness | null {
  const [r, setR] = useState<Readiness | null>(null);
  useEffect(() => { getLog().then((log) => setR(readiness(log))); }, []);
  return r;
}
