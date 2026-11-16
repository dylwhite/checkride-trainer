// DESIGN PREVIEW sample data (Phase 1). Real, verified content arrives in Phase 2.
export type Pave = 'P' | 'A' | 'V' | 'E';

export const PAVE: Record<Pave, { name: string; short: string; color: string }> = {
  P: { name: 'Pilot', short: 'Pilot', color: 'var(--pave-p)' },
  A: { name: 'Aircraft', short: 'Aircraft', color: 'var(--pave-a)' },
  V: { name: 'enVironment', short: 'enVironment', color: 'var(--pave-v)' },
  E: { name: 'External factors', short: 'External', color: 'var(--pave-e)' }
};

export interface Citation {
  label: string;
  url?: string;
}

export interface ChoiceQuestion {
  kind: 'scenario';
  id: string;
  pave: Pave;
  acs: string;
  topic: string;
  setup: string[];
  readout?: { tag: string; category: 'VFR' | 'MVFR' | 'IFR' | 'LIFR'; text: string };
  prompt: string;
  choices: { text: string; correct?: boolean; whyNot?: string }[];
  explanation: string[];
  thinkLikeAPilot: string;
  citations: Citation[];
  furtherReading: { label: string; url: string }[];
  xp: number;
}

export interface RecallQuestion {
  kind: 'recall';
  id: string;
  pave: Pave;
  acs: string;
  topic: string;
  prompt: string;
  answer: string[];
  citations: Citation[];
  xp: number;
}

export const SAMPLE_SESSION: [ChoiceQuestion, RecallQuestion] = [
  {
    kind: 'scenario',
    id: 'preview-khio-vis',
    pave: 'V',
    acs: 'PA.I.E',
    topic: 'VFR weather minimums',
    setup: [
      'Saturday morning at Hillsboro. You planned a local flight to practice landings. The tower is open, so you’re in Class D airspace.',
      'You listen to the ATIS before starting the engine:'
    ],
    readout: {
      tag: 'Sample METAR · fictional',
      category: 'IFR',
      text: 'KHIO 161753Z 20008KT 2SM BR BKN015 OVC025 09/08 A3002'
    },
    prompt: 'Can you take off and fly the pattern under basic VFR?',
    choices: [
      {
        text: 'Yes. The ceiling is above 1,000 ft, so I’m legal in Class D.',
        whyNot: 'The ceiling is only half the rule. Visibility must also be at least 3 SM.'
      },
      {
        text: 'No. Ground visibility must be at least 3 SM to take off under VFR in the Class D surface area.',
        correct: true
      },
      {
        text: 'Yes. 1 SM and clear of clouds is enough below 1,200 ft AGL.',
        whyNot: 'That is the daytime Class G minimum. KHIO is in Class D.'
      },
      {
        text: 'Yes, as long as I climb above the clouds after takeoff.',
        whyNot: 'Basic VFR doesn’t allow departing the surface area with less than 3 SM, and VFR on top of an overcast is a trap.'
      }
    ],
    explanation: [
      'Hillsboro has an operating control tower, so the airport sits in a **Class D surface area**.',
      'To take off, land, or enter the traffic pattern under VFR inside that surface area, **ground visibility must be at least 3 statute miles** and the **ceiling at least 1,000 ft**. Here the ceiling (1,500 ft broken) is fine, but visibility is only 2 SM.',
      'The only legal way out under VFR would be a **Special VFR clearance** from ATC.'
    ],
    thinkLikeAPilot:
      'Temperature 09, dewpoint 08: a 1° spread with mist. Ask yourself whether conditions are more likely to improve or get worse before you’d return.',
    citations: [
      { label: '14 CFR 91.155(c)', url: 'https://www.ecfr.gov/current/title-14/section-91.155' },
      { label: '14 CFR 91.155(d)', url: 'https://www.ecfr.gov/current/title-14/section-91.155' },
      { label: '14 CFR 91.157', url: 'https://www.ecfr.gov/current/title-14/section-91.157' }
    ],
    furtherReading: [{ label: 'Boldmethod', url: 'https://www.boldmethod.com/' }],
    xp: 15
  },
  {
    kind: 'recall',
    id: 'preview-classd-mins',
    pave: 'V',
    acs: 'PA.I.E',
    topic: 'VFR weather minimums',
    prompt: 'What are the basic VFR weather minimums in Class D airspace?',
    answer: [
      '**3 SM** flight visibility',
      'Cloud clearance: **500 ft below, 1,000 ft above, 2,000 ft horizontal**',
      'In the surface area: **1,000 ft ceiling** and **3 SM ground visibility** to take off, land, or enter the pattern'
    ],
    citations: [
      { label: '14 CFR 91.155(a)', url: 'https://www.ecfr.gov/current/title-14/section-91.155' },
      { label: '14 CFR 91.155(c)–(d)', url: 'https://www.ecfr.gov/current/title-14/section-91.155' }
    ],
    xp: 10
  }
];

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
