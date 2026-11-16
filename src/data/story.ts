// Flight Story: builds a random cross-country from KHIO with a PAVE briefing, a go/no-go call,
// and decision points drawn from the verified item bank. Airport data is from the Chart Supplement
// NW (29 Oct–24 Dec 2026). Weather is fictional but follows AIM 7-1-7 flight categories.
import type { Choice, Item, Pave } from './types';
import { MINIMUMS } from './minimums';
import { compute, type Load } from './wb';

export interface Dest {
  id: string; name: string; elev: number; rwy: string; len: number;
  freq: string; airspace: string; east: boolean; chart: 'Seattle' | 'Klamath Falls';
}
export const DESTS: Dest[] = [
  { id: 'KBDN', name: 'Bend', elev: 3459, rwy: '17-35', len: 5201, freq: 'CTAF 123.0', airspace: 'Class E', east: true, chart: 'Klamath Falls' },
  { id: 'KRDM', name: 'Redmond', elev: 3082, rwy: '05-23', len: 7038, freq: 'Tower 124.5 (part-time)', airspace: 'Class D when tower open', east: true, chart: 'Klamath Falls' },
  { id: 'KEUG', name: 'Eugene', elev: 374, rwy: '16R-34L', len: 8009, freq: 'Tower 118.9 (part-time)', airspace: 'Class D when tower open', east: false, chart: 'Klamath Falls' },
  { id: 'KSLE', name: 'Salem', elev: 213, rwy: '13-31', len: 5811, freq: 'Tower 119.1 (part-time)', airspace: 'Class D when tower open', east: false, chart: 'Seattle' },
  { id: 'KOLM', name: 'Olympia', elev: 208, rwy: '17-35', len: 5500, freq: 'Tower 124.4 (part-time)', airspace: 'Class D when tower open', east: false, chart: 'Seattle' },
  { id: 'KAST', name: 'Astoria', elev: 15, rwy: '08-26', len: 5794, freq: 'CTAF 122.8', airspace: 'Class E', east: false, chart: 'Seattle' }
];

export type Season = 'summer' | 'fall' | 'winter' | 'spring';
export type Cat = 'VFR' | 'MVFR' | 'IFR' | 'LIFR';

export interface Wx { ceil: number | null; vis: number; text: string; cat: Cat; note?: string; dir: number; spd: number; gust: number | null }

// AIM 7-1-7 categorical conditions.
export function category(ceil: number | null, vis: number): Cat {
  const c = ceil ?? 99999;
  if (c < 500 || vis < 1) return 'LIFR';
  if (c < 1000 || vis < 3) return 'IFR';
  if (c <= 3000 || vis <= 5) return 'MVFR';
  return 'VFR';
}

type Rng = () => number;
const pick = <T,>(r: Rng, a: T[]) => a[Math.floor(r() * a.length)];
const between = (r: Rng, lo: number, hi: number, step = 1) => lo + step * Math.floor(r() * ((hi - lo) / step + 1));
const pad = (n: number, w = 3) => String(n).padStart(w, '0');

export function mulberry(seed: number): Rng {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function genWx(r: Rng, id: string, season: Season, east: boolean, good: boolean): Wx {
  let ceil: number | null = null, vis = 10, wx = '', sky = 'SKC', t = 15, note: string | undefined;
  const bad = !good;
  if (season === 'summer') {
    t = east ? between(r, 27, 35) : between(r, 22, 31);
    if (r() < (bad ? 0.8 : 0.15)) { vis = bad ? between(r, 2, 4) : 6; wx = 'FU'; note = 'Wildfire smoke'; }
    if (bad && !wx) { ceil = between(r, 25, 45, 5) * 100; sky = `BKN${pad(ceil / 100)}CB`; note = 'Thunderstorms building'; }
    else sky = pick(r, ['SKC', 'FEW080', 'SCT120']);
  } else if (season === 'fall') {
    t = between(r, 8, 16);
    if (bad && !east) { ceil = between(r, 4, 9) * 100; vis = between(r, 2, 5); wx = 'BR'; note = 'Marine layer / fog'; }
    else if (bad) { ceil = between(r, 12, 28) * 100; vis = 6; }
    sky = ceil ? `OVC${pad(ceil / 100)}` : pick(r, ['SCT045', 'FEW035', 'SKC']);
  } else if (season === 'winter') {
    t = east ? between(r, -4, 4) : between(r, 2, 8);
    if (bad) { ceil = between(r, 7, 25) * 100; vis = between(r, 3, 6); wx = east ? '-SN' : '-RA'; note = 'Low clouds, icing in clouds'; }
    sky = ceil ? `OVC${pad(ceil / 100)}` : pick(r, ['BKN045', 'SCT040']);
    if (!ceil && sky.startsWith('BKN')) ceil = 4500;
  } else {
    t = between(r, 9, 17);
    if (bad) { ceil = between(r, 15, 30) * 100; vis = 5; wx = '-SHRA'; note = 'Showers'; }
    sky = ceil ? `BKN${pad(ceil / 100)}` : pick(r, ['SCT050', 'FEW040']);
  }
  const d = Math.max(t - (wx === 'BR' ? 1 : between(r, 3, 12)), -10);
  const dirN = between(r, 1, 36) * 10;
  const dir = pad(dirN);
  const gusty = bad && (season === 'spring' || season === 'winter') ? true : r() < 0.15;
  const spd = gusty ? between(r, 10, 18) : between(r, 3, 12);
  const gust = gusty ? spd + between(r, 6, 10) : null;
  const temp = (n: number) => (n < 0 ? 'M' + pad(-n, 2) : pad(n, 2));
  const text = `${id} 1${between(r, 5, 9)}1753Z ${dir}${pad(spd, 2)}${gust ? 'G' + gust : ''}KT ${vis}SM ${wx ? wx + ' ' : ''}${sky} ${temp(t)}/${temp(d)} A30${pad(between(r, 0, 25), 2)}`;
  return { ceil, vis, text, cat: category(ceil, vis), note, dir: dirN, spd, gust };
}

// Crosswind component on the better-aligned runway end (gust used if reported).
export function crosswind(dest: Dest, w: Wx) {
  const ends = dest.rwy.split('-').map((e) => parseInt(e, 10) * 10);
  const wind = w.gust ?? w.spd;
  let best = { rwy: dest.rwy.split('-')[0], angle: 180 };
  dest.rwy.split('-').forEach((e, i) => {
    let a = Math.abs(((w.dir - ends[i] + 540) % 360) - 180);
    if (a < best.angle) best = { rwy: e, angle: a };
  });
  return { rwy: best.rwy, angle: best.angle, kt: Math.round(wind * Math.sin((best.angle * Math.PI) / 180)) };
}

export interface Leg { id: string; title: string; phase: number; item: Item; vars?: Record<string, string> }

export interface Story {
  seed: number; dest: Dest; season: Season; tod: 'morning' | 'afternoon' | 'evening';
  depWx: Wx; destWx: Wx; icing: boolean;
  pilotIssue: string | null; annualOk: boolean; navLightOut: boolean; load: Load; wbOk: boolean;
  noGo: string[]; briefing: Leg[]; flight: Leg[];
}

const SEASON_LABEL: Record<Season, string> = { summer: 'August', fall: 'October', winter: 'January', spring: 'April' };
const SEASON_MONTH: Record<Season, number> = { summer: 8, fall: 10, winter: 1, spring: 4 };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// A date `back` months before the flight month of 2026, e.g. back=2 -> two months earlier.
function monthsBefore(season: Season, back: number) {
  const idx = 2026 * 12 + (SEASON_MONTH[season] - 1) - back;
  return `${MONTHS[idx % 12]} 12, ${Math.floor(idx / 12)}`;
}

function mk(id: string, pave: Pave, topic: string, acs: string[], setup: string[], prompt: string, choices: Choice[], explain: string[], c: string[]): Item {
  return { id, kind: 'scenario', pave, topic, acs, setup, prompt, choices, explain, c, xp: 15 };
}

export function buildStory(seed: number, bankById: (id: string) => Item | undefined): Story {
  const r = mulberry(seed);
  const dest = pick(r, DESTS);
  const season = pick(r, ['summer', 'fall', 'winter', 'spring'] as Season[]);
  const tod = pick(r, ['morning', 'afternoon', 'evening'] as const);
  const good = r() < 0.55;
  const depWx = genWx(r, 'KHIO', season, false, good || r() < 0.5);
  const destWx = genWx(r, dest.id, season, dest.east, good);
  const icing = season === 'winter' && dest.east && !good;
  const pilotIssue = r() < 0.22 ? pick(r, ['meds', 'drinks', 'sleep', 'food']) : null;
  const annualOk = r() > 0.12;
  const navLightOut = tod === 'evening' && r() < 0.3;
  const load: Load = { pilot: between(r, 150, 210, 5), pax: between(r, 120, 220, 5), gal: pick(r, [24.5, 20, 18]), a1: between(r, 0, 40, 5), a2: 0 };
  const wb = compute(load);

  const noGo: string[] = [];
  if (pilotIssue) noGo.push('You weren’t fit to fly (IMSAFE).');
  if (!annualOk) noGo.push('The annual inspection had expired.');
  if (navLightOut) noGo.push('A position light was out and you’d arrive after sunset.');
  if (!wb.ok) noGo.push(`Weight and balance: ${wb.problems[0]}.`);
  const meetsMins = (w: Wx) => (w.ceil === null || w.ceil >= MINIMUMS.ceiling) && w.vis >= MINIMUMS.visibility;
  if (!meetsMins(depWx) || !meetsMins(destWx)) noGo.push(`Weather was below your personal minimums (${MINIMUMS.ceiling.toLocaleString()} ft / ${MINIMUMS.visibility} SM).`);
  const xw = crosswind(dest, destWx);
  if (xw.kt > MINIMUMS.crosswind) noGo.push(`Crosswind at ${dest.name} (${xw.kt} kt on Runway ${xw.rwy}) was over your ${MINIMUMS.crosswind} kt personal maximum.`);
  if (icing) noGo.push('Icing in clouds over the Cascades: the 152 is prohibited from known icing.');

  const ED = `${SEASON_LABEL[season]}, ${tod}`;
  const briefing: Leg[] = [];

  // P: Pilot
  const pText: Record<string, string> = {
    meds: 'You took a drowsy-type antihistamine (6-hour dosing) 3 hours ago.',
    drinks: 'You had two glasses of wine that ended 6 hours ago.',
    sleep: `You got about 5 hours of sleep after a late shift. Your personal minimum is ${MINIMUMS.sleepHours} hours.`,
    food: `You skipped breakfast and lunch; your last meal was 12 hours ago. Your personal minimum is food within ${MINIMUMS.foodHours} hours.`
  };
  briefing.push({
    id: 'p', title: 'Pilot', phase: 0,
    item: mk('st-pilot', 'P', 'p-imsafe', ['PA.II.A.K1', 'PA.I.H.K3'],
      [`${ED}. You and a passenger plan KHIO to ${dest.name} (${dest.id}). Run IMSAFE on yourself.`, pilotIssue ? pText[pilotIssue] : 'You slept well, feel healthy, haven’t had alcohol or medication, and you’re current.'],
      'Are you fit to fly?',
      pilotIssue
        ? [{ t: 'No. I’m not fit today.', ok: true }, { t: 'Yes. I feel okay.', why: pilotIssue === 'drinks' ? 'Less than 8 hours since drinking makes it illegal, and the AIM recommends 12 to 24 hours.' : pilotIssue === 'meds' ? 'The PHAK says wait five dosing intervals: about 30 hours here.' : 'You set personal minimums so you don’t have to argue with yourself on the day. This is below one of them.' }]
        : [{ t: 'Yes. IMSAFE checks out.', ok: true }, { t: 'No.', why: 'Nothing on the IMSAFE checklist is a problem today.' }],
      ['IMSAFE: Illness, Medication, Stress, Alcohol, Fatigue, Emotion.', pilotIssue === 'drinks' ? 'No acting as crew within **8 hours** of alcohol; the AIM recommends **12–24 hours**.' : pilotIssue === 'meds' ? 'Wait **five maximal dosing intervals** after a medication with sedating side effects.' : `Your personal minimums: ${MINIMUMS.sleepHours} hours of sleep and food within ${MINIMUMS.foodHours} hours. Fatigue and poor nutrition both affect judgment.`],
      ['phak:2-8', 'phak:17-18', 'cfr14:91.17(a)', 'aim:8-1-1'])
  });

  // A: Aircraft
  // Current annual: 2–10 months ago. Expired: 13–15 months ago (outside the preceding 12 calendar months).
  const annualDate = annualOk ? monthsBefore(season, between(r, 2, 10)) : monthsBefore(season, between(r, 13, 15));
  briefing.push({
    id: 'a1', title: 'Aircraft: airworthiness', phase: 0,
    item: mk('st-annual', 'A', 'a-inspect', ['PA.I.B.K1b'],
      [`It’s ${SEASON_LABEL[season]} 2026. The logbooks show the last annual on ${annualDate}. 100-hour is current.${navLightOut ? ' During preflight the left position light doesn’t work, and you’ll land after sunset.' : ''}`],
      'Is the airplane legal for this flight?',
      annualOk && !navLightOut
        ? [{ t: 'Yes.', ok: true }, { t: 'No, the annual is out.', why: 'An annual within the preceding 12 calendar months is current.' }]
        : [{ t: 'No.', ok: true }, { t: 'Yes.', why: !annualOk ? 'The annual must be within the preceding 12 calendar months.' : 'Position lights are required from sunset to sunrise.' }],
      ['Annual: within the preceding **12 calendar months**. Position lights: required **sunset to sunrise**.'],
      ['cfr14:91.409(a)', 'cfr14:91.209(a)', 'cfr14:91.205(c)'])
  });
  briefing.push({
    id: 'a2', title: 'Aircraft: weight & balance', phase: 0,
    item: mk('st-wb', 'A', 'a-wb', ['PA.I.F.K2f'],
      [`POH sample airplane (1,136 lb empty, moment 34,000 lb-in). You ${load.pilot} lb, passenger ${load.pax} lb, fuel ${load.gal} gal (${wb.fuel} lb), bags Area 1 ${load.a1} lb.`, 'Arms: seats 39, fuel 42.0, Area 1 64. Taxi fuel 5 lb (200 lb-in).'],
      'Within limits for takeoff?',
      wb.ok
        ? [{ t: `Yes: ${wb.to} lb, CG ${wb.cg.toFixed(1)} in`, ok: true }, { t: 'No, over max takeoff weight', why: `${wb.to} lb is at or under 1,670.` }]
        : [{ t: `No: ${wb.problems[0]}`, ok: true }, { t: 'Yes', why: wb.problems.join('; ') }],
      [`Takeoff **${wb.to} lb**, CG **${wb.cg.toFixed(2)} in**. Max 1,670 lb; CG between the forward limit and 36.5 in.`, wb.ok ? '' : 'Fix it: less fuel (watch your reserve) or less baggage.'].filter(Boolean),
      ['poh:6-10', 'poh:2-6'])
  });

  // V: Environment
  briefing.push({
    id: 'v1', title: 'enVironment: weather', phase: 0,
    item: {
      ...mk('st-wx', 'V', 'v-wx-enroute', ['PA.I.C.K2', 'PA.I.C.R1b'],
        [`Your briefing (fictional reports). Your personal minimums: ${MINIMUMS.ceiling.toLocaleString()} ft ceiling, ${MINIMUMS.visibility} SM, VFR only.`, destWx.note ? `Note: ${destWx.note}.` : 'No significant weather noted.', icing ? 'AIRMET Zulu: moderate icing in clouds over the Cascades; freezing level near the surface east of the crest.' : ''].filter(Boolean),
        `What’s the flight category at ${dest.name}?`,
        (['VFR', 'MVFR', 'IFR', 'LIFR'] as Cat[]).map((c) => ({ t: c, ok: c === destWx.cat, why: c === destWx.cat ? undefined : `Ceiling ${destWx.ceil ?? 'none'}, visibility ${destWx.vis} SM → ${destWx.cat}.` })),
        ['AIM 7-1-7: **VFR** ceiling > 3,000 and vis > 5; **MVFR** 1,000–3,000 and/or 3–5; **IFR** 500 to < 1,000 and/or 1 to < 3; **LIFR** < 500 and/or < 1. Ceiling = lowest BKN/OVC layer.'],
        ['aim:7-1-7', 'aim:7-1-28']),
      readout: { tag: 'Fictional METARs', cat: destWx.cat, text: `${depWx.text}\n${destWx.text}` }
    }
  });
  const xwInfo = crosswind(dest, destWx);
  const windTxt = `${pad(destWx.dir)}° at ${destWx.spd}${destWx.gust ? ` gusting ${destWx.gust}` : ''} knots`;
  briefing.push({
    id: 'v-xw', title: 'enVironment: crosswind', phase: 0,
    item: mk('st-xw', 'V', 'a-perf', ['PA.IV.A.R2a', 'PA.I.C.R1b'],
      [`${dest.name} wind: ${windTxt}. Runway ${dest.rwy}. Best-aligned end: Runway ${xwInfo.rwy}, about ${xwInfo.angle}° off the wind.`, `Your personal maximum is ${MINIMUMS.crosswind} knots (the 152’s maximum demonstrated crosswind). Use the gust value if there is one.`],
      'Is the crosswind within your personal maximum?',
      xwInfo.kt <= MINIMUMS.crosswind
        ? [{ t: `Yes: about ${xwInfo.kt} knots`, ok: true }, { t: 'No: over 12 knots', why: `About ${xwInfo.kt} knots: within your maximum.` }]
        : [{ t: `No: about ${xwInfo.kt} knots`, ok: true }, { t: 'Yes: within 12 knots', why: `About ${xwInfo.kt} knots: over your maximum.` }],
      [`Crosswind component ≈ wind speed × sin(angle): ${destWx.gust ?? destWx.spd} × sin ${xwInfo.angle}° ≈ **${xwInfo.kt} kt**. The POH wind component chart gives the same answer.`, 'The 12-knot maximum demonstrated crosswind is **not a limitation** in the POH, but it’s your personal limit, and that makes it binding for you.'],
      ['poh:5-11', 'poh:4-3'])
  });
  const chartItem = bankById(dest.chart === 'Klamath Falls' ? (dest.id === 'KEUG' ? 'c-eug-block' : 'c-bdn-block') : 'c-pdx-shelf');
  if (chartItem) briefing.push({ id: 'v2', title: 'enVironment: chart', phase: 0, item: chartItem });

  // E: External
  briefing.push({
    id: 'e', title: 'External pressures', phase: 0,
    item: mk('st-ext', 'E', 'e-pressures', ['PA.I.D.R4'],
      [`Your passenger has an event in ${dest.name} this afternoon and says, “We have to be there. Everyone’s expecting us.”`],
      'How do you handle that pressure?',
      [{ t: 'Agree on a backup now (later flight, driving, or an extra stop) so the go/no-go call stays about safety.', ok: true }, { t: 'Promise you’ll get there no matter what.', why: 'That creates the pressure the PHAK warns about.' }, { t: 'Let the passenger decide.', why: 'You’re the PIC and the final authority.' }],
      ['External pressures can make a pilot ignore all the other risks. Build in personal SOPs: allow time for extra stops and have alternate plans.'],
      ['phak:2-9', 'phak:2-10', 'cfr14:91.3'])
  });

  // Flight legs: departure, en route, arrival — verified bank items as decision points.
  const departure = pick(r, ['s-wake-takeoff', 'e-door', 's-crosswind-runway', 'e-efato']);
  const enroute = pick(r, dest.east ? ['s-carb-ice', 's-cascades-climb', 'e-low-volt', 's-mountain-wave', 's-thunderstorm'] : ['s-carb-ice', 'e-low-volt', 's-vacuum', 's-converging', 's-adsb-traffic']);
  const arrival = dest.id === 'KBDN' ? 's-pattern-entry' : dest.airspace.startsWith('Class D') ? 's-classd-standby' : pick(r, ['s-wake', 's-black-hole']);
  const flight: Leg[] = [];
  for (const [id, phase, title] of [[departure, 1, 'Departure'], [enroute, 2, 'En route'], [arrival, 3, 'Arrival']] as const) {
    const it = bankById(id);
    if (it) flight.push({ id, title, phase, item: it, vars: id === 's-classd-standby' ? { apt: dest.name } : undefined });
  }
  return { seed, dest, season, tod, depWx, destWx, icing, pilotIssue, annualOk, navLightOut, load, wbOk: wb.ok, noGo, briefing, flight };
}
