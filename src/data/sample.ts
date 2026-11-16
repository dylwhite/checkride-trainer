// Placeholder progress numbers for the Today screen until Phase 4 tracks real progress.
import type { Pave } from './types';

export const SAMPLE_PROFILE = {
  streak: 6,
  xp: 1240,
  level: 'Solo',
  nextLevel: 'Cross-Country',
  levelFloor: 1000,
  levelCeil: 2500,
  readiness: { P: 72, A: 54, V: 61, E: 38 } as Record<Pave, number>,
  flight: {
    from: 'KHIO',
    to: 'KBDN',
    chapter: 'Chapter 3 · En route',
    teaser: 'Level at 9,500 over the Cascades. The engine just began to run a little rough…',
    phase: 2, // 0 Brief · 1 Depart · 2 En route · 3 Arrive · 4 Debrief
    progress: 0.55
  }
};
