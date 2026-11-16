export type Pave = 'P' | 'A' | 'V' | 'E';

export const PAVE: Record<Pave, { name: string; short: string; color: string }> = {
  P: { name: 'Pilot', short: 'Pilot', color: 'var(--pave-p)' },
  A: { name: 'Aircraft', short: 'Aircraft', color: 'var(--pave-a)' },
  V: { name: 'enVironment', short: 'enVironment', color: 'var(--pave-v)' },
  E: { name: 'External factors', short: 'External', color: 'var(--pave-e)' }
};

export type ItemKind = 'scenario' | 'recall' | 'chart';

export interface Choice {
  t: string;
  ok?: boolean;
  why?: string; // shown when this wrong choice is picked
}

export interface ChartRef {
  src: string; // file under public/charts
  chart: 'Seattle' | 'Klamath Falls';
  caption: string;
}

export interface Item {
  id: string;
  kind: ItemKind;
  emergency?: boolean;
  pave: Pave;
  topic: string; // outline topic id
  acs: string[];
  vars?: Record<string, string[]>; // template variables: {name} in text
  setup?: string[];
  readout?: { tag: string; cat?: 'VFR' | 'MVFR' | 'IFR' | 'LIFR'; text: string };
  chart?: ChartRef;
  prompt: string;
  choices?: Choice[]; // multiple choice; otherwise self-graded reveal
  answer?: string[]; // model answer for self-graded items
  explain: string[];
  think?: string;
  c: string[]; // citations
  read?: { label: string; url: string }[];
  next?: string; // id of the quick-recall follow-up
  xp: number;
}
