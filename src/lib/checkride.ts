// Full mock checkride oral, in ACS order, built around one planned cross-country.
// Deterministic from a seed, so a saved checkride rebuilds identically when resumed.
import { bank, byId } from '../data/bank';
import { buildStory, mulberry, type Story } from '../data/story';
import type { Item } from '../data/types';
import { chainFor, type Exchange } from '../screens/Oral';

export interface Section {
  code: string;
  title: string;
  intro: string; // what the examiner says to open the section
  topics: string[];
  story?: string[]; // briefing items from the planned flight (by item id)
  emergency?: boolean;
  leads: number; // how many questions to draw from the bank
}

export const SECTIONS = (s: Story): Section[] => [
  { code: 'I.A', title: 'Pilot Qualifications', intro: 'Let’s start with you. Walk me through what makes you eligible to be here and what you’ll be allowed to do afterward.', topics: ['p-cert', 'p-medical', 'p-basicmed', 'p-qual', 'p-privileges', 'p-limits', 'p-resp', 'p-legal', 'p-currency', 'p-endorse'], leads: 5 },
  { code: 'I.B', title: 'Airworthiness Requirements', intro: 'Now let’s look at the airplane. How do you know this 152 is legal to fly today?', topics: ['a-docs', 'a-awcert', 'a-reg', 'a-inspect', 'a-ads', 'a-logs', 'a-prevmx', 'a-inop', 'a-sfp'], story: ['st-annual'], leads: 4 },
  { code: 'I.C', title: 'Weather Information', intro: `You planned a flight from Hillsboro to ${s.dest.name}. Brief me on the weather.`, topics: ['v-wx-enroute', 'v-wx-general'], story: ['st-wx', 'st-xw'], leads: 3 },
  { code: 'I.D', title: 'Cross-Country Flight Planning', intro: `Show me your planning for ${s.dest.name}: route, altitude, fuel, and loading.`, topics: ['v-nav', 'v-fuelreq', 'v-flightplan', 'e-pressures'], story: ['st-wb', 'st-ext'], leads: 3 },
  { code: 'I.E', title: 'National Airspace System', intro: 'Let’s look at the airspace along your route on the sectional.', topics: ['v-airspace'], leads: 4 },
  { code: 'I.F', title: 'Performance and Limitations', intro: 'Let’s talk performance. Can the airplane do what you’re asking of it?', topics: ['a-perf', 'a-wb', 'e-perf', 'a-aero'], leads: 4 },
  { code: 'I.G', title: 'Operation of Systems', intro: 'Tell me about the airplane’s systems.', topics: ['a-engine', 'a-fuel', 'a-elec', 'a-carbheat', 'a-pitot', 'a-hyd'], leads: 4 },
  { code: 'I.H', title: 'Human Factors', intro: 'Now let’s talk about you as the pilot: fitness, decision-making, and physiology.', topics: ['p-imsafe', 'e-aeromed', 'p-attitudes', 'p-adm', 'p-3p'], story: ['st-pilot'], leads: 4 },
  { code: 'II–III', title: 'Preflight and Airport Operations', intro: 'Let’s head out to the airplane and get to the runway.', topics: ['a-preflight', 'e-brief', 'e-airportops', 'v-airport', 'v-lostcomm', 'v-transponder', 'v-wake'], leads: 4 },
  { code: 'VI', title: 'Navigation', intro: `You’re en route to ${s.dest.name}. Let’s talk navigation, and what you’d do if things don’t go to plan.`, topics: ['v-nav', 'v-lost', 'v-mountain'], leads: 3 },
  { code: 'IX', title: 'Emergency Operations', intro: 'Now some things that can go wrong on the way.', topics: [], emergency: true, leads: 4 },
  { code: 'XI–XII', title: 'Night Operations and Wrap-up', intro: 'Last area: suppose you’re coming home after dark.', topics: ['e-regs', 'e-aeromed'], leads: 2 }
];

export interface Planned { exchanges: (Exchange & { section: number })[]; sections: Section[]; story: Story }

export function buildCheckride(seed: number): Planned {
  const rnd = mulberry(seed);
  const story = buildStory(seed, (id) => byId(id));
  const sections = SECTIONS(story);
  const all = bank().filter((i) => i.id !== 'wb-calc');
  const used = new Set<string>();
  const shuffle = <T,>(a: T[]) => a.map((v) => [rnd(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const varsFor = (i: Item) => Object.fromEntries(Object.entries(i.vars ?? {}).map(([k, o]) => [k, o[Math.floor(rnd() * o.length)]]));
  const exchanges: (Exchange & { section: number })[] = [];

  sections.forEach((sec, si) => {
    const add = (list: Exchange[]) => list.forEach((e) => exchanges.push({ ...e, section: si }));
    for (const id of sec.story ?? []) {
      const b = story.briefing.find((l) => l.item.id === id);
      if (b) add(chainFor(b.item, {}, all, rnd).slice(0, 2));
    }
    const pool = shuffle(all.filter((i) => !used.has(i.id) && (sec.emergency ? i.emergency : sec.topics.includes(i.topic)) && i.choices));
    // One scenario or chart question (with the full why / where chain), the rest quick recall.
    const lead = pool.find((i) => i.kind !== 'recall');
    // Make sure the section's first topic (e.g. eligibility in I.A) gets asked, then order by outline topic order.
    const first = sec.topics[0] ? pool.find((i) => i.topic === sec.topics[0] && i !== lead) : undefined;
    const picks = [...new Set([...(first ? [first] : []), ...(lead ? [lead] : []), ...pool.filter((i) => i !== lead && i.kind === 'recall')])]
      .slice(0, sec.leads)
      .sort((x, y) => (sec.topics.indexOf(x.topic) + 99) % 99 - (sec.topics.indexOf(y.topic) + 99) % 99);
    for (const it of picks) {
      used.add(it.id);
      add(chainFor(it, varsFor(it), all, rnd));
      if (it.next) used.add(it.next);
    }
  });
  return { exchanges, sections, story };
}
