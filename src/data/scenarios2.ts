// Scenario batch 2: deeper coverage of thin topics. Every wrong option is a plausible
// misconception; every fact is checked against the cited source.
import type { Item } from './types';

type C = [string, boolean, string?];
const ch = (list: C[]) => list.map(([t, ok, why]) => (ok ? { t, ok: true } : { t, why }));
const S = (o: Omit<Item, 'kind' | 'xp' | 'choices'> & { choices: C[]; xp?: number }): Item => ({ kind: 'scenario', xp: 15, ...o, choices: ch(o.choices) });

export const SCENARIOS2: Item[] = [
  // ───────── PILOT ─────────
  S({ id: 's2-basicmed', pave: 'P', topic: 'p-basicmed', acs: ['PA.I.A.K5'],
    setup: ['A year after your checkride your third-class medical lapses. You held it after July 2006, it was never suspended or revoked, you’ve done the BasicMed course this year and a state-licensed physician’s exam last year. You have both in your logbook.'],
    prompt: 'Can you keep flying the 152 with a passenger?',
    choices: [
      ['Yes, under BasicMed: the 152 meets the aircraft limits, and you must stay at or below 18,000 MSL and 250 KIAS, in the U.S.', true],
      ['Yes, but only solo; BasicMed doesn’t allow passengers.', false, 'BasicMed allows up to 6 passengers in an aircraft authorized for 7 occupants or fewer.'],
      ['No. Once a medical expires you need a new one before using BasicMed.', false, 'The most recent medical may be expired, as long as it wasn’t suspended, revoked, or denied.'],
      ['Yes, but only within 50 NM of your home airport.', false, 'BasicMed has no distance limit inside the U.S.']
    ],
    explain: ['BasicMed: valid U.S. driver’s license, a medical held after July 14, 2006 (most recent not suspended or revoked; it may be expired), the course within 24 calendar months, the exam within 48. Aircraft: 7 occupants or fewer, 6 passengers max, 12,500 lb max takeoff weight. Flight: not above 18,000 MSL, not over 250 KIAS, in the U.S. unless authorized.'],
    c: ['cfr14:61.113(i)', 'cfr14:61.23(c)(3)'] }),
  S({ id: 's2-stepdown', pave: 'P', topic: 'p-medical', acs: ['PA.I.A.K3'],
    setup: ['You got a first-class medical at age 30, planning for the airlines. Fourteen months later you want to fly the 152 as a private pilot.'],
    prompt: 'Is your medical still good for private privileges?',
    choices: [
      ['Yes. Its first-class privileges lapsed after 12 months, but it covers private privileges through the 60th month.', true],
      ['No. A first-class medical expires completely after 12 months under 40.', false, 'Higher-class medicals step down: the same certificate covers private privileges for the third-class period.'],
      ['Yes, but only for 24 months total.', false, '24 months applies if you were 40 or older at the exam.'],
      ['Only after you get a new third-class medical.', false, 'No new exam is needed while the third-class period lasts.']
    ],
    explain: ['A medical expires for each kind of operation separately. Under 40 at the exam, a first-class medical covers ATP privileges for 12 months and private privileges until the end of the 60th month after the exam month.'],
    c: ['cfr14:61.23(d)'] }),
  S({ id: 's2-cfi-medical', pave: 'P', topic: 'p-medical', acs: ['PA.I.A.K3'],
    setup: ['After your checkride, you go for a flight review. You’ll act as PIC. Your CFI mentions their medical expired last month.'],
    prompt: 'Can the CFI still give you the flight review?',
    choices: [
      ['Yes. A flight instructor needs a medical only when acting as PIC or as a required crewmember.', true],
      ['No. Every flight instructor must hold at least a third-class medical to instruct.', false, 'Not when the instructor isn’t PIC or a required crewmember.'],
      ['Yes, but only if the CFI flies under BasicMed.', false, 'No medical qualification is needed at all if you’re PIC.'],
      ['No. A flight review must be given by a CFI with a second-class medical.', false, 'No such requirement.']
    ],
    explain: ['A medical isn’t required when exercising flight instructor privileges if the instructor isn’t acting as PIC or a required pilot flight crewmember.'],
    c: ['cfr14:61.23(b)(7)', 'cfr14:61.23(a)(3)(ii)'] }),
  S({ id: 's2-photo-id', pave: 'P', topic: 'p-resp', acs: ['PA.I.A.K4'],
    setup: ['At the airplane you realize your wallet, with your driver’s license, is at home. You have your pilot certificate and medical.'],
    prompt: 'Can you act as PIC?',
    choices: [
      ['No. You need a photo ID in your possession or readily accessible in the aircraft.', true],
      ['Yes. Your pilot certificate is your photo ID.', false, 'A U.S. pilot certificate has no photo, so you need a separate photo ID.'],
      ['Yes, for a local flight that doesn’t leave the pattern.', false, 'The requirement applies to every flight where you exercise pilot privileges.'],
      ['Yes, if your instructor vouches for you on the ground.', false, 'The rule requires the ID itself.']
    ],
    explain: ['To exercise pilot privileges you need your pilot certificate, your medical (or BasicMed documents), and an acceptable photo ID, in your physical possession or readily accessible in the aircraft.'],
    c: ['cfr14:61.3'] }),
  S({ id: 's2-prorata-three', pave: 'P', topic: 'p-limits', acs: ['PA.I.A.K2'],
    setup: ['A friend rents the school’s Cessna 172 and offers to split costs. You’ll fly with two friends to Newport. Total rental, fuel, and landing fees: $450.'],
    prompt: 'What’s the least you can pay?',
    choices: [
      ['$150: your pro rata share with three people aboard.', true],
      ['$0, as long as you don’t make a profit.', false, 'You may not pay less than your pro rata share.'],
      ['$225: the pilot always pays half.', false, 'Pro rata means an equal share among the occupants.'],
      ['$90: fuel only; the rental can’t be shared.', false, 'Rental fees and airport expenditures can be shared too.']
    ],
    explain: ['A private pilot may not pay less than the pro rata share of the operating expenses, which may be only fuel, oil, airport expenditures, or rental fees.'],
    c: ['cfr14:61.113(c)'] }),
  S({ id: 's2-invulnerability', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2'],
    setup: ['You read an accident report about a 152 that ran out of fuel near Salem. You think: “That pilot was careless. That would never happen to me.”'],
    prompt: 'Which hazardous attitude, and what’s the antidote?',
    choices: [
      ['Invulnerability: “It could happen to me.”', true],
      ['Macho: “Taking chances is foolish.”', false, 'Macho is about proving yourself. This is believing accidents only happen to others.'],
      ['Anti-authority: “Follow the rules. They are usually right.”', false, 'Anti-authority is resenting rules.'],
      ['Resignation: “I’m not helpless.”', false, 'Resignation is “What’s the use?”']
    ],
    explain: ['**Invulnerability** (“It won’t happen to me.”): pilots who think this way are more likely to take chances. Antidote: **“It could happen to me.”**'],
    c: ['phak:2-5'] }),
  S({ id: 's2-3p', pave: 'P', topic: 'p-3p', acs: ['PA.I.H.K4'],
    setup: ['Cruising to Eugene, you notice the ammeter showing a discharge (Perceive). You decide it’s probably the alternator, and that Corvallis is the nearest good airport (Process).'],
    prompt: 'What does the “Perform” step look like?',
    choices: [
      ['Run the POH low-voltage checklist, tell ATC, divert to Corvallis, then keep re-checking the situation.', true],
      ['Keep monitoring the ammeter until you’re sure it’s really failing.', false, 'That’s still Perceive. Perform means acting on your chosen course.'],
      ['List every possible cause before doing anything.', false, 'That’s Process. You’ve already chosen a course of action.'],
      ['Continue to Eugene, since it was the plan.', false, 'Perform means carrying out the best course you chose: the diversion.']
    ],
    explain: ['3P: **Perceive** the circumstances, **Process** by evaluating their impact on safety, **Perform** by implementing the best course of action. Then the loop starts again.'],
    c: ['phak:2-15', 'poh:3-8'] }),
  S({ id: 's2-decide', pave: 'P', topic: 'p-adm', acs: ['PA.I.H.K4'],
    setup: ['Climbing out of KHIO, you notice oil temperature creeping toward the red line. You realize it needs a response.'],
    prompt: 'In the DECIDE model, you’ve just done which step, and what comes next?',
    choices: [
      ['Detect; next, Estimate the need to react to the change.', true],
      ['Estimate; next, Choose a course of action.', false, 'Noticing the change is Detect.'],
      ['Identify; next, Do the necessary actions.', false, 'Identify (solutions) comes after Choose.'],
      ['Evaluate; next, Detect the next change.', false, 'Evaluate comes at the end, after you’ve acted.']
    ],
    explain: ['DECIDE: **Detect** a change, **Estimate** the need to react, **Choose** a desirable outcome, **Identify** actions to reach it, **Do** them, **Evaluate** the effect.'],
    c: ['phak:2-18'] }),
  S({ id: 's2-emotion', pave: 'P', topic: 'p-imsafe', acs: ['PA.II.A.K1', 'PA.I.H.K1g'],
    setup: ['An hour before your solo cross-country, you get upsetting news from home. You feel distracted but tell yourself flying will clear your head.'],
    prompt: 'What does IMSAFE say?',
    choices: [
      ['Emotion (and Stress) are on the list: if you’re upset, consider not flying today.', true],
      ['IMSAFE only covers physical issues like illness and alcohol.', false, 'It includes Stress and Emotion.'],
      ['Fly the planned route but skip the optional landings.', false, 'Reducing tasks doesn’t remove the distraction.'],
      ['Fly; as long as you slept well, IMSAFE is satisfied.', false, 'Every letter matters, not just Fatigue.']
    ],
    explain: ['IMSAFE: **I**llness, **M**edication, **S**tress, **A**lcohol, **F**atigue, **E**motion. The PHAK’s IMSAFE checklist asks “Am I emotionally upset?”'],
    c: ['phak:2-8'] }),

  // ───────── AIRCRAFT ─────────
  S({ id: 's2-lean-climb', pave: 'A', topic: 'a-engine', acs: ['PA.I.G.K1c'],
    setup: ['Climbing at full throttle to 8,500 ft for the Cascades on a summer day, you haven’t touched the mixture. Above 6,000 ft the engine starts running a little rough and power seems low.'],
    prompt: 'Most likely cause and fix?',
    choices: [
      ['A too-rich mixture at altitude: lean for maximum RPM, as the POH says above 3,000 ft.', true],
      ['Carb ice: apply full carb heat and leave the mixture alone.', false, 'Possible, but carb heat makes the mixture even richer. The classic altitude problem is the unleaned mixture.'],
      ['Too lean a mixture: push it full rich.', false, 'Climbing without leaning makes the mixture progressively richer.'],
      ['Fouled plugs from high power: switch to one magneto.', false, 'Leaning is the first fix the POH points to above 3,000 ft.']
    ],
    explain: ['As you climb without leaning, the air gets less dense and the mixture becomes **progressively richer**, causing **roughness and a loss of power**. The POH climb tables assume the mixture **leaned above 3,000 ft for maximum RPM**.'],
    c: ['phak:7-9', 'poh:5-13'] }),
  S({ id: 's2-density-alt', pave: 'E', topic: 'e-perf', acs: ['PA.I.F.K2a'],
    setup: ['Four takeoffs, same airplane and weight. Which combination gives the highest density altitude, and so the worst performance?'],
    prompt: 'Pick the worst case.',
    choices: [
      ['Bend (3,459 ft), 33 °C, low pressure, humid afternoon', true],
      ['Bend (3,459 ft), 5 °C, high pressure, dry morning', false, 'Cold, dry, and high pressure all lower density altitude.'],
      ['Hillsboro (208 ft), 33 °C, low pressure, humid afternoon', false, 'Same weather, but much lower elevation.'],
      ['Astoria (15 ft), 10 °C, high pressure', false, 'Low, cold, and high pressure: dense air.']
    ],
    explain: ['High density altitude comes from **high elevation, low pressure, high temperature, and high humidity**. As density altitude increases, aircraft performance decreases.'],
    c: ['phak:4-4', 'cs:KBDN'] }),
  S({ id: 's2-load-factor', pave: 'A', topic: 'a-aero', acs: ['PA.I.F.K3'],
    setup: ['Your 152 stalls at about 48 KCAS wings level, flaps up, at max weight. You roll into a coordinated, level 60° bank turn.'],
    prompt: 'About what is the stall speed now?',
    choices: [
      ['About 68 KCAS: load factor 2 G, and stall speed rises with the square root of the load factor.', true],
      ['About 96 KCAS: twice the load factor doubles the stall speed.', false, 'Stall speed increases with the square root of the load factor, not in direct proportion.'],
      ['About 48 KCAS: stall speed doesn’t change in a turn.', false, 'Load factor raises the stall speed.'],
      ['About 55 KCAS: 60° of bank adds about 15%.', false, 'At 2 G the increase is about 41%.']
    ],
    explain: ['In a coordinated level turn at **60° bank, load factor is 2 G**. Stall speed increases in proportion to the **square root** of the load factor: 48 × √2 ≈ **68 KCAS**.'],
    c: ['phak:5-34', 'poh:ii'] }),
  S({ id: 's2-cross-control', pave: 'A', topic: 'a-aero', acs: ['PA.VII.D.R1', 'PA.IX.B.R5'],
    setup: ['A gusty crosswind blows you through final while turning base to final at KHIO. You’re tempted to add bottom rudder to tighten the turn without adding bank.'],
    prompt: 'What’s the risk, and the best response?',
    choices: [
      ['A cross-control stall, which can come with little warning near the ground. Don’t skid it around: go around, or accept the overshoot and correct with coordinated controls.', true],
      ['Skidding is fine at pattern speeds; just add a bit of power.', false, 'Uncoordinated flight near the ground is exactly how cross-control stalls happen.'],
      ['Increase the bank to 60° to line up quickly.', false, 'Steeper bank raises load factor and stall speed close to the ground.'],
      ['Add opposite aileron to keep the wings level while you use rudder to turn.', false, 'That is the cross-control condition.']
    ],
    explain: ['AFH: a **cross-control stall** occurs when the critical AOA is exceeded with aileron in one direction and rudder in the other. It can occur **with very little warning** and can be **deadly close to the ground**. Overshooting the base-to-final turn is a classic setup.'],
    c: ['afh:5-20', 'afh:5-19'] }),
  S({ id: 's2-spin-flaps', pave: 'A', topic: 'a-aero', acs: ['PA.VII.D.K2', 'PA.I.F.R2'],
    setup: ['After your checkride, a friend suggests practicing a spin entry in the 152 with 10° of flaps “to make it gentler.”'],
    prompt: 'What does your POH say?',
    choices: [
      ['Intentional spins are prohibited with flaps extended (placard).', true],
      ['Spins are allowed with up to 10° of flaps.', false, 'The placard prohibits intentional spins with any flaps extended.'],
      ['Spins are prohibited in the 152 under any conditions.', false, 'The 152 is utility category; spins are approved with flaps up.'],
      ['Flaps make spin recovery easier, so they’re recommended.', false, 'The POH prohibits it.']
    ],
    explain: ['The 152 is certificated in the **utility category**; spins are approved, but the placard says **intentional spins prohibited with flaps extended**.'],
    c: ['poh:2-9', 'poh:2-6'] }),
  S({ id: 's2-va-light', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.R2'],
    setup: ['Solo with half fuel, you’re around 1,400 lb when you hit moderate turbulence over the Coast Range.'],
    prompt: 'What speed should you slow to?',
    choices: [
      ['At or below about 93–98 KIAS: Va and turbulent-air speed go down with weight (93 at 1,350, 98 at 1,500).', true],
      ['104 KIAS, the published Va.', false, '104 is Va at 1,670 lb. Lighter weight means a lower Va.'],
      ['111 KIAS, top of the green arc.', false, 'That’s Vno. Slow down further in turbulence.'],
      ['60 KIAS, best glide.', false, 'Too slow; you need a margin above stall in gusts.']
    ],
    explain: ['POH maneuvering speed and maximum recommended turbulent air penetration speed: **104 KIAS at 1,670 lb, 98 at 1,500 lb, 93 at 1,350 lb**. Both get lower as weight decreases.'],
    c: ['poh:2-3', 'poh:4-3'] }),
  S({ id: 's2-static-blocked', pave: 'A', topic: 'a-pitot', acs: ['PA.IX.C.K2c', 'PA.I.G.R1'],
    setup: ['After a wash, you take off. Climbing out, the altimeter stays stuck at field elevation, the VSI reads zero, and the airspeed reads lower than it should as you climb.'],
    prompt: 'What happened, and what can you do?',
    choices: [
      ['A blocked static system. With no alternate static source, the PHAK suggests breaking the VSI glass to vent static pressure; fly by pitch and power.', true],
      ['A blocked pitot tube. Turn on pitot heat to clear it.', false, 'A pitot blockage doesn’t freeze the altimeter and VSI.'],
      ['A vacuum failure. Use the turn coordinator.', false, 'Vacuum drives the gyros, not the altimeter or VSI.'],
      ['An electrical failure. Cycle the master switch.', false, 'These instruments don’t use electricity.']
    ],
    explain: ['A blocked static system freezes the **altimeter**, gives a constant **zero VSI**, and makes the **airspeed read low in a climb**. Without an alternate static source, the PHAK notes you can **break the VSI’s glass face** to introduce static pressure.'],
    c: ['phak:8-11', 'phak:8-3'] }),
  S({ id: 's2-pitot-blocked', pave: 'A', topic: 'a-pitot', acs: ['PA.IX.C.K2c'],
    setup: ['In rain near freezing, your airspeed slowly drops to zero while the airplane’s attitude, power, and altimeter are unchanged.'],
    prompt: 'Most likely cause?',
    choices: [
      ['The pitot tube is blocked but its drain hole is open, so the airspeed indicator drops to zero.', true],
      ['Both the pitot tube and drain are blocked, so it reads zero.', false, 'With both blocked, the ASI acts like an altimeter rather than dropping to zero.'],
      ['The static port is blocked.', false, 'A static blockage also freezes the altimeter.'],
      ['The engine is losing power.', false, 'Power and altitude are unchanged.']
    ],
    explain: ['If the pitot tube is blocked and the **drain hole remains open**, ram air can’t enter and the ASI **decreases to zero**. Fly by attitude and power, and get out of the icing conditions.'],
    c: ['phak:8-10', 'phak:8-11'] }),
  S({ id: 's2-compass-accel', pave: 'A', topic: 'a-pitot', acs: ['PA.VI.A.K2'],
    setup: ['With the heading indicator failed, you’re flying west by compass. You add power and accelerate.'],
    prompt: 'What does the magnetic compass do?',
    choices: [
      ['It shows a turn toward north, even though you’re flying straight.', true],
      ['It shows a turn toward south.', false, 'That’s what deceleration shows.'],
      ['Nothing: acceleration error only affects north and south headings.', false, 'Acceleration error is greatest on east and west headings.'],
      ['It spins freely until you stop accelerating.', false, 'It shows a false turn, not free rotation.']
    ],
    explain: ['Acceleration error (Northern Hemisphere): on east or west headings, **accelerating shows a turn toward north; decelerating, toward south**. Remember ANDS: Accelerate North, Decelerate South.'],
    c: ['phak:8-26'] }),
  S({ id: 's2-ad-recurring', pave: 'A', topic: 'a-ads', acs: ['PA.I.B.K1c', 'PA.I.B.R1'],
    setup: ['Reviewing the logs, you find a recurring AD that must be complied with every 100 hours. The last compliance was 104 hours ago. The annual is current.'],
    prompt: 'What’s your call?',
    choices: [
      ['Don’t fly it. The owner/operator must keep it in compliance with ADs; an overdue AD makes it unairworthy.', true],
      ['Fly it. The current annual covers ADs until the next annual.', false, 'Recurring ADs have their own intervals.'],
      ['Fly it, since the 10-hour overfly applies to ADs too.', false, 'The 10-hour allowance is for the 100-hour inspection, and only to reach a place to do it.'],
      ['Fly it, but write it up afterward.', false, 'Airworthiness must be confirmed before flight.']
    ],
    explain: ['The owner or operator is primarily responsible for maintaining the aircraft in an airworthy condition, **including compliance with ADs** (part 39). As PIC you verify airworthiness before flight.'],
    c: ['cfr14:91.403(a)', 'cfr14:91.409(b)'] }),

  // ───────── ENVIRONMENT ─────────
  S({ id: 's2-surface-analysis', pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K2'],
    setup: ['Planning a trip to Olympia for tomorrow, you want to see where the fronts and the high- and low-pressure centers are right now.'],
    prompt: 'Which product shows that?',
    choices: [
      ['The surface analysis chart', true],
      ['The TAF for Olympia', false, 'A TAF forecasts conditions at one airport.'],
      ['A METAR', false, 'A METAR reports current conditions at one station.'],
      ['The winds and temperatures aloft forecast', false, 'That shows winds and temperatures at altitudes, not fronts.']
    ],
    explain: ['The **surface analysis chart** depicts the location of **fronts** as well as **high- and low-pressure systems**. Prog charts forecast them for later times.'],
    c: ['awh:3-34'] }),
  S({ id: 's2-airmet-sierra', pave: 'V', topic: 'v-wx-enroute', acs: ['PA.I.C.K2', 'PA.I.C.R1'],
    setup: ['Your route to Astoria crosses the Coast Range. An AIRMET Sierra is out for mountain obscuration along the range.'],
    prompt: 'What does that tell you?',
    choices: [
      ['The mountains may be hidden in clouds or precipitation: a VFR crossing could put you in IMC near terrain. Consider the Columbia River route or waiting.', true],
      ['Expect moderate turbulence over the ridges.', false, 'That would be AIRMET Tango.'],
      ['Expect moderate icing and a low freezing level.', false, 'That would be AIRMET Zulu.'],
      ['It applies only to IFR flights, so VFR is fine.', false, 'AIRMETs warn all pilots, especially VFR pilots.']
    ],
    explain: ['**AIRMET Sierra**: IFR conditions and/or **mountain obscuration**. **Tango**: turbulence and strong surface winds. **Zulu**: icing and freezing levels.'],
    c: ['aim:7-1-6'] }),
  S({ id: 's2-tempo', pave: 'V', topic: 'v-wx-enroute', acs: ['PA.I.C.K2'],
    setup: ['Eugene TAF for your planned arrival time:'],
    readout: { tag: 'Fictional TAF', cat: 'VFR', text: 'FM181800 22012KT P6SM SCT035 BKN060\n     TEMPO 1820/1823 3SM -SHRA BKN020' },
    prompt: 'Arriving at 2100Z, what should you expect?',
    choices: [
      ['Mostly VFR, but temporary periods of 3 SM in light rain showers with a 2,000 ft ceiling (MVFR), each under an hour.', true],
      ['3 SM and 2,000 broken for the whole 1820–2300Z period.', false, 'TEMPO means temporary changes, each under an hour and less than half the period.'],
      ['Conditions gradually becoming 3 SM by 2300Z and staying that way.', false, 'That would be BECMG.'],
      ['A 30% chance of showers.', false, 'That would be PROB30.'],
    ],
    explain: ['**TEMPO**: temporary changes expected for **less than 1 hour** each, and **in total less than half** the period. **BKN020** is a 2,000 ft ceiling, and 3 SM is **MVFR**. That’s below your 3,000 / 5 personal minimums, so plan for it.'],
    c: ['aim:7-1-28', 'aim:7-1-7'] }),
  S({ id: 's2-freezing-rain', pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K3i', 'PA.I.C.R1c'],
    setup: ['A winter morning METAR at Redmond shows FZRA. It’s 0 °C at the surface, and a warm front is moving in aloft.'],
    prompt: 'What’s going on, and what’s the call?',
    choices: [
      ['Freezing rain: a warm layer aloft over a shallow sub-freezing layer near the surface. No-go: the 152 is prohibited from known icing.', true],
      ['Rain that will freeze only on the ground; it’s fine once airborne.', false, 'It freezes on contact with the airplane too.'],
      ['Snow mixed with rain; it’s harmless above freezing aloft.', false, 'FZRA is freezing rain, and you’d have to climb through the sub-freezing layer.'],
      ['Climb above the warm layer to stay out of it.', false, 'Never plan to fly in freezing rain in a 152.']
    ],
    explain: ['Freezing rain occurs when there’s a **deep above-freezing layer aloft** with a **shallow below-freezing layer near the surface**. The 152 is **prohibited from flight into known icing**.'],
    c: ['awh:14-4', 'poh:2-7', 'aim:7-1-28'] }),
  S({ id: 's2-microburst', pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K3h', 'PA.IV.N.K2'],
    setup: ['Approaching Eugene, a thunderstorm sits just west of the field. Eugene Tower reports a microburst alert on the approach end.'],
    prompt: 'Best decision?',
    choices: [
      ['Hold well clear or divert until the storm moves on. A microburst intensifies for about 5 minutes after hitting the ground.', true],
      ['Land quickly before it gets worse; microbursts weaken the moment they reach the ground.', false, 'They intensify for about 5 minutes after striking the ground.'],
      ['Fly the approach 10 knots faster and continue.', false, 'A microburst’s downdraft and outflow can exceed a light airplane’s climb ability.'],
      ['Approach under the storm where the air is clear.', false, 'The AIM says never fly under a thunderstorm.']
    ],
    explain: ['AIM: microbursts are small, intense downdrafts (typically **less than 1 mile** across) that spread outward at the surface and **intensify for about 5 minutes** after striking the ground. Never fly under a thunderstorm.'],
    c: ['aim:7-1-24', 'aim:7-1-27'] }),
  S({ id: 's2-mtr', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K3'],
    setup: ['Your route east of the Cascades crosses a charted VR route. You plan to be about 1,000 ft above the ground there.'],
    prompt: 'Why does it matter?',
    choices: [
      ['VR routes at 1,500 AGL and below are flown VFR by military aircraft, generally at more than 250 knots. Look hard and consider crossing higher.', true],
      ['VR routes are closed to civil aircraft when active.', false, 'MTRs aren’t restricted airspace; it’s a see-and-avoid hazard.'],
      ['VR routes are only used above 10,000 ft.', false, 'VFR routes are generally at 1,500 AGL and below.'],
      ['It doesn’t matter: military jets must avoid you.', false, 'See and avoid applies to everyone, and they’re very fast.']
    ],
    explain: ['MTRs are generally below 10,000 MSL for operations **faster than 250 knots**. Routes at **1,500 ft AGL and below** are generally flown under **VFR**.'],
    c: ['aim:3-5-2'] }),
  S({ id: 's2-moa', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K3'],
    setup: ['Your route to Bend passes through a MOA. You’re told it’s active today.'],
    prompt: 'What are your options?',
    choices: [
      ['VFR flight through an active MOA is allowed, but use extreme caution. Call an FSS or ATC for activity, or route around it.', true],
      ['VFR flight is prohibited in an active MOA.', false, 'MOAs separate military training from IFR traffic; VFR may enter with caution.'],
      ['You need permission from the using agency, just like a restricted area.', false, 'That’s for restricted areas.'],
      ['MOAs only matter above 10,000 ft.', false, 'MOAs have their own charted limits.']
    ],
    explain: ['AIM: MOAs separate military training from IFR traffic. **VFR pilots should exercise extreme caution** when military activity is being conducted. Contact any FSS within 100 miles for real-time status.'],
    c: ['aim:3-4-5'] }),
  S({ id: 's2-wildlife', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K3'],
    setup: ['Flying the coast toward Newport, your route passes over a National Wildlife Refuge.'],
    prompt: 'What does the AIM ask of you?',
    choices: [
      ['Maintain at least 2,000 ft above the surface over it (requested).', true],
      ['Maintain at least 500 ft above the surface.', false, '500 ft is the 91.119 minimum over sparsely populated areas. The refuge request is 2,000 ft.'],
      ['Avoid it entirely; flight over refuges is prohibited.', false, 'It’s a requested minimum altitude, not a prohibition.'],
      ['Stay at least 1,000 ft above the highest obstacle.', false, 'That’s the congested-area rule.']
    ],
    explain: ['Pilots are **requested** to maintain a minimum altitude of **2,000 ft above the surface** over National Parks, Wildlife Refuges, and similar areas.'],
    c: ['aim:7-5-6'] }),
  S({ id: 's2-pcl', pave: 'V', topic: 'v-airport', acs: ['PA.XI.A.K2'],
    setup: ['Night arrival at Astoria (KAST), nontowered. The runway lights are off.'],
    prompt: 'How do you turn them on?',
    choices: [
      ['Key the mic on the CTAF, 122.8: 7 times within 5 seconds for highest intensity.', true],
      ['Key the mic 7 times on 121.5.', false, 'Use the frequency listed in the Chart Supplement: the CTAF.'],
      ['Call the FBO on UNICOM to turn them on.', false, 'Pilot-controlled lighting is activated by clicking the mic.'],
      ['Key the mic 3 times for full brightness.', false, '3 clicks gives the lowest intensity.']
    ],
    explain: ['Chart Supplement: KAST runway lights are activated on the **CTAF (122.8)**. Pilot-controlled lighting: **7 clicks within 5 seconds = highest**, 5 = medium, 3 = lowest.'],
    c: ['cs:KAST', 'aim:2-1-8'] }),
  S({ id: 's2-beacon-day', pave: 'V', topic: 'v-airport', acs: ['PA.XI.A.K2', 'PA.I.E.K1'],
    setup: ['Arriving at Salem on a hazy afternoon, you notice the rotating beacon is on.'],
    prompt: 'What might that mean?',
    choices: [
      ['Ground visibility may be below 3 miles and/or the ceiling below 1,000 ft. Get the ATIS; you may need a clearance to operate in the surface area.', true],
      ['The tower is closed.', false, 'Daytime beacon operation in a surface area often indicates below-VFR conditions.'],
      ['Nothing: beacons run 24 hours.', false, 'The AIM notes daytime operation often means low weather.'],
      ['The airport is closed.', false, 'An X on the runway marks a closed runway.']
    ],
    explain: ['AIM: in Class B, C, D, and E surface areas, the beacon operating **during daylight often indicates ground visibility below 3 miles and/or a ceiling below 1,000 ft**. Don’t rely on it alone; check the ATIS.'],
    c: ['aim:2-1-9'] }),
  S({ id: 's2-hold-sign', pave: 'E', topic: 'e-airportops', acs: ['PA.II.D.K3', 'PA.II.D.R4'],
    setup: ['Taxiing to KHIO Runway 31L, you reach a red sign with white letters reading “2-20”, with yellow lines on the pavement: two solid on your side, two dashed beyond.'],
    prompt: 'What do you do?',
    choices: [
      ['Stop on your side of the solid lines unless cleared to cross Runway 2-20.', true],
      ['Continue, since you were cleared to taxi to 31L.', false, 'You need an explicit clearance to cross a runway.'],
      ['Stop on the dashed side.', false, 'The solid lines are on the side where you hold.'],
      ['It’s a location sign: you’re on Runway 2-20.', false, 'Location signs are black with yellow letters. Red with white is mandatory.']
    ],
    explain: ['A **red sign with a white inscription** is a mandatory instruction sign. Runway holding position markings are **four yellow lines, two solid and two dashed**; hold on the **solid** side.'],
    c: ['aim:2-3-8', 'aim:2-3-5'] }),
  S({ id: 's2-distance-sign', pave: 'E', topic: 'e-airportops', acs: ['PA.II.D.K3'],
    setup: ['On the takeoff roll on KHIO 13R you pass a black sign with a white “4”.'],
    prompt: 'What does it mean?',
    choices: [
      ['About 4,000 ft of runway remaining.', true],
      ['Taxiway 4 exit ahead.', false, 'Taxiway signs aren’t white numerals on black.'],
      ['400 ft of runway remaining.', false, 'Distance remaining is in thousands of feet.'],
      ['You’ve used 4,000 ft.', false, 'It shows what remains.']
    ],
    explain: ['Runway distance remaining signs: **black background, white numeral**, in **thousands of feet** remaining.'],
    c: ['aim:2-3-13', 'cs:KHIO'] }),
  S({ id: 's2-pattern-depart', pave: 'V', topic: 'v-airport', acs: ['PA.III.B.K1'],
    setup: ['Departing Bend (nontowered) eastbound from Runway 17, where the airplane pattern is right traffic.'],
    prompt: 'How should you leave the pattern?',
    choices: [
      ['Straight out, or a 45° turn to the right (the pattern direction) beyond the departure end after reaching pattern altitude.', true],
      ['An immediate left turn after takeoff toward your course.', false, 'Exit beyond the departure end, turning in the pattern direction.'],
      ['A 45° turn to the left once past the runway.', false, 'In a right-hand pattern, the 45° departure turn is to the right.'],
      ['Climb on the crosswind leg and depart from downwind.', false, 'The AIM describes straight out or a 45° turn.']
    ],
    explain: ['AIM: depart the pattern **straight out**, or with a **45° turn in the pattern direction** (right for right traffic) **beyond the departure end** of the runway, after reaching pattern altitude. Bend: right traffic Runway 17 for airplanes.'],
    c: ['aim:4-3-3', 'cs:KBDN'] }),
  S({ id: 's2-pilotage', pave: 'V', topic: 'v-nav', acs: ['PA.VI.A.K1'],
    setup: ['Flying to Astoria, you follow the Columbia River, checking off St. Helens, Longview, and Cathlamet as you pass them.'],
    prompt: 'What navigation method is that?',
    choices: [
      ['Pilotage: navigating by reference to landmarks or checkpoints.', true],
      ['Dead reckoning: computing heading and time from known speed and wind.', false, 'Dead reckoning uses computation, not landmarks.'],
      ['Radio navigation using VORs.', false, 'You’re using visual landmarks.'],
      ['GPS navigation.', false, 'You’re using what you see outside.']
    ],
    explain: ['**Pilotage** is navigation by reference to landmarks or checkpoints. It’s commonly used together with **dead reckoning** (computed headings and times).'],
    c: ['phak:16-12'] }),
  S({ id: 's2-lost-coast', pave: 'V', topic: 'v-lost', acs: ['PA.VI.D.K1', 'PA.VI.D.K2'],
    setup: ['Over the Coast Range under a high overcast, you’re not sure where you are. Fuel is fine.'],
    prompt: 'Best first steps, per the FAA?',
    choices: [
      ['Climb (if clouds and traffic allow) for better radio and radar coverage, fix your position with the GTN 650 or VOR, and talk to ATC or FSS for help.', true],
      ['Descend to read town names on water towers.', false, 'The PHAK says climb first. Descending near terrain adds risk.'],
      ['Keep flying your heading until you see a landmark.', false, 'Use all resources now.'],
      ['Circle in place to save fuel until someone finds you.', false, 'Communicate and use navigation aids.']
    ],
    explain: ['PHAK lost procedures: **climb** (mindful of traffic and weather) to increase radio, navigation, and radar range; use **VOR or GPS** to fix your position; **communicate** with any facility for radar vectors or direction-finding help.'],
    c: ['phak:16-34', 'aim:6-3-2'] }),
  S({ id: 's2-flightplan', pave: 'V', topic: 'v-flightplan', acs: ['PA.I.D.K5'],
    setup: ['You file a VFR flight plan to Bend for 1:00 pm, but you get distracted and take off at 2:15 without activating it.'],
    prompt: 'What’s the problem?',
    choices: [
      ['It isn’t active, so you don’t have VFR search and rescue coverage. Activate it after departure.', true],
      ['Nothing: filing a VFR flight plan activates it automatically.', false, 'You must activate it.'],
      ['ATC will now give you separation from other traffic.', false, 'A VFR flight plan doesn’t provide separation.'],
      ['It’s illegal to fly VFR without an active flight plan.', false, 'VFR flight plans aren’t required.']
    ],
    explain: ['AIM: **activating** the flight plan ensures you receive **VFR search and rescue services**. If not updated, search and rescue is based on the **assumed departure time**.'],
    c: ['aim:5-1-5'] }),
  S({ id: 's2-wake-crossing', pave: 'V', topic: 'v-wake', acs: ['PA.III.B.R3'],
    setup: ['Landing at Eugene on 16L, a larger jet is landing on the crossing runway ahead of you.'],
    prompt: 'How do you avoid its wake?',
    choices: [
      ['Cross above its flight path.', true],
      ['Cross below its flight path.', false, 'Vortices sink below the flight path.'],
      ['Land well beyond the intersection.', false, 'The guidance for a crossing runway is to cross above its path.'],
      ['Ignore it; wake only matters on the same runway.', false, 'Vortices drift and sink across runways.']
    ],
    explain: ['AIM vortex avoidance, landing behind a larger aircraft on a **crossing runway**: **cross above its flight path**.'],
    c: ['aim:7-4-6'] }),

  // ───────── EXTERNAL / AEROMED ─────────
  S({ id: 's2-night-vision', pave: 'E', topic: 'e-aeromed', acs: ['PA.XI.A.K1'],
    setup: ['Night flight home from Bend at 10,500 ft over the Cascades, no oxygen.'],
    prompt: 'What does the AIM say about your night vision?',
    choices: [
      ['It starts deteriorating at cabin altitudes as low as 5,000 ft, so expect reduced night vision up here.', true],
      ['Night vision isn’t affected until above 12,500 ft.', false, '12,500 is the oxygen rule; night vision degrades much lower.'],
      ['It improves at altitude because the air is clearer.', false, 'Reduced oxygen degrades night vision.'],
      ['Only after 30 minutes above 14,000 ft.', false, 'The effect starts as low as 5,000 ft.']
    ],
    explain: ['AIM: a **deterioration in night vision occurs at a cabin pressure altitude as low as 5,000 ft**. Full dark adaptation takes about 30 minutes in darkness.'],
    c: ['aim:8-1-2', 'aim:8-1-6'] }),
  S({ id: 's2-scuba', pave: 'E', topic: 'e-aeromed', acs: ['PA.I.H.K1l'],
    setup: ['Saturday at the coast: a morning recreational dive with no decompression stops. You plan to fly home over the Coast Range at 6,500 ft that same afternoon, 6 hours after surfacing.'],
    prompt: 'What does the AIM recommend?',
    choices: [
      ['Wait at least 12 hours after a non-decompression dive before flying up to 8,000 ft. Fly Sunday morning.', true],
      ['6 hours is enough below 8,000 ft.', false, 'The recommendation is at least 12 hours.'],
      ['Wait 24 hours.', false, '24 hours applies after a dive that required a controlled ascent.'],
      ['No wait is needed below 10,000 ft.', false, 'Decompression sickness can occur at lower altitudes.']
    ],
    explain: ['AIM: wait **at least 12 hours** after diving that didn’t require a controlled ascent before flying up to 8,000 ft, and **at least 24 hours** after diving that required one.'],
    c: ['aim:8-1-2'] }),
  S({ id: 's2-hyperventilation', pave: 'E', topic: 'e-aeromed', acs: ['PA.I.H.K1b'],
    setup: ['Your nervous passenger is breathing fast and says their fingers are tingling and they feel lightheaded. You’re at 3,500 ft.'],
    prompt: 'Most likely cause and remedy?',
    choices: [
      ['Hyperventilation: help them consciously slow their breathing (a paper bag can help).', true],
      ['Hypoxia: descend immediately.', false, 'At 3,500 ft hypoxia is unlikely; fast breathing from anxiety points to hyperventilation.'],
      ['Carbon monoxide: shut off the heat.', false, 'Possible if the heat is on, but rapid breathing from anxiety points to hyperventilation.'],
      ['Motion sickness: open a vent.', false, 'Tingling and lightheadedness with rapid breathing point to hyperventilation.']
    ],
    explain: ['AIM: hyperventilation symptoms subside within a few minutes after the **rate and depth of breathing are consciously brought back under control**. Breathing into a paper bag can speed recovery. Early symptoms resemble hypoxia.'],
    c: ['aim:8-1-3'] }),
  S({ id: 's2-somatogravic', pave: 'E', topic: 'e-aeromed', acs: ['PA.XI.A.K8', 'PA.I.H.K1d'],
    setup: ['Night takeoff from KHIO Runway 31L into a dark area with few lights. As you accelerate, it feels like the nose is pitching up steeply.'],
    prompt: 'What’s happening, and what do you do?',
    choices: [
      ['Somatogravic illusion: acceleration feels like a nose-up attitude. Trust the attitude indicator; don’t push the nose down.', true],
      ['Real excessive pitch: push forward until it feels level.', false, 'That’s how this illusion causes pilots to dive into the ground.'],
      ['Autokinesis: look away from the lights.', false, 'Autokinesis is a stationary light seeming to move.'],
      ['The leans: roll the wings level.', false, 'The leans is about bank, not pitch.']
    ],
    explain: ['AIM: a **rapid acceleration during takeoff** can create the illusion of being in a **nose-up attitude**; the disoriented pilot pushes into a nose-low or dive attitude. Use your instruments.'],
    c: ['aim:8-1-5'] }),
  S({ id: 's2-graveyard', pave: 'E', topic: 'e-aeromed', acs: ['PA.I.H.K1d', 'PA.VIII.E'],
    setup: ['After inadvertently entering cloud, you’ve been in a gentle turn for a while. You notice altitude decreasing, but it feels like you’re wings level.'],
    prompt: 'What’s the danger?',
    choices: [
      ['A graveyard spiral: pulling back without leveling the wings tightens the spiral and you lose more altitude. Level the wings on the instruments first.', true],
      ['A graveyard spin: you need full opposite rudder.', false, 'This is a coordinated turn, not a spin.'],
      ['Coriolis illusion: keep your head still and it will pass.', false, 'Coriolis comes from head movement in a turn.'],
      ['Nothing: pull back to regain the lost altitude.', false, 'Pulling back in a bank tightens the spiral.']
    ],
    explain: ['AIM: an observed loss of altitude in a coordinated constant-rate turn that no longer stimulates the inner ear feels like a **wings-level descent**. The pilot pulls back, **tightening the spiral**. Level the wings first using the instruments.'],
    c: ['aim:8-1-5'] }),
  S({ id: 's2-autokinesis', pave: 'E', topic: 'e-aeromed', acs: ['PA.XI.A.K8'],
    setup: ['Night over the Willamette Valley, you’ve been staring at a single bright light ahead for a while, and it seems to be drifting around.'],
    prompt: 'What is this?',
    choices: [
      ['Autokinesis: a stationary light appears to move when stared at. Keep scanning and use your instruments.', true],
      ['Another aircraft maneuvering: turn to avoid it.', false, 'A static light that seems to wander after long staring is autokinesis.'],
      ['False horizon: level off with the light.', false, 'False horizon comes from sloping clouds or ground lights.'],
      ['Flicker vertigo.', false, 'Flicker vertigo comes from flashing light, such as a propeller in sunlight.']
    ],
    explain: ['AIM: **autokinesis**: in the dark, a static light appears to move when stared at for many seconds. The disoriented pilot can lose control trying to align with it.'],
    c: ['aim:8-1-5'] }),
  S({ id: 's2-ntsb-controls', pave: 'V', topic: 'v-ntsb', acs: ['PA.III.A.K8'],
    setup: ['In cruise, the ailerons suddenly jam. You manage to land safely at Corvallis using rudder and trim. Nobody is hurt and the airplane isn’t damaged.'],
    prompt: 'Do you have to notify the NTSB?',
    choices: [
      ['Yes, immediately: a flight control system malfunction or failure is a listed serious incident.', true],
      ['No. Only accidents with injuries or damage need reporting.', false, 'Some incidents require immediate notification even with no damage.'],
      ['Only a written report within 30 days.', false, 'It requires immediate notification.'],
      ['Only if ATC was told during the flight.', false, 'The requirement doesn’t depend on ATC.']
    ],
    explain: ['49 CFR 830.5 requires **immediate notification** of an accident or listed serious incidents, including **flight control system malfunction or failure**, in-flight fire, and in-flight collision.'],
    c: ['cfr49:830.5(a)'] }),
  S({ id: 's2-pax-brief', pave: 'E', topic: 'e-brief', acs: ['PA.II.B.K1'],
    setup: ['Your first passenger after the checkride climbs in at KHIO. You’re running late and want to get going.'],
    prompt: 'What must you brief before moving the airplane?',
    choices: [
      ['How to fasten and unfasten the seat belt and shoulder harness, and that they must be fastened for taxi, takeoff, and landing.', true],
      ['Nothing is required for a single passenger.', false, '§91.107 applies to every person on board.'],
      ['Only the location of the fire extinguisher.', false, 'The required briefing is about belts and harnesses.'],
      ['Belts only before takeoff; taxi doesn’t count.', false, 'Belts must be fastened for movement on the surface too.']
    ],
    explain: ['The PIC must ensure each person is **briefed on how to fasten and unfasten** their belt and harness, and **notified to fasten them** before moving on the surface, takeoff, and landing.'],
    c: ['cfr14:91.107(a)'] })
];
