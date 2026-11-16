// The owner's PAVE outline (pave-outline.txt) as the app's main structure.
// `user` = the owner's own lines, kept as written. `facts` = completed details from the sources.
// `added: true` = a topic the outline didn't have, added to cover the ACS.
// Citation keys are resolved by cite() in sources.ts. Every fact was checked against the cited text.
import type { Pave } from './types';

export interface Fact {
  t: string;
  c: string[];
}
export interface Topic {
  id: string;
  pave: Pave;
  title: string;
  user: string[];
  added?: boolean;
  acs: string[];
  facts: Fact[];
  refs: string[]; // where to read more in the sources
}

export const OUTLINE: Topic[] = [
  // ───────────────────────────── PILOT ─────────────────────────────
  {
    id: 'p-cert', pave: 'P', title: 'Certification Requirements',
    user: ['Minimum Age (17 Yrs)', 'English Proficiency (Read, Speak, Write, Understand)', 'Training Received from Authorized Instructor', 'Proper Ground & Flight Training', 'Part 141 Hour Minimums', 'Ground 35', 'Dual 20', 'XC 3', 'Solo 5', 'Sim Inst. 3', 'Night 3', 'Total 35', 'Takeoff & Landings 10 FS', 'Endorsements (Solo, Pre-Checkride)', 'Pass FAA Written Test', 'Pass Checkride', 'Oral', 'Practical'],
    acs: ['PA.I.A.K1'],
    facts: [
      { t: 'Eligibility: at least 17 years old (airplane) and able to read, speak, write, and understand English.', c: ['cfr14:61.103(a)', 'cfr14:61.103(c)'] },
      { t: 'Part 141 private course: at least 35 hours of ground training and 35 hours of flight training.', c: ['cfr14:141 App. B 3(a), 4(a)'] },
      { t: 'Dual flight training: 20 hours, including 3 hours cross-country, 3 hours night (with one night cross-country of more than 100 NM total and 10 full-stop takeoffs and landings, each with a flight in the pattern), and 3 hours of instrument (control by reference to instruments).', c: ['cfr14:141 App. B 4(b)(1)'] },
      { t: 'Plus 3 hours of flight training in preparation for the practical test within 60 days before the test.', c: ['cfr14:141 App. B 4(b)(1)(iv)'] },
      { t: 'Solo: 5 hours, including a solo 100 NM cross-country with landings at 3 points and one leg of more than 50 NM straight-line, and 3 full-stop takeoffs and landings at an airport with an operating control tower.', c: ['cfr14:141 App. B 5(a)'] }
    ],
    refs: ['cfr14:61.103', 'cfr14:141 App. B', 'phak:ch. 1']
  },
  {
    id: 'p-medical', pave: 'P', title: 'Medical Certificate',
    user: ['1st (ATP) 12 Months Before 40 Yrs, 6 Months After 40 Yrs', '2nd (Commercial) 12 Months Before 40 Yrs, 12 Months After 40 Yrs', '3rd (Private, CFI, Student) 60 Months Before 40 Yrs, 24 Months After 40 Yrs'],
    acs: ['PA.I.A.K3'],
    facts: [
      { t: 'For private pilot privileges you need at least a third-class medical (or BasicMed).', c: ['cfr14:61.23(a)(3)(i)'] },
      { t: 'Third class: expires at the end of the last day of the 60th month after the exam month if you were under 40 at the exam; 24th month if 40 or older.', c: ['cfr14:61.23(d)'] },
      { t: 'Higher-class medicals “step down”: a first- or second-class medical that has lapsed for its own privileges still works for private privileges until the third-class period ends.', c: ['cfr14:61.23(d)'] },
      { t: 'A flight instructor needs a medical only when acting as PIC or as a required crewmember.', c: ['cfr14:61.23(a)(3)(ii)', 'cfr14:61.23(b)(7)'] }
    ],
    refs: ['cfr14:61.23', 'phak:ch. 17']
  },
  {
    id: 'p-basicmed', pave: 'P', title: 'BasicMed',
    user: ["Need Valid US Driver's License", 'Held Medical After 07/14/06', 'Pass CMEC', 'Complete Online Course', 'Keep Both in Logbook', 'No More than 7 Occupants', 'Maximum Takeoff Weight No More Than 12,500', 'No More than 6 Passengers', 'VFR or IFR within US', 'Below 18,000 MSL', 'Less than 251 KTs', 'No Comp or Hire', 'Private, Flight Crew, Examiner Privileges'],
    acs: ['PA.I.A.K5'],
    facts: [
      { t: 'Hold a valid U.S. driver’s license, and have held a Part 67 medical at any time after July 14, 2006 (most recent one not suspended or revoked).', c: ['cfr14:61.113(i)', 'cfr14:61.23(c)(3)'] },
      { t: 'Complete the medical education course within the previous 24 calendar months, and a comprehensive medical exam by a state-licensed physician within the previous 48 calendar months.', c: ['cfr14:61.23(c)(3)(i)'] },
      { t: 'Aircraft: authorized for no more than 7 occupants, max takeoff weight no more than 12,500 lb, no more than 6 passengers on board.', c: ['cfr14:61.113(i)(1)'] },
      { t: 'Flight: not above 18,000 ft MSL, not faster than 250 KIAS, and not outside the U.S. unless that country authorizes it.', c: ['cfr14:61.113(i)(2)'] },
      { t: 'Keep the completed exam checklist and the course-completion certificate in your logbook.', c: ['cfr14:61.113(i)(3)'] }
    ],
    refs: ['cfr14:61.113(i)', 'cfr14:61.23(c)(3)']
  },
  {
    id: 'p-qual', pave: 'P', title: 'Qualifications',
    user: ['Private Pilot License', 'Airplane', 'Single Engine Land'],
    acs: ['PA.I.A.K1'],
    facts: [
      { t: 'The FAA issues a private pilot certificate (not a “license”) with category airplane and class single-engine land.', c: ['cfr14:61.103', 'cfr14:61.5'] }
    ],
    refs: ['cfr14:61.5']
  },
  {
    id: 'p-privileges', pave: 'P', title: 'Privileges',
    user: ['Act as PIC (Pilot In Command)', 'Carry Passengers', 'Fly at Night', 'Charity, Non-Profit, Community Event', 'Search & Rescue', 'Aircraft Salesman (200 Hrs, Demonstrate to Buyer)', 'Incidental for Business or Employment (Ex. Flying Yourself To Client, Pilot isn’t Primary Job)', 'Glider Towing (100 Hrs PIC Cat. Class, Type, Preceding 12 Months 3 Sim or Actual in Cat. Class, Type)'],
    acs: ['PA.I.A.K2'],
    facts: [
      { t: 'No PIC for compensation or hire, except: flights only incidental to business/employment with no passengers or property carried for hire.', c: ['cfr14:61.113(a)', 'cfr14:61.113(b)'] },
      { t: 'Charitable, nonprofit, or community event flights, if the sponsor and pilot meet §91.146.', c: ['cfr14:61.113(d)'] },
      { t: 'Search and location: may be reimbursed for fuel, oil, airport expenditures, or rental fees when sanctioned by a government agency or SAR organization.', c: ['cfr14:61.113(e)'] },
      { t: 'Aircraft salesman with at least 200 hours logged may demonstrate an aircraft to a prospective buyer.', c: ['cfr14:61.113(f)'] },
      { t: 'Glider/ultralight towing per §61.69: 100 hours PIC in the category, class (and type) used; an instructor endorsement; and within the preceding 24 calendar months 3 actual or simulated tows (or 3 flights as PIC of a towed glider).', c: ['cfr14:61.69'] }
    ],
    refs: ['cfr14:61.113', 'cfr14:61.69']
  },
  {
    id: 'p-limits', pave: 'P', title: 'Limitations',
    user: ['No Less than Pro Rata Share', 'Fuel, Oil, Rental Fees, Airport Expenditures'],
    acs: ['PA.I.A.K2'],
    facts: [{ t: 'You may not pay less than the pro rata share of operating expenses with passengers; expenses may only be fuel, oil, airport expenditures, or rental fees.', c: ['cfr14:61.113(c)'] }],
    refs: ['cfr14:61.113(c)']
  },
  {
    id: 'p-resp', pave: 'P', title: 'Responsibilities',
    user: ['Final Authority as to the operation of the Aircraft', 'Safety of Plane and Passengers', 'In-Flight Emergency, Can Deviate to the Extent to Meet that Emergency', 'Follow ATC Instructions', 'Know and Understand FAA Rules & Regulations', 'Must Have Medical, Government Issued Photo ID, Pilot Certificate on Person'],
    acs: ['PA.I.A.K4', 'PA.I.D.K1'],
    facts: [
      { t: 'The PIC is directly responsible for, and is the final authority as to, the operation of the aircraft. In an in-flight emergency the PIC may deviate from any rule to the extent needed; file a written report if the FAA requests it.', c: ['cfr14:91.3'] },
      { t: 'Before every flight, become familiar with all available information, including weather, fuel requirements, alternatives, known ATC delays, runway lengths, and takeoff/landing distance data.', c: ['cfr14:91.103'] },
      { t: 'Pilot certificate, medical (or BasicMed documents) and a photo ID must be in your physical possession or readily accessible in the aircraft.', c: ['cfr14:61.3'] }
    ],
    refs: ['cfr14:91.3', 'cfr14:91.103', 'cfr14:61.3']
  },
  {
    id: 'p-endorse', pave: 'P', title: 'Endorsements',
    user: ['Complex (Need All 3, Flaps, Retractable Gear, Controllable Pitch Propeller)', 'High Performance (Above 200 HP)', 'High Altitude / Pressurized (Above 25,000 FT MSL)', 'Tailwheel'],
    acs: ['PA.I.A.K1'],
    facts: [
      { t: 'Complex: retractable gear, flaps, and a controllable-pitch propeller (or FADEC). Requires ground and flight training plus a one-time endorsement.', c: ['cfr14:61.1', 'cfr14:61.31(e)'] },
      { t: 'High performance: an engine of more than 200 horsepower.', c: ['cfr14:61.31(f)'] },
      { t: 'High altitude: pressurized aircraft with a service ceiling or max operating altitude above 25,000 ft MSL.', c: ['cfr14:61.31(g)'] },
      { t: 'Tailwheel: flight training and a one-time endorsement.', c: ['cfr14:61.31(i)'] }
    ],
    refs: ['cfr14:61.31']
  },
  {
    id: 'p-legal', pave: 'P', title: 'Legality (Flight Review)',
    user: ['Flight Review (24 Calendar Months)', 'Min 1 Hr Ground & Flight', 'No Fail But Needs to be Satisfactory', 'Up to Discretion of Authorized Instructor or Examiner for Maneuvers and Procedures', 'Ground is For Rules & Regs', 'New Rating or Wings Program is a substitute'],
    acs: ['PA.I.A.K1'],
    facts: [
      { t: 'To act as PIC you need a flight review since the beginning of the 24th calendar month before this month: at least 1 hour of ground and 1 hour of flight training, covering Part 91 rules and maneuvers chosen by the instructor, with a logbook endorsement.', c: ['cfr14:61.56(a)', 'cfr14:61.56(c)'] },
      { t: 'A practical test for a new certificate or rating, or a phase of the FAA WINGS program, can take the place of the flight review.', c: ['cfr14:61.56(d)', 'cfr14:61.56(e)'] }
    ],
    refs: ['cfr14:61.56']
  },
  {
    id: 'p-currency', pave: 'P', title: 'Currency & Proficiency',
    user: ['Currency (To Carry Passengers in Preceding 90 Days, Day 3 T&L Night or Tailwheel 3 T&L to FS)', 'Proficiency (Skill, Comfortable with these Model Planes, Glass Cockpit, Good Decision Making)'],
    acs: ['PA.I.A.K1', 'PA.I.A.R1', 'PA.XI.A.R5'],
    facts: [
      { t: 'To carry passengers: 3 takeoffs and landings in the preceding 90 days as sole manipulator, in the same category, class, and type (if a type rating is required). Tailwheel: to a full stop in a tailwheel airplane.', c: ['cfr14:61.57(a)'] },
      { t: 'To carry passengers from 1 hour after sunset to 1 hour before sunrise: 3 takeoffs and landings to a full stop in that same night period within the preceding 90 days.', c: ['cfr14:61.57(b)'] },
      { t: 'Currency is the legal minimum. Proficiency is actually being able to fly safely in today’s conditions. The ACS tests that you know the difference.', c: ['acs:PA.I.A.R1'] }
    ],
    refs: ['cfr14:61.57']
  },
  {
    id: 'p-imsafe', pave: 'P', title: 'IMSAFE',
    user: ['Illness (AIM 8-1-2)', 'Contact AME about Medications, or OTC Medications Reference Guide', 'At Least 5X Dosage Interval Before Flying', 'Stress (Wait Until Head Is Clear To Make Good Decisions)', 'Alcohol (0.04 BAC, 8 Hrs “Bottle to Throttle” Rec. 12 - 24 Hrs)', 'Fatigue (Personal Min. Sleep)'],
    acs: ['PA.I.H.K1', 'PA.I.H.K2', 'PA.I.H.K3', 'PA.II.A.K1'],
    facts: [
      { t: 'IMSAFE = Illness, Medication, Stress, Alcohol, Fatigue, Emotion. A personal checklist for fitness to fly.', c: ['phak:2-8'] },
      { t: 'Medication: wait at least five maximal dosing intervals after the last dose before flying (e.g. a 5–6 hour dosing interval means waiting 30 hours).', c: ['phak:17-18'] },
      { t: 'Alcohol: no acting as a crewmember within 8 hours of drinking, while under the influence, or with 0.04 or greater alcohol concentration. The AIM recommends 12 to 24 hours.', c: ['cfr14:91.17(a)', 'aim:8-1-1'] }
    ],
    refs: ['aim:8-1-1', 'phak:2-8', 'phak:ch. 17']
  },
  {
    id: 'p-adm', pave: 'P', title: 'ADM',
    user: ['Decide Model (Detect, Estimate, Choose, Identify, Do, Evaluate)', '5 P’s (The Plan, The Plane, The Pilot, The Passengers, The Programming)', 'Personal Minimums'],
    acs: ['PA.I.H.K4', 'PA.I.C.R1b'],
    facts: [
      { t: 'DECIDE: Detect, Estimate, Choose a course of action, Identify solutions, Do the necessary actions, Evaluate the effects.', c: ['phak:2-18'] },
      { t: '5P: the Plan, the Plane, the Pilot, the Passengers, and the Programming, reviewed at decision points such as before departure and before takeoff.', c: ['phak:2-13'] },
      { t: 'PAVE (Pilot, Aircraft, enVironment, External pressures) is the FAA’s checklist for identifying hazards in flight planning.', c: ['phak:2-8'] }
    ],
    refs: ['phak:ch. 2', 'rmh:ch. 1']
  },
  {
    id: 'p-attitudes', pave: 'P', title: 'Hazardous Attitudes & Antidotes', added: true,
    user: [],
    acs: ['PA.I.H.R2', 'PA.I.H.K4'],
    facts: [
      { t: 'Anti-authority (“Don’t tell me.”) → “Follow the rules. They are usually right.”', c: ['phak:2-5'] },
      { t: 'Impulsivity (“Do it quickly.”) → “Not so fast. Think first.”', c: ['phak:2-5'] },
      { t: 'Invulnerability (“It won’t happen to me.”) → “It could happen to me.”', c: ['phak:2-5'] },
      { t: 'Macho (“I can do it.”) → “Taking chances is foolish.”', c: ['phak:2-5'] },
      { t: 'Resignation (“What’s the use?”) → “I’m not helpless. I can make a difference.”', c: ['phak:2-5'] }
    ],
    refs: ['phak:2-5']
  },
  {
    id: 'p-3p', pave: 'P', title: '3P Model (Perceive, Process, Perform)', added: true,
    user: [],
    acs: ['PA.I.H.K4'],
    facts: [{ t: 'Perceive the circumstances of the flight, Process by evaluating their impact on safety, Perform by implementing the best course of action. Usable in every phase of flight.', c: ['phak:2-15'] }],
    refs: ['phak:2-15', 'rmh:ch. 1']
  },

  // ───────────────────────────── AIRCRAFT ─────────────────────────────
  {
    id: 'a-engine', pave: 'A', title: 'Type & Engine',
    user: ['Cessna 152, Lycoming O-235-N2C', 'Normally Aspirated, Direct-Drive, Air-Cooled, Horizontally Opposed, Carbureted, Four Cylinder, 235 Cu In Displacement, 108 HP'],
    acs: ['PA.I.G.K1c'],
    facts: [
      { t: 'Avco Lycoming O-235-N2C: normally aspirated, direct-drive, air-cooled, horizontally opposed, carburetor-equipped, four-cylinder, 233.3 cu in displacement.', c: ['poh:1-3'] },
      { t: '108 rated BHP at 2550 RPM. Max engine speed 2550 RPM.', c: ['poh:1-3', 'poh:2-4'] },
      { t: 'Fixed-pitch, two-blade propeller, 69 in max / 67.5 in min diameter (POH lists the McCauley prop; check your airplane’s equipment list for the installed prop).', c: ['poh:1-3'] },
      { t: 'Static full-throttle RPM range (carb heat off, mixture leaned for max RPM): 2280–2380 RPM.', c: ['poh:2-4'] }
    ],
    refs: ['poh:Sec. 1', 'poh:Sec. 2', 'phak:ch. 7']
  },
  {
    id: 'a-docs', pave: 'A', title: 'Documents',
    user: ['Supplements (Garmin Manual)', 'Placards (Mag Deviation Card, INOP Equipment)', 'Radio Operating License (Outside US)', 'Operating Limitations, POH', 'Weight & Balance'],
    acs: ['PA.I.B.K1a'],
    facts: [
      { t: 'The POH Section 2 limitations, together with Section 9 supplements (e.g. GTN 650, GTX 345), are FAA-approved. Observing them is required by regulation.', c: ['poh:2-3'] },
      { t: 'Required placards include the kinds-of-operation placard, “intentional spins prohibited with flaps extended,” and “flight into known icing conditions prohibited.”', c: ['poh:2-9'] }
    ],
    refs: ['phak:ch. 9', 'poh:Sec. 2', 'poh:Sec. 9']
  },
  {
    id: 'a-awcert', pave: 'A', title: 'Airworthiness Certificate',
    user: ['NO Expiration', 'Can Be Revoked', 'Not Maintained In Airworthy Condition', 'No Longer Meets its Type Design (Major Alterations)', 'Out of AD Compliance', 'Major Damage'],
    acs: ['PA.I.B.K1a'],
    facts: [{ t: 'A standard airworthiness certificate stays effective as long as maintenance, preventive maintenance, and alterations are done per Parts 43 and 91 and the aircraft is U.S.-registered, unless surrendered, suspended, or revoked.', c: ['cfr14:21.181(a)'] }],
    refs: ['cfr14:21.181', 'phak:ch. 9']
  },
  {
    id: 'a-reg', pave: 'A', title: 'Registration',
    user: ['Expires 7 Yrs', 'Can Be Revoked', 'Ownership Transfer', 'Aircraft Destroyed', 'Owner Loss of Status or Citizenship'],
    acs: ['PA.I.B.K1a'],
    facts: [{ t: 'A Certificate of Aircraft Registration expires seven years after the last day of the month it was issued.', c: ['cfr14:47.40(a)'] }],
    refs: ['cfr14:47.40', 'cfr14:47.41']
  },
  {
    id: 'a-ads', pave: 'A', title: 'Airworthiness Directives',
    user: ['AD Compliance', 'One Time or Recurring', 'Emergency / Immediate or Specific Time Period'],
    acs: ['PA.I.B.K1c'],
    facts: [{ t: 'The owner or operator is primarily responsible for maintaining the aircraft in an airworthy condition, including compliance with ADs.', c: ['cfr14:91.403(a)'] }],
    refs: ['cfr14:91.403', 'phak:ch. 9']
  },
  {
    id: 'a-inspect', pave: 'A', title: 'Required Inspections',
    user: ['Annual Inspection (12 Calendar Months)', 'VOR Inspection (30 Days, IFR)', '100 HR Inspection (For Hire)', 'Altimeter / Static System Inspection (24 Calendar Months, IFR)', 'Transponder Inspection (24 Calendar Months)', 'ELT Inspection (12 Calendar Months)'],
    acs: ['PA.I.B.K1b'],
    facts: [
      { t: 'Annual inspection within the preceding 12 calendar months.', c: ['cfr14:91.409(a)'] },
      { t: '100-hour inspection when carrying a person for hire, or when giving flight instruction for hire in an aircraft the instructor provides (this covers flight school airplanes). It may be exceeded by up to 10 hours only to reach a place where the inspection can be done.', c: ['cfr14:91.409(b)'] },
      { t: 'VOR check within the preceding 30 days for IFR.', c: ['cfr14:91.171'] },
      { t: 'Altimeter, static system, and altitude-reporting equipment: within 24 calendar months to fly IFR in controlled airspace.', c: ['cfr14:91.411'] },
      { t: 'Transponder: tested and inspected within the preceding 24 calendar months.', c: ['cfr14:91.413'] },
      { t: 'ELT: inspected within 12 calendar months. Batteries replaced after more than 1 cumulative hour of use or 50% of useful life.', c: ['cfr14:91.207(c)', 'cfr14:91.207(d)'] }
    ],
    refs: ['cfr14:91.409', 'cfr14:91.207']
  },
  {
    id: 'a-sfp', pave: 'A', title: 'Special Flight Permits',
    user: ['Special Flight Permits, FSDO (Flight Service District Office)'],
    acs: ['PA.I.B.K1d'],
    facts: [{ t: 'FSDO = Flight Standards District Office. A special flight permit is effective for the period specified in the permit.', c: ['phak:1-9', 'cfr14:21.181(a)(2)'] }],
    refs: ['cfr14:21.197', 'phak:1-9']
  },
  {
    id: 'a-logs', pave: 'A', title: 'Maintenance Logs',
    user: ['Maintenance Logs (Check For)', 'Annual Inspection', '100 Hr Inspection', 'Propeller & Engine', 'ADs', 'ELT', 'Compare Actual Time', 'Look For Dates'],
    acs: ['PA.I.B.K1b'],
    facts: [{ t: 'The owner/operator must ensure maintenance personnel make the proper logbook entries approving the aircraft for return to service.', c: ['cfr14:91.405'] }],
    refs: ['cfr14:91.417', 'phak:ch. 9']
  },
  {
    id: 'a-prevmx', pave: 'A', title: 'Preventive Maintenance',
    user: ['Allows You To Perform Maintenance That Doesn’t involve Complex Assembly (Basic & Limited)', 'Light Bulbs', 'Tires', 'Reflectors', 'Fluids'],
    acs: ['PA.I.B.K2'],
    facts: [{ t: 'A certificated pilot may do preventive maintenance on an aircraft they own or operate that isn’t used under Parts 121, 129, or 135. The allowed items are listed in Part 43 Appendix A, and the work must be logged.', c: ['cfr14:43.3(g)', 'cfr14:43.9'] }],
    refs: ['cfr14:43.3(g)', 'cfr14:43.9']
  },
  {
    id: 'a-inop', pave: 'A', title: 'Inoperative Equipment',
    user: ['Find Inoperative Equipment', 'Check', 'Equipment List (MEL, Most GA Airplanes Don’t Have)', 'Type Certificate Data Sheet (TCDS)', 'Kinds of Operations Equipment List (KOEL, Don’t HAVE)', 'Supplemental Type Certificate (STC, Optional Installed Equipment)', 'AD Compliance', 'ATOMATOFLAMES (91.205)', 'Do You Feel Comfortable?', 'IF IT’S A GO:', 'Deactivate or Remove, Placard INOP, LOG IT.'],
    acs: ['PA.I.B.K3', 'PA.I.B.R1', 'PA.II.B.R2'],
    facts: [
      { t: 'Without an MEL you may fly with inoperative equipment only if it isn’t required by the VFR-day type certificate, the equipment list/KOEL, §91.205 or another rule, or an AD.', c: ['cfr14:91.213(d)'] },
      { t: 'Then it must be removed (with a maintenance record) or deactivated and placarded “Inoperative,” and a pilot or mechanic must determine it isn’t a hazard.', c: ['cfr14:91.213(d)(3)', 'cfr14:91.213(d)(4)'] }
    ],
    refs: ['cfr14:91.213', 'cfr14:91.205']
  },
  {
    id: 'a-perf', pave: 'A', title: 'V-Speeds & Limitations',
    user: ['V Speeds', 'Takeoff & Landing Distances'],
    acs: ['PA.I.F.K1', 'PA.I.F.R2', 'PA.IV.A.K2'],
    facts: [
      { t: 'Vne 149 KIAS · Vno 111 KIAS · Vfe 85 KIAS (flaps).', c: ['poh:2-3'] },
      { t: 'Va (maneuvering): 104 KIAS at 1,670 lb, 98 at 1,500 lb, 93 at 1,350 lb. It decreases as weight decreases.', c: ['poh:2-3'] },
      { t: 'Vx 55 KIAS · Vy 67 KIAS (sea level) · normal climb 70–80 KIAS.', c: ['poh:4-3'] },
      { t: 'Approach: 60–70 KIAS flaps up, 55–65 KIAS flaps 30° · short-field 54 KIAS. Max demonstrated crosswind 12 knots.', c: ['poh:4-3'] },
      { t: 'Airspeed indicator: white arc 35–85, green 40–111, yellow 111–149, red line 149 KIAS.', c: ['poh:2-4'] },
      { t: 'Load factors: flaps up +4.4g / −1.76g; flaps down +3.5g. Utility category.', c: ['poh:2-7'] }
    ],
    refs: ['poh:Sec. 2', 'poh:Sec. 4', 'poh:Sec. 5']
  },
  {
    id: 'a-wb', pave: 'A', title: 'Weight & Balance',
    user: ['Weight & Balance', 'CG', 'Aft CG vs Forward CG'],
    acs: ['PA.I.F.K2e', 'PA.I.F.K2f'],
    facts: [
      { t: 'Max ramp 1,675 lb; max takeoff and landing 1,670 lb.', c: ['poh:2-6'] },
      { t: 'Baggage: Area 1 max 120 lb, Area 2 max 40 lb, combined max 120 lb.', c: ['poh:2-6'] },
      { t: 'CG range: forward 31.0 in aft of datum at 1,350 lb or less, straight-line to 32.65 in at 1,670 lb; aft 36.5 in at all weights. Datum: front face of firewall.', c: ['poh:2-6'] }
    ],
    refs: ['poh:Sec. 6', 'phak:ch. 10', 'wbh:ch. 2']
  },
  {
    id: 'a-fuel', pave: 'A', title: 'Fuel System',
    user: ['Flight Controls', 'Fuel System', 'Fuel Rating', 'Carburetor'],
    acs: ['PA.I.G.K1e'],
    facts: [
      { t: 'Gravity-fed from two wing tanks through a shutoff valve and strainer to the carburetor. No fuel pump.', c: ['poh:7-19'] },
      { t: 'Standard tanks: 26 gal total, 24.5 gal usable. Long-range: 39 gal total, 37.5 gal usable.', c: ['poh:2-7'] },
      { t: 'Approved fuel: 100LL (blue) or grade 100 (green).', c: ['poh:2-8'] },
      { t: 'Venting matters: a blocked vent causes decreasing fuel flow and eventual engine stoppage. The left tank vents overboard; the right tank vents through the left and its filler cap.', c: ['poh:7-19'] }
    ],
    refs: ['poh:Sec. 7', 'phak:ch. 7']
  },
  {
    id: 'a-elec', pave: 'A', title: 'Electrical System',
    user: ['Electric System', 'Battery', 'Alternator', 'Magnetos'],
    acs: ['PA.I.G.K1f', 'PA.IX.C.K2a'],
    facts: [
      { t: '28-volt DC system with a 24-volt battery and a belt-driven 60-amp alternator.', c: ['poh:7-22'] },
      { t: 'Ignition comes from engine-driven magnetos, which work even with the master switch off.', c: ['poh:7-22'] },
      { t: 'Low-voltage light in flight: radios off, alternator breaker in, master off (both sides) then on, check light off, radios on. If it returns: alternator off, nonessential equipment off, and terminate the flight as soon as practical.', c: ['poh:3-8'] }
    ],
    refs: ['poh:Sec. 7', 'poh:3-8', 'phak:ch. 7']
  },
  {
    id: 'a-carbheat', pave: 'A', title: 'Carburetor Heat & Carb Ice',
    user: ['Carb Heat'],
    acs: ['PA.I.G.K1c', 'PA.IX.C.K1'],
    facts: [
      { t: 'Carb ice in the 152 shows up as a gradual loss of RPM, then roughness. Remedy: full throttle and carb heat full out until it runs smoothly, then carb heat off and reset the throttle.', c: ['poh:3-13'] },
      { t: 'If you need carb heat continuously in cruise, use the minimum amount needed and lean for max RPM.', c: ['poh:3-13'] },
      { t: 'Engine failure in flight: Airspeed 60 KIAS and Carb Heat ON are memory items.', c: ['poh:3-4'] }
    ],
    refs: ['poh:3-13', 'phak:ch. 7', 'awh:ch. 20']
  },
  {
    id: 'a-pitot', pave: 'A', title: 'Pitot-Static & Vacuum Instruments',
    user: ['Pitot Static System', 'Pitot Tube', 'ASI', 'Static Port', 'Altimeter', 'VSI', 'Airspeed Indicator Markings'],
    acs: ['PA.I.G.K1h', 'PA.IX.C.K2b', 'PA.IX.C.K2c'],
    facts: [
      { t: 'Airspeed indicator uses pitot and static pressure. Altimeter and VSI use static pressure only.', c: ['phak:ch. 8'] },
      { t: 'The attitude and heading indicators are driven by an engine-driven vacuum system. Normal suction 4.5–5.4 in. Hg.', c: ['poh:7-30', 'poh:2-5'] }
    ],
    refs: ['phak:ch. 8', 'poh:Sec. 7']
  },
  {
    id: 'a-hyd', pave: 'A', title: 'Hydraulic System (Brakes)',
    user: ['Hydraulic System'],
    acs: ['PA.I.G.K1e'],
    facts: [],
    refs: ['poh:Sec. 7']
  },
  {
    id: 'a-aero', pave: 'A', title: 'Aerodynamics',
    user: ['Understand Aerodynamics?', '4 Forces of Flight', 'AOA', 'Lift Generation', 'Induced Drag', 'Parasite Drag', 'Wingtip Vortices', 'Downwash', 'Stability vs Controllability', 'Load Factor', 'Turn Tendencies', 'Adverse Yaw', 'Spin Recovery'],
    acs: ['PA.I.F.K3', 'PA.VII.D.K1', 'PA.VII.D.K3'],
    facts: [
      { t: 'Spin recovery (C152): ailerons neutral, throttle idle, full opposite rudder, then just after the rudder hits the stop, brisk forward elevator to break the stall. Hold until rotation stops, then neutralize rudder and recover from the dive.', c: ['poh:3-12', 'poh:3-13'] },
      { t: 'Intentional spins are prohibited with flaps extended.', c: ['poh:2-9'] }
    ],
    refs: ['phak:ch. 4', 'phak:ch. 5', 'afh:ch. 5']
  },
  {
    id: 'a-preflight', pave: 'A', title: 'Preflight Inspection',
    user: ['Preflight Inspections'],
    acs: ['PA.II.A.K3'],
    facts: [],
    refs: ['poh:Sec. 4', 'afh:ch. 2']
  },

  // ───────────────────────────── ENVIRONMENT ─────────────────────────────
  {
    id: 'v-nav', pave: 'V', title: 'Navigation',
    user: ['Pilotage', 'Deduced Reckoning', 'VOR', 'Navigation Definition', 'Course, Track, Heading', 'NAV LOG'],
    acs: ['PA.VI.A.K1', 'PA.VI.B.K1', 'PA.VI.B.K2'],
    facts: [
      { t: 'VFR cruising altitudes more than 3,000 ft AGL: magnetic course 0–179° → odd thousands + 500 (3,500, 5,500…); 180–359° → even thousands + 500.', c: ['cfr14:91.159(a)'] }
    ],
    refs: ['phak:ch. 16', 'aim:1-1-3']
  },
  {
    id: 'v-flightplan', pave: 'V', title: 'Elements of a Flight Plan',
    user: ['Aircraft Info', 'Pilot Info', 'Route', 'ETE', 'Fuel Required', 'Souls on Board', 'Types of Airspeed', 'Cruising Altitude and Mag Course', 'Departure Airport', 'Arrival Airport', 'Alternates'],
    acs: ['PA.I.D.K4', 'PA.I.D.K5'],
    facts: [],
    refs: ['aim:5-1-5']
  },
  {
    id: 'v-fuelreq', pave: 'V', title: 'VFR Fuel Requirements', added: true,
    user: [],
    acs: ['PA.I.D.K3c', 'PA.I.D.R6'],
    facts: [{ t: 'Considering wind and forecast weather, enough fuel to reach the first point of intended landing, then fly at normal cruise for 30 minutes (day) or 45 minutes (night).', c: ['cfr14:91.151(a)'] }],
    refs: ['cfr14:91.151']
  },
  {
    id: 'v-lost', pave: 'V', title: 'Lost Procedures',
    user: ['Lost Procedures 5 C’s'],
    acs: ['PA.VI.D.K1', 'PA.VI.D.K2', 'PA.VI.D.R4'],
    facts: [
      { t: 'FAA guidance: climb (being mindful of traffic and weather) for better radio, navigation and radar coverage; use VOR/GPS to fix your position; communicate with any facility for radar vectors or direction-finding help.', c: ['phak:16-34'] },
      { t: 'In distress or urgency: climb if possible, squawk 7700 if not already in contact with ATC, and transmit MAYDAY or PAN-PAN.', c: ['aim:6-3-2'] }
    ],
    refs: ['phak:16-34', 'aim:6-3-2']
  },
  {
    id: 'v-lostcomm', pave: 'V', title: 'Lost Comms & Light Gun Signals',
    user: ['Lost Comms Procedures, Light Gun'],
    acs: ['PA.III.A.K3', 'PA.III.A.K5'],
    facts: [{ t: 'Squawk 7600 to indicate radio failure.', c: ['aim:6-4-2'] }],
    refs: ['aim:4-2-13', 'aim:4-3-13', 'aim:6-4-2']
  },
  {
    id: 'v-airport', pave: 'V', title: 'Runways, Patterns & Frequencies',
    user: ['Runway Lengths', 'Runway', 'Traffic Pattern Altitudes and Directions', 'Frequencies', 'Flight Following'],
    acs: ['PA.III.B.K1', 'PA.II.D.K1'],
    facts: [
      { t: 'KHIO: field elevation 208 ft. Pattern altitude 1,208 MSL (1,000 AGL); turbine and large aircraft 1,708. Right traffic for Rwy 02 and Rwy 31R.', c: ['cs:KHIO'] },
      { t: 'KHIO: Tower 119.3, Ground 121.7, ATIS 127.65. Class D when the tower is open (1400–0600Z‡), otherwise Class E.', c: ['cs:KHIO'] }
    ],
    refs: ['cs:KHIO', 'aim:4-3-3']
  },
  {
    id: 'v-wx-general', pave: 'V', title: 'General Weather',
    user: ['Surface Analysis Charts', 'Prog Charts', 'High Pressure', 'Low Pressure', 'Stability', 'Wind Direction', 'Fronts', 'Clouds', 'Precipitation', 'Turbulence', 'Icing', 'Fog', 'Visibility', 'Smoke, Haze', 'Thunderstorms'],
    acs: ['PA.I.C.K3'],
    facts: [],
    refs: ['awh:ch. 11', 'awh:ch. 13', 'awh:ch. 16', 'awh:ch. 20', 'awh:ch. 22']
  },
  {
    id: 'v-wx-enroute', pave: 'V', title: 'En-Route Weather',
    user: ['Flight Categories', 'AIRMET, SIGMET, Convective SIGMET', 'METARs', 'TAFs', 'PIREPs', 'Winds Aloft'],
    acs: ['PA.I.C.K1', 'PA.I.C.K2', 'PA.I.C.R2b'],
    facts: [],
    refs: ['aim:7-1-7', 'aim:7-1-28', 'awh:ch. 24', 'awh:ch. 26', 'awh:ch. 27']
  },
  {
    id: 'v-airspace', pave: 'V', title: 'Airspace',
    user: ['Airspace Floor & Ceiling', 'VFR Weather Minimums', 'Equipment List Requirements', 'Sectional Chart', 'Speed Limits', 'Special VFR', 'NOTAMs', 'TFRs', 'Special Use Airspaces'],
    acs: ['PA.I.E.K1', 'PA.I.E.K2', 'PA.I.E.K3'],
    facts: [
      { t: 'Class B, C, D, and E below 10,000 MSL: 3 SM visibility. Class B: clear of clouds. Class C, D, E: 500 below, 1,000 above, 2,000 horizontal.', c: ['cfr14:91.155(a)'] },
      { t: 'Class E at or above 10,000 MSL: 5 SM, 1,000 below, 1,000 above, 1 SM horizontal.', c: ['cfr14:91.155(a)'] },
      { t: 'Class G at 1,200 AGL or less: day 1 SM and clear of clouds; night 3 SM and 500/1,000/2,000.', c: ['cfr14:91.155(a)'] },
      { t: 'Within the surface area of Class B, C, D, or E for an airport: ceiling at least 1,000 ft and ground visibility at least 3 SM to take off, land, or enter the pattern under VFR (unless Special VFR).', c: ['cfr14:91.155(c)', 'cfr14:91.155(d)'] }
    ],
    refs: ['aim:3-2-1', 'phak:ch. 15', 'cug:VFR Terms and Symbols']
  },
  {
    id: 'v-wake', pave: 'V', title: 'Wake Turbulence', added: true,
    user: [],
    acs: ['PA.II.F.R3', 'PA.III.B.R3', 'PA.IV.A.R2d'],
    facts: [],
    refs: ['aim:7-4-1', 'aim:7-4-6']
  },
  {
    id: 'v-mountain', pave: 'V', title: 'Mountain & Terrain Considerations', added: true,
    user: [],
    acs: ['PA.I.C.K3b', 'PA.I.D.K2', 'PA.IX.D.K3b'],
    facts: [{ t: 'Plan altitudes for terrain and obstacles in advance, especially at night or in low visibility.', c: ['phak:2-9'] }],
    refs: ['awh:ch. 16', 'phak:2-9']
  },
  {
    id: 'v-transponder', pave: 'V', title: 'Transponder, ADS-B & Emergency Codes', added: true,
    user: [],
    acs: ['PA.III.A.K4', 'PA.VI.B.K4', 'PA.IX.B.K6'],
    facts: [
      { t: '7700 = emergency (when not already talking to ATC), 7600 = radio failure. 121.5 MHz is the emergency frequency.', c: ['aim:6-3-2', 'aim:6-4-2', 'aim:6-3-1'] }
    ],
    refs: ['aim:4-1-20', 'aim:6-2-2', 'gtx:Operation']
  },
  {
    id: 'v-ntsb', pave: 'V', title: 'NTSB 830 Reporting',
    user: ['NTSB Reporting'],
    acs: ['PA.III.A.K8'],
    facts: [
      { t: 'Notify the NTSB immediately after an accident or listed serious incidents, including flight control failure, crewmember unable to perform duties, in-flight fire, in-flight collision, and property damage over $25,000; and when an aircraft is overdue and believed in an accident.', c: ['cfr49:830.5'] },
      { t: 'File a report within 10 days after an accident, or after 7 days if an overdue aircraft is still missing.', c: ['cfr49:830.15(a)'] }
    ],
    refs: ['cfr49:830.5', 'cfr49:830.15']
  },

  // ───────────────── EXTERNAL FACTORS (owner's layout kept) ─────────────────
  {
    id: 'e-pressures', pave: 'E', title: 'External Pressures', added: true,
    user: [],
    acs: ['PA.I.D.R4', 'PA.II.A.R4'],
    facts: [
      { t: 'External pressures are influences outside the flight that create pressure to complete it, often at the expense of safety: someone waiting at the destination, a passenger you don’t want to disappoint, wanting to impress someone, get-there-itis.', c: ['phak:2-9'] }
    ],
    refs: ['phak:2-9', 'rmh:ch. 1']
  },
  {
    id: 'e-perf', pave: 'E', title: 'Aircraft Performance (Altitudes)',
    user: ['Pressure Altitude', 'Density Altitude', 'Types of Altitude'],
    acs: ['PA.I.F.K2a'],
    facts: [],
    refs: ['phak:ch. 11', 'poh:Sec. 5']
  },
  {
    id: 'e-airportops', pave: 'E', title: 'Airport Operations',
    user: ['Signage', 'Markings', 'Lighting', 'Hot Spots', 'Runway Incursions', 'TPA', 'Diagram', 'Chart Supplement', 'Right-Of-Way', 'LAHSO'],
    acs: ['PA.II.D.K3', 'PA.II.D.R4', 'PA.III.B.K3'],
    facts: [{ t: 'KHIO has LAHSO: landing Rwy 13R, hold short of Rwy 02-20, with 4,922 ft of landing distance available.', c: ['cs:KHIO'] }],
    refs: ['phak:ch. 14', 'aim:4-3-11', 'cfr14:91.113']
  },
  {
    id: 'e-aeromed', pave: 'E', title: 'Aero-Medical Factors',
    user: ['Hypoxia Types and Solutions', 'Hyperventilation and Solutions', 'Spatial Disorientation and Solution', 'CO Poisoning and Solution', 'Decompression Sickness and Solutions', 'Illusions', 'Night Visual Illusions'],
    acs: ['PA.I.H.K1'],
    facts: [],
    refs: ['phak:ch. 17', 'aim:8-1-2', 'aim:8-1-3', 'aim:8-1-4', 'aim:8-1-5']
  },
  {
    id: 'e-regs', pave: 'E', title: 'FAA Rules and Regulations',
    user: ['Minimum Safe Alts.', 'Night Definitions', 'Seatbelts', 'Oxygen'],
    acs: ['PA.I.A.K2', 'PA.XI.A.K3'],
    facts: [
      { t: 'Night (14 CFR 1.1) = end of evening civil twilight to beginning of morning civil twilight. Position lights required sunset to sunrise. Night passenger currency counts 1 hour after sunset to 1 hour before sunrise.', c: ['cfr14:1.1', 'cfr14:91.209(a)', 'cfr14:61.57(b)'] },
      { t: 'Oxygen: required crew must use it above 12,500 up to 14,000 ft cabin altitude for flight longer than 30 minutes, and at all times above 14,000. Above 15,000, every occupant must be provided oxygen.', c: ['cfr14:91.211(a)'] },
      { t: 'Seatbelts: the PIC must brief each person on how to fasten and unfasten belts and harnesses, and ensure everyone is told to fasten them for taxi, takeoff, and landing.', c: ['cfr14:91.107(a)'] }
    ],
    refs: ['cfr14:91.119', 'cfr14:91.107', 'cfr14:91.211']
  },
  {
    id: 'e-brief', pave: 'E', title: 'Passenger Briefing', added: true,
    user: [],
    acs: ['PA.II.B.K1', 'PA.II.B.R3'],
    facts: [{ t: 'Before takeoff, brief each person on how to fasten and unfasten their safety belt and shoulder harness.', c: ['cfr14:91.107(a)(1)'] }],
    refs: ['cfr14:91.107']
  }
];
