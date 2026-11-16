// Weight & balance problems built from the POH sample airplane (Figure 6-6) and POH arms
// (Figure 6-3). Labeled as the POH sample, not the owner's airplane.
import type { Item } from './types';

export const WB = {
  bew: 1136, bewMoment: 34000, // POH sample basic empty weight and moment (lb-in)
  armFuel: 42.0, armSeats: 39, armArea1: 64, armArea2: 84,
  fuelLbPerGal: 6, maxUsable: 24.5,
  maxRamp: 1675, maxTakeoff: 1670, taxiFuel: 5, taxiMoment: 200,
  aft: 36.5
};

// Forward CG limit: 31.0 in at 1,350 lb or less, straight line to 32.65 in at 1,670 lb.
export function fwdLimit(w: number) {
  if (w <= 1350) return 31.0;
  return 31.0 + ((w - 1350) / (1670 - 1350)) * (32.65 - 31.0);
}

export interface Load { pilot: number; pax: number; gal: number; a1: number; a2: number }

export function compute(l: Load) {
  const fuel = l.gal * WB.fuelLbPerGal;
  const ramp = WB.bew + fuel + l.pilot + l.pax + l.a1 + l.a2;
  const rampM = WB.bewMoment + fuel * WB.armFuel + (l.pilot + l.pax) * WB.armSeats + l.a1 * WB.armArea1 + l.a2 * WB.armArea2;
  const to = ramp - WB.taxiFuel;
  const toM = rampM - WB.taxiMoment;
  const cg = toM / to;
  const problems: string[] = [];
  if (ramp > WB.maxRamp) problems.push(`ramp weight ${ramp} lb is over the 1,675 lb limit`);
  if (to > WB.maxTakeoff) problems.push(`takeoff weight ${to} lb is over the 1,670 lb limit`);
  if (l.a2 > 40) problems.push('Area 2 baggage is over 40 lb');
  if (l.a1 + l.a2 > 120) problems.push('total baggage is over 120 lb');
  if (cg > WB.aft) problems.push(`CG ${cg.toFixed(1)} in is aft of the 36.5 in limit`);
  if (cg < fwdLimit(to)) problems.push(`CG ${cg.toFixed(1)} in is forward of the limit`);
  return { fuel, ramp, rampM, to, toM, cg, ok: problems.length === 0, problems };
}

const r = (lo: number, hi: number, step = 5) => lo + step * Math.floor(Math.random() * ((hi - lo) / step + 1));

// Builds a fresh, randomized loading problem each time it's shown.
export function wbItem(): Item {
  const l: Load = { pilot: r(140, 220), pax: r(0, 220), gal: [24.5, 20, 18, 15, 12][Math.floor(Math.random() * 5)], a1: r(0, 60), a2: r(0, 20) };
  const x = compute(l);
  const yes = 'Yes, within weight and CG limits';
  const choices = x.ok
    ? [{ t: yes, ok: true }, { t: 'No, over max takeoff weight', why: `Takeoff weight is ${x.to} lb, at or under 1,670.` }, { t: 'No, CG is aft of limits', why: `CG is ${x.cg.toFixed(1)} in, inside the 36.5 in aft limit.` }]
    : [{ t: `No: ${x.problems[0]}`, ok: true }, { t: yes, why: `Not legal: ${x.problems.join('; ')}.` }, { t: 'Yes, as long as you burn off fuel before landing', why: 'You must be within limits for takeoff.' }];
  const fuelTxt = `${l.gal} gal (${x.fuel} lb)`;
  return {
    id: 'wb-calc', kind: 'scenario', pave: 'A', topic: 'a-wb', acs: ['PA.I.F.K2f', 'PA.I.F.R2'],
    setup: [
      `Using the POH sample C152 (basic empty weight ${WB.bew} lb, moment ${WB.bewMoment.toLocaleString()} lb-in): pilot ${l.pilot} lb, ${l.pax ? `passenger ${l.pax} lb` : "no passenger"}, fuel ${fuelTxt}, baggage Area 1 ${l.a1} lb, Area 2 ${l.a2} lb.`,
      'Arms: seats 39 in, fuel 42.0 in, Area 1 64 in, Area 2 84 in. Subtract 5 lb (200 lb-in) for start, taxi, and runup.'
    ],
    prompt: 'Is this loading legal for takeoff?',
    choices,
    explain: [
      `Ramp: **${x.ramp} lb**, moment ${Math.round(x.rampM).toLocaleString()} lb-in. Takeoff: **${x.to} lb**, moment ${Math.round(x.toM).toLocaleString()} lb-in.`,
      `CG = moment ÷ weight = **${x.cg.toFixed(2)} in** aft of datum. Limits at ${x.to} lb: forward ${fwdLimit(x.to).toFixed(2)} in, aft 36.5 in. Max takeoff 1,670 lb; baggage Area 2 max 40 lb, combined max 120 lb.`,
      x.ok ? 'Everything is inside the limits.' : `Problem: ${x.problems.join('; ')}.`,
      'This uses the POH **sample** airplane. Your 152’s actual empty weight and moment are in its own weight and balance records.'
    ],
    think: 'With two adults in a 152, fuel is usually what you trade away. How would reduced fuel change your range and reserve planning?',
    c: ['poh:6-10', 'poh:6-7', 'poh:2-6'], xp: 20
  };
}
