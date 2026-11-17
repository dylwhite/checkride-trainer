// Scenario generators: each call builds a fresh situation and computes the correct answer
// from a verified rule or POH table, so the same concept appears in endless variations.
// Sources: 14 CFR 91.155/91.157/91.159/91.211/91.409/61.56/61.23/91.207, POH Figures 5-4 to 5-8,
// Chart Supplement NW (airport coordinates), AIM 7-1-7.
import type { Choice, Item } from './types';

const R = () => Math.random();
const pick = <T,>(a: T[]) => a[Math.floor(R() * a.length)];
const between = (lo: number, hi: number, step = 1) => lo + step * Math.floor(R() * ((hi - lo) / step + 1));
const shuffle = <T,>(a: T[]) => a.map((v) => [R(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const fmt = (n: number) => n.toLocaleString('en-US');

// Build choices: first is correct; drop duplicates of the correct text.
function choices(correct: string, wrong: [string, string][]): Choice[] {
  const seen = new Set([correct]);
  const out: Choice[] = [{ t: correct, ok: true }];
  for (const [t, why] of wrong) if (!seen.has(t) && out.length < 4) { seen.add(t); out.push({ t, why }); }
  return out;
}

function item(base: Omit<Item, 'kind' | 'xp'> & { xp?: number }): Item {
  return { kind: 'scenario', xp: 20, ...base };
}

// ───────────── 1. Weather legality at KHIO (surface area of Class D / E) ─────────────
function wxLegal(): Item {
  const night = R() < 0.3;
  const ceil = pick([null, 600, 800, 900, 1000, 1200, 1500, 2500, 3000, 3500, 5000]);
  const vis = pick([1.5, 2, 2.5, 3, 4, 5, 6, 10]);
  const legal = (ceil === null || ceil >= 1000) && vis >= 3;
  const mins = (ceil === null || ceil >= 3000) && vis >= 5;
  const tower = !night || R() < 0.5;
  const sky = ceil === null ? 'SCT050' : `${pick(['BKN', 'OVC'])}${String(ceil / 100).padStart(3, '0')}`;
  const wx = vis < 3 ? ' BR' : vis < 6 ? ' HZ' : '';
  const A = 'Legal under basic VFR, and within your personal minimums';
  const B = 'Legal under basic VFR, but below your personal minimums';
  const C = 'Not legal under basic VFR; you’d need a Special VFR clearance';
  const D = night ? 'Not legal under basic VFR, and Special VFR isn’t an option for you tonight' : 'Not legal under basic VFR, and Special VFR isn’t available at Hillsboro';
  const correct = legal ? (mins ? A : B) : night ? D : C;
  const all: [string, string][] = [
    [A, 'Check both the legal minimums (1,000 ft ceiling, 3 SM) and your personal minimums (3,000 ft, 5 SM).'],
    [B, legal ? 'These conditions meet your personal minimums too.' : 'Below the legal minimums for the surface area.'],
    [C, night ? 'Special VFR at night requires an instrument rating and an IFR-equipped airplane.' : 'The basic VFR minimums are met, so SVFR isn’t needed.'],
    [D, night ? 'The basic VFR minimums are met.' : legal ? 'The basic VFR minimums are met.' : 'By day, Special VFR is available at KHIO (it isn’t on the Appendix D list).']
  ];
  return item({
    id: 'g-wx-legal', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.C.R1b'],
    setup: [`${night ? 'Evening, after dark' : 'Midday'} at Hillsboro (${tower ? 'tower open: Class D' : 'tower closed: Class E surface area'}). You want to depart VFR. Your personal minimums: 3,000 ft ceiling, 5 SM, VFR only.`],
    readout: { tag: 'Fictional METAR', cat: ceil !== null && ceil < 500 ? 'LIFR' : ceil !== null && ceil < 1000 || vis < 3 ? 'IFR' : ceil !== null && ceil <= 3000 || vis <= 5 ? 'MVFR' : 'VFR', text: `KHIO 171753Z 20006KT ${vis}SM${wx} ${sky} 12/08 A3005` },
    prompt: 'Which statement is most correct?',
    choices: choices(correct, all.filter(([t]) => t !== correct)),
    explain: [
      'Inside the surface area of Class B, C, D, or E for an airport, basic VFR needs a **ceiling of at least 1,000 ft** and **ground visibility of at least 3 SM** to take off, land, or enter the pattern.',
      'Special VFR (with an ATC clearance) needs clear of clouds and 1 SM; **at night it requires an instrument rating and an IFR-equipped airplane**.',
      `Here: ceiling ${ceil === null ? 'none' : fmt(ceil) + ' ft'}, visibility ${vis} SM → ${legal ? 'legal' : 'below basic VFR'}${legal ? (mins ? ', and within your 3,000 / 5 personal minimums' : ', but below your 3,000 / 5 personal minimums') : ''}.`
    ],
    c: ['cfr14:91.155(c)', 'cfr14:91.155(d)', 'cfr14:91.157(b)', 'cfr14:91 App. D', 'cs:KHIO']
  });
}

// ───────────── 2. VFR minimums by airspace (is this legal?) ─────────────
interface Mins { vis: number; below: number | 'clear'; above: number; horiz: number | 'mile' }
const TABLE: { name: string; mins: Mins }[] = [
  { name: 'Class C', mins: { vis: 3, below: 500, above: 1000, horiz: 2000 } },
  { name: 'Class D', mins: { vis: 3, below: 500, above: 1000, horiz: 2000 } },
  { name: 'Class E below 10,000 MSL', mins: { vis: 3, below: 500, above: 1000, horiz: 2000 } },
  { name: 'Class E at or above 10,000 MSL', mins: { vis: 5, below: 1000, above: 1000, horiz: 'mile' } },
  { name: 'Class G, more than 1,200 AGL, below 10,000 MSL, by day', mins: { vis: 1, below: 500, above: 1000, horiz: 2000 } },
  { name: 'Class G, more than 1,200 AGL, below 10,000 MSL, at night', mins: { vis: 3, below: 500, above: 1000, horiz: 2000 } },
  { name: 'Class B', mins: { vis: 3, below: 'clear', above: 0, horiz: 0 } }
];
function vfrMins(): Item {
  const row = pick(TABLE);
  const m = row.mins;
  const breakVis = R() < 0.4, breakCloud = R() < 0.4;
  const vis = breakVis ? Math.max(0.5, m.vis - pick([0.5, 1, 2])) : m.vis + pick([0, 1, 2]);
  const clearOnly = m.below === 'clear';
  const below = clearOnly ? 0 : breakCloud ? (m.below as number) - pick([100, 200, 300]) : (m.below as number) + pick([0, 200, 500]);
  const okVis = vis >= m.vis, okCloud = clearOnly || below >= (m.below as number);
  const correct = okVis && okCloud ? 'Legal' : !okVis && !okCloud ? 'Not legal: both visibility and cloud clearance are too low' : !okVis ? 'Not legal: flight visibility is too low' : 'Not legal: too close to the clouds';
  const cloudTxt = clearOnly ? 'clear of all clouds' : `${fmt(below)} ft below a cloud layer, well clear laterally and above`;
  const minsTxt = clearOnly ? `${m.vis} SM and clear of clouds` : `${m.vis} SM; ${fmt(m.below as number)} below, ${fmt(m.above)} above, ${m.horiz === 'mile' ? '1 SM' : fmt(m.horiz as number) + ' ft'} horizontal`;
  return item({
    id: 'g-vfr-mins', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1'],
    setup: [`You’re in ${row.name}, with ${vis} SM flight visibility, ${cloudTxt}.`],
    prompt: 'Is that legal under basic VFR?',
    choices: choices(correct, [
      ['Legal', 'Compare with the minimums for this airspace.'],
      ['Not legal: flight visibility is too low', `Required visibility is ${m.vis} SM.`],
      ['Not legal: too close to the clouds', clearOnly ? 'Class B only requires clear of clouds.' : `Required: ${fmt(m.below as number)} ft below.`],
      ['Not legal: both visibility and cloud clearance are too low', 'Check each requirement separately.']
    ].filter(([t]) => t !== correct) as [string, string][]),
    explain: [`Basic VFR minimums in ${row.name}: **${minsTxt}**.`],
    c: ['cfr14:91.155(a)'], xp: 15
  });
}

// ───────────── 3. Fuel planning (POH climb and cruise tables) ─────────────
const APTS: Record<string, { name: string; lat: number; lon: number }> = {
  KBDN: { name: 'Bend', lat: 44 + 5.67 / 60, lon: -(121 + 12.01 / 60) },
  KRDM: { name: 'Redmond', lat: 44 + 15.24 / 60, lon: -(121 + 9.0 / 60) },
  KEUG: { name: 'Eugene', lat: 44 + 7.48 / 60, lon: -(123 + 12.72 / 60) },
  KSLE: { name: 'Salem', lat: 44 + 54.57 / 60, lon: -(123 + 0.15 / 60) },
  KOLM: { name: 'Olympia', lat: 46 + 58.16 / 60, lon: -(122 + 54.15 / 60) },
  KAST: { name: 'Astoria', lat: 46 + 9.48 / 60, lon: -(123 + 52.72 / 60) },
  KCVO: { name: 'Corvallis', lat: 44 + 29.81 / 60, lon: -(123 + 17.37 / 60) },
  KONP: { name: 'Newport', lat: 44 + 34.82 / 60, lon: -(124 + 3.48 / 60) }
};
const KHIO = { lat: 45 + 32.53 / 60, lon: -(122 + 57.04 / 60) };
export function nm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const r = Math.PI / 180, d = 3440.065;
  const x = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 2 * d * Math.asin(Math.sqrt(x));
}
// POH Figure 5-7 (standard temperature, from sea level): [time min, fuel gal, distance NM]
const CLIMB: Record<number, [number, number, number]> = { 4000: [6, 0.9, 7], 6000: [10, 1.4, 12], 8000: [15, 2.0, 17] };
// POH Figure 5-8, standard temperature: [RPM, KTAS, GPH]
const CRUISE: Record<number, [number, number, number][]> = {
  4000: [[2400, 101, 6.0], [2300, 97, 5.5], [2200, 91, 4.9]],
  6000: [[2400, 101, 5.8], [2300, 96, 5.2], [2200, 90, 4.7]],
  8000: [[2400, 100, 5.5], [2300, 95, 5.0], [2200, 89, 4.6]]
};
function fuelPlan(): Item {
  const id = pick(Object.keys(APTS));
  const a = APTS[id];
  const dist = Math.round(nm(KHIO, a));
  const alt = pick([4000, 6000, 8000]);
  const [rpm, tas, gph] = pick(CRUISE[alt]);
  const head = pick([-10, 0, 10, 15, 20]); // negative = tailwind
  const gs = tas - head;
  const night = R() < 0.35;
  const [, cFuel, cDist] = CLIMB[alt];
  const cruiseTime = Math.max(0, dist - cDist) / gs; // hours
  const reserveMin = night ? 45 : 30;
  const need = 0.8 + cFuel + cruiseTime * gph + (reserveMin / 60) * gph;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const ans = r1(need);
  const noWind = r1(0.8 + cFuel + (Math.max(0, dist - cDist) / tas) * gph + (reserveMin / 60) * gph);
  const otherRes = r1(0.8 + cFuel + cruiseTime * gph + ((night ? 30 : 45) / 60) * gph);
  const noAllow = r1(cruiseTime * gph + (reserveMin / 60) * gph + (dist / gs) * 0);
  const fits = ans <= 24.5;
  return item({
    id: 'g-fuel', pave: 'V', topic: 'v-fuelreq', acs: ['PA.I.D.K3c', 'PA.I.D.R6', 'PA.I.F.K1'],
    setup: [
      `KHIO to ${a.name} (${id}): about ${dist} NM direct. ${night ? 'You’ll land after dark.' : 'Daytime flight.'} Cruise at ${fmt(alt)} ft pressure altitude, standard temperature, ${fmt(rpm)} RPM: POH ${tas} KTAS at ${gph} GPH.`,
      `${head > 0 ? `Forecast headwind component ${head} kt` : head < 0 ? `Forecast tailwind component ${-head} kt` : 'No wind'}. POH climb from sea level to ${fmt(alt)}: ${CLIMB[alt][1]} gal, ${CLIMB[alt][2]} NM. Add 0.8 gal for start, taxi, and takeoff. Ignore descent.`
    ],
    prompt: 'What’s the minimum legal fuel at engine start (to the nearest 0.1 gal)?',
    choices: choices(`${ans} gal${fits ? '' : ': more than the 24.5 gal usable, so plan a fuel stop'}`, [
      [`${noWind} gal${noWind <= 24.5 ? '' : ': plan a fuel stop'}`, 'That ignores the wind. Use groundspeed for time en route.'],
      [`${otherRes} gal${otherRes <= 24.5 ? '' : ': plan a fuel stop'}`, night ? 'At night the VFR reserve is 45 minutes, not 30.' : 'By day the VFR reserve is 30 minutes, not 45.'],
      [`${r1(noAllow + cFuel)} gal${r1(noAllow + cFuel) <= 24.5 ? '' : ': plan a fuel stop'}`, 'You left out the 0.8 gal start/taxi/takeoff allowance.'],
      [`${r1(ans + 1.5)} gal`, 'Unusable fuel isn’t part of this calculation; plan against usable fuel (24.5 gal).']
    ]),
    explain: [
      `Groundspeed ${tas} ${head >= 0 ? '−' : '+'} ${Math.abs(head)} = **${gs} kt**. Cruise distance ${dist} − ${cDist} (climb) = ${Math.max(0, dist - cDist)} NM → ${(cruiseTime * 60).toFixed(0)} min × ${gph} GPH.`,
      `Total: 0.8 (start/taxi) + ${cFuel} (climb) + ${r1(cruiseTime * gph)} (cruise) + ${r1((reserveMin / 60) * gph)} (${reserveMin}-min ${night ? 'night' : 'day'} reserve) = **${ans} gal**. Usable fuel in standard tanks: 24.5 gal.`,
      'POH cruise speeds assume speed fairings (about 2 kt faster), and climb figures increase 10% per 10 °C above standard. Add your own margin.'
    ],
    think: 'The legal reserve is a floor. What would you need if your destination’s weather went down and you diverted?',
    c: ['cfr14:91.151(a)', 'poh:5-14', 'poh:5-15', 'poh:2-7', `cs:${id}`]
  });
}

// ───────────── 4. Crosswind component (POH Figure 5-4) ─────────────
const RWYS: { apt: string; rwys: number[] }[] = [
  { apt: 'KHIO', rwys: [13, 31, 2, 20] }, { apt: 'KBDN', rwys: [17, 35] }, { apt: 'KEUG', rwys: [16, 34] },
  { apt: 'KSLE', rwys: [13, 31, 16, 34] }, { apt: 'KAST', rwys: [8, 26, 14, 32] }, { apt: 'KOLM', rwys: [17, 35, 8, 26] }
];
function crosswind(): Item {
  const ap = pick(RWYS);
  const rw = pick(ap.rwys);
  const angle = pick([20, 30, 40, 45, 50, 60, 70, 80, 90]);
  const side = pick([-1, 1]);
  const dir = ((rw * 10 + side * angle) % 360 + 360) % 360 || 360;
  const spd = between(8, 22, 2);
  const xw = Math.round(spd * Math.sin((angle * Math.PI) / 180));
  const hw = Math.round(spd * Math.cos((angle * Math.PI) / 180));
  const over = xw > 12;
  return item({
    id: 'g-xwind', pave: 'A', topic: 'a-perf', acs: ['PA.IV.A.R1', 'PA.IV.A.R2a'],
    setup: [`${ap.apt}, Runway ${String(rw).padStart(2, '0')}. Wind ${String(dir).padStart(3, '0')}° at ${spd} kt (${angle}° off the runway). Your personal maximum crosswind: 12 kt.`],
    prompt: 'About how much crosswind, and is it within your limit?',
    choices: choices(`About ${xw} kt: ${over ? 'over' : 'within'} your limit`, [
      [`About ${hw} kt: ${hw > 12 ? 'over' : 'within'} your limit`, `${hw} kt is the headwind component. Crosswind uses the sine of the angle.`],
      [`About ${spd} kt: ${spd > 12 ? 'over' : 'within'} your limit`, 'Only the part of the wind across the runway counts as crosswind.'],
      [`About ${Math.round(spd / 2)} kt: ${Math.round(spd / 2) > 12 ? 'over' : 'within'} your limit`, `Half the wind is the crosswind only at 30°. At ${angle}° it’s about ${xw} kt.`],
      [`About ${xw} kt: ${over ? 'within' : 'over'} your limit`, `Your limit is 12 kt.`]
    ]),
    explain: [`Crosswind ≈ wind × sin(angle) = ${spd} × sin ${angle}° ≈ **${xw} kt**; headwind ≈ wind × cos(angle) ≈ ${hw} kt. POH Figure 5-4 gives the same values.`, 'The 12-kt maximum demonstrated crosswind isn’t a POH limitation, but it’s your personal limit.'],
    c: ['poh:5-11', 'poh:4-3'], xp: 15
  });
}

// ───────────── 5. Takeoff distance (POH Figure 5-5) ─────────────
const TO_ALT = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];
const TO_T = [0, 10, 20, 30, 40];
const TO: [number, number][][] = [
  [[640, 1190], [705, 1310], [775, 1445], [855, 1600], [940, 1775], [1040, 1970], [1145, 2200], [1270, 2470], [1405, 2800]],
  [[695, 1290], [765, 1420], [840, 1565], [925, 1730], [1020, 1920], [1125, 2140], [1245, 2395], [1375, 2705], [1525, 3080]],
  [[755, 1390], [825, 1530], [910, 1690], [1000, 1870], [1100, 2080], [1215, 2320], [1345, 2610], [1490, 2960], [1655, 3395]],
  [[810, 1495], [890, 1645], [980, 1820], [1080, 2020], [1190, 2250], [1315, 2525], [1455, 2855], [1615, 3255], [1795, 3765]],
  [[875, 1605], [960, 1770], [1055, 1960], [1165, 2185], [1285, 2440], [1420, 2750], [1570, 3125], [1745, 3590], [1940, 4195]]
];
function takeoff(): Item {
  const ai = between(0, 8), ti = between(0, 4);
  const [g, t] = TO[ti][ai];
  const headwind = pick([0, 0, 9, 18]);
  const f = 1 - 0.1 * (headwind / 9);
  const ans = Math.round(t * f);
  const near = (dt: number, da: number) => TO[Math.min(4, Math.max(0, ti + dt))][Math.min(8, Math.max(0, ai + da))][1];
  const alt = TO_ALT[ai] === 0 ? 'sea level' : `${fmt(TO_ALT[ai])} ft`;
  return item({
    id: 'g-takeoff', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.K1', 'PA.I.F.R1'],
    setup: [`Short-field takeoff at 1,670 lb, flaps 10°, paved dry runway. Pressure altitude ${alt}, ${TO_T[ti]} °C, ${headwind ? `${headwind}-kt headwind` : 'calm wind'}.`],
    prompt: 'Per POH Figure 5-5, total distance to clear a 50-ft obstacle?',
    choices: choices(`About ${fmt(ans)} ft`, [
      [`About ${fmt(t)} ft`, headwind ? `That ignores the headwind: decrease 10% per 9 kt.` : 'Check the row and column again.'],
      [`About ${fmt(Math.round(near(1, 0) * f))} ft`, `That’s the ${TO_T[Math.min(4, ti + 1)]} °C column.`],
      [`About ${fmt(Math.round(near(0, 1) * f))} ft`, 'That’s the next pressure-altitude row up.'],
      [`About ${fmt(Math.round(g * f))} ft`, 'That’s the ground roll, not the distance over 50 ft.'],
      [`About ${fmt(Math.round(near(-1, 0) * f))} ft`, `That’s the ${TO_T[Math.max(0, ti - 1)]} °C column.`]
    ]),
    explain: [`Figure 5-5 at ${alt} and ${TO_T[ti]} °C: ground roll **${fmt(g)} ft**, total over 50 ft **${fmt(t)} ft**.${headwind ? ` Headwind ${headwind} kt: decrease 10% per 9 kt → **${fmt(ans)} ft**.` : ''}`, 'Above 3,000 ft field elevation, lean for maximum RPM before takeoff. Add 15% of the ground roll for dry grass.'],
    c: ['poh:5-12'], xp: 15
  });
}

// ───────────── 6. Climb rate (POH Figure 5-6) ─────────────
const CL_ALT = [0, 2000, 4000, 6000, 8000, 10000, 12000];
const CL_T = [-20, 0, 20, 40];
const CL = [[835, 765, 700, 630], [735, 670, 600, 535], [635, 570, 505, 445], [535, 475, 415, 355], [440, 380, 320, 265], [340, 285, 230, 175], [245, 190, 135, 85]];
function climb(): Item {
  const ai = between(0, 6), ti = between(0, 3);
  const v = CL[ai][ti];
  const alt = CL_ALT[ai] === 0 ? 'sea level' : `${fmt(CL_ALT[ai])} ft`;
  return item({
    id: 'g-climb', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.K1', 'PA.I.D.K2'],
    setup: [`At 1,670 lb, flaps up, full throttle (leaned above 3,000 ft for max RPM). Pressure altitude ${alt}, ${CL_T[ti]} °C.`],
    prompt: 'Per POH Figure 5-6, maximum rate of climb?',
    choices: choices(`${v} fpm`, [
      [`${CL[ai][Math.min(3, ti + 1)]} fpm`, 'That’s the next warmer column.'],
      [`${CL[Math.min(6, ai + 1)][ti]} fpm`, 'That’s the next higher altitude row.'],
      [`${CL[Math.max(0, ai - 1)][ti]} fpm`, 'That’s the next lower altitude row.'],
      [`${CL[ai][Math.max(0, ti - 1)]} fpm`, 'That’s the next colder column.']
    ]),
    explain: [`Figure 5-6 at ${alt} and ${CL_T[ti]} °C: **${v} fpm**. Hotter and higher means less climb: at 12,000 ft and 40 °C it’s only 85 fpm.`],
    c: ['poh:5-13'], xp: 15
  });
}

// ───────────── 7. Legal to fly today? (calendar-month rules) ─────────────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const mStr = (m: number) => `${MONTHS[((m % 12) + 12) % 12]} ${Math.floor(m / 12)}`;
function legality(): Item {
  const now = 2026 * 12 + between(0, 11);
  const expired = pick(['none', 'annual', 'review', 'medical', 'elt']);
  const under40 = R() < 0.6;
  const medLife = under40 ? 60 : 24;
  const annual = now - (expired === 'annual' ? between(13, 15) : between(1, 11));
  const review = now - (expired === 'review' ? between(25, 27) : between(3, 23));
  const medical = now - (expired === 'medical' ? medLife + between(1, 3) : between(2, medLife - 1));
  const elt = now - (expired === 'elt' ? between(13, 14) : between(1, 11));
  const L: Record<string, string> = { none: 'Nothing: everything is current', annual: 'The annual inspection', review: 'Your flight review', medical: 'Your medical certificate', elt: 'The ELT inspection' };
  return item({
    id: 'g-legal', pave: 'P', topic: 'p-legal', acs: ['PA.I.A.K1', 'PA.I.B.K1b'],
    setup: [
      `It’s mid-${mStr(now)}. A private pilot plans to fly the school’s 152.`,
      `Last annual: ${mStr(annual)} · Last flight review: ${mStr(review)} · Third-class medical: ${mStr(medical)} (age ${under40 ? 'under 40' : '40 or older'} at the exam) · Last ELT inspection: ${mStr(elt)}.`
    ],
    prompt: 'Which, if anything, keeps this flight from being legal today?',
    choices: shuffle(Object.keys(L).filter((k) => k !== expired)).slice(0, 3).reduce((acc, k) => {
      acc.push({ t: L[k], why: k === 'none' ? 'Count the calendar months for each item.' : `${L[k]} is still current.` });
      return acc;
    }, [{ t: L[expired], ok: true }] as Choice[]),
    explain: [
      'Annual and ELT inspection: within the preceding **12 calendar months**. Flight review: since the beginning of the **24th calendar month** before this month. Third-class medical: through the end of the **60th month** after the exam month if under 40 at the exam, **24th** if 40 or older.',
      `Here, ${expired === 'none' ? 'every item is still current.' : `${L[expired].toLowerCase()} has run out.`}`
    ],
    c: ['cfr14:91.409(a)', 'cfr14:91.207(d)', 'cfr14:61.56(c)', 'cfr14:61.23(d)'], xp: 15
  });
}

// ───────────── 8. VFR cruising altitude ─────────────
function cruiseAlt(): Item {
  const course = between(0, 359);
  const east = course <= 179;
  const pickAlt = (odd: boolean) => (odd ? pick([3, 5, 7, 9]) : pick([4, 6, 8, 10])) * 1000 + 500;
  const right = pickAlt(east);
  return item({
    id: 'g-cruise-alt', pave: 'V', topic: 'v-nav', acs: ['PA.I.D.K2', 'PA.VI.A.K4b'],
    setup: [`Magnetic course ${String(course).padStart(3, '0')}°. You’ll cruise more than 3,000 ft above the surface, below 18,000 MSL, VFR.`],
    prompt: 'Which altitude is appropriate?',
    choices: choices(`${fmt(right)} ft MSL`, [
      [`${fmt(pickAlt(!east))} ft MSL`, `On a magnetic course of ${east ? '0–179°, use odd' : '180–359°, use even'} thousands + 500.`],
      [`${fmt(right - 500)} ft MSL`, 'VFR cruising altitudes are thousands + 500.'],
      [`${fmt(right + 500)} ft MSL`, 'VFR cruising altitudes are thousands + 500.']
    ]),
    explain: ['Above 3,000 ft AGL in level cruise: magnetic course **0–179° → odd thousands + 500**; **180–359° → even thousands + 500**.'],
    c: ['cfr14:91.159(a)'], xp: 10
  });
}

// ───────────── 9. Magnetic variation ─────────────
function variation(): Item {
  const tc = between(0, 359);
  const v = pick([14.5, 15, 16, 12]) * (R() < 0.75 ? 1 : -1); // + east, − west
  const mc = Math.round((((tc - v) % 360) + 360) % 360);
  const wrong = Math.round((((tc + v) % 360) + 360) % 360);
  const dirTxt = v > 0 ? `${Math.abs(v)}°E` : `${Math.abs(v)}°W`;
  return item({
    id: 'g-variation', pave: 'V', topic: 'v-nav', acs: ['PA.VI.A.K5a'],
    setup: [`True course ${String(tc).padStart(3, '0')}°. The isogonic line shows ${dirTxt} variation.`],
    prompt: 'What’s the magnetic course?',
    choices: choices(`${String(mc).padStart(3, '0')}°`, [
      [`${String(wrong).padStart(3, '0')}°`, v > 0 ? 'East is least: subtract easterly variation.' : 'West is best: add westerly variation.'],
      [`${String(tc).padStart(3, '0')}°`, 'Variation must be applied to get magnetic course.'],
      [`${String((mc + 180) % 360).padStart(3, '0')}°`, 'That’s the reciprocal.']
    ]),
    explain: [`**East is least (subtract), west is best (add).** ${tc}° ${v > 0 ? '−' : '+'} ${Math.abs(v)}° ≈ **${String(mc).padStart(3, '0')}°** magnetic.`],
    c: ['phak:16-8', 'phak:8-24'], xp: 10
  });
}

// ───────────── 10. Oxygen ─────────────
function oxygen(): Item {
  const alt = pick([11500, 12500, 13500, 14500, 15500]);
  const mins = pick([20, 40, 60]);
  const ans = alt <= 12500 ? 'No supplemental oxygen required' : alt <= 14000 ? (mins > 30 ? 'Crew must use oxygen for the part over 30 minutes' : 'No oxygen required for 30 minutes or less') : alt <= 15000 ? 'Crew must use oxygen the entire time' : 'Crew must use oxygen the entire time, and every occupant must be provided oxygen';
  return item({
    id: 'g-oxygen', pave: 'E', topic: 'e-regs', acs: ['PA.I.H.K1a', 'PA.I.A.K2'],
    setup: [`Unpressurized airplane, cabin altitude ${fmt(alt)} ft MSL for about ${mins} minutes.`],
    prompt: 'What does 14 CFR 91.211 require?',
    choices: choices(ans, [
      ['No supplemental oxygen required', 'Check the 12,500 / 14,000 / 15,000 ft thresholds.'],
      ['Crew must use oxygen for the part over 30 minutes', 'That applies above 12,500 up to 14,000 ft.'],
      ['Crew must use oxygen the entire time', 'That applies above 14,000 ft.'],
      ['Crew must use oxygen the entire time, and every occupant must be provided oxygen', 'Occupants must be provided oxygen above 15,000 ft.'],
      ['No oxygen required for 30 minutes or less', 'That applies only between 12,500 and 14,000 ft.']
    ].filter(([t]) => t !== ans) as [string, string][]),
    explain: ['Above **12,500 to 14,000 ft**: crew uses oxygen for flight over 30 minutes. Above **14,000**: crew uses it the entire time. Above **15,000**: every occupant must be provided oxygen.'],
    c: ['cfr14:91.211(a)'], xp: 10
  });
}

export const GENERATORS: (() => Item)[] = [wxLegal, vfrMins, fuelPlan, crosswind, takeoff, climb, legality, cruiseAlt, variation, oxygen];
export const GENERATOR_IDS = ['g-wx-legal', 'g-vfr-mins', 'g-fuel', 'g-xwind', 'g-takeoff', 'g-climb', 'g-legal', 'g-cruise-alt', 'g-variation', 'g-oxygen'];
