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
      { t: 'Yes. Flight reviews are good for 24 months plus a 30-day grace period.', why: 'There’s no grace period.' },
      { t: 'Yes, as long as you’re current with 3 landings in 90 days.', why: 'Currency to carry passengers and the flight review are separate requirements.' },
      { t: 'Yes, but only solo.', why: 'Without a current flight review you can’t act as PIC at all.' }
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
      { t: 'Through March 31, 2025.', why: '12 months is for commercial (second class) privileges.' }
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
      { t: 'Fly. More than 8 hours have passed, so you’re legal no matter what.', why: '8 hours is only one part of the rule. You also can’t be under the influence or at 0.04 or higher.' },
      { t: 'Fly, but only solo.', why: 'The alcohol rule applies to any crewmember, solo or not.' },
      { t: 'Fly if you feel fine after coffee.', why: 'Coffee doesn’t speed up how fast your body clears alcohol.' }
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
      { t: 'Your friend can pay all of it since you aren’t making a profit.', why: 'A private pilot may not pay less than the pro rata share.' },
      { t: 'Nothing. Private pilots can’t share costs.', why: 'Sharing is allowed, just not less than your share.' },
      { t: 'Your friend can pay everything if you log it as a charity flight.', why: 'Charity flights have their own rules under §91.146.' }
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
      { t: 'No. Any compensation makes it a commercial flight.', why: '§61.113(b) specifically allows flights incidental to business or employment.' },
      { t: 'Yes, and you can bring your client along and bill them.', why: 'You can’t carry passengers or property for compensation or hire.' },
      { t: 'Only if you hold a second-class medical.', why: 'The medical class doesn’t change private pilot privileges.' }
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
      { t: 'Yes, until October 15, 2027.', why: 'An annual covers the preceding 12 calendar months, so it ran out at the end of October 2026.' },
      { t: 'Yes. The 100-hour inspection replaces the annual.', why: 'A 100-hour doesn’t substitute for an annual.' },
      { t: 'Yes, for one more month of grace.', why: 'There’s no grace period.' }
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
      { t: 'No issue. The 10-hour allowance covers lessons.', why: 'The 10 hours may be used only en route to where the inspection can be done.' },
      { t: 'No issue. 100-hour inspections are only for charter flights.', why: 'They also apply to flight instruction for hire in an aircraft the instructor provides.' },
      { t: 'Fly solo instead. Solo flights never need a 100-hour.', why: 'That depends on how the aircraft is being used; ask your school. The lesson plan here is the problem.' }
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
      { t: 'No. Every installed item must work.', why: 'That isn’t the rule without an MEL. §91.213(d) allows flight with some equipment inoperative.' },
      { t: 'Yes, no action needed at all.', why: 'Inoperative equipment must be removed or deactivated and placarded.' },
      { t: 'No. A landing light is required for all flights.', why: '§91.205 requires a landing light only for night flight for hire.' }
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
      { t: 'No problem until civil twilight ends.', why: 'Position lights are required from sunset, not from the end of civil twilight.' },
      { t: 'No problem if your strobes work.', why: 'Anticollision lights don’t replace required position lights.' },
      { t: 'No problem for a Part 141 student.', why: 'The equipment rules apply to everyone.' }
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
      { t: '855 ft ground roll; 1,600 ft total', why: 'That’s the 3,000 ft row at 0 °C.' },
      { t: '810 ft ground roll; 1,495 ft total', why: 'That’s sea level at 30 °C.' },
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
      { t: 'About 700 fpm the whole way', why: '700 fpm is sea level at 20 °C.' },
      { t: 'About 505 fpm at 8,000; 415 at 10,000', why: 'Those are the 4,000 and 6,000 ft values.' },
      { t: 'About 440 fpm at 8,000; 340 at 10,000', why: 'Those are the −20 °C values.' }
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
      { t: 'Accept 31L. The 12-knot crosswind figure is a limitation you can ignore.', why: 'It’s a demonstrated value, not a limitation, but about 20–28 knots of crosswind is far beyond it.' },
      { t: 'Use 13R for the longer runway.', why: 'Length doesn’t fix an almost direct crosswind.' },
      { t: 'You must use the runway the tower assigns.', why: 'The AIM says if you prefer a different runway, advise ATC.' }
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
      { t: 'Go. Any drop under 200 RPM is fine.', why: 'The POH limit is 125 RPM drop on either mag and 50 RPM differential.' },
      { t: 'Go, but only fly on the right magneto.', why: 'You can’t take off with a failed runup check.' },
      { t: 'Go if the engine sounds smooth.', why: 'Smooth isn’t the test. The numbers are out of limits.' }
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
      { t: 'Aft CG stalls at a higher speed; forward CG is less stable.', why: 'It’s the reverse.' },
      { t: 'CG position only matters for weight, not handling.', why: 'CG changes stall speed, stability, and control forces.' },
      { t: 'Forward CG cruises faster because of less drag.', why: 'Aft CG has less tail-down load and less drag.' }
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
      { t: 'Probably a gauge problem. Continue to destination.', why: 'That’s the case only if oil temperature stays normal.' },
      { t: 'Add full power to get to an airport faster.', why: 'High power on a failing engine speeds the failure.' },
      { t: 'Switch magnetos to see if it improves.', why: 'Mags don’t affect oil pressure.' }
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
      { t: 'Master off and on to reset it, then continue.', why: 'That’s the low-voltage procedure, not excessive charge.' },
      { t: 'Ignore it. A full charge means the battery is healthy.', why: 'Overcharging can damage the battery and electronics.' },
      { t: 'Turn on everything to use up the extra charge.', why: 'Not in the POH. Shed load instead.' }
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
      { t: 'Master switch off first.', why: 'That’s the electrical fire memory item. For an engine fire, cut off the fuel first.' },
      { t: 'Open all vents to clear the smoke.', why: 'The POH closes cabin heat and air (except wing root vents).' },
      { t: 'Dive at Vne to blow out the fire.', why: 'The POH says 85 KIAS, increasing speed only if needed to find an incombustible mixture.' }
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
      { t: 'Stop cranking and get out immediately.', why: 'The POH’s first step is to continue cranking.' },
      { t: 'Turn the master off and wait.', why: 'Not the first step.' },
      { t: 'Prime more to keep it running.', why: 'More fuel feeds the fire.' }
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
      { t: 'Electrical failure: all gyros are out.', why: 'The 152’s attitude and heading indicators are vacuum-driven. The turn coordinator is electric.' },
      { t: 'Pitot blockage: airspeed is now unreliable.', why: 'Pitot-static instruments don’t use vacuum.' },
      { t: 'Nothing. A low reading is normal at altitude.', why: 'Normal suction is 4.5–5.4 in. Hg.' }
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
      { t: 'Pull up steeply to climb above the clouds.', why: 'Steep pitch changes in cloud invite loss of control.' },
      { t: 'Bank steeply to turn around quickly.', why: 'Steep banks in IMC lead to a graveyard spiral. The POH uses standard rate.' },
      { t: 'Descend until you see the ground.', why: 'Descending blind near terrain is how CFIT happens.' }
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
      { t: 'Land straight in at 75 KIAS with no flaps.', why: 'The POH uses a slow inspection pass and a 55 KIAS full-flap final.' },
      { t: 'Shut the engine down first to simulate a forced landing.', why: 'Keep the power. That’s the point of a precautionary landing.' },
      { t: 'Overfly at pattern altitude at cruise speed.', why: 'The POH inspection pass is slow, at 60 KIAS with 20° flaps.' }
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
      { t: 'Flaps up, stall it in as high as possible.', why: 'The POH uses 30° flaps and a controlled 300 fpm descent.' },
      { t: 'Keep the doors closed to stay dry.', why: 'Unlatch the doors so you can get out.' },
      { t: 'Land fast to skim across the water.', why: 'Touch down in a level attitude at 300 fpm descent, not fast.' }
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
      { t: 'Continue. A little ice is fine for a short time.', why: 'The 152 is prohibited from known icing. Get out now.' },
      { t: 'Extend flaps to increase lift.', why: 'The POH says leave flaps retracted: flap extension could cost elevator effectiveness with tail ice.' },
      { t: 'Reduce power to slow the ice buildup.', why: 'The POH says open the throttle to increase engine speed.' }
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
      { t: 'Climb so the cold air puts it out.', why: 'Not in the POH. Land as soon as possible.' },
      { t: 'Slip toward the fire.', why: 'Slip to keep the flames away from the fuel tank and cabin.' },
      { t: 'Extend full flaps to slow down.', why: 'The POH says land with flaps retracted.' }
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
      { t: 'Both. Any reply establishes communication.', why: 'Without your call sign, communication isn’t established.' },
      { t: 'Neither. You need “cleared into the Class D.”', why: 'A clearance is required for Class B, not D.' },
      { t: 'Only B.', why: 'B didn’t identify you.' }
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
      { t: 'Yes. A squawk code means you’re cleared.', why: 'A squawk code isn’t a Class B clearance.' },
      { t: 'Yes. Two-way communication is enough.', why: 'That’s the Class C and D rule.' },
      { t: 'Yes, if you stay below 3,500.', why: 'An altitude instruction isn’t a clearance into Class B.' }
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
      { t: 'Nothing. It’s Class D 24 hours.', why: 'KHIO’s Class D is in effect only when the tower operates (1400–0600Z‡).' },
      { t: 'The airport is closed. Divert to PDX.', why: 'The airport stays open. It becomes a nontowered operation.' },
      { t: 'Call Ground on 121.7 for landing clearance.', why: 'Ground is part of the tower, which is closed.' }
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
      { t: 'Accept it. The PIC must follow ATC instructions.', why: 'You may decline LAHSO, and the AIM says students should not participate.' },
      { t: 'Accept it, then use the whole runway if needed.', why: 'Accepting a LAHSO clearance means you must hold short.' },
      { t: 'Go around without saying anything.', why: 'Tell ATC immediately that you’re unable.' }
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
      { t: 'Yes, as long as visibility is at least 1 SM.', why: 'True at most airports, but PDX is excluded.' },
      { t: 'Yes, at night only.', why: 'Night SVFR needs an instrument rating, and PDX is excluded anyway.' },
      { t: 'Yes, but only with 3 SM.', why: 'SVFR is 1 SM, but PDX is excluded.' }
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
      { t: 'Overfly the TFR at a high altitude. They only apply near the ground.', why: 'A TFR has published dimensions. Stay out unless the NOTAM allows otherwise.' },
      { t: 'FU means funnel cloud, so cancel.', why: 'FU means smoke.' },
      { t: 'TFRs are advisory for VFR.', why: 'They’re regulatory.' }
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
      { t: 'VFR now: 4 SM is above 3 SM.', why: 'The 700 ft ceiling makes it IFR.' },
      { t: 'BR means broken clouds.', why: 'BR is mist.' },
      { t: 'FM1900 means the TAF expires at 1900Z.', why: 'FM means a significant change starting at that time.' }
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
      { t: 'Upslope fog.', why: 'Upslope fog needs air pushed up rising terrain.' },
      { t: 'Steam fog.', why: 'Steam fog forms over water.' }
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
      { t: 'Rotate after its rotation point.', why: 'Its vortices start where it rotated.' },
      { t: 'Stay low after takeoff until clear.', why: 'Stay above its climb path.' },
      { t: 'No issue: vortices only form on landing.', why: 'Vortices begin at rotation.' }
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
      { t: 'You do: you saw it first.', why: 'Not how the rule works.' },
      { t: 'Whoever is faster.', why: 'Speed doesn’t decide right-of-way.' },
      { t: 'Both turn left.', why: 'Head-on traffic turns right. Converging: the aircraft on the right has the right-of-way.' }
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
      { t: 'They’re right: ADS-B shows every aircraft.', why: 'Garmin warns it’s an aid only.' },
      { t: 'Only gliders don’t show up.', why: 'Many aircraft may not appear, for several reasons.' },
      { t: 'Turn off the display to reduce distraction.', why: 'It’s a useful aid; just don’t rely on it alone.' }
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
      { t: 'Standby until the runway, then ALT.', why: 'Garmin and the AIM say ALT on the ground too. There’s no pilot-selectable ground mode.' },
      { t: 'ON (no altitude reporting) to avoid cluttering ATC.', why: 'ALT mode is required in certain airspace and recommended on the surface.' },
      { t: 'OFF until airborne.', why: 'KHIO’s Chart Supplement says operate transponders with altitude reporting on all airport surfaces.' }
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
      { t: 'Left traffic for 17, east of the runway.', why: 'At Bend, fixed-wing traffic stays west: right traffic for 17, left for 35. Helicopters use the east side.' },
      { t: 'Straight in only.', why: 'The Chart Supplement specifies the pattern side.' },
      { t: 'Overfly at 500 ft to check the windsock.', why: 'Stay at pattern altitude. Watch for glider and helicopter traffic.' }
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
      { t: 'Fly under the anvil where it’s clear.', why: 'Severe and extreme clear air turbulence can exist under the anvil.' },
      { t: 'Go through quickly at Va.', why: 'Never penetrate a thunderstorm.' },
      { t: '5 miles is enough in a light airplane.', why: '20 miles for a severe storm or intense echo.' }
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
      { t: 'Fair weather. Lenticular clouds mean smooth air everywhere.', why: 'They’re smooth looking, but they indicate wave activity.' },
      { t: 'An approaching cold front.', why: 'Stationary lenticular clouds point to mountain wave.' },
      { t: 'Fog forming.', why: 'These are high clouds indicating wave.' }
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
      { t: 'About 105° (add it)', why: 'East is least: subtract easterly variation.' },
      { t: '090°: variation only matters near the pole', why: 'It applies everywhere.' },
      { t: 'About 076° true', why: 'Magnetic, not true.' }
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
      { t: 'Exactly when it reads 360°.', why: 'In a northerly turn the compass leads.' },
      { t: 'After it passes 360°.', why: 'That’s the correction for southerly turns.' },
      { t: 'It doesn’t matter in the Northern Hemisphere.', why: 'Turning errors are significant here.' }
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
      { t: 'Open the window but keep the heat on.', why: 'The heater is the likely source. Shut it off.' },
      { t: 'It’s fatigue. Continue.', why: 'Headache, drowsiness, and exhaust smell point to CO.' },
      { t: 'Climb to get more oxygen.', why: 'Climbing makes hypoxia worse.' }
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
      { t: 'Yes. Oxygen is only needed above 14,000.', why: 'The 30-minute rule starts above 12,500.' },
      { t: 'Yes, for up to an hour.', why: '30 minutes is the limit.' },
      { t: 'Only passengers need oxygen.', why: 'The rule applies to required crew.' }
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
      { t: 'You feel lower, so you fly a high approach.', why: 'Featureless terrain makes you feel higher.' },
      { t: 'Autokinesis.', why: 'Autokinesis is a fixed light appearing to move.' },
      { t: 'Somatogravic.', why: 'That comes from acceleration.' }
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
      { t: 'Go. You can turn back if it gets bad.', why: 'With icing in clouds over the passes, “turn back” may not be available.' },
      { t: 'Go higher to stay above the icing.', why: 'Climbing over icing clouds in a 152 is a trap with no escape.' },
      { t: 'Let your passenger decide.', why: 'You are the PIC: you’re the final authority.' }
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
      { t: '*L: left traffic only. Bend is towered.', why: '*L is about lighting. Magenta means no tower.' },
      { t: '*L: lights on at all times. 123.0 is the tower.', why: 'Magenta airports don’t have control towers.' },
      { t: '*L: pilot-controlled lighting unavailable. Bend is Class D.', why: 'Bend is Class E per the Chart Supplement.' }
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
      { t: 'To 5,600 AGL.', why: 'Class D ceilings are charted in MSL.' },
      { t: 'To 560 ft MSL.', why: 'Charted in hundreds of feet: 56 = 5,600.' },
      { t: 'It’s Class C to 5,600.', why: 'Dashed blue is Class D.' }
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
      { t: 'The boundary of a MOA.', why: 'MOAs are labeled by name.' },
      { t: 'A Victor airway.', why: 'Airways are labeled V-plus-number.' },
      { t: 'The 14.5° glide path to Eugene.', why: 'No such chart symbol.' }
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
      { t: 'Rotating beacon on 24 hours.', why: 'A star next to a frequency means part-time operation.' },
      { t: 'Class C airspace.', why: 'Airspace isn’t shown by stars.' },
      { t: 'Tower frequencies reserved for jets.', why: 'Not what the star means.' }
    ],
    explain: ['A **star** next to the tower frequency indicates **part-time operation**. Eugene: tower 1400–0730Z‡; Class D during those hours, Class E otherwise. **374** = elevation, **L** = lighting sunset to sunrise, **80** = longest runway 8,000 ft (8,009), **122.95** = UNICOM.'],
    c: ['cug:p. 15', 'cs:KEUG'], xp: 15
  }
];
