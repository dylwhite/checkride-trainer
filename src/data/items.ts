// Phase 2 sample bank: 22 verified items (scenario, quick recall, chart, emergency).
// Text in {braces} is a template variable; each option keeps the answer correct.
import type { Item } from './types';

export const ITEMS: Item[] = [
  // ── 1. VFR minimums in the KHIO surface area ──
  {
    id: 's-khio-vis', kind: 'scenario', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.C.R1'],
    vars: { day: ['Saturday morning', 'Sunday morning', 'Early Tuesday'], plan: ['practice landings', 'fly a short local flight', 'take your instructor up for a pattern check'] },
    setup: ['{day} at Hillsboro. You planned to {plan}. The tower is open, so KHIO is Class D.', 'You listen to the ATIS before starting up:'],
    readout: { tag: 'Sample METAR · fictional', cat: 'IFR', text: 'KHIO 161753Z 20008KT 2SM BR BKN015 OVC025 09/08 A3002' },
    prompt: 'Can you take off and fly the pattern under basic VFR?',
    choices: [
      { t: 'Yes. The ceiling is above 1,000 ft, so I’m legal in Class D.', why: 'The ceiling is only half the rule. Ground visibility must also be at least 3 SM.' },
      { t: 'No. Ground visibility must be at least 3 SM to take off under VFR in the Class D surface area.', ok: true },
      { t: 'Yes. 1 SM and clear of clouds is enough below 1,200 ft AGL.', why: 'That is the daytime Class G minimum. KHIO is in Class D while the tower is open.' },
      { t: 'Yes, as long as I climb above the clouds after takeoff.', why: 'You can’t legally take off under VFR in the surface area with less than 3 SM ground visibility.' }
    ],
    explain: [
      'With the tower open, Hillsboro is a **Class D surface area**.',
      'To take off, land, or enter the pattern under VFR there, you need **ground visibility of at least 3 SM** and a **ceiling of at least 1,000 ft**. The 1,500 ft broken ceiling is fine, but visibility is only 2 SM.',
      'The only legal way out under VFR would be a **Special VFR clearance** from ATC.'
    ],
    think: 'Temperature 09, dewpoint 08: a 1° spread with mist. Is this more likely to improve or get worse before you’d want to land?',
    c: ['cfr14:91.155(c)', 'cfr14:91.155(d)', 'cfr14:91.157', 'cs:KHIO'],
    next: 'r-classd-mins', xp: 15
  },
  {
    id: 'r-classd-mins', kind: 'recall', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1'],
    prompt: 'What are the basic VFR weather minimums in Class D airspace?',
    answer: ['**3 SM** flight visibility', 'Clouds: **500 ft below, 1,000 ft above, 2,000 ft horizontal**', 'In the surface area: **1,000 ft ceiling** and **3 SM ground visibility** to take off, land, or enter the pattern'],
    explain: [], c: ['cfr14:91.155(a)', 'cfr14:91.155(c)', 'cfr14:91.155(d)'], xp: 10
  },

  // ── 2. Carburetor ice ──
  {
    id: 's-carb-ice', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-carbheat', acs: ['PA.IX.C.K1', 'PA.I.G.K1c'],
    vars: { where: ['over the Willamette Valley south of Salem', 'along the Columbia west of Kelso', 'near McMinnville'], wx: ['cool, damp morning under a high overcast', 'humid afternoon after a morning of drizzle', 'mild day, 15 °C with low clouds clearing'] },
    setup: ['You’re cruising {where} on a {wx}. The 152 has been running smoothly at your cruise power.', 'Over a few minutes you notice the RPM has slowly dropped by about 100, with no roughness yet. Mixture and throttle haven’t moved.'],
    prompt: 'What’s the most likely cause, and what do you do first?',
    choices: [
      { t: 'Carburetor ice. Apply full carburetor heat.', ok: true },
      { t: 'A fouled spark plug. Lean the mixture aggressively.', why: 'Plug fouling causes slight roughness, not a smooth, gradual RPM loss. A gradual RPM drop is the classic carb ice sign.' },
      { t: 'A magneto problem. Switch to the left magneto.', why: 'Mag checks help with roughness, but a smooth, slow RPM decay points to carb ice first.' },
      { t: 'Normal. Add throttle to get the RPM back.', why: 'Adding throttle hides the symptom while ice keeps building.' }
    ],
    explain: [
      'In a fixed-pitch prop airplane, the **first sign of carb ice is a drop in RPM**, which may be followed by roughness.',
      'Your POH: apply **full throttle and pull carb heat full out** until the engine runs smoothly, then carb heat off and readjust the throttle.',
      'Expect the engine to run **rougher at first** after you apply heat, as melted ice passes through. Don’t take it back off.',
      'Carb ice can form in outside air as warm as **100 °F with humidity as low as 50%**, which makes Pacific Northwest air prime territory.'
    ],
    think: 'Carb ice is especially dangerous at reduced power, like a long descent into KHIO or Eugene. Use carb heat before you pull the power back, not after the engine stumbles.',
    c: ['poh:3-13', 'phak:7-10'], next: 'r-carb-sign', xp: 15
  },
  {
    id: 'r-carb-sign', kind: 'recall', pave: 'A', topic: 'a-carbheat', acs: ['PA.I.G.K1c'],
    prompt: 'In an airplane with a fixed-pitch prop, what’s the first indication of carburetor ice? And when is it most dangerous?',
    answer: ['A **decrease in engine RPM**, which may be followed by roughness', 'Most dangerous when using **reduced power, such as during a descent**: it can build unnoticed until you add power'],
    explain: [], c: ['phak:7-10'], xp: 10
  },

  // ── 3. Engine failure after takeoff ──
  {
    id: 'e-efato', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-perf', acs: ['PA.IX.B.K1', 'PA.IV.A.R3b'],
    vars: { rwy: ['13R', '31L'], agl: ['300', '400', '500'] },
    setup: ['Departing KHIO Runway {rwy}, solo. Climbing through about {agl} ft AGL, the engine quits completely. The prop is windmilling and there’s no response to the throttle.'],
    prompt: 'What do you do?',
    choices: [
      { t: 'Pitch for 60 KIAS and land straight ahead or with small turns, choosing the best spot in front of you.', ok: true },
      { t: 'Turn back to the runway immediately before you lose more altitude.', why: 'The “impossible turn” loses a lot of altitude. The AFH says to turn back only if you’re certain you can make it and have trained it in your airplane.' },
      { t: 'Hold Vy (67 KIAS) to stretch the glide back toward the airport.', why: 'Your POH memory item is 60 KIAS for engine failure after takeoff.' },
      { t: 'Troubleshoot first: carb heat, fuel, mags, then decide.', why: 'At this altitude there’s no time. Airspeed first, landing site second. The restart procedure is for failures with altitude to work with.' }
    ],
    explain: [
      'Memory item: **Airspeed 60 KIAS.** Then mixture idle cut-off, fuel shutoff valve off, ignition off, flaps as required, master off.',
      'The AFH: continuing **straight ahead or with a slight turn** lets you land under control and as slowly as possible. Turning back requires knowing the altitude loss for your airplane and having practiced the maneuver.'
    ],
    think: 'Decide before you take the runway. Out of 31L at KHIO, what’s ahead of you? Brief it at the hold-short line.',
    c: ['poh:3-4', 'afh:ch. 18'], next: 'r-efato-memory', xp: 20
  },
  {
    id: 'r-efato-memory', kind: 'recall', emergency: true, pave: 'A', topic: 'a-perf', acs: ['PA.IX.B.K1'],
    prompt: 'Say the C152 checklist “Engine Failure Immediately After Takeoff” word for word. Which item is a memory item?',
    answer: ['1. **Airspeed -- 60 KIAS.** (memory item, bold in the POH)', '2. Mixture -- IDLE CUT-OFF.', '3. Fuel Shutoff Valve -- OFF.', '4. Ignition Switch -- OFF.', '5. Wing Flaps -- AS REQUIRED.', '6. Master Switch -- OFF.'],
    explain: [], c: ['poh:3-4'], xp: 15
  },

  // ── 4. Electrical fire ──
  {
    id: 'e-elec-fire', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-elec', acs: ['PA.IX.C.K3'],
    vars: { where: ['10 miles south of KHIO at 3,500', 'over Forest Grove at 2,500', 'abeam Scappoose at 3,500'] },
    setup: ['You’re {where} when you smell hot insulation. A thin wisp of smoke is coming from behind the panel.'],
    prompt: 'What are your first actions?',
    choices: [
      { t: 'Master switch OFF, vents/cabin air/heat CLOSED, fire extinguisher ACTIVATE if available.', ok: true },
      { t: 'Mixture idle cut-off and fuel shutoff valve OFF.', why: 'That’s the engine fire checklist. This is electrical: remove the power source first.' },
      { t: 'Open all vents to clear the smoke, then find the bad circuit breaker.', why: 'The POH closes vents, cabin air, and heat right after the master switch.' },
      { t: 'Reset any popped circuit breaker to restore the radios.', why: 'Your POH says check breakers but do not reset them.' }
    ],
    explain: [
      'Memory items: **Master Switch OFF, Vents/Cabin Air/Heat CLOSED, Fire Extinguisher ACTIVATE** (if available). Ventilate the cabin after using an extinguisher.',
      'Then all other switches (except ignition) off. The engine keeps running on its magnetos.',
      'Only if the fire is out and you need power: master on, check breakers (don’t reset), and turn equipment on one at a time.'
    ],
    think: 'An in-flight fire is a serious incident that requires immediate NTSB notification, even if you land safely.',
    c: ['poh:3-6', 'poh:7-22', 'cfr49:830.5'], next: 'r-ntsb', xp: 20
  },
  {
    id: 'r-ntsb', kind: 'recall', pave: 'V', topic: 'v-ntsb', acs: ['PA.III.A.K8'],
    prompt: 'Name events that require immediate NTSB notification under 49 CFR 830.5, and when a written report is due.',
    answer: ['Any **accident**, plus serious incidents including: **flight control system malfunction**, a **crewmember unable to perform duties** from injury or illness, **in-flight fire**, **in-flight collision**, and **damage to other property over $25,000**', 'An **overdue aircraft** believed to be in an accident', 'Written report: within **10 days** after an accident (or after **7 days** if an overdue aircraft is still missing). For incidents, only if the NTSB requests it.'],
    explain: [], c: ['cfr49:830.5', 'cfr49:830.15(a)'], xp: 10
  },

  // ── 5. Low-voltage light ──
  {
    id: 'e-low-volt', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-elec', acs: ['PA.IX.C.K2a', 'PA.I.G.R2'],
    vars: { dest: ['Eugene (KEUG)', 'Bend (KBDN)', 'Olympia (KOLM)'] },
    setup: ['Level en route from KHIO to {dest}, the low-voltage light comes on and the ammeter shows a discharge. Engine RPM is normal.'],
    prompt: 'Per your POH, what’s the right sequence?',
    choices: [
      { t: 'Radios off, alternator breaker check in, master off (both sides) then on, check light off, radios on. If it comes back: alternator off, nonessentials off, terminate the flight as soon as practical.', ok: true },
      { t: 'Continue to the destination. The battery runs everything for the rest of the flight.', why: 'Your battery is now the only source. The POH says terminate the flight as soon as practical.' },
      { t: 'Turn the master off and leave it off for the rest of the flight.', why: 'That’s not the POH sequence. First try to reset the alternator with a master cycle.' },
      { t: 'Reduce RPM to idle to reduce the electrical load.', why: 'That isn’t in the POH procedure. You reduce electrical load by turning equipment off.' }
    ],
    explain: [
      'The POH “Low-Voltage Light Illuminates During Flight” checklist: **Radios OFF → Alternator circuit breaker CHECK IN → Master OFF (both sides) → Master ON → Low-voltage light CHECK OFF → Radios ON.**',
      'If it illuminates again: **Alternator OFF → nonessential radio and electrical equipment OFF → terminate the flight as soon as practical.**',
      'Your magnetos keep the engine running regardless. But the GTN 650 and GTX 345 depend on the battery from here on.'
    ],
    think: 'Tell ATC early while you still have a radio, and pick the nearest suitable airport rather than pressing on to {dest}.',
    c: ['poh:3-8', 'poh:7-22'], xp: 20
  },

  // ── 6. Lost comms arriving KHIO ──
  {
    id: 's-lostcomm', kind: 'scenario', pave: 'V', topic: 'v-lostcomm', acs: ['PA.III.A.K5', 'PA.III.A.K3', 'PA.III.A.K4'],
    vars: { from: ['the practice area west of Forest Grove', 'a flight to Scappoose and back', 'the north practice area'] },
    setup: ['Returning to KHIO from {from}, with the tower open. Your radio has gone silent. You can’t hear anything and nobody answers your calls. The weather is good VFR.'],
    prompt: 'What’s the best plan?',
    choices: [
      { t: 'Squawk 7600, stay outside or above the Class D until you see the traffic flow, join the pattern, and watch the tower for light signals.', ok: true },
      { t: 'Squawk 7700 and land on the longest runway right away.', why: '7700 is for emergencies. Radio failure is 7600, and you still need to fit in with traffic.' },
      { t: 'Enter the Class D and land. ATC will see you on radar.', why: 'You need two-way radio contact to enter Class D. Without it, follow the AIM radio-failure arrival procedure.' },
      { t: 'Divert to a nontowered airport only. You can’t land at KHIO without a radio.', why: 'Diverting is an option, but the AIM has a procedure for landing at a towered airport with light signals.' }
    ],
    explain: [
      'Squawk **7600** for loss of two-way radio.',
      'Arriving with radio failure: **remain outside or above the Class D surface area until you’ve determined the direction and flow of traffic**, then **join the pattern** and **watch the tower for light signals**.',
      'Acknowledge light signals by moving the ailerons or rudder (day) or blinking the landing or navigation lights (night).'
    ],
    c: ['aim:6-4-2', 'aim:4-2-13', 'aim:4-3-13'], next: 'r-lightgun', xp: 15
  },
  {
    id: 'r-lightgun', kind: 'recall', pave: 'V', topic: 'v-lostcomm', acs: ['PA.III.A.K3'],
    prompt: 'You’re on downwind with no radio. The tower points a flashing red light at you. What does it mean?',
    choices: [
      { t: 'Airport unsafe, do not land.', ok: true },
      { t: 'Give way to other aircraft and continue circling.', why: 'That’s steady red in flight.' },
      { t: 'Return for landing.', why: 'That’s flashing green in flight.' },
      { t: 'Exercise extreme caution.', why: 'That’s alternating red and green.' }
    ],
    explain: ['In flight: **steady green** cleared to land · **flashing green** return for landing · **steady red** give way and continue circling · **flashing red** airport unsafe, do not land · **alternating red/green** exercise extreme caution.'],
    c: ['aim:4-3-13'], xp: 10
  },

  // ── 7. Hazardous attitudes ──
  {
    id: 's-macho', kind: 'scenario', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2'],
    vars: { dest: ['Bend', 'Redmond'], who: ['a friend', 'your cousin'] },
    setup: ['You’re planning KHIO to {dest} with {who}. The forecast over the Cascade passes is marginal. You catch yourself thinking: “I’ve handled worse in the pattern. I can do this. I’ll show them what I can do.”'],
    prompt: 'Which hazardous attitude is this, and what’s its antidote?',
    choices: [
      { t: 'Macho: “Taking chances is foolish.”', ok: true },
      { t: 'Invulnerability: “It could happen to me.”', why: 'Invulnerability is “It won’t happen to me.” This thought is about proving yourself.' },
      { t: 'Anti-authority: “Follow the rules. They are usually right.”', why: 'Anti-authority is “Don’t tell me.” This is about proving you can do it.' },
      { t: 'Impulsivity: “Not so fast. Think first.”', why: 'Impulsivity is “Do it quickly.” This is about proving yourself.' }
    ],
    explain: [
      '**Macho** (“I can do it.”): trying to prove you’re better than others. Antidote: **“Taking chances is foolish.”**',
      'The PHAK’s method: recognize the thought, **label it as hazardous**, then **say the antidote**.'
    ],
    c: ['phak:2-5'], next: 'r-attitudes', xp: 15
  },
  {
    id: 'r-attitudes', kind: 'recall', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2'],
    prompt: 'Name the five hazardous attitudes and their antidotes.',
    answer: ['**Anti-authority** → Follow the rules. They are usually right.', '**Impulsivity** → Not so fast. Think first.', '**Invulnerability** → It could happen to me.', '**Macho** → Taking chances is foolish.', '**Resignation** → I’m not helpless. I can make a difference.'],
    explain: [], c: ['phak:2-5'], xp: 10
  },

  // ── 8. External pressures ──
  {
    id: 's-external', kind: 'scenario', pave: 'E', topic: 'e-pressures', acs: ['PA.I.D.R4', 'PA.II.A.R4'],
    vars: { event: ['a wedding in Bend', 'a family reunion in Eugene', 'a concert in Seattle'], when: ['Saturday at 2 pm', 'Sunday at noon'] },
    setup: ['Two friends are counting on you to fly them to {event} on {when}. They’ve already told everyone you’re flying them. The forecast looks “probably fine.”'],
    prompt: 'What’s the best way to manage this, according to the FAA?',
    choices: [
      { t: 'Set it up now with a release valve: plan to leave early, build in time for a weather stop, and agree on a backup way to get there.', ok: true },
      { t: 'Commit to going so your friends aren’t disappointed, and decide in the air.', why: 'That’s the pressure talking. Decisions are easiest on the ground before anyone gets in the plane.' },
      { t: 'Ignore it. External pressures only matter for commercial flights.', why: 'The PHAK calls managing external pressure the single most important key to risk management.' },
      { t: 'Only go if you can promise an on-time arrival.', why: 'Promising a time is what creates the pressure.' }
    ],
    explain: [
      'External pressures include **someone waiting for you, passengers you don’t want to disappoint, and get-there-itis**.',
      'The PHAK says managing them is **the single most important key to risk management**, because it can make you ignore every other risk. Personal SOPs give the pressure an outlet: allow time for an extra fuel or weather stop, have alternate plans for a late arrival, and leave early for important trips.'
    ],
    c: ['phak:2-9', 'phak:2-10'], xp: 15
  },

  // ── 9. Night fuel reserve ──
  {
    id: 's-night-fuel', kind: 'scenario', pave: 'V', topic: 'v-fuelreq', acs: ['PA.I.D.K3c', 'PA.I.D.R6'],
    vars: { from: ['Eugene (KEUG)', 'Olympia (KOLM)', 'Astoria (KAST)'] },
    setup: ['You’re planning the trip home from {from} to KHIO. Because of a late lunch, you’ll be landing after sunset.'],
    prompt: 'What fuel must you have, at minimum, when you take off?',
    choices: [
      { t: 'Enough to reach KHIO, considering wind and forecast weather, plus 45 minutes at normal cruise.', ok: true },
      { t: 'Enough to reach KHIO plus 30 minutes.', why: '30 minutes is the daytime minimum. At night it’s 45.' },
      { t: 'Enough to reach KHIO plus 1 hour.', why: 'That’s a good personal minimum, but the regulation is 45 minutes at night.' },
      { t: 'Full tanks are required for night flight.', why: 'No rule requires full tanks, but they’re often a smart choice in a 152.' }
    ],
    explain: [
      'VFR fuel rule: enough to fly to the **first point of intended landing**, considering wind and forecast weather, and then **30 minutes (day) or 45 minutes (night)** at normal cruising speed.',
      'Your 152 holds **24.5 gallons usable** in the standard tanks. Fuel below the red line on the gauge can’t be used safely in flight.'
    ],
    think: 'The regulation is a floor, not a plan. What would you do if KHIO’s weather went down and you needed to divert?',
    c: ['cfr14:91.151(a)', 'poh:2-7', 'poh:2-8'], xp: 15
  },

  // ── 10. Medication ──
  {
    id: 's-meds', kind: 'scenario', pave: 'P', topic: 'p-imsafe', acs: ['PA.I.H.K3', 'PA.II.A.K1'],
    vars: { time: ['7 am', '8 am'] },
    setup: ['Allergy season. You took an antihistamine at {time} that can cause drowsiness. The label says to take it every 6 hours. You’re scheduled to fly at 3 pm and feel fine.'],
    prompt: 'Per FAA guidance, can you fly at 3 pm?',
    choices: [
      { t: 'No. Wait at least five maximum dosing intervals, about 30 hours here.', ok: true },
      { t: 'Yes. You feel fine, and that’s what IMSAFE checks.', why: 'Feeling fine isn’t the test. The FAA guidance is based on time since the last dose.' },
      { t: 'Yes, as long as 8 hours have passed, like the alcohol rule.', why: '8 hours is the alcohol rule. Medications have their own guidance.' },
      { t: 'Yes, if you take only half a dose next time.', why: 'The guidance is about time since the last dose, not dose size.' }
    ],
    explain: ['The PHAK says to wait **at least five maximal dosing intervals** before flying after taking a medication with potentially adverse side effects, such as sedation or dizziness. With a 5 to 6 hour dosing interval, that means waiting **30 hours**.'],
    c: ['phak:17-18', 'cfr14:91.17(a)'], xp: 15
  },

  // ── 11. Night currency ──
  {
    id: 's-night-currency', kind: 'scenario', pave: 'P', topic: 'p-currency', acs: ['PA.I.A.K1', 'PA.XI.A.R5'],
    vars: { pax: ['your roommate', 'your sister', 'a coworker'] },
    setup: ['You want to show {pax} the Portland city lights after dark. Your last night landings (3 to a full stop, after 1 hour past sunset) were 97 days ago. You did 5 day landings last week.'],
    prompt: 'Can you take them after dark tonight?',
    choices: [
      { t: 'Not after 1 hour past sunset. First make 3 full-stop takeoffs and landings at night within 90 days.', ok: true },
      { t: 'Yes. Last week’s day landings keep you current for night.', why: 'Night currency needs its own 3 full-stop landings in the night period.' },
      { t: 'Yes, as long as you land before sunrise.', why: 'The rule covers carrying passengers from 1 hour after sunset to 1 hour before sunrise.' },
      { t: 'No. You need a flight review first.', why: 'A flight review is a separate 24-month requirement, not night currency.' }
    ],
    explain: ['To carry passengers **from 1 hour after sunset to 1 hour before sunrise**, you need **3 takeoffs and 3 landings to a full stop** in that period within the **preceding 90 days**, as sole manipulator, in the same category and class.'],
    think: 'Currency is legal. Proficiency is safe. After 97 days, a solo night pattern session is a good idea anyway.',
    c: ['cfr14:61.57(b)'], xp: 15
  },

  // ── 12. Wake turbulence ──
  {
    id: 's-wake', kind: 'scenario', pave: 'V', topic: 'v-wake', acs: ['PA.III.B.R3', 'PA.IV.A.R2d'],
    vars: { jet: ['a business jet', 'a turboprop twin'] },
    setup: ['On a 2-mile final for KHIO Runway 13R, the tower clears you to land behind {jet} that is just touching down ahead of you.'],
    prompt: 'How do you avoid its wake?',
    choices: [
      { t: 'Stay at or above its final approach path, note where it touched down, and land beyond that point.', ok: true },
      { t: 'Stay below its path and land short of its touchdown point.', why: 'Vortices sink. Being below the path puts you in them.' },
      { t: 'Land exactly on its touchdown point.', why: 'That’s where vortices from the landing aircraft settle.' },
      { t: 'Wake turbulence only matters behind airliners.', why: 'The AIM procedures apply behind any larger aircraft. A vortex’s induced roll can exceed the roll-control authority of the airplane that flies into it.' }
    ],
    explain: ['AIM vortex avoidance, landing behind a larger aircraft on the same runway: **stay at or above its final approach flight path, note its touchdown point, and land beyond it.**'],
    c: ['aim:7-4-6'], xp: 15
  },

  // ── 13. Door opens on takeoff ──
  {
    id: 'e-door', kind: 'scenario', emergency: true, pave: 'A', topic: 'a-preflight', acs: ['PA.IX.C.K5'],
    vars: { rwy: ['13R', '31L', '02'] },
    setup: ['Just after liftoff from KHIO Runway {rwy}, there’s a loud bang and a roar of wind: the right door has popped open. The airplane is still climbing normally.'],
    prompt: 'What should you do?',
    choices: [
      { t: 'Fly the airplane: continue to pattern altitude, fly a normal pattern and landing, then close the door on the ground.', ok: true },
      { t: 'Unbuckle and reach across to pull the door closed.', why: 'Never release your seat belt and harness to reach the door. Leave it alone.' },
      { t: 'Chop the power and land straight ahead immediately.', why: 'The AFH says don’t rush to land. A cabin door that opens in flight seldom if ever compromises the airplane’s ability to fly.' },
      { t: 'Slip toward the open door to force it shut.', why: 'A slip toward the door may open it wider. A slip away may push it closed, but flying comes first.' }
    ],
    explain: [
      'The AFH: the danger isn’t the door, it’s **the pilot’s reaction**. **Concentrate on flying the airplane.**',
      'If it opens after liftoff, **don’t rush to land**: climb to pattern altitude, fly a normal pattern, make a normal landing. Don’t release your seat belt to reach it.'
    ],
    c: ['afh:18-17'], xp: 15
  },

  // ── 14–17. Chart excerpts (Seattle sectional) ──
  {
    id: 'c-khio-block', kind: 'chart', pave: 'V', topic: 'v-airport', acs: ['PA.I.E.K2', 'PA.II.D.K1'],
    chart: { src: 'charts/khio.jpg', chart: 'Seattle', caption: 'Portland-Hillsboro (KHIO) and surroundings' },
    prompt: 'In KHIO’s data block, what does “208 L 66” tell you?',
    choices: [
      { t: 'Field elevation 208 ft; runway lights on sunset to sunrise; longest runway 6,600 ft.', ok: true },
      { t: 'Pattern altitude 208 ft AGL; left traffic; runway 6,600 ft.', why: '208 is field elevation in feet MSL. “L” is lighting, not left traffic.' },
      { t: 'Elevation 208 ft; L = lighting by pilot control; 66 = runway heading.', why: '66 is the longest runway length in hundreds of feet.' },
      { t: 'Elevation 2,080 ft; L = Class D; 66 = CTAF.', why: 'Airport elevation is shown in feet, not hundreds.' }
    ],
    explain: [
      'Data block: **elevation in feet**, **L** = lighting in operation sunset to sunrise, **66** = length of the **longest runway in hundreds of feet** (6,600). KHIO’s Runway 13R-31L is 6,600 × 150 ft.',
      '**RP 2, 31R** means right traffic for those runways. **CT – 119.3** is the tower frequency, and the **★ after it means the tower operates part-time**. The circled **C** marks the CTAF.'
    ],
    c: ['cug:p. 15', 'cug:p. 16', 'cs:KHIO'], xp: 15
  },
  {
    id: 'c-khio-classd', kind: 'chart', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.E.K2'],
    chart: { src: 'charts/khio.jpg', chart: 'Seattle', caption: 'Portland-Hillsboro (KHIO) and surroundings' },
    prompt: 'The dashed blue circle around KHIO shows “27” in a box. What is it, and is it always active?',
    choices: [
      { t: 'Class D, surface up to and including 2,700 ft MSL. Part-time: see the NOTAMs/Supplement note for its hours.', ok: true },
      { t: 'Class D up to 2,700 ft AGL, active 24 hours.', why: 'Ceilings are in hundreds of feet MSL, and the note says to check the Chart Supplement for hours.' },
      { t: 'Class C up to 2,700 ft MSL.', why: 'Class C is solid magenta. Dashed blue is Class D.' },
      { t: 'Class E surface area up to 2,700 ft.', why: 'Class E surface areas are dashed magenta.' }
    ],
    explain: [
      '**Dashed blue = Class D.** The boxed number is the **ceiling in hundreds of feet MSL**. A minus sign would mean “up to but not including.”',
      'The note “See NOTAMs/Supplement for Class D eff hrs” means it’s part-time. The Chart Supplement says Class D 1400–0600Z‡, otherwise **Class E**.'
    ],
    c: ['cug:p. 16', 'cs:KHIO'], xp: 15
  },
  {
    id: 'c-pdx-shelf', kind: 'chart', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.E.K2'],
    chart: { src: 'charts/khio.jpg', chart: 'Seattle', caption: 'East of KHIO: the Portland Class C shelf' },
    vars: { alt: ['3,000', '3,500'] },
    setup: ['You depart KHIO eastbound, climbing to {alt} MSL toward Portland. On the right side of the excerpt, a magenta “40 over 23” sits inside the Portland Class C outer shelf.'],
    prompt: 'Before you cross into that shelf at {alt}, what must you have?',
    choices: [
      { t: 'Two-way radio communication established with Portland Approach, plus an operating Mode C transponder and ADS-B Out.', ok: true },
      { t: 'An explicit “cleared into the Class C” from ATC.', why: 'An explicit clearance is the Class B rule. Class C needs two-way radio communication.' },
      { t: 'Nothing. The shelf starts at 4,000 ft.', why: '40 over 23 means ceiling 4,000 and floor 2,300 MSL. At {alt} you’re inside it.' },
      { t: 'Just a call on the tower frequency 119.3.', why: '119.3 is Hillsboro Tower. Class C is Portland Approach (the box says 118.1 within 20 NM here).' }
    ],
    explain: [
      'Class C sector altitudes are in **hundreds of feet MSL**: **40/23 = 4,000 ceiling, 2,300 floor.**',
      'To enter Class C you must **establish two-way radio communication** with ATC before entering. An altitude-reporting (**Mode C**) transponder and **ADS-B Out** are required in Class C.'
    ],
    c: ['cug:p. 16', 'cfr14:91.130(c)', 'cfr14:91.215(b)', 'cfr14:91.225(d)'], xp: 20
  },
  {
    id: 'c-mef', kind: 'chart', pave: 'V', topic: 'v-mountain', acs: ['PA.I.E.K2', 'PA.I.D.K2'],
    chart: { src: 'charts/mef-buxton.jpg', chart: 'Seattle', caption: 'Coast Range foothills near Buxton, northwest of KHIO' },
    prompt: 'What does the large blue “3⁹” tell you about this area?',
    choices: [
      { t: 'The highest terrain or obstacle in this quadrant is at or below 3,900 ft MSL (rounded up).', ok: true },
      { t: 'The minimum safe altitude here is 3,900 ft AGL.', why: 'MEF is an elevation in MSL, not a minimum altitude or an AGL value.' },
      { t: 'The highest terrain is exactly 390 ft.', why: 'The small digit is hundreds: 3⁹ = 3,900.' },
      { t: 'The MOA in this area tops out at 3,900 ft.', why: 'MEF has nothing to do with special use airspace.' }
    ],
    explain: ['The **Maximum Elevation Figure** is the highest elevation in the quadrant (30 minutes of latitude by 30 minutes of longitude), **including terrain and obstacles like towers and trees**, rounded up. The last two digits aren’t shown.'],
    think: 'At night or in reduced visibility west of KHIO, the MEF is a quick way to see how high you need to be for terrain.',
    c: ['cug:p. 12'], xp: 15
  },

  // ── 18. Endorsements / privileges quick recall ──
  {
    id: 'r-basicmed', kind: 'recall', pave: 'P', topic: 'p-basicmed', acs: ['PA.I.A.K5'],
    prompt: 'Under BasicMed, what are the aircraft and flight limits?',
    answer: ['Aircraft: authorized for **no more than 7 occupants**, **max takeoff weight 12,500 lb or less**, **no more than 6 passengers**', 'Flight: **not above 18,000 ft MSL**, **not faster than 250 KIAS**, not outside the U.S. unless that country authorizes it, and no compensation or hire', 'Course every **24 calendar months**; physician exam every **48 calendar months**'],
    explain: [], c: ['cfr14:61.113(i)', 'cfr14:61.23(c)(3)'], xp: 10
  },
  {
    id: 'r-vspeeds', kind: 'recall', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.R2', 'PA.IV.A.K2'],
    prompt: 'From your C152 POH: Vx, Vy (sea level), best glide, Vfe, Vno, and Vne?',
    answer: ['**Vx 55 KIAS** · **Vy 67 KIAS** (sea level)', '**Best glide 60 KIAS**', '**Vfe 85 KIAS** · **Vno 111 KIAS** · **Vne 149 KIAS**'],
    explain: [], c: ['poh:4-3', 'poh:3-3', 'poh:2-3'], xp: 10
  },
  {
    id: 'r-inspections', kind: 'recall', pave: 'A', topic: 'a-inspect', acs: ['PA.I.B.K1b'],
    prompt: 'Which inspections must your school’s 152 have, and how often?',
    answer: ['**Annual**: every 12 calendar months', '**100-hour**: it’s used for flight instruction for hire in an aircraft the school provides (may exceed by 10 hours only to reach an inspection)', '**Transponder**: 24 calendar months', '**ELT**: 12 calendar months, battery after 1 cumulative hour or 50% of useful life', 'For IFR only: **VOR check** 30 days, **altimeter/static** 24 calendar months'],
    explain: [], c: ['cfr14:91.409', 'cfr14:91.413', 'cfr14:91.207', 'cfr14:91.171', 'cfr14:91.411'], xp: 10
  }
];

export function itemById(id: string) {
  return ITEMS.find((i) => i.id === id);
}
