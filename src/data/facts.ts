// Quick-recall fact tables. Each row becomes one question: multiple choice in sessions
// (wrong options come from other rows of the same table) and a flashcard in Drills.
// Every row was checked against the cited source text.
import { DISTRACTORS } from './distractors';
import type { Item, Pave } from './types';

interface Row {
  q: string; // question
  a: string; // short correct answer (also used as a distractor for sibling rows)
  more?: string[]; // fuller answer for the flashcard
  c: string[];
  x?: string[]; // extra hand-written distractors
  topic?: string; // overrides the table's topic
}
interface Table {
  id: string;
  pave: Pave;
  topic: string;
  acs: string[];
  emergency?: boolean;
  rows: Row[];
}

const T: Table[] = [
  {
    id: 'vfrmin', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1'],
    rows: [
      { q: 'Basic VFR minimums in Class B airspace?', a: '3 SM, clear of clouds', c: ['cfr14:91.155(a)'] },
      { q: 'Basic VFR minimums in Class C airspace?', a: '3 SM; 500 below, 1,000 above, 2,000 horizontal', c: ['cfr14:91.155(a)'] },
      { q: 'Basic VFR minimums in Class E below 10,000 ft MSL?', a: '3 SM; 500 below, 1,000 above, 2,000 horizontal', c: ['cfr14:91.155(a)'], x: ['1 SM; clear of clouds'] },
      { q: 'Basic VFR minimums in Class E at or above 10,000 ft MSL?', a: '5 SM; 1,000 below, 1,000 above, 1 SM horizontal', c: ['cfr14:91.155(a)'] },
      { q: 'Class G, 1,200 ft AGL or less, by day: VFR minimums?', a: '1 SM, clear of clouds', c: ['cfr14:91.155(a)'] },
      { q: 'Class G, 1,200 ft AGL or less, at night: VFR minimums?', a: '3 SM; 500 below, 1,000 above, 2,000 horizontal', c: ['cfr14:91.155(a)'], x: ['1 SM, clear of clouds'] },
      { q: 'Class G, more than 1,200 AGL but below 10,000 MSL, by day: VFR minimums?', a: '1 SM; 500 below, 1,000 above, 2,000 horizontal', c: ['cfr14:91.155(a)'] },
      { q: 'Class G, more than 1,200 AGL and at or above 10,000 MSL: VFR minimums?', a: '5 SM; 1,000 below, 1,000 above, 1 SM horizontal', c: ['cfr14:91.155(a)'] },
      { q: 'To take off or land under basic VFR in a Class D surface area, what ceiling and ground visibility do you need?', a: 'Ceiling at least 1,000 ft and ground visibility at least 3 SM', c: ['cfr14:91.155(c)', 'cfr14:91.155(d)'], x: ['Ceiling at least 500 ft and 1 SM', 'Ceiling at least 3,000 ft and 5 SM', 'No ceiling requirement; 3 SM flight visibility'] }
    ]
  },
  {
    id: 'lightgun', pave: 'V', topic: 'v-lostcomm', acs: ['PA.III.A.K3'],
    rows: [
      { q: 'Light gun: steady green to an aircraft in flight?', a: 'Cleared to land', c: ['aim:4-3-13'] },
      { q: 'Light gun: steady green to an aircraft on the ground?', a: 'Cleared for takeoff', c: ['aim:4-3-13'] },
      { q: 'Light gun: flashing green to an aircraft in flight?', a: 'Return for landing (followed by steady green at the proper time)', c: ['aim:4-3-13'] },
      { q: 'Light gun: flashing green to an aircraft on the ground?', a: 'Cleared for taxi', c: ['aim:4-3-13'] },
      { q: 'Light gun: steady red to an aircraft in flight?', a: 'Give way to other aircraft and continue circling', c: ['aim:4-3-13'] },
      { q: 'Light gun: steady red to an aircraft on the ground?', a: 'Stop', c: ['aim:4-3-13'] },
      { q: 'Light gun: flashing red to an aircraft in flight?', a: 'Airport unsafe, do not land', c: ['aim:4-3-13'] },
      { q: 'Light gun: flashing red to an aircraft on the ground?', a: 'Taxi clear of the runway in use', c: ['aim:4-3-13'] },
      { q: 'Light gun: flashing white to an aircraft on the ground?', a: 'Return to starting point on airport', c: ['aim:4-3-13'] },
      { q: 'Light gun: alternating red and green?', a: 'Exercise extreme caution', c: ['aim:4-3-13'] },
      { q: 'With no radio, how do you acknowledge a light signal in daylight? At night?', a: 'Day: move ailerons or rudder. Night: blink landing or navigation lights.', c: ['aim:4-3-13'], x: ['Day: flash landing light. Night: rock wings.', 'Squawk ident', 'Click the mic 3 times'] }
    ]
  },
  {
    id: 'vspeeds', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.R2', 'PA.IV.A.K2'],
    rows: [
      { q: 'C152 Vne (never exceed)?', a: '149 KIAS', c: ['poh:2-3'] },
      { q: 'C152 Vno (max structural cruising)?', a: '111 KIAS', c: ['poh:2-3'] },
      { q: 'C152 Va (maneuvering) at 1,670 lb?', a: '104 KIAS', c: ['poh:2-3'] },
      { q: 'C152 Va at 1,350 lb?', a: '93 KIAS', more: ['93 KIAS. Va goes down as weight goes down (98 at 1,500 lb).'], c: ['poh:2-3'] },
      { q: 'C152 Vfe (max flap extended)?', a: '85 KIAS', c: ['poh:2-3'] },
      { q: 'C152 Vx (best angle of climb)?', a: '55 KIAS', c: ['poh:4-3'] },
      { q: 'C152 Vy (best rate of climb) at sea level?', a: '67 KIAS', c: ['poh:4-3'] },
      { q: 'C152 best rate of climb speed at 10,000 ft?', a: '61 KIAS', c: ['poh:4-3'] },
      { q: 'C152 best glide speed?', a: '60 KIAS', c: ['poh:3-3'] },
      { q: 'C152 emergency landing without power: approach speed flaps up / flaps down?', a: '65 KIAS flaps up, 60 KIAS flaps down', c: ['poh:3-3'] },
      { q: 'C152 precautionary landing with engine power: final approach speed?', a: '55 KIAS', c: ['poh:3-3'] },
      { q: 'C152 short-field approach speed (flaps 30°)?', a: '54 KIAS', c: ['poh:4-3'] },
      { q: 'C152 normal approach speed with flaps 30°?', a: '55–65 KIAS', c: ['poh:4-3'], x: ['70–80 KIAS', '60–70 KIAS'] },
      { q: 'C152 maximum demonstrated crosswind?', a: '12 knots', more: ['12 knots, which the POH notes is not a limitation. It’s what was demonstrated in testing, so treat it as a guide to your own skill.'], c: ['poh:4-3', 'poh:5-11'], x: ['15 knots', '17 knots', '10 knots'] },
      { q: 'C152 airspeed indicator white arc?', a: '35–85 KIAS (full flap operating range)', c: ['poh:2-4'] },
      { q: 'C152 airspeed indicator green arc?', a: '40–111 KIAS (normal operating range)', c: ['poh:2-4'] },
      { q: 'C152 airspeed indicator yellow arc?', a: '111–149 KIAS (caution range, smooth air only)', c: ['poh:2-4'] },
      { q: 'C152 approved flap settings for takeoff?', a: '0° to 10°', c: ['poh:2-8'], x: ['0° to 20°', '10° to 30°'] }
    ]
  },
  {
    id: 'c152limits', pave: 'A', topic: 'a-wb', acs: ['PA.I.F.R2', 'PA.I.G.K1'],
    rows: [
      { q: 'C152 maximum takeoff weight?', a: '1,670 lb', c: ['poh:2-6'] },
      { q: 'C152 maximum ramp weight?', a: '1,675 lb', c: ['poh:2-6'] },
      { q: 'C152 baggage limits?', a: 'Area 1: 120 lb, Area 2: 40 lb, combined 120 lb', c: ['poh:2-6'], x: ['Area 1: 100 lb, Area 2: 50 lb', '200 lb total'] },
      { q: 'C152 aft CG limit?', a: '36.5 in aft of datum at all weights', c: ['poh:2-6'] },
      { q: 'C152 CG reference datum?', a: 'Front face of the firewall', c: ['poh:2-6'], x: ['Tip of the propeller spinner', 'Leading edge of the wing'] },
      { q: 'C152 flight load factor limits, flaps up?', a: '+4.4g / −1.76g', c: ['poh:2-7'], x: ['+3.8g / −1.52g', '+6.0g / −3.0g'] },
      { q: 'C152 flight load factor limit, flaps down?', a: '+3.5g', c: ['poh:2-7'] },
      { topic: 'a-fuel', q: 'C152 standard tanks: total and usable fuel?', a: '26 gal total, 24.5 gal usable', c: ['poh:2-7'] },
      { q: 'C152 long-range tanks: total and usable fuel?', a: '39 gal total, 37.5 gal usable', c: ['poh:2-7'] },
      { topic: 'a-fuel', q: 'C152 approved fuel grades?', a: '100LL (blue) or grade 100 (green)', c: ['poh:2-8'], x: ['80/87 (red) or 100LL (blue)', 'Jet A or 100LL'] },
      { q: 'C152 max engine speed?', a: '2,550 RPM', c: ['poh:2-4'] },
      { q: 'C152 oil pressure: minimum, normal, maximum?', a: '25 psi min, 60–90 psi normal, 115 psi max', c: ['poh:2-5'] },
      { q: 'C152 max oil temperature?', a: '245 °F', c: ['poh:2-5'], x: ['220 °F', '260 °F'] },
      { q: 'C152 normal suction (vacuum) range?', a: '4.5–5.4 in. Hg', c: ['poh:2-5'], x: ['2.0–3.0 in. Hg', '6.0–7.0 in. Hg'] },
      { q: 'C152 electrical system?', a: '28-volt DC, 24-volt battery, 60-amp alternator', c: ['poh:7-22'], x: ['14-volt DC, 12-volt battery, 60-amp alternator', '28-volt DC, 12-volt battery, 40-amp alternator'] },
      { q: 'What does the C152 master switch NOT control?', a: 'Engine ignition, clock, and flight hour recorder', c: ['poh:7-22'], x: ['Radios and lights', 'Fuel quantity gauges'] }
    ]
  },
  {
    id: 'inspections', pave: 'A', topic: 'a-inspect', acs: ['PA.I.B.K1b'],
    rows: [
      { q: 'Annual inspection interval?', a: 'Within the preceding 12 calendar months', c: ['cfr14:91.409(a)'] },
      { q: 'When is a 100-hour inspection required?', a: 'Carrying persons for hire, or flight instruction for hire in an aircraft the instructor provides', c: ['cfr14:91.409(b)'] },
      { q: 'How far may the 100-hour inspection be exceeded?', a: 'Up to 10 hours, only to reach a place where it can be done', c: ['cfr14:91.409(b)'], x: ['Up to 25 hours for any reason', 'It may never be exceeded'] },
      { q: 'Transponder test and inspection interval?', a: 'Within the preceding 24 calendar months', c: ['cfr14:91.413'] },
      { q: 'ELT inspection interval?', a: 'Within 12 calendar months', c: ['cfr14:91.207(d)'] },
      { q: 'When must ELT batteries be replaced or recharged?', a: 'After more than 1 cumulative hour of use, or at 50% of useful life', c: ['cfr14:91.207(c)'] },
      { q: 'Altimeter/static system check: interval and when required?', a: '24 calendar months, for IFR in controlled airspace', c: ['cfr14:91.411'] },
      { q: 'VOR check interval for IFR?', a: 'Within the preceding 30 days', c: ['cfr14:91.171'], x: ['Within 10 days', 'Within 90 days'] },
      { topic: 'a-reg', q: 'How long is an aircraft registration valid?', a: 'Seven years', c: ['cfr14:47.40(a)'], x: ['Three years', 'Indefinitely'] }
    ]
  },
  {
    id: 'pilotreq', pave: 'P', topic: 'p-medical', acs: ['PA.I.A.K1', 'PA.I.A.K3'],
    rows: [
      { q: 'Third-class medical, under 40 at the exam: how long for private privileges?', a: 'Until the end of the 60th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'Third-class medical, 40 or older at the exam: how long for private privileges?', a: 'Until the end of the 24th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'Second-class medical for commercial privileges lasts…?', a: 'Until the end of the 12th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'First-class medical for ATP privileges, 40 or older?', a: 'Until the end of the 6th month after the exam month', c: ['cfr14:61.23(d)'] },
      { topic: 'p-legal', q: 'Flight review: how often and how long?', a: 'Every 24 calendar months; at least 1 hr ground + 1 hr flight', c: ['cfr14:61.56'] },
      { topic: 'p-currency', q: 'Passenger-carrying currency (day)?', a: '3 takeoffs and landings in the preceding 90 days, same category and class', c: ['cfr14:61.57(a)'] },
      { topic: 'p-currency', q: 'Night passenger currency?', a: '3 takeoffs and landings to a full stop, 1 hr after sunset to 1 hr before sunrise, within 90 days', c: ['cfr14:61.57(b)'] },
      { topic: 'p-basicmed', q: 'BasicMed: how often the online course and the physician exam?', a: 'Course every 24 calendar months; exam every 48 calendar months', c: ['cfr14:61.23(c)(3)(i)'] },
      { topic: 'p-imsafe', q: 'Alcohol rule for crewmembers?', a: 'Not within 8 hours of drinking, not under the influence, not at 0.04 or higher', c: ['cfr14:91.17(a)'] },
      { topic: 'p-resp', q: 'What documents must you carry to act as PIC?', a: 'Pilot certificate, medical (or BasicMed), and photo ID, in your possession or readily accessible', c: ['cfr14:61.3'], x: ['Pilot certificate and logbook', 'Pilot certificate only'] },
      { topic: 'p-cert', q: 'Minimum age for a private pilot certificate (airplane)?', a: '17', c: ['cfr14:61.103(a)'], x: ['16', '18'] }
    ]
  },
  {
    id: 'ops', pave: 'E', topic: 'e-regs', acs: ['PA.I.A.K2', 'PA.I.D.K3c'],
    rows: [
      { topic: 'v-fuelreq', q: 'VFR fuel reserve during the day?', a: '30 minutes at normal cruise', c: ['cfr14:91.151(a)'] },
      { topic: 'v-fuelreq', q: 'VFR fuel reserve at night?', a: '45 minutes at normal cruise', c: ['cfr14:91.151(a)'] },
      { q: 'Oxygen: cabin altitude above 12,500 up to 14,000 ft?', a: 'Required crew must use it for the part of the flight over 30 minutes', c: ['cfr14:91.211(a)'] },
      { q: 'Oxygen: cabin altitude above 14,000 ft?', a: 'Required crew must use it the entire time', c: ['cfr14:91.211(a)'] },
      { q: 'Oxygen: cabin altitude above 15,000 ft?', a: 'Each occupant must be provided with oxygen', c: ['cfr14:91.211(a)'] },
      { q: 'Minimum safe altitude over a congested area?', a: '1,000 ft above the highest obstacle within 2,000 ft horizontally', c: ['cfr14:91.119(b)'] },
      { q: 'Minimum safe altitude over other than congested areas?', a: '500 ft above the surface', more: ['500 ft AGL. Over open water or sparsely populated areas: not closer than 500 ft to any person, vessel, vehicle, or structure.'], c: ['cfr14:91.119(c)'] },
      { q: 'Minimum safe altitude anywhere?', a: 'An altitude allowing an emergency landing without undue hazard if the engine fails', c: ['cfr14:91.119(a)'] },
      { q: 'Speed limit below 10,000 ft MSL?', a: '250 KIAS', c: ['cfr14:91.117(a)'] },
      { q: 'Speed limit within 4 NM of the primary airport of Class C or D, at or below 2,500 AGL?', a: '200 KIAS', c: ['cfr14:91.117(b)'] },
      { q: 'How does 14 CFR 1.1 define “night”?', a: 'End of evening civil twilight to beginning of morning civil twilight', c: ['cfr14:1.1'] },
      { q: 'When are position lights required?', a: 'Sunset to sunrise', c: ['cfr14:91.209(a)'] },
      { topic: 'v-nav', q: 'VFR cruising altitude on a magnetic course of 0–179°, above 3,000 AGL?', a: 'Odd thousands + 500 (e.g. 5,500)', c: ['cfr14:91.159(a)'] },
      { topic: 'v-nav', q: 'VFR cruising altitude on a magnetic course of 180–359°, above 3,000 AGL?', a: 'Even thousands + 500 (e.g. 6,500)', c: ['cfr14:91.159(a)'] }
    ]
  },
  {
    id: 'rightofway', pave: 'E', topic: 'e-airportops', acs: ['PA.III.B.K3'],
    rows: [
      { q: 'Who has the right-of-way over all other traffic?', a: 'An aircraft in distress', c: ['cfr14:91.113(c)'] },
      { q: 'Two airplanes converging at about the same altitude: who has the right-of-way?', a: 'The aircraft to the other’s right', c: ['cfr14:91.113(d)'] },
      { q: 'Approaching head-on: what do both pilots do?', a: 'Each alters course to the right', c: ['cfr14:91.113(e)'] },
      { q: 'Overtaking: who has the right-of-way?', a: 'The aircraft being overtaken; the overtaking aircraft passes well clear to the right', c: ['cfr14:91.113(f)'] },
      { q: 'Your 152 converges with a glider. Who has the right-of-way?', a: 'The glider', c: ['cfr14:91.113(d)'] },
      { q: 'Which category has the right-of-way over all other categories?', a: 'A balloon', c: ['cfr14:91.113(d)'] },
      { q: 'Two aircraft approaching to land: who has the right-of-way?', a: 'The lower one, but it may not cut in front of or overtake an aircraft on final', c: ['cfr14:91.113(g)'] }
    ]
  },
  {
    id: 'equip', pave: 'A', topic: 'a-inop', acs: ['PA.I.B.K3'],
    rows: [
      { q: 'Name the 14 CFR 91.205(b) day VFR instruments for your 152 (ATOMATOFLAMES).', a: 'Airspeed, tachometer, oil pressure, magnetic direction indicator, altimeter, oil temperature, fuel gauges, seat belts and shoulder harnesses, ELT, anticollision lights (if required)', more: ['Airspeed indicator, Tachometer, Oil pressure gauge, Manifold pressure (altitude engines, N/A), Altimeter, Temperature gauge (liquid-cooled, N/A), Oil temperature gauge, Fuel gauges, Landing gear position (retractable, N/A), Anticollision lights (part 23 after 3/11/1996), Magnetic direction indicator, ELT (if required), Safety belts/shoulder harnesses'], c: ['cfr14:91.205(b)'], x: ['Airspeed, altimeter, attitude indicator, heading indicator, turn coordinator, VSI', 'Airspeed, altimeter, compass, GPS, transponder'] },
      { q: 'What does 14 CFR 91.205(c) add for night VFR?', a: 'Position lights, anticollision lights, landing light (if for hire), adequate electrical source, spare fuses', c: ['cfr14:91.205(c)'], x: ['Attitude indicator, heading indicator, and a flashlight', 'Landing light and pitot heat'] },
      { q: 'Without an MEL, who determines that inoperative equipment isn’t a hazard?', a: 'A certificated pilot or a person qualified to maintain the aircraft', c: ['cfr14:91.213(d)(4)'], x: ['Only an FAA inspector', 'Only an A&P with IA'] },
      { q: 'If inoperative equipment is deactivated rather than removed, what’s required?', a: 'Placard it “Inoperative” (and record any maintenance)', c: ['cfr14:91.213(d)(3)'], x: ['Nothing, if it’s not required', 'Call the FSDO'] }
    ]
  },
  {
    id: 'airspace-entry', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K1'],
    rows: [
      { q: 'What do you need to enter Class B?', a: 'An ATC clearance (and at least a private certificate, or a student with endorsements)', c: ['cfr14:91.131(a)', 'cfr14:91.131(b)'] },
      { q: 'What do you need to enter Class C?', a: 'Two-way radio communication established before entering, Mode C, and ADS-B Out', c: ['cfr14:91.130(c)', 'cfr14:91.215(b)', 'cfr14:91.225(d)'] },
      { q: 'What do you need to enter Class D?', a: 'Two-way radio communication established before entering', c: ['cfr14:91.129(c)'] },
      { q: 'Where is a Mode C transponder required around a Class B primary airport?', a: 'Within 30 NM, from the surface up to 10,000 ft MSL', c: ['cfr14:91.215(b)'], x: ['Within 10 NM, surface to 4,000 AGL', 'Within 20 NM, surface to 18,000 MSL'] },
      { q: 'What does a magenta “40 over 23” inside a Class C sector mean?', a: 'Ceiling 4,000 ft MSL, floor 2,300 ft MSL', c: ['cug:p. 16'], x: ['Ceiling 40,000, floor 23,000', 'Ceiling 4,000 AGL, floor 2,300 AGL'] }
    ]
  },
  {
    id: 'codes', pave: 'V', topic: 'v-transponder', acs: ['PA.III.A.K4', 'PA.IX.B.K6'],
    emergency: true,
    rows: [
      { q: 'Standard VFR transponder code?', a: '1200', c: ['aim:4-1-20'] },
      { q: 'Transponder code for loss of two-way radio?', a: '7600', c: ['aim:6-4-2'] },
      { q: 'Transponder code for an emergency (when not already talking to ATC)?', a: '7700', c: ['aim:6-3-2'] },
      { q: 'Transponder code 7500 means…?', a: 'Hijacking (air piracy)', c: ['aim:4-1-20'], x: ['Radio failure', 'Emergency'] },
      { q: 'Emergency frequency you can always call?', a: '121.5 MHz', c: ['aim:6-3-1'], x: ['122.75 MHz', '123.45 MHz'] },
      { q: 'How do you start a distress call? An urgency call?', a: 'MAYDAY, MAYDAY, MAYDAY · PAN-PAN, PAN-PAN, PAN-PAN', c: ['aim:6-3-2'], x: ['Emergency, emergency · Help, help', 'SOS · CQ'] }
    ]
  },
  {
    id: 'attitudes', pave: 'P', topic: 'p-attitudes', acs: ['PA.I.H.R2'],
    rows: [
      { q: 'Antidote for anti-authority (“Don’t tell me.”)?', a: 'Follow the rules. They are usually right.', c: ['phak:2-5'] },
      { q: 'Antidote for impulsivity (“Do it quickly.”)?', a: 'Not so fast. Think first.', c: ['phak:2-5'] },
      { q: 'Antidote for invulnerability (“It won’t happen to me.”)?', a: 'It could happen to me.', c: ['phak:2-5'] },
      { q: 'Antidote for macho (“I can do it.”)?', a: 'Taking chances is foolish.', c: ['phak:2-5'] },
      { q: 'Antidote for resignation (“What’s the use?”)?', a: 'I’m not helpless. I can make a difference.', c: ['phak:2-5'] },
      { topic: 'p-adm', q: 'What does DECIDE stand for?', a: 'Detect, Estimate, Choose, Identify, Do, Evaluate', c: ['phak:2-18'], x: ['Define, Evaluate, Choose, Implement, Debrief, Execute', 'Detect, Evaluate, Communicate, Investigate, Decide, Execute'] },
      { topic: 'p-adm', q: 'What are the 5 Ps?', a: 'Plan, Plane, Pilot, Passengers, Programming', c: ['phak:2-13'], x: ['Pilot, Plane, Place, People, Preparation', 'Plan, Preflight, Pilot, Passengers, Power'] },
      { topic: 'p-3p', q: 'What are the three steps of the 3P model?', a: 'Perceive, Process, Perform', c: ['phak:2-15'], x: ['Plan, Prepare, Perform', 'Pilot, Plane, Programming'] },
      { topic: 'p-imsafe', q: 'What does IMSAFE stand for?', a: 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion', c: ['phak:2-8'], x: ['Illness, Medication, Sleep, Alcohol, Food, Exercise', 'Injury, Mood, Stress, Age, Fatigue, Eyesight'] },
      { topic: 'p-adm', q: 'What does PAVE stand for?', a: 'Pilot, Aircraft, enVironment, External pressures', c: ['phak:2-8'], x: ['Plan, Airspace, Visibility, Equipment', 'Pilot, Airport, Vehicle, Engine'] }
    ]
  },
  {
    id: 'aeromed', pave: 'E', topic: 'e-aeromed', acs: ['PA.I.H.K1'],
    rows: [
      { q: 'Hypoxic hypoxia is caused by…?', a: 'Insufficient oxygen available to the body, e.g. reduced partial pressure at altitude', c: ['phak:17-3'] },
      { q: 'Hypemic hypoxia is caused by…?', a: 'Blood unable to carry enough oxygen, e.g. blood loss, anemia, or carbon monoxide', c: ['phak:17-3', 'aim:8-1-4'] },
      { q: 'Stagnant hypoxia is caused by…?', a: 'Oxygen-rich blood not flowing to the tissues', c: ['phak:17-3'] },
      { q: 'Histotoxic hypoxia is caused by…?', a: 'Cells unable to use oxygen, e.g. alcohol or drugs', c: ['phak:17-4'] },
      { q: 'How do you treat hyperventilation?', a: 'Consciously slow the rate and depth of breathing (breathing into a paper bag can help)', c: ['aim:8-1-3'], x: ['Increase your breathing rate', 'Descend immediately'] },
      { q: 'Smell exhaust or get a headache with the cabin heat on: what do you do?', a: 'Suspect CO poisoning: shut off the heater and open the air vents', c: ['aim:8-1-4'], x: ['Turn the heat up to stay alert', 'Lean the mixture'] },
      { q: 'Scuba diving without a controlled ascent: wait how long before flying up to 8,000 ft?', a: 'At least 12 hours', c: ['aim:8-1-2'], x: ['At least 24 hours', 'At least 4 hours'] },
      { q: 'Scuba diving that required a controlled ascent: wait how long before flying?', a: 'At least 24 hours', c: ['aim:8-1-2'], x: ['At least 12 hours', 'At least 48 hours'] },
      { q: 'Which illusion: rapid acceleration on takeoff feels like a nose-up attitude?', a: 'Somatogravic illusion', c: ['aim:8-1-5'] },
      { q: 'Which illusion: an abrupt head movement in a prolonged turn feels like rotation in a different axis?', a: 'Coriolis illusion', c: ['aim:8-1-5'] },
      { q: 'Which illusion: rolling out abruptly after a slow, unnoticed bank feels like banking the other way?', a: 'The leans', c: ['aim:8-1-5'] },
      { q: 'Which illusion: a coordinated turn feels like a wings-level descent, so you pull back and tighten the spiral?', a: 'Graveyard spiral', c: ['aim:8-1-5'] },
      { q: 'Which illusion: a static light at night appears to move when stared at?', a: 'Autokinesis', c: ['aim:8-1-5'] },
      { q: 'A narrower-than-usual runway makes you feel…?', a: 'Higher than you are, so you fly a low approach', c: ['aim:8-1-5'], x: ['Lower than you are, so you fly a high approach', 'Faster than you are'] },
      { q: 'Rain on the windscreen and haze make you…?', a: 'Feel higher and farther away, so you fly a lower approach', c: ['aim:8-1-5'], x: ['Feel lower, so you fly a high approach', 'Feel slower'] },
      { q: 'An upsloping runway makes you feel…?', a: 'Higher than you are, so you fly a lower approach', c: ['aim:8-1-5'], x: ['Lower than you are, so you fly a higher approach'] }
    ]
  },
  {
    id: 'airport', pave: 'E', topic: 'e-airportops', acs: ['PA.II.D.K3', 'PA.XI.A.K2'],
    rows: [
      { q: 'Runway holding position markings look like…?', a: 'Four yellow lines, two solid and two dashed; hold on the solid side', c: ['aim:2-3-5'] },
      { q: 'Mandatory instruction signs are…?', a: 'Red background, white inscription', c: ['aim:2-3-8'] },
      { q: 'Location signs (runway or taxiway you’re on) are…?', a: 'Black background, yellow inscription and border', c: ['aim:2-3-9'] },
      { q: 'Direction and destination signs are…?', a: 'Yellow background, black inscription', c: ['aim:2-3-10', 'aim:2-3-11'] },
      { q: 'Runway distance remaining signs are…?', a: 'Black background, white numeral (thousands of feet)', c: ['aim:2-3-13'] },
      { q: 'Taxiway centerline marking?', a: 'A single continuous yellow line', c: ['aim:2-3-4'], x: ['A dashed white line', 'Two blue lines'] },
      { q: 'Taxiway edge lights are what color?', a: 'Blue', c: ['aim:2-1-10'], x: ['Green', 'White', 'Yellow'] },
      { q: 'A civil land airport beacon flashes…?', a: 'White and green', c: ['aim:2-1-9'] },
      { q: 'The airport beacon is on during the day in a Class D surface area. What might it mean?', a: 'Ground visibility may be less than 3 miles and/or the ceiling less than 1,000 ft', c: ['aim:2-1-9'], x: ['The tower is closed', 'The runway lights are out'] },
      { q: 'Pilot-controlled lighting: clicks for highest intensity?', a: '7 times within 5 seconds', c: ['aim:2-1-8'] },
      { q: 'Pilot-controlled lighting: clicks for medium intensity?', a: '5 times within 5 seconds', c: ['aim:2-1-8'] },
      { q: 'Pilot-controlled lighting: clicks for lowest intensity?', a: '3 times within 5 seconds', c: ['aim:2-1-8'] }
    ]
  },
  {
    id: 'weather', pave: 'V', topic: 'v-wx-enroute', acs: ['PA.I.C.K2', 'PA.I.C.R2b'],
    rows: [
      { q: 'Flight category: ceiling 2,000 ft, visibility 6 SM?', a: 'MVFR', c: ['aim:7-1-7'], x: ['VFR', 'IFR', 'LIFR'] },
      { q: 'Flight category: ceiling 800 ft, visibility 4 SM?', a: 'IFR', c: ['aim:7-1-7'], x: ['VFR', 'MVFR', 'LIFR'] },
      { q: 'Flight category: ceiling 400 ft?', a: 'LIFR', c: ['aim:7-1-7'], x: ['VFR', 'MVFR', 'IFR'] },
      { q: 'Flight category: ceiling 4,000 ft, visibility 10 SM?', a: 'VFR', c: ['aim:7-1-7'], x: ['MVFR', 'IFR', 'LIFR'] },
      { q: 'In a METAR or TAF, what is a ceiling?', a: 'The lowest broken or overcast layer, or the vertical visibility', c: ['aim:7-1-28'], x: ['The lowest layer of any coverage', 'The lowest scattered layer'] },
      { q: 'How much of the sky does BKN mean?', a: '5/8 to 7/8', c: ['aim:7-1-28'], x: ['3/8 to 4/8', '8/8', 'More than 0/8 to 2/8'] },
      { q: 'How much of the sky does SCT mean?', a: '3/8 to 4/8', c: ['aim:7-1-28'], x: ['5/8 to 7/8', '8/8', 'More than 0/8 to 2/8'] },
      { q: 'BR vs FG in a METAR?', a: 'BR = mist (visibility 5/8 SM or more); FG = fog (less than 5/8 SM)', c: ['aim:7-1-28'], x: ['BR = blowing rain; FG = freezing fog', 'BR = broken; FG = fog'] },
      { q: 'What is FU in a METAR? (Think wildfire season.)', a: 'Smoke', c: ['aim:7-1-28'], x: ['Funnel cloud', 'Fog, unknown intensity'] },
      { q: 'What does VC mean in a US METAR?', a: 'In the vicinity: 5 to 10 SM from the point of observation', c: ['aim:7-1-28'], x: ['Variable ceiling', 'Within 5 SM'] },
      { q: 'TAF “TEMPO” means…?', a: 'Temporary changes expected for less than 1 hour each, less than half the period', c: ['aim:7-1-28'] },
      { q: 'TAF “FM” means…?', a: 'From: a significant change beginning at the stated time', c: ['aim:7-1-28'] },
      { q: 'TAF “BECMG” means…?', a: 'Becoming: a change expected during the stated period', c: ['aim:7-1-28'] },
      { q: 'How long is a TAF valid?', a: '24 or 30 hours', c: ['aim:7-1-28'], x: ['6 hours', '12 hours'] },
      { q: 'AIRMET Sierra covers…?', a: 'IFR conditions and mountain obscuration', c: ['aim:7-1-6'] },
      { q: 'AIRMET Tango covers…?', a: 'Turbulence and strong surface winds', c: ['aim:7-1-6'] },
      { q: 'AIRMET Zulu covers…?', a: 'Moderate icing and freezing levels', c: ['aim:7-1-6'] },
      { q: 'How long is a (non-convective) SIGMET valid?', a: '4 hours (6 for volcanic ash or tropical cyclones)', c: ['aim:7-1-6'], x: ['2 hours', '12 hours'] },
      { q: 'Name conditions that trigger a non-convective SIGMET.', a: 'Severe icing, severe or extreme turbulence, dust/sand storms below 3 miles, volcanic ash', c: ['aim:7-1-6'], x: ['Moderate icing and IFR', 'Thunderstorms and hail'] },
      { q: 'How far should you stay from a severe thunderstorm?', a: 'At least 20 miles', c: ['aim:7-1-27'], x: ['5 miles', '10 miles'] }
    ]
  },
  {
    id: 'instruments', pave: 'A', topic: 'a-pitot', acs: ['PA.I.G.K1h', 'PA.IX.C.K2c'],
    rows: [
      { q: 'Which instruments use static pressure?', a: 'Airspeed, altimeter, and VSI', c: ['phak:8-11'], x: ['Airspeed only', 'Attitude and heading indicators'] },
      { q: 'Pitot tube blocked but drain hole open: what does the airspeed show?', a: 'It decreases to zero', c: ['phak:8-10', 'phak:8-11'], x: ['It acts like an altimeter', 'It freezes'] },
      { q: 'Static system blocked: what do the altimeter and VSI show?', a: 'Altimeter freezes; VSI shows a constant zero', c: ['phak:8-11'] },
      { q: 'Static port blocked and you climb: what does the airspeed indicator do?', a: 'Shows a decrease (reads lower than actual)', c: ['phak:8-11'], x: ['Shows an increase', 'Freezes'] },
      { q: 'Accelerating on an east or west heading, the magnetic compass shows…?', a: 'A turn toward north (decelerating: toward south)', c: ['phak:8-26'] },
      { q: 'Turning to north in the Northern Hemisphere, when do you stop the turn on the compass?', a: 'Before reaching the heading: about 15° plus half your latitude', c: ['phak:8-26'] },
      { q: 'Turning to south, when do you stop the turn on the compass?', a: 'After passing the heading: about 15° plus half your latitude', c: ['phak:8-26'] },
      { topic: 'e-perf', q: 'What is pressure altitude?', a: 'The altitude indicated with 29.92 set in the altimeter', c: ['phak:8-6'] },
      { topic: 'e-perf', q: 'What is density altitude?', a: 'Pressure altitude corrected for nonstandard temperature', c: ['phak:8-6'] },
      { topic: 'e-perf', q: 'What is absolute altitude?', a: 'Height above the terrain (AGL)', c: ['phak:8-6'] },
      { topic: 'e-perf', q: 'What is true altitude?', a: 'Actual height above mean sea level', c: ['phak:8-6'] }
    ]
  },
  {
    id: 'aero', pave: 'A', topic: 'a-aero', acs: ['PA.I.F.K3'],
    rows: [
      { q: 'Load factor in a coordinated level 60° bank turn?', a: '2 G', c: ['phak:5-34'], x: ['1.5 G', '3 G', '1.2 G'] },
      { q: 'How does stall speed change with load factor?', a: 'It increases in proportion to the square root of the load factor', c: ['phak:5-34'], x: ['It stays the same', 'It doubles with every G'] },
      { q: 'The four elements of the left-turning tendency?', a: 'Torque reaction, corkscrewing slipstream, gyroscopic precession, and P-factor', c: ['phak:5-31'], x: ['Torque, drag, lift, and weight', 'Adverse yaw, P-factor, ground effect, and torque'] },
      { q: 'Standard sea-level atmosphere?', a: '15 °C (59 °F) and 29.92 in. Hg', c: ['phak:4-3'], x: ['0 °C and 30.00 in. Hg', '20 °C and 29.92 in. Hg'] },
      { q: 'Standard temperature lapse rate?', a: 'About 2 °C (3.5 °F) per 1,000 ft', c: ['phak:4-3'], x: ['About 3 °C per 1,000 ft', 'About 1 °C per 1,000 ft'] },
      { q: 'Standard pressure lapse rate (low altitudes)?', a: 'About 1 in. Hg per 1,000 ft', c: ['phak:4-3'], x: ['About 0.1 in. Hg per 1,000 ft', 'About 2 in. Hg per 1,000 ft'] }
    ]
  },
  {
    id: 'external', pave: 'E', topic: 'e-pressures', acs: ['PA.I.D.R4'],
    rows: [
      { q: 'Give examples of external pressures.', a: 'Someone waiting, passengers you don’t want to disappoint, wanting to impress, get-there-itis', c: ['phak:2-9'], x: ['Weather, terrain, and airspace', 'Fatigue and illness'] },
      { q: 'Why does the PHAK call managing external pressure the most important key to risk management?', a: 'It can make you ignore all the other risk factors', c: ['phak:2-10'], x: ['It’s the only factor the FAA tests', 'It causes most mechanical failures'] },
      { q: 'Name personal SOPs that relieve external pressure.', a: 'Allow time for an extra stop, have alternate plans for a late arrival, leave early for important trips', c: ['phak:2-10'], x: ['Fly faster to arrive on time', 'Skip the preflight when late'] }
    ]
  },
  {
    id: 'ntsb', pave: 'V', topic: 'v-ntsb', acs: ['PA.III.A.K8'],
    rows: [
      { q: 'Does an in-flight fire require immediate NTSB notification?', a: 'Yes, it’s a listed serious incident', c: ['cfr49:830.5(a)'], x: ['No, only if there are injuries', 'Only if the airplane is damaged'] },
      { q: 'Does a flight control system malfunction require immediate NTSB notification?', a: 'Yes', c: ['cfr49:830.5(a)'], x: ['No', 'Only for airliners'] },
      { q: 'Property damage (other than the aircraft) over what amount requires immediate notification?', a: '$25,000', c: ['cfr49:830.5(a)'], x: ['$10,000', '$100,000'] },
      { q: 'When is the written NTSB report due after an accident?', a: 'Within 10 days', c: ['cfr49:830.15(a)'], x: ['Within 24 hours', 'Within 30 days'] },
      { q: 'When is the report due for an overdue aircraft still missing?', a: 'After 7 days', c: ['cfr49:830.15(a)'], x: ['After 24 hours', 'After 30 days'] }
    ]
  }
];

// ── Batch 2 tables ──
T.push(
  {
    id: 'sua', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K3'],
    rows: [
      { q: 'Prohibited area?', a: 'Flight is prohibited, for security or national welfare', c: ['aim:3-4-2'] },
      { q: 'Restricted area?', a: 'Flight isn’t wholly prohibited but is subject to restrictions (e.g. hazards like artillery)', c: ['aim:3-4-3'] },
      { q: 'Warning area?', a: 'Hazardous activity, from 3 NM outward from the U.S. coast', c: ['aim:3-4-4'] },
      { q: 'Military Operations Area (MOA)?', a: 'Separates military training from IFR traffic; VFR pilots should use extreme caution when active', c: ['aim:3-4-5'] },
      { q: 'Alert area?', a: 'High volume of pilot training or unusual aerial activity; be particularly alert', c: ['aim:3-4-6'] },
      { q: 'Controlled firing area (CFA)?', a: 'Activities are suspended immediately when spotter aircraft, radar, or ground lookouts see an aircraft approaching', c: ['aim:3-4-7'] },
      { q: 'Where is Class A airspace?', a: 'From 18,000 ft MSL up to and including FL 600', c: ['aim:3-2-2'] },
      { q: 'Military Training Routes: which are generally flown VFR?', a: 'Routes at 1,500 ft AGL and below', c: ['aim:3-5-2'], x: ['Routes above 1,500 ft AGL', 'All routes above 10,000 MSL'] },
      { q: 'MTRs are generally for operations at what speed?', a: 'In excess of 250 knots, below 10,000 MSL', c: ['aim:3-5-2'], x: ['Under 150 knots', 'Only supersonic'] },
      { q: 'Requested minimum altitude over national parks and wildlife refuges?', a: '2,000 ft above the surface', c: ['aim:7-5-6'], x: ['1,000 ft above the surface', '500 ft above the surface'] }
    ]
  },
  {
    id: 'chartsym', pave: 'V', topic: 'v-airspace', acs: ['PA.I.E.K2'],
    rows: [
      { q: 'How is Class D shown on a sectional?', a: 'Dashed blue line, ceiling in a box in hundreds of feet MSL', c: ['cug:p. 16'] },
      { q: 'How is Class C shown?', a: 'Magenta, with each sector’s ceiling/floor in solid magenta figures (hundreds of feet MSL)', c: ['cug:p. 16'] },
      { q: 'How is a Class E surface area shown?', a: 'Dashed magenta line', c: ['cug:p. 16'] },
      { q: 'What does a magenta vignette (shaded band) mean?', a: 'Class E floor begins at 700 ft AGL', c: ['cug:p. 17'] },
      { q: 'What does a blue vignette along uncontrolled airspace usually mean?', a: 'A Class E floor other than 700 ft AGL, where it borders Class G', c: ['cug:p. 17'] },
      { q: 'Airport symbol color: blue vs magenta?', a: 'Blue = control tower; magenta = all others', c: ['cug:p. 15'] },
      { q: 'A star next to a tower frequency means…?', a: 'Part-time operation', c: ['cug:p. 15'] },
      { q: '“*L” in an airport data block means…?', a: 'Lighting limitations exist; refer to the Chart Supplement', c: ['cug:p. 15'] },
      { q: 'The number after the L in a data block (e.g. “L 66”)?', a: 'Longest runway in hundreds of feet', c: ['cug:p. 15'] },
      { q: 'What does an MEF of 3⁹ mean?', a: 'Highest terrain/obstacle in the quadrant is at or below 3,900 ft MSL', c: ['cug:p. 12'] },
      { topic: 'v-nav', q: 'What is an isogonic line?', a: 'A line of equal magnetic variation', c: ['cug:p. 32', 'phak:8-24'] }
    ]
  },
  {
    id: 'wakevision', pave: 'V', topic: 'v-wake', acs: ['PA.III.B.R3', 'PA.XI.A.K1'],
    rows: [
      { q: 'When are wingtip vortices strongest?', a: 'When the generating aircraft is heavy, clean, and slow', c: ['aim:7-4-3'] },
      { q: 'How do vortices behave behind a larger aircraft?', a: 'They sink several hundred fpm, slowing and weakening with time and distance', c: ['aim:7-4-4'] },
      { q: 'Near the ground, vortices drift laterally at about what speed?', a: '2 or 3 knots', c: ['aim:7-4-4'], x: ['10 knots', 'They don’t move'] },
      { q: 'Which wind requires maximum caution for lingering vortices?', a: 'A light quartering tailwind', c: ['aim:7-4-4'], x: ['A strong headwind', 'Calm wind only'] },
      { q: 'Landing behind a departing larger aircraft on the same runway?', a: 'Land well prior to its rotation point', c: ['aim:7-4-6'], x: ['Land beyond its rotation point', 'Land at its rotation point'] },
      { q: 'How long for complete dark adaptation of your eyes?', a: 'At least 30 minutes in total darkness', c: ['aim:8-1-6'], x: ['5 minutes', '2 hours'] },
      { q: 'Downside of red cockpit lighting at night?', a: 'It severely distorts colors, especially on charts', c: ['aim:8-1-6'], x: ['It ruins night vision', 'It causes hypoxia'] }
    ]
  },
  {
    id: 'wxtheory', pave: 'V', topic: 'v-wx-general', acs: ['PA.I.C.K3'],
    rows: [
      { q: 'Rime ice?', a: 'Rough, milky, opaque; small supercooled drops freeze instantly. Most often reported.', c: ['awh:20-2'] },
      { q: 'Clear ice?', a: 'Denser and less opaque; drops freeze gradually and spread. Hard to see.', c: ['awh:20-2'] },
      { q: 'Mixed ice?', a: 'A mix of clear and rime; harder to remove than rime', c: ['awh:20-3'] },
      { q: 'What causes freezing rain?', a: 'A deep above-freezing layer aloft over a shallow below-freezing layer near the surface', c: ['awh:14-4'], x: ['Snow melting on the windshield', 'Rain falling through warm air all the way down'] },
      { q: 'Thunderstorm stage with a strong updraft?', a: 'Towering cumulus stage', c: ['awh:22-2'] },
      { q: 'When does a thunderstorm cell become mature?', a: 'When precipitation reaches the surface', c: ['awh:22-3'] },
      { q: 'What marks the dissipating stage?', a: 'A strong downdraft within the precipitation', c: ['awh:22-3'] },
      { q: 'A temperature inversion is…?', a: 'A layer where temperature increases with altitude', c: ['awh:5-12'], x: ['A layer where temperature drops faster than standard', 'A layer of 100% humidity'] },
      { q: 'Microburst: how big, and how does it change after reaching the ground?', a: 'Downdraft under 1 mile wide; it intensifies for about 5 minutes after it hits', c: ['aim:7-1-24'], x: ['10 miles wide; weakens immediately', 'Only forms over water'] },
      { q: 'Advection fog forms how, and where is it common?', a: 'Moist air moving over a colder surface; most common along coasts', c: ['awh:18-4'] },
      { q: 'Radiation fog forms how?', a: 'Over land on clear, calm nights; shallow when wind is calm', c: ['awh:18-3'] }
    ]
  },
  {
    id: 'engineops', pave: 'A', topic: 'a-engine', acs: ['PA.I.G.K1c'],
    rows: [
      { q: 'What happens if you climb without leaning?', a: 'A progressively richer mixture: roughness and loss of power', c: ['phak:7-9'] },
      { q: 'Effect of carburetor heat on power and mixture?', a: 'Power drops (up to about 15%) and the mixture gets richer', c: ['phak:7-10'] },
      { q: 'Ground effect reduces induced drag most when…?', a: 'The wing is very close to the ground (about 47% at one-tenth wingspan)', c: ['phak:5-11'], x: ['The wing is one full wingspan up', 'Only above 1,000 ft'] },
      { q: 'C152 magneto check at runup: limits?', a: 'At 1,700 RPM: no more than 125 RPM drop on either mag, 50 RPM difference', c: ['poh:4-14'] },
      { q: 'Total loss of oil pressure with rising oil temperature?', a: 'Engine failure may be imminent: reduce power, pick a landing field', c: ['poh:3-14'] },
      { q: 'Low oil pressure with normal oil temperature?', a: 'Possibly a gauge or relief valve problem; land at the nearest airport to inspect', c: ['poh:3-14'] },
      { q: 'GTX 345: which mode on the ground and in the air?', a: 'ALT, unless ATC requests otherwise', c: ['gtx:2-1'], x: ['STBY on the ground', 'ON (no altitude) on the ground'] },
      { q: 'GTX 345: what does the VFR key do?', a: 'Sets the preprogrammed VFR code', c: ['gtx:2-1'], x: ['Turns off altitude reporting', 'Sends an ident'] },
      { topic: 'v-nav', q: 'VOR check tolerance: ground check vs airborne check?', a: '±4° ground, ±6° airborne', c: ['aim:1-1-4'], x: ['±6° ground, ±4° airborne', '±2° for both'] }
    ]
  }
);

// ── Batch 3 tables ──
T.push(
  {
    id: 'regional', pave: 'V', topic: 'v-airport', acs: ['PA.II.D.K1', 'PA.III.B.K1'],
    rows: [
      { q: 'KHIO field elevation?', a: '208 ft', c: ['cs:KHIO'], x: ['374 ft', '58 ft', '1,208 ft'] },
      { q: 'KHIO traffic pattern altitude for light airplanes?', a: '1,208 ft MSL (1,000 AGL)', c: ['cs:KHIO'], x: ['1,708 ft MSL', '1,000 ft MSL', '800 ft AGL'] },
      { q: 'KHIO tower and ground frequencies?', a: 'Tower 119.3, Ground 121.7', c: ['cs:KHIO'], x: ['Tower 118.9, Ground 121.7', 'Tower 119.3, Ground 121.9', 'Tower 120.9, Ground 121.8'] },
      { q: 'KHIO ATIS frequency?', a: '127.65', c: ['cs:KHIO'], x: ['125.225', '135.625', '118.525'] },
      { q: 'KHIO’s longest runway?', a: '13R-31L, 6,600 × 150 ft', c: ['cs:KHIO'], x: ['02-20, 3,820 ft', '13L-31R, 3,600 ft', '16R-34L, 8,009 ft'] },
      { q: 'Which KHIO runways use right traffic?', a: 'Runway 02 and Runway 31R', c: ['cs:KHIO'], x: ['Runway 13R and 20', 'All runways', 'None'] },
      { q: 'KHIO airspace when the tower is closed?', a: 'Class E', c: ['cs:KHIO'], x: ['Class G', 'Class C', 'Class D'] },
      { q: 'KHIO has a VOT for checking your VOR receiver. Frequency?', a: '115.2', c: ['cs:KHIO'], x: ['117.4', '110.7', '119.3'] },
      { q: 'KHIO’s preferred runway for noise abatement?', a: 'Runway 31L', c: ['cs:KHIO'], x: ['Runway 13R', 'Runway 02', 'Runway 20'] },
      { q: 'Bend (KBDN): elevation, CTAF, airspace?', a: '3,459 ft; CTAF 123.0; Class E', c: ['cs:KBDN'], x: ['3,082 ft; tower 124.5; Class D', '374 ft; tower 118.9; Class D'] },
      { q: 'Redmond (KRDM): elevation and tower?', a: '3,082 ft; tower 124.5 (part-time)', c: ['cs:KRDM'], x: ['3,459 ft; CTAF 123.0', '213 ft; tower 119.1'] },
      { q: 'Eugene (KEUG): elevation and pattern altitude?', a: '374 ft; TPA 1,174 MSL (800 AGL)', c: ['cs:KEUG'], x: ['374 ft; TPA 1,374 MSL', '250 ft; TPA 1,050 MSL'] },
      { q: 'Eugene’s airspace?', a: 'Class D when the tower operates (1400–0730Z‡), otherwise Class E', c: ['cs:KEUG'], x: ['Class C at all times', 'Class B', 'Class E only'] },
      { q: 'Salem (KSLE) tower frequency?', a: '119.1', c: ['cs:KSLE'], x: ['119.3', '124.4', '120.35'] },
      { q: 'Olympia (KOLM) tower frequency?', a: '124.4', c: ['cs:KOLM'], x: ['124.5', '119.1', '120.9'] },
      { q: 'Troutdale (KTTD) tower frequency?', a: '120.9', c: ['cs:KTTD'], x: ['119.3', '120.35', '124.4'] },
      { q: 'Aurora State (KUAO) tower frequency?', a: '120.35', c: ['cs:KUAO'], x: ['120.9', '119.1', '118.9'] },
      { q: 'Astoria (KAST): CTAF and airspace?', a: 'CTAF 122.8; Class E', c: ['cs:KAST'], x: ['Tower 124.4; Class D', 'CTAF 123.0; Class G'] },
      { q: 'Scappoose (KSPB) CTAF?', a: '122.8', c: ['cs:KSPB'], x: ['123.0', '122.725', '119.3'] },
      { q: 'McMinnville (KMMV) CTAF?', a: '123.0', c: ['cs:KMMV'], x: ['122.8', '122.725', '120.35'] },
      { q: 'Corvallis (KCVO) pattern altitude?', a: '1,050 ft MSL (800 AGL)', c: ['cs:KCVO'], x: ['1,250 ft MSL', '1,174 ft MSL'] },
      { q: 'Which airport’s Class D tops out at 5,600 ft MSL in the high desert?', a: 'Redmond (KRDM)', c: ['cug:p. 16', 'cs:KRDM'], x: ['Bend (KBDN)', 'Eugene (KEUG)', 'Hillsboro (KHIO)'] }
    ]
  },
  {
    id: 'pohspec', pave: 'A', topic: 'a-perf', acs: ['PA.I.F.K1', 'PA.I.G.K1'],
    rows: [
      { q: 'C152 stall speed (KCAS), flaps up, power off, max weight?', a: '48 knots', c: ['poh:ii'], x: ['43 knots', '55 knots', '40 knots'] },
      { q: 'C152 stall speed (KCAS), flaps down, power off, max weight?', a: '43 knots', c: ['poh:ii'], x: ['48 knots', '35 knots', '50 knots'] },
      { q: 'C152 service ceiling (POH)?', a: '14,700 ft', c: ['poh:ii'], x: ['12,500 ft', '18,000 ft', '10,000 ft'] },
      { q: 'C152 rate of climb at sea level (POH specs)?', a: '715 fpm', c: ['poh:ii'], x: ['500 fpm', '1,000 fpm', '900 fpm'] },
      { q: 'C152 oil capacity (POH specs)?', a: '7 quarts', c: ['poh:ii'], x: ['6 quarts', '8 quarts', '5 quarts'] },
      { topic: 'a-fuel', q: 'C152 unusable fuel?', a: '1.5 gal total (0.75 gal each tank)', c: ['poh:2-7', 'poh:2-5'], x: ['3 gal total', '0.5 gal total'] },
      { topic: 'a-fuel', q: 'Why re-top the C152’s tanks after refueling?', a: 'Cross-feeding between tanks: re-topping assures maximum capacity', c: ['poh:2-8'], x: ['To cool the fuel', 'To check for water'] },
      { topic: 'a-fuel', q: 'Minimum fuel for which C152 takeoffs were demonstrated?', a: '2 gallons total (1 per tank). Takeoffs weren’t demonstrated with less.', c: ['poh:2-8'], x: ['5 gallons total', 'Half tanks'] },
      { topic: 'a-fuel', q: 'What does the C152 primer draw from?', a: 'The fuel strainer; it injects fuel into the cylinder intake ports', c: ['poh:7-19'], x: ['The left tank only', 'The carburetor bowl'] },
      { q: 'Max rate of climb at 1,670 lb, 4,000 ft, 20 °C (POH)?', a: '505 fpm', c: ['poh:5-13'], x: ['600 fpm', '415 fpm', '700 fpm'] },
      { q: 'Short-field takeoff at sea level, 20 °C, 1,670 lb: total over 50 ft (POH)?', a: '1,390 ft', c: ['poh:5-12'], x: ['1,190 ft', '1,495 ft', '2,080 ft'] },
      { q: 'Short-field takeoff at 6,000 ft PA, 30 °C, 1,670 lb: total over 50 ft (POH)?', a: '2,855 ft', c: ['poh:5-12'], x: ['2,250 ft', '3,255 ft', '2,525 ft'] },
      { q: 'POH takeoff correction for a dry grass runway?', a: 'Increase distances by 15% of the ground roll figure', c: ['poh:5-12'], x: ['Increase by 50%', 'No correction'] },
      { q: 'POH takeoff correction for headwind?', a: 'Decrease distances 10% for each 9 knots', c: ['poh:5-12'], x: ['Decrease 10% per 2 knots', 'Decrease 50% for any headwind'] },
      { q: 'POH takeoff correction for tailwind (up to 10 knots)?', a: 'Increase distances 10% for each 2 knots', c: ['poh:5-12'], x: ['Increase 10% per 9 knots', 'Tailwind takeoffs prohibited'] },
      { q: 'Cruise at 6,000 ft, standard temp, 2,300 RPM: TAS and fuel flow (POH)?', a: '96 KTAS, 5.2 GPH', c: ['poh:5-15'], x: ['101 KTAS, 5.8 GPH', '90 KTAS, 4.7 GPH'] }
    ]
  },
  {
    id: 'pohemerg', pave: 'A', topic: 'a-perf', acs: ['PA.IX.B.K1', 'PA.IX.C.K3'], emergency: true,
    rows: [
      { q: 'Engine failure during takeoff roll: first two (memory) items?', a: 'Throttle IDLE, Brakes APPLY', c: ['poh:3-3'], x: ['Mixture idle cut-off, fuel off', 'Master off, ignition off'] },
      { q: 'Electrical fire in flight: memory items?', a: 'Master OFF, vents/cabin air/heat CLOSED, fire extinguisher ACTIVATE', c: ['poh:3-6'], x: ['Mixture idle cut-off, fuel off', 'Radios off, alternator off'] },
      { q: 'Engine fire in flight: airspeed per the POH?', a: '85 KIAS (increase if needed to find an incombustible mixture)', c: ['poh:3-6'], x: ['60 KIAS', '104 KIAS'] },
      { q: 'Fire during start that does start: what next?', a: 'Run at 1,700 RPM for a few minutes, then shut down and inspect', c: ['poh:3-5'], x: ['Take off immediately', 'Shut down instantly'] },
      { q: 'Electrical fire out and you need power: what about circuit breakers?', a: 'Check them for the faulty circuit but do not reset', c: ['poh:3-6'], x: ['Reset all of them', 'Pull every breaker'] },
      { q: 'Ditching: power and speed on approach?', a: '300 ft/min descent at 55 KIAS, flaps 30°', c: ['poh:3-5'], x: ['Power off at 65 KIAS', '500 ft/min at 70 KIAS'] },
      { q: 'Landing with a flat main tire?', a: 'Touch down good tire first, hold the flat off with aileron', c: ['poh:3-8'], x: ['Flat tire first', 'No-flap landing at high speed'] },
      { q: 'Inadvertent icing: approach speed?', a: '65 to 75 KIAS depending on ice', c: ['poh:3-8'], x: ['54 KIAS', '85 KIAS'] },
      { q: 'Spin recovery: first step in the C152 POH?', a: 'Ailerons neutral (then throttle idle, full opposite rudder)', c: ['poh:3-12'], x: ['Full forward elevator', 'Full power'] },
      { q: 'Vacuum failure in cloud: what does the POH assume is left for attitude?', a: 'The electric turn coordinator', c: ['poh:3-11'], x: ['The attitude indicator', 'The heading indicator'] }
    ]
  },
  {
    id: 'regs2', pave: 'P', topic: 'p-privileges', acs: ['PA.I.A.K2', 'PA.I.E.K1'],
    rows: [
      { topic: 'v-airspace', q: 'Special VFR: weather and clearance (fixed-wing, day)?', a: 'ATC clearance, clear of clouds, 1 SM flight visibility (1 SM ground visibility to take off or land)', c: ['cfr14:91.157(b)', 'cfr14:91.157(c)'] },
      { topic: 'v-airspace', q: 'Special VFR at night requires…?', a: 'An instrument rating and an IFR-equipped airplane', c: ['cfr14:91.157(b)'], x: ['Only a landing light', 'Nothing extra'] },
      { topic: 'v-airspace', q: 'Name two Appendix D airports near you where fixed-wing SVFR is prohibited.', a: 'Portland International and Seattle-Tacoma', c: ['cfr14:91 App. D'], x: ['Hillsboro and Troutdale', 'Eugene and Salem'] },
      { topic: 'e-regs', q: 'Speed limit under a Class B shelf or in a VFR corridor?', a: '200 KIAS', c: ['cfr14:91.117(c)'] },
      { q: 'Private pilot as aircraft salesman: requirement to demo?', a: 'At least 200 hours logged', c: ['cfr14:61.113(f)'], x: ['500 hours', 'A commercial certificate'] },
      { q: 'What can a private pilot be reimbursed for on a sanctioned search and location mission?', a: 'Fuel, oil, airport expenditures, or rental fees', c: ['cfr14:61.113(e)'], x: ['Their time', 'Nothing'] },
      { q: 'Glider tow recency (14 CFR 61.69)?', a: '3 actual or simulated tows (or 3 towed-glider PIC flights) within the preceding 24 calendar months', c: ['cfr14:61.69'], x: ['3 tows in 12 months', '1 tow in 90 days'] },
      { topic: 'p-resp', q: 'What does PIC responsibility (14 CFR 91.3) include in an emergency?', a: 'You may deviate from any rule to the extent needed to meet the emergency', c: ['cfr14:91.3'], x: ['You must still follow every rule', 'Only ATC may authorize deviations'] },
      { topic: 'p-resp', q: 'What must you know before every flight (14 CFR 91.103)?', a: 'All available information: weather, fuel, alternatives, known ATC delays, runway lengths, takeoff and landing data', c: ['cfr14:91.103'], x: ['Only the weather', 'Only fuel and weight'] },
      { topic: 'p-cert', q: 'Part 141 private: how much checkride prep training is required, and when?', a: '3 hours within 60 days before the test', c: ['cfr14:141 App. B 4(b)(1)(iv)'], x: ['3 hours within 90 days', '1 hour within 30 days'] },
      { topic: 'p-cert', q: 'Part 141 private: solo cross-country requirement?', a: '100 NM total, landings at 3 points, one leg over 50 NM straight-line', c: ['cfr14:141 App. B 5(a)'], x: ['150 NM total, one leg over 50 NM', '50 NM total'] },
      { topic: 'a-prevmx', q: 'Who may perform preventive maintenance on the 152?', a: 'A certificated pilot who owns or operates it (not under Part 121/129/135), and it must be logged', c: ['cfr14:43.3(g)', 'cfr14:43.9'] },
      { topic: 'a-awcert', q: 'How long does a standard airworthiness certificate last?', a: 'As long as maintenance is done per Parts 43 and 91 and the aircraft is U.S.-registered', c: ['cfr14:21.181(a)'], x: ['7 years', '12 calendar months'] },
      { topic: 'a-ads', q: 'Who is primarily responsible for AD compliance?', a: 'The owner or operator', c: ['cfr14:91.403(a)'], x: ['The mechanic', 'The FAA'] }
    ]
  },
  {
    id: 'aimops', pave: 'V', topic: 'v-airport', acs: ['PA.III.A.K2', 'PA.III.B.K1'],
    rows: [
      { q: 'Tower replies “Aircraft calling, standby.” Can you enter the Class D?', a: 'No: without your call sign, communication isn’t established', c: ['aim:3-2-5'] },
      { q: 'Class B entry phrase you must hear?', a: 'An explicit clearance, e.g. “cleared into the Class Bravo”', c: ['aim:3-2-3', 'cfr14:91.131(a)'], x: ['Any squawk code', '“Radar contact”'] },
      { q: 'Pattern entry per the AIM?', a: 'Level flight, abeam the midpoint of the runway, at pattern altitude', c: ['aim:4-3-3'], x: ['Descending on the 45 to downwind', 'Straight in from 5 miles'] },
      { q: 'Departing the pattern per the AIM?', a: 'Straight out, or a 45° turn (in the pattern direction) beyond the departure end after reaching pattern altitude', c: ['aim:4-3-3'] },
      { q: 'Radio failure arriving at a towered field: before joining the pattern?', a: 'Stay outside or above the Class D until you determine the direction and flow of traffic', c: ['aim:4-2-13'] },
      { q: 'Radio failure before departure: what does the AIM say?', a: 'Try to get it fixed; otherwise phone the tower and ask to depart without two-way radio', c: ['aim:4-2-13'], x: ['Depart and squawk 7600', 'Depart only in Class G'] },
      { q: 'Can a student pilot accept a LAHSO clearance?', a: 'The AIM says students shouldn’t participate in LAHSO', c: ['aim:4-3-11'], x: ['Yes, any pilot must accept', 'Only at night'] },
      { q: 'You prefer a different runway than ATC assigned. What do you do?', a: 'Advise ATC', c: ['aim:4-3-6'], x: ['Use it without asking', 'Nothing: you must accept'] },
      { q: 'Thunderstorm don’t: flying under the anvil?', a: 'Don’t: severe and extreme clear air turbulence is possible', c: ['aim:7-1-27'] },
      { q: 'What does vivid, frequent lightning indicate?', a: 'Probably a severe thunderstorm', c: ['aim:7-1-27'], x: ['A dissipating storm', 'Light rain only'] },
      { q: 'In distress and not already talking to ATC: transponder?', a: 'Squawk 7700 with Mode C', c: ['aim:6-3-2'], x: ['Squawk 7600', 'Squawk 1200'] },
      { q: 'Disaster/hazard TFRs (14 CFR 91.137) protect what?', a: 'People and property from a surface hazard, and disaster relief aircraft', c: ['cfr14:91.137(a)'], x: ['Only the President', 'Only airliners'] }
    ]
  }
);

T.push({
  id: 'misc', pave: 'V', topic: 'v-transponder', acs: ['PA.VI.B.K4', 'PA.XI.A.K1'],
  rows: [
    { q: 'GTX 345: what does the ON key do?', a: 'Powers on with altitude reporting disabled', c: ['gtx:2-1'], x: ['Enables altitude reporting', 'Sends an ident'] },
    { q: 'GTX 345: what does IDNT do?', a: 'Activates the ident function', c: ['gtx:2-1'], x: ['Sets 1200', 'Turns off ADS-B'] },
    { q: 'GTX 345: is there a pilot-selectable ground mode?', a: 'No; it detects air/ground itself, so use ALT', c: ['gtx:2-1'], x: ['Yes, GND mode', 'Yes, use STBY'] },
    { q: 'Night vision: dim red cockpit light gives moderate dark adaptation in about how long?', a: 'About 20 minutes', c: ['aim:8-1-6'], x: ['About 2 minutes', 'About 2 hours'] },
    { q: 'Landing behind a larger aircraft on a crossing runway?', a: 'Cross above its flight path', c: ['aim:7-4-6'], x: ['Cross below its flight path', 'Land before the intersection always'] },
    { q: 'For accurate MOA hours, whom should you contact?', a: 'Any FSS within 100 miles of the area', c: ['aim:3-4-5'], x: ['The nearest tower', 'The military base by phone only'] },
    { q: 'ILS critical area holding position marking?', a: 'Two solid yellow lines connected by pairs of solid lines (ladder-like)', c: ['aim:2-3-5'], x: ['Four yellow lines, two solid two dashed', 'A single white bar'] },
    { topic: 'p-basicmed', q: 'BasicMed: may your most recent FAA medical be expired?', a: 'Yes, as long as it wasn’t suspended, revoked, or denied', c: ['cfr14:61.23(c)(3)(ii)'], x: ['No, it must be current', 'Only if it was first class'] },
    { q: 'A VSI in level flight with a blocked static port shows…?', a: 'Zero, continuously, even in a climb or descent', c: ['phak:8-11'], x: ['A constant climb', 'Wild swings'] },
    { q: 'What does a squawk of 7500 tell ATC?', a: 'Unlawful interference (hijack)', c: ['aim:4-1-20'], x: ['Radio failure', 'Medical emergency'] }
  ]
});

T.push({
  id: 'gaps', pave: 'P', topic: 'p-endorse', acs: ['PA.I.A.K1', 'PA.I.B.K1a'],
  rows: [
    { q: 'What makes an airplane “complex”?', a: 'Retractable gear, flaps, and a controllable-pitch propeller (or FADEC)', c: ['cfr14:61.1', 'cfr14:61.31(e)'], x: ['More than 200 hp', 'A glass cockpit'] },
    { q: 'What makes an airplane “high performance”?', a: 'An engine of more than 200 horsepower', c: ['cfr14:61.31(f)'], x: ['More than 180 hp', 'Retractable gear'] },
    { q: 'When do you need the high-altitude endorsement?', a: 'PIC of a pressurized aircraft with a service ceiling or max operating altitude above 25,000 ft MSL', c: ['cfr14:61.31(g)'], x: ['Above 18,000 ft in any aircraft', 'Above 12,500 ft'] },
    { q: 'What do you need to act as PIC of a tailwheel airplane?', a: 'Flight training from an authorized instructor and a one-time logbook endorsement', c: ['cfr14:61.31(i)'], x: ['A type rating', 'Nothing extra'] },
    { topic: 'p-qual', q: 'What does the FAA call your “license”?', a: 'A private pilot certificate (airplane category, single-engine land class)', c: ['cfr14:61.5'], x: ['A private pilot license', 'A sport pilot permit'] },
    { topic: 'a-sfp', q: 'What does FSDO stand for?', a: 'Flight Standards District Office', c: ['phak:1-9'], x: ['Flight Service District Office', 'Federal Safety Directorate Office'] },
    { topic: 'a-sfp', q: 'How long is a special flight permit valid?', a: 'For the period specified in the permit', c: ['cfr14:21.181(a)(2)'], x: ['30 days', 'Until the next annual'] },
    { topic: 'e-brief', q: 'Before takeoff, what must the PIC brief every passenger on (14 CFR 91.107)?', a: 'How to fasten and unfasten their safety belt and shoulder harness', c: ['cfr14:91.107(a)(1)'], x: ['Emergency exits only', 'Nothing is required'] },
    { topic: 'e-brief', q: 'When must passengers be told to fasten their belts (14 CFR 91.107)?', a: 'Before moving on the surface, takeoff, and landing', c: ['cfr14:91.107(a)(2)'], x: ['Only for takeoff', 'Only in turbulence'] },
    { topic: 'a-logs', q: 'Who must make sure maintenance entries approving return to service are in the records?', a: 'The owner or operator', c: ['cfr14:91.405(b)'], x: ['The pilot renting it', 'The FAA'] },
    { topic: 'a-docs', q: 'Which POH limitations are FAA approved?', a: 'Section 2 limitations and the Section 9 supplements', c: ['poh:2-3'], x: ['Only Section 5 performance', 'None; they’re advisory'] },
    { topic: 'a-docs', q: 'Name placards required in your 152’s view.', a: 'Kinds of operations, “intentional spins prohibited with flaps extended,” “flight into known icing prohibited”', c: ['poh:2-9'], x: ['Only the fuel placard', 'Only the registration number'] },
    { topic: 'a-hyd', q: 'C152 brakes go spongy or pedal travel increases. What does the POH say?', a: 'Pump the pedals to build pressure; if one brake fails, use the other sparingly with opposite rudder', c: ['poh:7-22'], x: ['Pull the parking brake', 'Shut down the engine'] },
    { topic: 'v-lost', q: 'FAA guidance when lost: first steps?', a: 'Climb (watching traffic and weather) for better radio, nav, and radar coverage; use VOR/GPS; communicate', c: ['phak:16-34'], x: ['Descend to read signs', 'Circle until fuel is low'] },
    { topic: 'v-lost', q: 'What is direction-finding (DF) assistance?', a: 'A facility locates you by your transmissions: you key the mic when asked and turn as directed', c: ['phak:16-34'], x: ['A GPS mode', 'A transponder code'] },
    { topic: 'v-flightplan', q: 'Why activate your VFR flight plan?', a: 'It ensures you receive VFR search and rescue services', c: ['aim:5-1-5'], x: ['It gives you ATC separation', 'It’s required for all flights'] },
    { topic: 'v-flightplan', q: 'If you don’t update a late departure, search and rescue is based on…?', a: 'Your assumed (filed) departure time', c: ['aim:5-1-5'], x: ['Your actual departure time', 'Your arrival airport’s hours'] }
  ]
});

const unit = (x: string) => (x.match(/(KIAS|knots|kt|lb|ft|°|RPM|psi|gal|fpm|SM|hours?|minutes?|days?|months?|G|%)/i) ?? [''])[0].toLowerCase();
const isRange = (x: string) => /\d\s*[–-]\s*\d/.test(x);
function likeness(a: string, b: string) {
  return Math.abs(a.length - b.length) / 4 + (unit(a) === unit(b) ? 0 : 20) + (isRange(a) === isRange(b) ? 0 : 15) + (/\d/.test(a) === /\d/.test(b) ? 0 : 25);
}

const shuffle = <V,>(a: V[]) => a.map((v) => [Math.random(), v] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

function toItem(t: Table, r: Row, i: number): Item {
  const hand = DISTRACTORS[r.q];
  const extra = shuffle((r.x ?? []).filter((x) => x !== r.a));
  // Siblings that look like the right answer: same unit, range-vs-single, similar length.
  const siblings = [...new Set(t.rows.filter((o) => o !== r).map((o) => o.a))]
    .filter((x) => x !== r.a && !extra.includes(x))
    .map((x) => [x, likeness(r.a, x) + Math.random() * 6] as const)
    .sort((p, q) => p[1] - q[1])
    .map((p) => p[0]);
  const wrong = hand ? shuffle(hand).slice(0, 3) : [...extra, ...siblings].slice(0, 3);
  return {
    id: `f-${t.id}-${i}`,
    kind: 'recall',
    emergency: t.emergency,
    pave: t.pave,
    topic: r.topic ?? t.topic,
    acs: t.acs,
    prompt: r.q,
    choices: [{ t: r.a, ok: true }, ...wrong.map((w) => ({ t: w }))],
    answer: r.more ?? [r.a],
    explain: r.more ?? [r.a],
    c: r.c,
    xp: 10
  };
}

export const FACT_ITEMS: Item[] = T.flatMap((t) => t.rows.map((r, i) => toItem(t, r, i)));
export const FACT_TABLES = T.map((t) => ({ id: t.id, topic: t.topic, pave: t.pave, count: t.rows.length }));
