// Phase 3 scenario batch 1: scenario, emergency, and chart items across the PAVE outline.
// Every fact was checked against the cited source.
import type { Item } from './types';

const KLAMATH = 'Klamath Falls' as const;

export const SCENARIOS: Item[] = [
  // ─────────────── PILOT ───────────────
  {
    id: 's-flight-review', kind: 'scenario', pave: 'P', topic: 'p-legal', acs: ['PA.I.A.K1', 'PA.I.A.S1'],
    vars: { mon: ['October', 'September'] },
    setup: ['Picture yourself two years after your checkride. It’s November 2026. Your last flight review was in {mon} 2024 and you haven’t passed any practical test or WINGS phase since.'],
    prompt: 'Can you act as PIC of the 152 today?',
    choices: [
      { t: 'No. The review had to be since the beginning of the 24th calendar month before this month (November 2024).', ok: true },
      { t: 'Yes, through the end of {mon} 2026: the 24 calendar months run from the review month.', why: 'Count back from the month of the flight: the review must be on or after November 2024 for a November 2026 flight.' },
      { t: 'Yes. Your 3 landings in the last 90 days keep you legal as PIC.', why: 'Landing currency and the flight review are separate requirements.' },
      { t: 'Only to fly solo; a flight review is needed only to carry passengers.', why: 'Without a current flight review you can’t act as PIC at all.' }
    ],
    explain: ['No one may act as PIC unless, **since the beginning of the 24th calendar month before the month of the flight**, they’ve completed a flight review (1 hour ground + 1 hour flight) with a logbook endorsement, or passed a practical test or WINGS phase that substitutes for it.'],
    c: ['cfr14:61.56(c)', 'cfr14:61.56(d)', 'cfr14:61.56(e)'], xp: 15
  },
  {
    id: 's-medical-date', kind: 'scenario', pave: 'P', topic: 'p-medical', acs: ['PA.I.A.K3'],
    vars: { age: ['38', '35', '29'] },
    setup: ['You were {age} when you got your third-class medical on March 10, 2024.'],
    prompt: 'Through what date can it be used for private pilot privileges?',
    choices: [
      { t: 'Through March 31, 2029.', ok: true },
      { t: 'Through March 10, 2029.', why: 'Medicals run to the end of the last day of the month.' },
      { t: 'Through March 31, 2026.', why: '24 months applies if you were 40 or older at the exam.' },
      { t: 'Through February 28, 2029.', why: 'Count 60 months after the exam month: the end of March 2029.' }
    ],
    explain: ['Under 40 at the exam: third class lasts until **the end of the last day of the 60th month** after the exam month. 40 or older: the 24th month.'],
    c: ['cfr14:61.23(d)'], xp: 15
  },
  {
    id: 's-alcohol', kind: 'scenario', pave: 'P', topic: 'p-imsafe', acs: ['PA.I.H.K2', 'PA.I.H.K3'],
    vars: { time: ['10:30 pm', '11 pm'] },
    setup: ['At a friend’s party you have several beers, your last at {time}. You’re booked for a 7:30 am flight the next morning.'],
    prompt: 'What’s the best decision?',
    choices: [
      { t: 'Cancel or push the flight back. The 8-hour rule is a legal minimum; the AIM recommends 12 to 24 hours depending on how much you drank.', ok: true },
      { t: 'Fly. More than 8 hours have passed, so you’re legal as long as you feel okay.', why: 'You also can’t be under the influence or at 0.04 or higher, and the AIM recommends 12–24 hours.' },
      { t: 'Fly, but take a breathalyzer test first and go only if it reads under 0.08.', why: 'The aviation limit is 0.04, not 0.08.' },
      { t: 'Push it back 1 hour so that 9 hours have passed.', why: 'That only satisfies the bare legal minimum. The AIM recommends 12–24 hours.' }
    ],
    explain: [
      'No acting as a crewmember **within 8 hours** of drinking, **while under the influence**, or **at 0.04 or more**.',
      'The AIM: a pilot may still be under the influence 8 hours after a moderate amount, so allow **at least 12 to 24 hours** between bottle and throttle.'
    ],
    c: ['cfr14:91.17(a)', 'aim:8-1-1'], xp: 15
  },
  {
    id: 's-prorata', kind: 'scenario', pave: 'P', topic: 'p-limits', acs: ['PA.I.A.K2'],
    vars: { dest: ['Astoria', 'Newport', 'Bend'] },
    setup: ['After your checkride, you take a friend to {dest} for lunch. The rental and fuel total $360. Your friend offers to pay all of it.'],
    prompt: 'What can you accept?',
    choices: [
      { t: 'You must pay at least your pro rata share: here, at least half ($180).', ok: true },
      { t: 'Your friend may pay all the fuel, and you pay the rental.', why: 'You must pay at least your pro rata share of all the operating expenses.' },
      { t: 'Your friend may pay everything, since you aren’t making a profit.', why: 'A private pilot may not pay less than the pro rata share.' },
      { t: 'You may split it evenly, but only fuel and oil can be shared.', why: 'Fuel, oil, airport expenditures, and rental fees can all be shared.' }
    ],
    explain: ['A private pilot may not pay **less than the pro rata share** of the operating expenses, and only **fuel, oil, airport expenditures, or rental fees** count.'],
    c: ['cfr14:61.113(c)'], xp: 15
  },
  {
    id: 's-business', kind: 'scenario', pave: 'P', topic: 'p-privileges', acs: ['PA.I.A.K2'],
    setup: ['You’re an accountant. Your firm asks you to fly yourself to a client meeting in Bend in a rental 152, and reimburses the rental as a business expense.'],
    prompt: 'Is this legal for a private pilot?',
    choices: [
      { t: 'Yes, if the flight is only incidental to your job and you carry no passengers or property for hire.', ok: true },
      { t: 'Yes, but only if you hold at least a second-class medical.', why: 'The medical class doesn’t change private pilot privileges. §61.113(b) is about the flight being incidental, with no passengers or property carried for hire.' },
      { t: 'No. Being reimbursed by your employer makes it a commercial flight.', why: '§61.113(b) specifically allows flights incidental to business or employment.' },
      { t: 'Only if you pay at least half of the rental yourself.', why: 'That’s the pro rata rule for passengers, not the business rule.' }
    ],
    explain: ['A private pilot may act as PIC for compensation or hire **in connection with business or employment** if the flight is **only incidental** to that business and the aircraft **does not carry passengers or property for compensation or hire**.'],
    c: ['cfr14:61.113(b)'], xp: 15
  },
  {
    id: 's-anti-authority', kind: 'scenario', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2'],
    setup: ['Before a flight to Corvallis you think: “The TFR NOTAMs are always overkill. Nobody checks those anyway, so I’ll skip the briefing.”'],
    prompt: 'Which hazardous attitude, and what’s the antidote?',
    choices: [
      { t: 'Anti-authority: “Follow the rules. They are usually right.”', ok: true },
      { t: 'Resignation: “I’m not helpless.”', why: 'Resignation is “What’s the use?”' },
      { t: 'Impulsivity: “Not so fast.”', why: 'Impulsivity is acting quickly without thinking.' },
      { t: 'Macho: “Taking chances is foolish.”', why: 'Macho is about proving yourself.' }
    ],
    explain: ['**Anti-authority** (“Don’t tell me.”) regards rules and procedures as silly or unnecessary. Antidote: **“Follow the rules. They are usually right.”** Before every flight you must become familiar with all available information.'],
    c: ['phak:2-5', 'cfr14:91.103'], xp: 15
  },
  {
    id: 's-resignation', kind: 'scenario', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2', 'PA.VI.D.R4'],
    setup: ['Over the Coast Range, clouds have closed in behind you and you’re not sure where you are. You think: “Nothing I do now will matter. It’s up to luck.”'],
    prompt: 'Which hazardous attitude, and what’s the antidote?',
    choices: [
      { t: 'Resignation: “I’m not helpless. I can make a difference.”', ok: true },
      { t: 'Invulnerability: “It could happen to me.”', why: 'Invulnerability is “It won’t happen to me.”' },
      { t: 'Anti-authority: “Follow the rules.”', why: 'Anti-authority is “Don’t tell me.”' },
      { t: 'Impulsivity: “Not so fast. Think first.”', why: 'Impulsivity is “Do it quickly.”' }
    ],
    explain: [
      '**Resignation** (“What’s the use?”): the pilot leaves the action to others or to luck. Antidote: **“I’m not helpless. I can make a difference.”**',
      'You can make a difference: climb (if weather allows) for better radio and radar coverage, fix your position with the GTN 650, and call ATC for help.'
    ],
    c: ['phak:2-5', 'phak:16-34'], xp: 15
  },
  {
    id: 's-impulsivity', kind: 'scenario', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2'],
    setup: ['In cruise the engine runs slightly rough. Without thinking, you immediately yank the mixture to full lean to “fix it.”'],
    prompt: 'Which hazardous attitude shows here?',
    choices: [
      { t: 'Impulsivity: “Not so fast. Think first.”', ok: true },
      { t: 'Macho: “Taking chances is foolish.”', why: 'This isn’t about showing off. It’s acting before thinking.' },
      { t: 'Invulnerability', why: 'Invulnerability is “It won’t happen to me.”' },
      { t: 'Resignation', why: 'Resignation is doing nothing.' }
    ],
    explain: ['**Impulsivity** (“Do it quickly.”): doing the first thing that comes to mind instead of selecting the best alternative. For roughness, your POH’s troubleshooting (carb heat for ice; mag check and lean setting for plug fouling) is the better path.'],
    c: ['phak:2-5', 'poh:3-13'], xp: 15
  },

  // ─────────────── AIRCRAFT ───────────────
  {
    id: 's-annual', kind: 'scenario', pave: 'A', topic: 'a-inspect', acs: ['PA.I.B.K1b', 'PA.I.B.R1'],
    setup: ['Preflighting the 152 on November 16, 2026, you check the logs. The last annual inspection was signed off on October 15, 2025.'],
    prompt: 'Is the airplane legal to fly?',
    choices: [
      { t: 'No. The annual expired at the end of October 2026.', ok: true },
      { t: 'Yes. It’s good through October 15, 2026 plus the rest of the month, so still legal in November.', why: 'The rest of the month is October, not November.' },
      { t: 'Yes, as long as a 100-hour inspection was done in the last 100 hours.', why: 'A 100-hour doesn’t substitute for an annual.' },
      { t: 'Yes, for a ferry flight to the shop without any permit.', why: 'That would need a special flight permit.' }
    ],
    explain: ['No one may operate an aircraft unless it has had an **annual inspection within the preceding 12 calendar months**. An October 15, 2025 annual is good through **October 31, 2026**.'],
    c: ['cfr14:91.409(a)'], xp: 15
  },
  {
    id: 's-100hr', kind: 'scenario', pave: 'A', topic: 'a-inspect', acs: ['PA.I.B.K1b'],
    vars: { left: ['1.5', '0.8'] },
    setup: ['Your school’s 152 has {left} hours left before its 100-hour inspection is due. You’re scheduled for a 2-hour dual lesson with your instructor.'],
    prompt: 'What’s the issue?',
    choices: [
      { t: 'It’s flight instruction for hire in the school’s airplane, so it can’t exceed 100 hours. The 10-hour allowance is only to reach a place for the inspection.', ok: true },
      { t: 'The 10-hour overfly lets you finish the lesson as long as you schedule the inspection.', why: 'The 10 hours may be used only en route to where the inspection can be done.' },
      { t: 'No issue: 100-hour inspections apply only when carrying passengers for hire.', why: 'They also apply to flight instruction for hire in an aircraft the instructor provides.' },
      { t: 'No issue as long as the annual is current.', why: 'The annual doesn’t replace the 100-hour for instruction for hire.' }
    ],
    explain: ['A 100-hour is required to carry anyone for hire or to give **flight instruction for hire in an aircraft that person provides**. The limit can be exceeded by **not more than 10 hours, only while en route to reach a place where the inspection can be done**.'],
    c: ['cfr14:91.409(b)'], xp: 15
  },
  {
    id: 's-inop-landing-light', kind: 'scenario', pave: 'A', topic: 'a-inop', acs: ['PA.I.B.K3a', 'PA.I.B.R1'],
    setup: ['Day VFR flight, back well before sunset. During preflight you find the landing light is burned out. The 152 has no MEL.'],
    prompt: 'Can you go?',
    choices: [
      { t: 'Yes, if it’s not required by the equipment list, KOEL, §91.205, or an AD; it’s deactivated and placarded inoperative; and you determine it isn’t a hazard.', ok: true },
      { t: 'Yes, if you placard it inoperative. No other check is needed for a light.', why: 'You must also confirm it isn’t required by the equipment list, KOEL, §91.205, or an AD, and determine it isn’t a hazard.' },
      { t: 'No. Without an MEL, all installed equipment must be working.', why: '§91.213(d) allows flight with some inoperative equipment without an MEL.' },
      { t: 'No. §91.205 requires a landing light for day VFR flight training.', why: '§91.205 requires a landing light only at night when operated for hire.' }
    ],
    explain: [
      'Without an MEL (§91.213(d)), the item must not be required by the **VFR-day type certificate, the equipment list or KOEL, §91.205 or another rule, or an AD**.',
      'Then it must be **removed or deactivated and placarded “Inoperative,”** and a pilot or mechanic must **determine it isn’t a hazard**. §91.205 requires a landing light only **at night when operated for hire**.'
    ],
    c: ['cfr14:91.213(d)', 'cfr14:91.205(c)'], xp: 15
  },
  {
    id: 's-inop-navlight', kind: 'scenario', pave: 'A', topic: 'a-inop', acs: ['PA.I.B.K3', 'PA.XI.A.K3'],
    setup: ['Returning from Salem, you’ll land at KHIO about 20 minutes after sunset. On preflight, the left position light doesn’t work.'],
    prompt: 'What’s the problem?',
    choices: [
      { t: 'Position lights are required from sunset to sunrise, so you can’t fly that leg after sunset.', ok: true },
      { t: 'You’re fine until the end of evening civil twilight, the legal definition of night.', why: 'Position lights are required from sunset, not from the end of civil twilight.' },
      { t: 'You’re fine if the anticollision strobes work.', why: 'Anticollision lights don’t replace required position lights.' },
      { t: 'You’re fine if you land within 1 hour after sunset.', why: '1 hour after sunset is the night-currency period, not the position light rule.' }
    ],
    explain: ['No one may operate an aircraft **from sunset to sunrise** without lighted position lights, and night VFR requires approved position lights. Leave earlier, or get it fixed.'],
    c: ['cfr14:91.209(a)', 'cfr14:91.205(c)'], xp: 15
  },
  {
    id: 's-bend-takeoff', kind: 'scenario', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.K1', 'PA.I.F.K2a', 'PA.I.F.R1'],
    setup: ['Summer afternoon in Bend (elevation 3,459 ft). Pressure altitude works out to 4,000 ft and it’s 30 °C. You’re at 1,670 lb, wind calm, paved dry runway, flaps 10°, short-field technique.'],
    prompt: 'Per POH Figure 5-5, what are the ground roll and total distance over a 50-ft obstacle?',
    choices: [
      { t: '1,190 ft ground roll; 2,250 ft total', ok: true },
      { t: '1,080 ft ground roll; 2,020 ft total', why: 'That’s the 3,000 ft row at 30 °C.' },
      { t: '1,100 ft ground roll; 2,080 ft total', why: 'That’s 4,000 ft at 20 °C.' },
      { t: '1,315 ft ground roll; 2,525 ft total', why: 'That’s 5,000 ft pressure altitude at 30 °C.' }
    ],
    explain: [
      'POH short-field takeoff, 1,670 lb, **4,000 ft and 30 °C: 1,190 ft ground roll, 2,250 ft to clear 50 ft**. At sea level and 30 °C it’s only 810 / 1,495.',
      'POH notes: above **3,000 ft field elevation, lean for maximum RPM** in a full-throttle static runup. On a dry grass runway, add 15% to the ground roll.',
      'Bend’s runway is 5,201 ft. The POH says its figures come from flight tests under carefully documented conditions and will vary with individual airplanes, so build in a margin.'
    ],
    think: 'Bend in summer often sits well above standard temperature. Compute it before you go, and add your own margin for a tired engine and your technique.',
    c: ['poh:5-12', 'poh:ii', 'cs:KBDN'], xp: 20
  },
  {
    id: 's-cascades-climb', kind: 'scenario', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.K1', 'PA.I.D.K2'],
    setup: ['Eastbound over the Cascades to Bend on a 20 °C summer day, you’re climbing at full throttle, leaned for max RPM, near max gross weight. You pass 8,000 ft pressure altitude.'],
    prompt: 'Per POH Figure 5-6, about what climb rate should you expect now, and at 10,000 ft?',
    choices: [
      { t: 'About 320 fpm at 8,000 ft; about 230 fpm at 10,000 ft', ok: true },
      { t: 'About 380 fpm at 8,000 ft; about 285 fpm at 10,000 ft', why: 'Those are the 0 °C values.' },
      { t: 'About 265 fpm at 8,000 ft; about 175 fpm at 10,000 ft', why: 'Those are the 40 °C values.' },
      { t: 'About 415 fpm at 8,000 ft; about 320 fpm at 10,000 ft', why: 'Those are the 6,000 and 8,000 ft values at 20 °C.' }
    ],
    explain: ['POH maximum rate of climb at 1,670 lb, **20 °C: 320 fpm at 8,000 ft, 230 fpm at 10,000 ft** (climb speed 62 and 61 KIAS). Mixture leaned above 3,000 ft for max RPM.'],
    think: 'At a few hundred feet per minute, plan your climb before you reach rising terrain. Downdrafts in mountain wave can exceed what a 152 can out-climb.',
    c: ['poh:5-13'], xp: 20
  },
  {
    id: 's-cruise-fuel', kind: 'scenario', pave: 'A', topic: 'a-perf', acs: ['PA.I.D.K3c', 'PA.I.F.K1'],
    setup: ['Planning to cruise at 8,000 ft pressure altitude, standard temperature, 2,400 RPM, recommended lean mixture.'],
    prompt: 'Per POH Figure 5-8, what true airspeed and fuel flow should you plan?',
    choices: [
      { t: 'About 100 KTAS at 5.5 GPH', ok: true },
      { t: 'About 108 KTAS at 6.4 GPH', why: 'That’s 2,550 RPM.' },
      { t: 'About 95 KTAS at 5.0 GPH', why: 'That’s 2,300 RPM.' },
      { t: 'About 101 KTAS at 6.0 GPH', why: 'That’s 4,000 ft at 2,400 RPM.' }
    ],
    explain: [
      'POH cruise at 1,670 lb, **8,000 ft, standard temperature, 2,400 RPM: 67% BHP, 100 KTAS, 5.5 GPH**.',
      'Note: cruise speeds in the POH assume speed fairings (about 2 knots faster).'
    ],
    c: ['poh:5-15'], xp: 15
  },
  {
    id: 's-crosswind-runway', kind: 'scenario', pave: 'A', topic: 'a-perf', acs: ['PA.IV.A.R1', 'PA.IV.A.R2a'],
    setup: ['KHIO ATIS: wind 230 at 20, gusting 28. Runways: 13R/31L, 13L/31R, and 02/20 (3,820 ft long). The tower is using 31L.'],
    prompt: 'What’s your best plan in the 152?',
    choices: [
      { t: 'Request Runway 20. The wind is about 30° off it instead of about 80° off 31L.', ok: true },
      { t: 'Accept 31L: the crosswind is about half the wind speed, within the 12-knot demonstrated value.', why: 'At about 80° off, nearly all of the 20–28 knots is crosswind.' },
      { t: 'Request Runway 13R for its greater length and width.', why: '13R has the same alignment as 31L, so the same crosswind.' },
      { t: 'Request Runway 20 only if the gusts drop below 20 knots; otherwise use 31L.', why: 'Runway 20 is the better choice whatever the gusts.' }
    ],
    explain: [
      'Wind 230° vs runway 310°: about **80°**, so nearly the whole 20–28 knots is crosswind. Vs runway 200°: about **30°**, roughly half as crosswind.',
      'The 152’s **maximum demonstrated crosswind is 12 knots**. That’s not a limitation, but it tells you what was shown to be controllable.'
    ],
    think: 'If no runway gives you a crosswind you’re comfortable with, the best runway may be at another airport, or tomorrow.',
    c: ['poh:5-11', 'poh:4-3', 'aim:4-3-6', 'cs:KHIO'], xp: 20
  },
  {
    id: 's-runup-mag', kind: 'scenario', pave: 'A', topic: 'a-elec', acs: ['PA.II.F.K1b'],
    vars: { drop: ['175', '150'] },
    setup: ['Runup at 1,700 RPM. Right magneto: 75 RPM drop. Left magneto: {drop} RPM drop. Engine runs smoothly on both.'],
    prompt: 'What do you do?',
    choices: [
      { t: 'Don’t go. More than 125 RPM drop, and more than 50 RPM difference between mags.', ok: true },
      { t: 'Go. The drop is under 175 RPM on each mag, which is within limits.', why: 'The POH limit is 125 RPM drop on either mag.' },
      { t: 'Lean the mixture aggressively to clear a fouled plug, then go without rechecking.', why: 'You can try to clear plugs, but you must recheck. Don’t take off on a failed check.' },
      { t: 'Go. The difference only matters if the engine runs rough.', why: 'The POH limits are numbers, not just smoothness.' }
    ],
    explain: ['POH magneto check at **1,700 RPM**: RPM drop should **not exceed 125 RPM on either magneto** or show **more than 50 RPM differential**. If in doubt, checks at higher RPM usually confirm whether there’s a problem. Taxi back and squawk it.'],
    c: ['poh:4-14'], xp: 15
  },
  {
    id: 's-cg-effects', kind: 'scenario', pave: 'A', topic: 'a-wb', acs: ['PA.I.F.K2e'],
    setup: ['Two loadings of the same 152 at the same weight: one near the forward CG limit, one near the aft limit.'],
    prompt: 'Which statement is correct?',
    choices: [
      { t: 'Forward CG stalls at a higher speed; aft CG cruises faster but is less stable.', ok: true },
      { t: 'Forward CG stalls at a lower speed; aft CG cruises faster but is less stable.', why: 'Forward CG stalls at a higher speed.' },
      { t: 'Aft CG stalls at a higher speed and is more stable.', why: 'Aft CG is less stable and stalls at a lower speed.' },
      { t: 'Forward CG cruises faster and is less stable.', why: 'Aft CG cruises faster; aft CG is less stable.' }
    ],
    explain: ['PHAK: with a **forward CG** the airplane **stalls at a higher speed** and needs more back elevator pressure. With an **aft CG** it **cruises faster** (less drag) but becomes **less stable**.'],
    c: ['phak:5-44'], xp: 15
  },
  {
    id: 's-low-oil', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-engine', acs: ['PA.IX.C.K1', 'PA.I.G.K2'],
    setup: ['Cruising over farmland near Albany, the oil pressure drops to zero and oil temperature starts climbing.'],
    prompt: 'What does your POH say?',
    choices: [
      { t: 'Engine failure may be imminent: reduce power now, pick a forced-landing field, and use only the power needed to reach it.', ok: true },
      { t: 'Probably a gauge or relief valve problem. Land at the nearest airport to inspect.', why: 'That’s the POH guidance when oil temperature stays normal. Rising temperature means engine failure may be imminent.' },
      { t: 'Add power to climb, so you have more glide range if it quits.', why: 'The POH says reduce power immediately.' },
      { t: 'Enrich the mixture to cool the engine and continue to the nearest airport.', why: 'The POH says reduce power and select a forced-landing field.' }
    ],
    explain: ['POH: low oil pressure with **normal** oil temperature may be a gauge or relief valve problem, so land at the nearest airport to inspect. **Total loss of oil pressure with rising oil temperature** means engine failure may be imminent: **reduce power immediately and select a forced-landing field**, using only the minimum power needed.'],
    c: ['poh:3-14'], xp: 20
  },
  {
    id: 's-overcharge', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-elec', acs: ['PA.IX.C.K2a'],
    setup: ['In cruise, the ammeter suddenly shows a full-scale charge.'],
    prompt: 'What’s the POH checklist?',
    choices: [
      { t: 'Alternator off, alternator circuit breaker pull, nonessential equipment off, terminate flight as soon as practical.', ok: true },
      { t: 'Radios off, master off then on, check the light off, radios on.', why: 'That’s the low-voltage procedure.' },
      { t: 'Alternator off, then back on after a minute to reset it, and continue.', why: 'The POH says pull the alternator breaker and terminate the flight.' },
      { t: 'Master switch off for the rest of the flight.', why: 'The POH turns off the alternator, not the master.' }
    ],
    explain: ['POH “Ammeter Shows Excessive Rate of Charge”: **Alternator OFF → Alternator circuit breaker PULL → Nonessential electrical equipment OFF → Flight TERMINATE as soon as practical.**'],
    c: ['poh:3-8'], xp: 15
  },
  {
    id: 's-engine-fire', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-engine', acs: ['PA.IX.C.K3'],
    setup: ['Smoke and flames appear from the cowling in cruise at 4,500 ft.'],
    prompt: 'What are the first actions (memory items)?',
    choices: [
      { t: 'Mixture idle cut-off, fuel shutoff valve off.', ok: true },
      { t: 'Master switch off, mixture idle cut-off.', why: 'For an engine fire the memory items cut off the fuel first.' },
      { t: 'Fuel shutoff valve off, then glide at 60 KIAS.', why: 'Mixture idle cut-off is first, and the POH speed is 85 KIAS.' },
      { t: 'Mixture idle cut-off, cabin heat on to keep fumes out.', why: 'The POH turns cabin heat and air off (except wing root vents).' }
    ],
    explain: ['POH Engine Fire in Flight: **Mixture IDLE CUT-OFF, Fuel Shutoff Valve OFF** (bold memory items), then master off, cabin heat and air off (except wing root vents), **85 KIAS** (increase glide speed if the fire isn’t out), and execute a forced landing.'],
    c: ['poh:3-6'], xp: 20
  },
  {
    id: 's-start-fire', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-engine', acs: ['PA.II.C.K4', 'PA.IX.C.K3'],
    setup: ['After a lot of priming on a cold morning, you see flames from the engine compartment during the start.'],
    prompt: 'What does the POH say to do first?',
    choices: [
      { t: 'Keep cranking, to suck the flames and fuel through the carburetor into the engine.', ok: true },
      { t: 'Stop cranking, mixture idle cut-off, and get the extinguisher.', why: 'The POH’s first step is to continue cranking.' },
      { t: 'Stop cranking, master off, and exit the airplane.', why: 'The POH’s first step is to continue cranking.' },
      { t: 'Keep cranking with the throttle closed and the mixture rich.', why: 'If it doesn’t start, the POH says throttle full open and mixture idle cut-off.' }
    ],
    explain: ['POH Fire During Start on Ground: **Cranking CONTINUE**. If it starts, run at 1,700 RPM for a few minutes, then shut down and inspect. If it doesn’t start: throttle full open, mixture idle cut-off, keep cranking, get a fire extinguisher, then secure the engine.'],
    c: ['poh:3-5'], xp: 15
  },
  {
    id: 's-vacuum', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-pitot', acs: ['PA.IX.C.K2b', 'PA.I.G.R1'],
    setup: ['Under a high overcast, you notice the attitude indicator slowly tilting while the airplane flies level, and the low-vacuum light comes on. The suction gauge reads well below the green arc.'],
    prompt: 'What’s going on, and what can you still trust?',
    choices: [
      { t: 'Vacuum failure: the attitude and heading indicators are unreliable. The electric turn coordinator, the pitot-static instruments, and the outside horizon still work.', ok: true },
      { t: 'Vacuum failure: the attitude indicator and turn coordinator are unreliable; use the heading indicator.', why: 'The turn coordinator is electric. The heading indicator is vacuum-driven.' },
      { t: 'Vacuum failure: only the attitude indicator is affected; the heading indicator is electric.', why: 'Both the attitude and heading indicators are vacuum-driven in the 152.' },
      { t: 'Electrical failure: the attitude and heading indicators are unreliable.', why: 'The low-vacuum light and low suction point to the vacuum system.' }
    ],
    explain: [
      'The engine-driven vacuum system runs the **attitude indicator and directional indicator**. Normal suction is **4.5–5.4 in. Hg**.',
      'With a vacuum failure, the POH assumes only the **electric turn coordinator** is left for attitude reference. Stay out of the clouds and cross-check the magnetic compass.'
    ],
    c: ['poh:7-30', 'poh:2-5', 'poh:3-11'], xp: 20
  },
  {
    id: 's-imc-180', kind: 'scenario', emergency: true, pave: 'V', topic: 'v-wx-general', acs: ['PA.VIII.D', 'PA.I.C.R1a'],
    setup: ['Scud running along the Columbia, you suddenly fly into cloud. You can’t see the ground.'],
    prompt: 'Per your POH’s procedure for a 180° turn in clouds, what do you do?',
    choices: [
      { t: 'Note the heading and time, make a standard-rate turn using the turn coordinator for 60 seconds, roll level, and confirm the compass shows the reciprocal.', ok: true },
      { t: 'Make a 30° bank turn using the attitude indicator until the heading indicator shows the reciprocal.', why: 'The POH procedure assumes only the turn coordinator, using a standard-rate turn for 60 seconds.' },
      { t: 'Make a standard-rate turn for 2 minutes, then check the compass.', why: 'A standard-rate turn takes 1 minute to turn 180°.' },
      { t: 'Climb straight ahead to get on top, then turn around.', why: 'The POH plan is an immediate 180° turn back to VFR.' }
    ],
    explain: [
      'POH: note the **compass heading** and **time**; at the nearest half minute, start a **standard-rate turn** (turn coordinator wing on the index mark) for **60 seconds**, then roll level. Check the compass reads the **reciprocal**.',
      'Maintain altitude and airspeed with cautious elevator inputs. Avoid overcontrolling.'
    ],
    c: ['poh:3-11', 'aim:8-1-5'], xp: 20
  },
  {
    id: 's-emerg-landing-items', kind: 'recall', emergency: true, pave: 'A', topic: 'a-perf', acs: ['PA.IX.B.K1'],
    prompt: 'Say the C152 “Emergency Landing Without Engine Power” checklist.',
    answer: ['1. Seats, belts, harnesses: **SECURE**', '2. Airspeed: **65 KIAS flaps up, 60 KIAS flaps down**', '3. Mixture: IDLE CUT-OFF', '4. Fuel shutoff valve: OFF', '5. Ignition switch: OFF', '6. Wing flaps: AS REQUIRED (30° recommended)', '7. Master switch: OFF', '8. Doors: UNLATCH PRIOR TO TOUCHDOWN', '9. Touchdown: SLIGHTLY TAIL LOW', '10. Brakes: APPLY HEAVILY'],
    explain: [], c: ['poh:3-4'], xp: 15
  },
  {
    id: 's-restart-items', kind: 'recall', emergency: true, pave: 'A', topic: 'a-carbheat', acs: ['PA.IX.B.K1'],
    prompt: 'Say the C152 “Engine Failure During Flight (Restart Procedures)” checklist. Which items are memory items?',
    answer: ['1. **Airspeed: 60 KIAS** (memory item)', '2. **Carburetor heat: ON** (memory item)', '3. Primer: IN and LOCKED', '4. Fuel shutoff valve: ON', '5. Mixture: RICH', '6. Ignition switch: BOTH (or START if the propeller is stopped)'],
    explain: [], c: ['poh:3-4'], xp: 15
  },
  {
    id: 's-precautionary', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-perf', acs: ['PA.IX.B.K1', 'PA.IX.B.R1'],
    setup: ['Weather is closing in and you’re low on options. The engine runs fine, so you decide to land in a large hay field near Sheridan.'],
    prompt: 'Per the POH, how do you set up?',
    choices: [
      { t: 'Fly over the field at 60 KIAS with 20° flaps to check terrain and obstructions, then land with 30° flaps at 55 KIAS.', ok: true },
      { t: 'Fly over the field at 60 KIAS with 30° flaps, then land with 30° flaps at 60 KIAS.', why: 'The inspection pass uses 20° flaps; final is 55 KIAS.' },
      { t: 'Overfly at pattern altitude at cruise speed, then land with 20° flaps at 65 KIAS.', why: 'The POH uses a slow inspection pass at 60 KIAS with 20° flaps and a 55 KIAS full-flap final.' },
      { t: 'Land straight in at 54 KIAS with 30° flaps, without an inspection pass.', why: 'The POH calls for flying over the field first to check it.' }
    ],
    explain: ['POH Precautionary Landing with Engine Power: belts secure, **60 KIAS, flaps 20°**, **fly over the selected field** noting terrain and obstructions, retract flaps once at a safe altitude and airspeed, radios and electrical off, **flaps 30° on final, 55 KIAS**, master off, doors unlatched before touchdown, slightly tail low, ignition off, brakes heavily.'],
    c: ['poh:3-4', 'poh:3-5'], xp: 15
  },
  {
    id: 's-ditching', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-perf', acs: ['PA.IX.B.K1', 'PA.IX.D.K3c'],
    setup: ['The engine has quit over the Columbia River. There’s no reachable dry land.'],
    prompt: 'Per the POH ditching checklist, what approach?',
    choices: [
      { t: 'MAYDAY on 121.5 and squawk 7700, flaps 30°, about 300 fpm descent at 55 KIAS, doors unlatched, level attitude at touchdown.', ok: true },
      { t: 'MAYDAY on 121.5 and squawk 7700, flaps up, best glide 60 KIAS, doors closed until stopped.', why: 'The POH uses 30° flaps, 300 fpm at 55 KIAS, and unlatches the doors before touchdown.' },
      { t: 'MAYDAY on 121.5, flaps 30°, power off at 55 KIAS, nose high to stall it in.', why: 'The POH touchdown is a level attitude at 300 fpm descent.' },
      { t: 'Squawk 7600, flaps 20°, 500 fpm at 60 KIAS, land into the swells.', why: '7700 is the emergency code; land parallel to swells in light wind.' }
    ],
    explain: ['POH Ditching: **transmit MAYDAY on 121.5 MHz and squawk 7700**, secure heavy objects, belts secure, approach into the wind (high winds) or parallel to swells (light winds), **flaps 30°, 300 ft/min at 55 KIAS**, unlatch doors, **level attitude at touchdown**, cushion your face, evacuate.'],
    c: ['poh:3-5'], xp: 15
  },
  {
    id: 's-icing', kind: 'scenario', emergency: true, pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K3i', 'PA.I.F.R2'],
    setup: ['Crossing the Coast Range in late fall, you enter a thin cloud layer and see ice forming on the windshield and wing struts.'],
    prompt: 'What does the POH say?',
    choices: [
      { t: 'Flight into known icing is prohibited. Turn back or change altitude to get out, use cabin heat for defrost, and plan to land at the nearest airport.', ok: true },
      { t: 'Turn back, extend flaps to lower the stall speed, and reduce power.', why: 'The POH says leave flaps retracted and open the throttle.' },
      { t: 'Climb to get on top of the clouds where it’s colder and drier.', why: 'Turn back or change altitude to warmer air; a 152 has limited climb performance.' },
      { t: 'Continue at a lower airspeed to reduce the rate of ice buildup.', why: 'Get out of the conditions. The 152 is prohibited from known icing.' }
    ],
    explain: [
      'POH limitation: **flight into known icing conditions is prohibited**.',
      'Inadvertent encounter: **turn back or change altitude**, cabin heat full for defrost, **open the throttle**, watch for carb or air filter ice, **plan a landing at the nearest airport**, expect a **higher stall speed**, and **leave the flaps retracted**. Approach at 65–75 KIAS depending on ice.'
    ],
    c: ['poh:2-7', 'poh:3-7', 'poh:3-8'], xp: 20
  },
  {
    id: 's-wing-fire', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-elec', acs: ['PA.IX.C.K3'],
    setup: ['A passenger points out flames at the left wingtip.'],
    prompt: 'What does the POH say?',
    choices: [
      { t: 'Nav lights, strobes, and pitot heat off; slip to keep flames away from the fuel tank and cabin; land as soon as possible with flaps retracted.', ok: true },
      { t: 'Nav lights and strobes off; slip toward the fire to blow it out; land with full flaps.', why: 'Slip to keep flames away from the tank and cabin, and land with flaps retracted.' },
      { t: 'Master switch off; mixture idle cut-off; land as soon as possible.', why: 'The POH turns off the nav lights, strobes, and pitot heat, and slips.' },
      { t: 'Nav lights, strobes, and pitot heat off; climb to cooler air until it goes out.', why: 'Land as soon as possible.' }
    ],
    explain: ['POH Wing Fire: **navigation light switch OFF, strobe light switch OFF, pitot heat OFF**. Perform a **side slip** to keep flames away from the fuel tank and cabin, and **land as soon as possible with flaps retracted**.'],
    c: ['poh:3-7'], xp: 15
  },

  // ─────────────── ENVIRONMENT ───────────────
  {
    id: 's-classd-standby', kind: 'scenario', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.III.A.K2'],
    vars: { apt: ['Troutdale', 'Aurora', 'Salem'], call: ['Cessna 4-5-6-7-8', 'Cessna 9-8-7-6-5'] },
    setup: ['Approaching {apt}’s Class D, you call the tower. Two replies are possible:', 'A) “{call}, standby.”   B) “Aircraft calling, standby.”'],
    prompt: 'In which case may you enter the Class D?',
    choices: [
      { t: 'Only A. The controller used your call sign, so communication is established.', ok: true },
      { t: 'Both. Any reply from the tower establishes communication.', why: 'Without your call sign, communication isn’t established.' },
      { t: 'Neither. “Standby” means remain outside until cleared.', why: 'With your call sign, “standby” still establishes communication.' },
      { t: 'Only B, since the tower answered.', why: 'B didn’t identify you.' }
    ],
    explain: ['AIM: if the controller responds with **“[your call sign] standby,”** communication is established and you **can enter**. A reply **without your call sign** does not establish communication; **don’t enter**.'],
    c: ['aim:3-2-5', 'cfr14:91.129(c)'], xp: 15
  },
  {
    id: 's-classb-seattle', kind: 'scenario', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1'],
    setup: ['Flying to Boeing Field (KBFI), you call Seattle Approach and they reply: “Cessna 2-3-4, squawk 4-3-2-1, maintain VFR at or below 3,500.” You’re about to enter the Class B.'],
    prompt: 'May you enter?',
    choices: [
      { t: 'No. You need an explicit ATC clearance to enter Class B.', ok: true },
      { t: 'Yes. A discrete squawk code from Approach means you’re cleared in.', why: 'A squawk code isn’t a Class B clearance.' },
      { t: 'Yes. Two-way radio communication is established, and that’s enough.', why: 'That’s the Class C and D rule.' },
      { t: 'Yes, if you stay at or below 3,500 as instructed.', why: 'An altitude instruction isn’t a clearance into Class B.' }
    ],
    explain: ['You must **receive an ATC clearance** before operating in Class B, regardless of weather. Listen for “**cleared into the Class Bravo**.” The PIC must also hold at least a private pilot certificate (or meet the student/recreational/sport requirements).'],
    c: ['cfr14:91.131(a)', 'cfr14:91.131(b)', 'aim:3-2-3'], xp: 15
  },
  {
    id: 's-khio-night-closed', kind: 'scenario', pave: 'V', topic: 'v-airport', acs: ['PA.III.B.K1', 'PA.XI.A.K2'],
    setup: ['You’re returning to KHIO late at night after the tower has closed.'],
    prompt: 'What changes?',
    choices: [
      { t: 'The airspace becomes Class E. Use CTAF 119.3 to self-announce, and use pilot-controlled lighting as listed in the Chart Supplement.', ok: true },
      { t: 'The airspace becomes Class G. Use 122.95 (UNICOM) to self-announce.', why: 'KHIO becomes Class E, and the CTAF is 119.3.' },
      { t: 'It stays Class D. Call Portland Approach for a landing clearance.', why: 'Class D is in effect only when the tower operates.' },
      { t: 'The airspace becomes Class E. Call Ground on 121.7 for taxi after landing.', why: 'Ground closes with the tower; use the CTAF.' }
    ],
    explain: ['Chart Supplement: KHIO is **Class D 1400–0600Z‡, other times Class E**. **CTAF 119.3**. When the tower is closed, lighting such as the Runway 13R MALSR is activated on the CTAF.', 'Pilot-controlled lighting: key the mic **7 times within 5 seconds** for highest intensity.'],
    c: ['cs:KHIO', 'aim:2-1-8'], xp: 15
  },
  {
    id: 's-lahso', kind: 'scenario', pave: 'E', topic: 'e-airportops', acs: ['PA.III.B.K1', 'PA.IV.B'],
    setup: ['On your solo cross-country, KHIO tower says: “Cessna 2-3-4, Runway 13R cleared to land, hold short of Runway 2-20.”'],
    prompt: 'As a student pilot, what should you do?',
    choices: [
      { t: 'Decline the hold-short: “Unable hold short.” Student pilots shouldn’t participate in LAHSO.', ok: true },
      { t: 'Accept it, since 4,922 ft is plenty for a 152 to stop.', why: 'The AIM says student pilots should not participate in LAHSO.' },
      { t: 'Accept it, and go around if you can’t stop in time.', why: 'Students shouldn’t participate, and accepting means you must hold short.' },
      { t: 'Ask the tower to repeat the clearance, then accept it.', why: 'The AIM says student pilots should decline.' }
    ],
    explain: ['AIM: **student pilots or pilots not familiar with LAHSO should not participate**. The PIC may decline. At KHIO, landing 13R holding short of 02-20 leaves **4,922 ft** of available landing distance.'],
    c: ['aim:4-3-11', 'cs:KHIO'], xp: 15
  },
  {
    id: 's-svfr-pdx', kind: 'scenario', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1'],
    setup: ['Portland International’s surface area is IFR with 2 SM visibility. A friend says you could just get Special VFR to depart a nearby field inside PDX’s surface area.'],
    prompt: 'Can a fixed-wing airplane get Special VFR in PDX’s surface area?',
    choices: [
      { t: 'No. Portland International is on the list of airports where fixed-wing SVFR isn’t available.', ok: true },
      { t: 'Yes, by day, clear of clouds with at least 1 SM visibility.', why: 'That’s the rule at most airports, but PDX is excluded.' },
      { t: 'Yes, by day, if the ceiling is at least 1,000 ft.', why: 'SVFR has no ceiling requirement, and PDX is excluded.' },
      { t: 'Yes, at night only with an instrument rating.', why: 'PDX is excluded for fixed-wing SVFR.' }
    ],
    explain: ['14 CFR 91 Appendix D, Section 3 lists airports where **fixed-wing Special VFR isn’t allowed**. **Portland International** and **Seattle-Tacoma** are on it, and the sectional shows “NO SVFR” at PDX.', 'Where SVFR is allowed: an ATC clearance, clear of clouds, 1 SM flight visibility (1 SM ground visibility to take off or land), and at night only with an instrument rating and an IFR-equipped airplane.'],
    c: ['cfr14:91.157(b)', 'cfr14:91.157(c)', 'cfr14:91 App. D'], xp: 15
  },
  {
    id: 's-wildfire-tfr', kind: 'scenario', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K3', 'PA.I.C.R1'],
    setup: ['August. Your route KHIO to Bend passes near a large wildfire in the Cascades. Your briefing shows a TFR around it, and the METARs east of the mountains include FU.'],
    prompt: 'What’s the right approach?',
    choices: [
      { t: 'Plan around the TFR (it protects firefighting aircraft), and treat smoke (FU) as an obstruction to visibility that may make the route MVFR or worse.', ok: true },
      { t: 'Plan around the TFR, and treat FU as haze that won’t affect VFR flight.', why: 'FU is smoke, and it can reduce visibility below your minimums.' },
      { t: 'Fly through the TFR if you stay above 10,000 ft and talk to ATC.', why: 'TFRs have published dimensions. Stay out unless the NOTAM allows otherwise.' },
      { t: 'Rely on the GTN 650’s FIS-B TFR display to route around it in flight.', why: 'Both Garmin guides say datalink TFRs may be incomplete. Confirm with official sources.' }
    ],
    explain: ['Disaster/hazard TFRs (§91.137) are issued by NOTAM to **protect people and property from a hazard** and to give **disaster relief aircraft a safe environment**. In a METAR, **FU = smoke**.', 'The GTN 650 can display FIS-B TFRs from the GTX 345, but both Garmin guides say the datalink TFR picture may be incomplete. Confirm TFRs through official sources.'],
    c: ['cfr14:91.137(a)', 'aim:3-5-3', 'aim:7-1-28', 'gtn:11-2', 'gtx:FIS-B'], xp: 15
  },
  {
    id: 's-marine-layer', kind: 'scenario', pave: 'V', topic: 'v-wx-enroute', acs: ['PA.I.C.K2', 'PA.I.C.R1'],
    vars: { coast: ['Astoria', 'Newport'] },
    setup: ['You want to fly to {coast} for lunch. 9 am report there:'],
    readout: { tag: 'Sample METAR & TAF · fictional', cat: 'IFR', text: 'METAR …Z 27006KT 4SM BR OVC007 12/11 A3010\nTAF … FM1900 28010KT P6SM BKN025' },
    prompt: 'How do you read this, and what’s a sensible plan?',
    choices: [
      { t: 'IFR now (700 ft overcast), forecast to improve from 1900Z to P6SM and 2,500 broken. Plan to arrive after the improvement, with a backup.', ok: true },
      { t: 'MVFR now (4 SM), forecast VFR from 1900Z with 2,500 broken.', why: 'The 700 ft ceiling makes it IFR now, and 2,500 broken is MVFR.' },
      { t: 'IFR now, forecast to improve gradually between now and 1900Z.', why: 'FM1900 means the change begins at 1900Z, not gradually before it.' },
      { t: 'IFR now; the TAF expires at 1900Z, so get a new one.', why: 'FM means a significant change starting at that time.' }
    ],
    explain: [
      'Ceiling **700 ft** (lowest broken or overcast) = **IFR** (500 to below 1,000). **BR = mist**.',
      '**FM1900**: from 1900Z, conditions change to P6SM and BKN025 (ceiling 2,500 = MVFR).',
      'Coastal fog like this is often **advection fog**: moist air moving over a colder surface. It’s most common along coasts.'
    ],
    c: ['aim:7-1-7', 'aim:7-1-28', 'awh:18-4'], xp: 20
  },
  {
    id: 's-radiation-fog', kind: 'scenario', pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K3j'],
    setup: ['Clear, calm autumn night in the Willamette Valley. At sunrise the temperature/dewpoint spread at KHIO is 1 °C and fog is forming in low spots.'],
    prompt: 'What type of fog is this, most likely?',
    choices: [
      { t: 'Radiation fog: forms over land on clear, calm nights.', ok: true },
      { t: 'Advection fog: moist air moving over a colder surface.', why: 'That’s typical along the coast, with wind.' },
      { t: 'Upslope fog: moist air pushed up the Coast Range.', why: 'Upslope fog needs air pushed up rising terrain by wind.' },
      { t: 'Steam fog: cold air moving over the warmer Willamette River.', why: 'Steam fog forms over water; this formed over calm land.' }
    ],
    explain: ['AWH: **radiation fog** is relatively shallow, restricted to land because water cools little at night, and shallow when wind is calm.'],
    c: ['awh:18-3'], xp: 15
  },
  {
    id: 's-wake-takeoff', kind: 'scenario', pave: 'V', topic: 'v-wake', acs: ['PA.II.F.R3', 'PA.IV.A.R2d'],
    setup: ['You’re cleared for takeoff on KHIO 13R right after a business jet departs the same runway.'],
    prompt: 'How do you avoid its wake?',
    choices: [
      { t: 'Note its rotation point, rotate before it, and climb above its path until you can turn clear.', ok: true },
      { t: 'Note its rotation point, rotate after it, and climb above its path.', why: 'Its vortices begin where it rotated, so rotate before that point.' },
      { t: 'Wait for it to lift off, then rotate at the same point and stay below its climb path.', why: 'Stay above its climb path.' },
      { t: 'Rotate before its rotation point, then stay low in ground effect until clear.', why: 'Climb above its path until you can turn clear.' }
    ],
    explain: ['AIM, departing behind a larger aircraft: **note its rotation point, rotate prior to it, and continue climbing above its climb path** until turning clear of the wake.'],
    c: ['aim:7-4-6'], xp: 15
  },
  {
    id: 's-converging', kind: 'scenario', pave: 'E', topic: 'e-airportops', acs: ['PA.III.B.K3', 'PA.III.B.R1'],
    setup: ['At 3,500 ft over Forest Grove you see another airplane at your altitude, converging from your right.'],
    prompt: 'Who has the right-of-way?',
    choices: [
      { t: 'The other airplane: it’s to your right. Give way.', ok: true },
      { t: 'You do: it’s to your right, so it must give way to you.', why: 'The aircraft to the other’s right has the right-of-way.' },
      { t: 'Neither: both alter course to the right.', why: 'That’s the head-on rule.' },
      { t: 'The faster airplane, since it’s less maneuverable.', why: 'Speed doesn’t decide right-of-way.' }
    ],
    explain: ['Converging aircraft of the same category at about the same altitude: **the aircraft to the other’s right has the right-of-way**. Head-on: **both alter course to the right**.'],
    c: ['cfr14:91.113(d)', 'cfr14:91.113(e)'], xp: 15
  },
  {
    id: 's-adsb-traffic', kind: 'scenario', pave: 'A', topic: 'v-transponder', acs: ['PA.VI.B.K4', 'PA.III.B.R1'],
    setup: ['The GTN 650 traffic page (from the GTX 345) shows nothing near you. Your passenger relaxes: “No traffic, we can stop looking.”'],
    prompt: 'What do you tell them?',
    choices: [
      { t: 'Traffic displays are only an aid. Not every aircraft shows up, so keep looking outside.', ok: true },
      { t: 'They’re mostly right: ADS-B Out is required everywhere, so all traffic shows up.', why: 'Garmin warns the display is an aid only; not all traffic appears.' },
      { t: 'Keep looking, but only for aircraft without transponders.', why: 'Any aircraft may be missing from the display.' },
      { t: 'Maneuver away from traffic shown on the display, and look outside less.', why: 'Garmin: maneuver only on ATC guidance or seeing the traffic yourself.' }
    ],
    explain: ['Garmin GTX 345: **traffic information is provided as an aid in visually acquiring traffic**. Maneuver only based on ATC guidance or seeing the traffic yourself. See and avoid stays your job in VMC.'],
    c: ['gtx:Warnings', 'cfr14:91.113(b)'], xp: 15
  },
  {
    id: 's-gtx-alt', kind: 'scenario', pave: 'A', topic: 'v-transponder', acs: ['PA.III.A.K4', 'PA.VI.B.K4'],
    setup: ['Taxiing out at KHIO, your instructor asks what mode the GTX 345 should be in.'],
    prompt: 'What’s the right answer?',
    choices: [
      { t: 'ALT mode, on the ground and in the air, unless ATC says otherwise.', ok: true },
      { t: 'STBY until the runway, then ALT for takeoff.', why: 'Garmin and the AIM say ALT on the ground too.' },
      { t: 'ON (no altitude reporting) on the ground, ALT in the air.', why: 'There’s no pilot-selectable ground mode; use ALT.' },
      { t: 'ALT only inside Class B, C, and D airspace; ON elsewhere.', why: 'Always operate in ALT unless ATC requests otherwise.' }
    ],
    explain: ['GTX 345 guide: **always operate in ALT mode**, on the ground and in the air, unless ATC requests otherwise. The unit detects ground vs air itself. KHIO’s Chart Supplement: **operate transponders with altitude reporting and ADS-B enabled on all airport surfaces**.', 'Use the **VFR key** for the preprogrammed VFR code (1200) and **IDNT** when ATC asks you to ident.'],
    c: ['gtx:2-1', 'cs:KHIO', 'aim:4-1-20'], xp: 15
  },
  {
    id: 's-pattern-entry', kind: 'scenario', pave: 'V', topic: 'v-airport', acs: ['PA.III.B.K1', 'PA.III.B.K2'],
    setup: ['Arriving at Bend (KBDN), nontowered, CTAF 123.0. Winds favor Runway 17.'],
    prompt: 'What’s the right pattern?',
    choices: [
      { t: 'Right traffic for Runway 17, west of the runway, entering at pattern altitude in level flight abeam the midpoint.', ok: true },
      { t: 'Left traffic for Runway 17, east of the runway, entering at pattern altitude.', why: 'At Bend, fixed-wing traffic stays west: right traffic for 17. Helicopters use the east side.' },
      { t: 'Right traffic for Runway 17, descending on the 45 to reach pattern altitude on downwind.', why: 'Enter at pattern altitude, in level flight.' },
      { t: 'Left traffic for Runway 35, west of the runway, entering abeam the midpoint.', why: 'Winds favor 17. Left traffic for 35 is correct only when using 35.' }
    ],
    explain: [
      'Chart Supplement (Bend): **fixed-wing traffic remains west of the runway**, right pattern Rwy 17 and left pattern Rwy 35. Helicopters remain east. Gliders, wildlife, and intensive helicopter training are noted.',
      'AIM: enter the pattern **in level flight, abeam the midpoint of the runway, at pattern altitude**.'
    ],
    c: ['cs:KBDN', 'aim:4-3-3'], xp: 15
  },
  {
    id: 's-thunderstorm', kind: 'scenario', pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K3h', 'PA.I.C.R1c'],
    setup: ['Returning from Bend on a July afternoon, a towering cumulonimbus with frequent lightning sits near your route over Santiam Pass. You can see clear air under its anvil.'],
    prompt: 'What does the AIM say?',
    choices: [
      { t: 'Avoid a severe storm by at least 20 miles, and never fly under the anvil or under the storm itself.', ok: true },
      { t: 'Avoid it by at least 10 miles; flying under the clear anvil is fine.', why: '20 miles for a severe storm, and severe turbulence is possible under the anvil.' },
      { t: 'Fly under the storm if you can see through to the other side.', why: 'Turbulence and wind shear under the storm could be hazardous.' },
      { t: 'Avoid it by 20 miles on the upwind side only; the downwind side is safe.', why: 'Avoid it by at least 20 miles, and especially avoid the anvil.' }
    ],
    explain: ['AIM thunderstorm don’ts: **don’t fly under a thunderstorm** or **under the anvil**. **Avoid by at least 20 miles** any thunderstorm identified as severe or giving an intense radar echo. **Vivid, frequent lightning** indicates the probability of a severe thunderstorm.'],
    c: ['aim:7-1-27'], xp: 15
  },
  {
    id: 's-mountain-wave', kind: 'scenario', pave: 'V', topic: 'v-mountain', acs: ['PA.I.C.K3b', 'PA.I.D.K2'],
    setup: ['Strong west winds aloft over the Cascades. From KHIO you can see smooth, lens-shaped clouds standing still east of Mt. Hood.'],
    prompt: 'What do they suggest?',
    choices: [
      { t: 'Mountain wave: stable air flowing over the ridge, with possible strong downdrafts and turbulence downwind (lee side).', ok: true },
      { t: 'Mountain wave: unstable air rising over the ridge, with turbulence only on the windward side.', why: 'Mountain wave comes from stable air, and the hazard is usually downwind.' },
      { t: 'Smooth air: lenticular clouds form only in calm conditions.', why: 'Lenticulars are visual indicators of wave activity.' },
      { t: 'An approaching warm front with stable air.', why: 'Stationary lenticular clouds over mountains indicate wave.' }
    ],
    explain: ['AWH: mountain waves form from **vertical displacement of a stable air mass over a mountain or ridge**. **Lenticular and rotor clouds** are visual indicators of wave activity, though wave can exist without them.'],
    think: 'A 152 at altitude climbs only a few hundred fpm. Plan crossings with extra altitude and an escape route away from the lee side.',
    c: ['awh:16-2', 'awh:16-8'], xp: 15
  },
  {
    id: 's-variation', kind: 'scenario', pave: 'V', topic: 'v-nav', acs: ['PA.VI.A.K5a', 'PA.I.E.K2'],
    setup: ['Near Eugene, the sectional shows an isogonic line labeled 14°30′E. Your true course is 090°.'],
    prompt: 'What’s your magnetic course?',
    choices: [
      { t: 'About 075° (subtract easterly variation)', ok: true },
      { t: 'About 105° (add easterly variation)', why: 'East is least: subtract easterly variation.' },
      { t: 'About 090° (variation applies only to the compass card)', why: 'Variation converts true to magnetic for every course.' },
      { t: 'About 075° true', why: '075° is the magnetic course.' }
    ],
    explain: ['Isogonic lines connect points of **equal magnetic variation**. Remember “**east is least (subtract), west is best (add)**”: 090° − 14.5° ≈ **075.5°** magnetic.'],
    c: ['phak:8-24', 'phak:16-8'], xp: 15
  },
  {
    id: 's-northerly-turn', kind: 'scenario', pave: 'A', topic: 'a-pitot', acs: ['PA.VI.A.K2'],
    setup: ['Your heading indicator has failed. Near KHIO (about 45°N), you need to turn left from 270° to 360° using only the magnetic compass.'],
    prompt: 'When do you roll out?',
    choices: [
      { t: 'Before the compass reaches 360°: about 15° plus half your latitude, roughly 37° early.', ok: true },
      { t: 'After the compass passes 360°: about 15° plus half your latitude.', why: 'That’s the correction for southerly turns.' },
      { t: 'Before the compass reaches 360°: about half your latitude, roughly 23° early.', why: 'The PHAK rule is 15° plus half your latitude.' },
      { t: 'Exactly at 360°, if you use a shallow bank.', why: 'The compass still leads in a northerly turn.' }
    ],
    explain: ['PHAK: in a northerly turn the compass card **leads**, so stop the turn **before** the desired heading, about **15° plus half the latitude**. Turning south it lags, so overshoot by the same amount.'],
    c: ['phak:8-26'], xp: 15
  },

  // ─────────────── EXTERNAL / AEROMED ───────────────
  {
    id: 's-co', kind: 'scenario', emergency: true, pave: 'E', topic: 'e-aeromed', acs: ['PA.I.H.K1f'],
    setup: ['January, cabin heat on full. Twenty minutes later you have a headache and feel drowsy. You notice a faint exhaust smell.'],
    prompt: 'What do you do?',
    choices: [
      { t: 'Suspect carbon monoxide: shut off the heat, open the fresh air vents, and land as soon as practical.', ok: true },
      { t: 'Suspect carbon monoxide: open the vents but leave the heat on to stay warm.', why: 'The heater is the likely source. Shut it off.' },
      { t: 'Suspect hypoxia: descend, and keep the heat on.', why: 'Headache with an exhaust smell while using the heater points to CO.' },
      { t: 'Suspect fatigue: open a window and continue to your destination.', why: 'Shut off the heat and land as soon as practical.' }
    ],
    explain: ['AIM: most light-aircraft heaters work by air flowing over the exhaust manifold. If you smell exhaust or have **headache, drowsiness, or dizziness** while using the heater, **suspect CO, shut off the heater, and open air vents**. Get medical help if symptoms continue.'],
    c: ['aim:8-1-4'], xp: 15
  },
  {
    id: 's-oxygen', kind: 'scenario', pave: 'E', topic: 'e-regs', acs: ['PA.I.H.K1a', 'PA.I.A.K2'],
    setup: ['To clear clouds over the Cascades you consider cruising at 13,500 ft for about 45 minutes. The 152 has no oxygen system.'],
    prompt: 'Is that legal?',
    choices: [
      { t: 'No. Above 12,500 up to 14,000 ft, the crew must use oxygen for flight there longer than 30 minutes.', ok: true },
      { t: 'Yes. Oxygen is required only above 14,000 ft.', why: 'The 30-minute rule starts above 12,500.' },
      { t: 'Yes, for up to 60 minutes above 12,500 ft.', why: '30 minutes is the limit.' },
      { t: 'Yes, if your passengers are provided oxygen above 15,000 only.', why: 'The rule applies to required crew above 12,500 for over 30 minutes.' }
    ],
    explain: ['Above **12,500 to 14,000 ft** cabin altitude: required crew must use oxygen for the part **over 30 minutes**. Above **14,000**: at all times. Above **15,000**: every occupant must be provided oxygen.'],
    c: ['cfr14:91.211(a)'], xp: 15
  },
  {
    id: 's-black-hole', kind: 'scenario', pave: 'E', topic: 'e-aeromed', acs: ['PA.XI.A.K8', 'PA.I.H.K1k'],
    setup: ['Night approach to Newport (KONP) over the dark ocean. There are no lights between you and the runway.'],
    prompt: 'What illusion should you expect, and how does it fool you?',
    choices: [
      { t: 'Featureless terrain: you feel higher than you are, so you tend to fly a lower approach.', ok: true },
      { t: 'Featureless terrain: you feel lower than you are, so you tend to fly a higher approach.', why: 'Featureless terrain makes you feel higher.' },
      { t: 'False horizon: you feel banked, so you roll into a dangerous attitude.', why: 'False horizon is about horizon alignment, not height over dark terrain.' },
      { t: 'Runway width illusion: you feel lower, so you flare high.', why: 'That’s a wider-than-usual runway; this is featureless terrain.' }
    ],
    explain: ['AIM: an absence of ground features, as **over water or darkened areas**, creates the illusion of being **higher** than you are. The pilot who doesn’t recognize it **flies a lower approach**. Use the PAPI and a stabilized approach.'],
    c: ['aim:8-1-5'], xp: 15
  },
  {
    id: 's-get-home', kind: 'scenario', pave: 'E', topic: 'e-pressures', acs: ['PA.I.D.R4', 'PA.VI.C.R3'],
    setup: ['Sunday afternoon in Bend. You have work at 8 am Monday in Portland. The forecast for the passes is marginal, with icing in clouds. Your passenger says, “We’ll be fine, let’s go.”'],
    prompt: 'What’s the best decision?',
    choices: [
      { t: 'Use your backup plan: stay overnight or drive. The pressure to get home is exactly what the PAVE “E” warns about.', ok: true },
      { t: 'Go early in the morning, when the forecast is usually better, and turn back if needed.', why: 'With icing in clouds over the passes, turning back may not be available.' },
      { t: 'Go, but fly above the clouds where it’s smooth and clear.', why: 'Climbing over icing clouds in a 152 is a trap with no escape.' },
      { t: 'Go, but follow the highway through the pass under the clouds.', why: 'Scud running in mountains with icing clouds is a classic accident setup.' }
    ],
    explain: ['External pressures, like a schedule or a passenger’s expectations, push pilots to ignore other risks. The PHAK suggests **personal SOPs**: have alternate plans and leave early for important trips. The 152 is prohibited from flight into known icing.'],
    c: ['phak:2-9', 'phak:2-10', 'poh:2-7', 'cfr14:91.3'], xp: 20
  },

  // ─────────────── CHART (Klamath Falls sectional) ───────────────
  {
    id: 'c-bdn-block', kind: 'chart', pave: 'V', topic: 'v-airport', acs: ['PA.I.E.K2', 'PA.II.D.K1'],
    chart: { src: 'charts/bdn.jpg', chart: KLAMATH, caption: 'Bend (KBDN) and Redmond (KRDM)' },
    prompt: 'Bend’s data block reads “3459 *L 52 123.0 Ⓒ”. What does *L mean, and is Bend towered?',
    choices: [
      { t: '*L: lighting limitations exist, so check the Chart Supplement. Bend is nontowered (magenta symbol); 123.0 is the CTAF.', ok: true },
      { t: '*L: lights on sunset to sunrise. Bend is nontowered; 123.0 is the CTAF.', why: 'A plain L means sunset to sunrise; *L means limitations, so check the Chart Supplement.' },
      { t: '*L: lighting limitations exist. Bend is towered; 123.0 is the tower.', why: 'Magenta means no control tower.' },
      { t: '*L: pilot-controlled lighting. Bend is nontowered; 123.0 is UNICOM only.', why: '*L means limitations; the circled C marks 123.0 as the CTAF.' }
    ],
    explain: [
      '**Airports with control towers are blue; all others are magenta.** Bend is magenta: nontowered, Class E.',
      '***L** = lighting limitations exist; refer to the Chart Supplement (here, lights are activated on the CTAF). **52** = longest runway 5,200 ft (the Chart Supplement lists 5,201). **Ⓒ** marks the CTAF.'
    ],
    c: ['cug:p. 15', 'cs:KBDN'], xp: 15
  },
  {
    id: 'c-rdm-classd', kind: 'chart', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.E.K2'],
    chart: { src: 'charts/bdn.jpg', chart: KLAMATH, caption: 'Bend (KBDN) and Redmond (KRDM)' },
    prompt: 'Redmond’s dashed blue ring shows a boxed 56. Redmond’s elevation is 3,082 ft. About how high above the airport does its Class D go?',
    choices: [
      { t: 'To 5,600 MSL, about 2,500 ft above the airport.', ok: true },
      { t: 'To 5,600 AGL, about 8,700 ft MSL.', why: 'Class D ceilings are charted in MSL.' },
      { t: 'To 2,500 AGL, the standard Class D height, regardless of the chart.', why: 'The charted figure governs: 5,600 MSL.' },
      { t: 'Up to but not including 5,600 MSL.', why: 'A minus sign would indicate “up to but not including.”' }
    ],
    explain: ['Dashed blue = **Class D**; the boxed figure is the **ceiling in hundreds of feet MSL**: 5,600 MSL, about 2,500 ft above Redmond’s 3,082 ft field. The Chart Supplement: Class D 1400–0600Z‡, other times Class E.'],
    c: ['cug:p. 16', 'cs:KRDM'], xp: 15
  },
  {
    id: 'c-eug-variation', kind: 'chart', pave: 'V', topic: 'v-nav', acs: ['PA.I.E.K2', 'PA.VI.A.K5a'],
    chart: { src: 'charts/eug.jpg', chart: KLAMATH, caption: 'Eugene (KEUG) area' },
    prompt: 'A dashed magenta line labeled “14°30′E” crosses this excerpt. What is it?',
    choices: [
      { t: 'An isogonic line: magnetic variation is 14.5° east here.', ok: true },
      { t: 'An isogonic line: magnetic variation is 14.5° west here.', why: 'The label reads E: easterly variation.' },
      { t: 'A line of equal magnetic dip of 14.5°.', why: 'Isogonic lines show variation, not dip.' },
      { t: 'The boundary of the Eugene approach control area.', why: 'This is an isogonic line.' }
    ],
    explain: ['**Isogonic lines** connect points of equal magnetic variation. Here, **14°30′ east**: subtract it from true courses to get magnetic (east is least).'],
    c: ['cug:p. 32', 'phak:8-24', 'phak:16-8'], xp: 15
  },
  {
    id: 'c-eug-block', kind: 'chart', pave: 'V', topic: 'v-airport', acs: ['PA.I.E.K2'],
    chart: { src: 'charts/eug.jpg', chart: KLAMATH, caption: 'Eugene (KEUG) area' },
    prompt: 'Eugene’s data block shows “CT – 118.9 ★ Ⓒ 124.15 ★” and “374 L 80 122.95”. What do the stars tell you?',
    choices: [
      { t: 'The tower operates part-time. When it’s closed, use 118.9 as the CTAF.', ok: true },
      { t: 'The tower operates part-time. When it’s closed, use 122.95 as the CTAF.', why: 'The circled C marks 118.9 as the CTAF; 122.95 is UNICOM.' },
      { t: 'Rotating beacon in operation. The tower is open 24 hours.', why: 'A star next to a frequency means part-time operation.' },
      { t: 'Primary and secondary tower frequencies.', why: 'The star means part-time operation.' }
    ],
    explain: ['A **star** next to the tower frequency indicates **part-time operation**. Eugene: tower 1400–0730Z‡; Class D during those hours, Class E otherwise. **374** = elevation, **L** = lighting sunset to sunrise, **80** = longest runway 8,000 ft (8,009), **122.95** = UNICOM.'],
    c: ['cug:p. 15', 'cs:KEUG'], xp: 15
  }
];
