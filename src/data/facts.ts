// Quick-recall fact tables. Each row becomes one question: multiple choice in sessions
// (wrong options come from other rows of the same table) and a flashcard in Drills.
// Every row was checked against the cited source text.
import type { Item, Pave } from './types';

interface Row {
  q: string; // question
  a: string; // short correct answer (also used as a distractor for sibling rows)
  more?: string[]; // fuller answer for the flashcard
  c: string[];
  x?: string[]; // extra hand-written distractors
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
      { q: 'C152 standard tanks: total and usable fuel?', a: '26 gal total, 24.5 gal usable', c: ['poh:2-7'] },
      { q: 'C152 long-range tanks: total and usable fuel?', a: '39 gal total, 37.5 gal usable', c: ['poh:2-7'] },
      { q: 'C152 approved fuel grades?', a: '100LL (blue) or grade 100 (green)', c: ['poh:2-8'], x: ['80/87 (red) or 100LL (blue)', 'Jet A or 100LL'] },
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
      { q: 'How long is an aircraft registration valid?', a: 'Seven years', c: ['cfr14:47.40(a)'], x: ['Three years', 'Indefinitely'] }
    ]
  },
  {
    id: 'pilotreq', pave: 'P', topic: 'p-medical', acs: ['PA.I.A.K1', 'PA.I.A.K3'],
    rows: [
      { q: 'Third-class medical, under 40 at the exam: how long for private privileges?', a: 'Until the end of the 60th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'Third-class medical, 40 or older at the exam: how long for private privileges?', a: 'Until the end of the 24th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'Second-class medical for commercial privileges lasts…?', a: 'Until the end of the 12th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'First-class medical for ATP privileges, 40 or older?', a: 'Until the end of the 6th month after the exam month', c: ['cfr14:61.23(d)'] },
      { q: 'Flight review: how often and how long?', a: 'Every 24 calendar months; at least 1 hr ground + 1 hr flight', c: ['cfr14:61.56'] },
      { q: 'Passenger-carrying currency (day)?', a: '3 takeoffs and landings in the preceding 90 days, same category and class', c: ['cfr14:61.57(a)'] },
      { q: 'Night passenger currency?', a: '3 takeoffs and landings to a full stop, 1 hr after sunset to 1 hr before sunrise, within 90 days', c: ['cfr14:61.57(b)'] },
      { q: 'BasicMed: how often the online course and the physician exam?', a: 'Course every 24 calendar months; exam every 48 calendar months', c: ['cfr14:61.23(c)(3)(i)'] },
      { q: 'Alcohol rule for crewmembers?', a: 'Not within 8 hours of drinking, not under the influence, not at 0.04 or higher', c: ['cfr14:91.17(a)'] },
      { q: 'What documents must you carry to act as PIC?', a: 'Pilot certificate, medical (or BasicMed), and photo ID, in your possession or readily accessible', c: ['cfr14:61.3'], x: ['Pilot certificate and logbook', 'Pilot certificate only'] },
      { q: 'Minimum age for a private pilot certificate (airplane)?', a: '17', c: ['cfr14:61.103(a)'], x: ['16', '18'] }
    ]
  },
  {
    id: 'ops', pave: 'E', topic: 'e-regs', acs: ['PA.I.A.K2', 'PA.I.D.K3c'],
    rows: [
      { q: 'VFR fuel reserve during the day?', a: '30 minutes at normal cruise', c: ['cfr14:91.151(a)'] },
      { q: 'VFR fuel reserve at night?', a: '45 minutes at normal cruise', c: ['cfr14:91.151(a)'] },
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
      { q: 'VFR cruising altitude on a magnetic course of 0–179°, above 3,000 AGL?', a: 'Odd thousands + 500 (e.g. 5,500)', c: ['cfr14:91.159(a)'] },
      { q: 'VFR cruising altitude on a magnetic course of 180–359°, above 3,000 AGL?', a: 'Even thousands + 500 (e.g. 6,500)', c: ['cfr14:91.159(a)'] }
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
      { q: 'What does DECIDE stand for?', a: 'Detect, Estimate, Choose, Identify, Do, Evaluate', c: ['phak:2-18'], x: ['Define, Evaluate, Choose, Implement, Debrief, Execute', 'Detect, Evaluate, Communicate, Investigate, Decide, Execute'] },
      { q: 'What are the 5 Ps?', a: 'Plan, Plane, Pilot, Passengers, Programming', c: ['phak:2-13'], x: ['Pilot, Plane, Place, People, Preparation', 'Plan, Preflight, Pilot, Passengers, Power'] },
      { q: 'What are the three steps of the 3P model?', a: 'Perceive, Process, Perform', c: ['phak:2-15'], x: ['Plan, Prepare, Perform', 'Pilot, Plane, Programming'] },
      { q: 'What does IMSAFE stand for?', a: 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion', c: ['phak:2-8'], x: ['Illness, Medication, Sleep, Alcohol, Food, Exercise', 'Injury, Mood, Stress, Age, Fatigue, Eyesight'] },
      { q: 'What does PAVE stand for?', a: 'Pilot, Aircraft, enVironment, External pressures', c: ['phak:2-8'], x: ['Plan, Airspace, Visibility, Equipment', 'Pilot, Airport, Vehicle, Engine'] }
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
      { q: 'What is pressure altitude?', a: 'The altitude indicated with 29.92 set in the altimeter', c: ['phak:8-6'] },
      { q: 'What is density altitude?', a: 'Pressure altitude corrected for nonstandard temperature', c: ['phak:8-6'] },
      { q: 'What is absolute altitude?', a: 'Height above the terrain (AGL)', c: ['phak:8-6'] },
      { q: 'What is true altitude?', a: 'Actual height above mean sea level', c: ['phak:8-6'] }
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

const shuffle = <V,>(a: V[]) => a.map((v) => [Math.random(), v] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

function toItem(t: Table, r: Row, i: number): Item {
  const pool = [...new Set([...(r.x ?? []), ...t.rows.filter((o) => o !== r).map((o) => o.a)])].filter((s) => s !== r.a);
  const wrong = shuffle(pool).slice(0, 3);
  return {
    id: `f-${t.id}-${i}`,
    kind: 'recall',
    emergency: t.emergency,
    pave: t.pave,
    topic: t.topic,
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
