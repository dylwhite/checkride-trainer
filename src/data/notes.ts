// Notes Check: items in the owner's outline that are wrong, outdated, or incomplete.
// `you` quotes the outline line; `fix` is the correction; `c` are the citations it was checked against.

export type NoteKind = 'wrong' | 'incomplete' | 'wording';

export interface Note {
  id: string;
  topicId: string;
  kind: NoteKind;
  you: string;
  fix: string;
  c: string[];
}

export const NOTES: Note[] = [
  // ── Wrong ──
  {
    id: 'n-fsdo', topicId: 'a-sfp', kind: 'wrong',
    you: 'FSDO (Flight Service District Office)',
    fix: 'FSDO stands for Flight Standards District Office. Flight Service Stations are a different service (pilot briefings, flight plans, help for lost aircraft).',
    c: ['phak:1-9', 'aim:4-1-3']
  },
  {
    id: 'n-glider', topicId: 'p-privileges', kind: 'wrong',
    you: 'Glider Towing (… Preceding 12 Months 3 Sim or Actual …)',
    fix: 'The recency window is 24 calendar months, not 12: within the preceding 24 calendar months, 3 actual or simulated tows with a qualified pilot, or 3 flights as PIC of a glider being towed. You also need 100 hours PIC in the towing aircraft’s category, class (and type) and an instructor endorsement.',
    c: ['cfr14:61.69(a)']
  },
  {
    id: 'n-displacement', topicId: 'a-engine', kind: 'wrong',
    you: '235 Cu In Displacement',
    fix: 'Your POH lists the O-235-N2C at 233.3 cubic inches displacement. The “235” in the model name is a rounded figure.',
    c: ['poh:1-3']
  },
  {
    id: 'n-aim', topicId: 'p-imsafe', kind: 'wrong',
    you: 'Illness (AIM 8-1-2)',
    fix: 'Fitness for flight (illness, medication, alcohol, fatigue, stress, emotion) is AIM 8-1-1. AIM 8-1-2 is “Effects of Altitude” (hypoxia, ear block, DCS).',
    c: ['aim:8-1-1', 'aim:8-1-2']
  },
  // ── Incomplete ──
  {
    id: 'n-141', topicId: 'p-cert', kind: 'incomplete',
    you: 'Part 141 Hour Minimums (Ground 35, Dual 20, XC 3, Solo 5, Sim Inst. 3, Night 3, Total 35, T&L 10 FS)',
    fix: 'Your numbers are right. Missing pieces: the night training must include a cross-country of more than 100 NM total distance; 3 hours of practical-test prep within 60 days before the test; the 5 hours solo must include a 100 NM cross-country with 3 landing points and one leg over 50 NM, plus 3 full-stop takeoffs and landings at a towered airport. “Sim Inst.” is instrument training: flight by reference to instruments.',
    c: ['cfr14:141 App. B 4(b)(1)', 'cfr14:141 App. B 5(a)']
  },
  {
    id: 'n-medical', topicId: 'p-medical', kind: 'incomplete',
    you: '1st … 2nd … 3rd (Private, CFI, Student) 60 Months Before 40 Yrs, 24 Months After 40 Yrs',
    fix: 'Durations are calendar months: the medical expires at the end of the last day of the 12th/24th/60th month after the exam month. Age is your age on the exam date. A CFI needs a medical only when acting as PIC or a required crewmember. A first- or second-class medical still covers private privileges after its higher privileges lapse, for the third-class period.',
    c: ['cfr14:61.23(d)', 'cfr14:61.23(a)(3)(ii)', 'cfr14:61.23(b)(7)']
  },
  {
    id: 'n-basicmed', topicId: 'p-basicmed', kind: 'incomplete',
    you: 'Pass CMEC · Complete Online Course · VFR or IFR within US · Below 18,000 MSL',
    fix: 'Your limits are correct under the current rule. Add the timing: the online course every 24 calendar months, and the physician exam (CMEC) every 48 calendar months. Altitude limit is not more than 18,000 ft MSL. Outside the U.S. is allowed only if that country authorizes it.',
    c: ['cfr14:61.23(c)(3)(i)', 'cfr14:61.113(i)']
  },
  {
    id: 'n-currency', topicId: 'p-currency', kind: 'incomplete',
    you: 'Currency (To Carry Passengers in Preceding 90 Days, Day 3 T&L Night or Tailwheel 3 T&L to FS)',
    fix: 'Day: 3 takeoffs and landings in 90 days, sole manipulator, same category and class (and type if required). Night: 3 to a full stop, done between 1 hour after sunset and 1 hour before sunrise, to carry passengers in that period. Tailwheel: full stop in a tailwheel airplane.',
    c: ['cfr14:61.57(a)', 'cfr14:61.57(b)']
  },
  {
    id: 'n-100hr', topicId: 'a-inspect', kind: 'incomplete',
    you: '100 HR Inspection (For Hire)',
    fix: 'It also applies when giving flight instruction for hire in an aircraft the instructor provides, which is why your school’s 152 needs one. The 100 hours may be exceeded by up to 10 hours only to fly to a place where the inspection can be done.',
    c: ['cfr14:91.409(b)']
  },
  {
    id: 'n-elt', topicId: 'a-inspect', kind: 'incomplete',
    you: 'ELT Inspection (12 Calendar Months)',
    fix: 'Correct. Also: ELT batteries must be replaced (or recharged) after more than 1 cumulative hour of use, or when 50% of their useful life has expired.',
    c: ['cfr14:91.207(c)', 'cfr14:91.207(d)']
  },
  {
    id: 'n-inop', topicId: 'a-inop', kind: 'incomplete',
    you: 'Deactivate or Remove, Placard INOP, LOG IT.',
    fix: 'One more required step: a certificated pilot or a person qualified to maintain the aircraft must determine that the inoperative item does not create a hazard. If it’s removed, the cockpit control is placarded and the maintenance recorded per §43.9.',
    c: ['cfr14:91.213(d)(3)', 'cfr14:91.213(d)(4)']
  },
  {
    id: 'n-prevmx', topicId: 'a-prevmx', kind: 'incomplete',
    you: 'Allows You To Perform Maintenance That Doesn’t involve Complex Assembly',
    fix: 'Only on an aircraft you own or operate that isn’t used under Parts 121, 129, or 135, only for items listed in Part 43 Appendix A, and the work must be recorded in the maintenance records.',
    c: ['cfr14:43.3(g)', 'cfr14:43.9']
  },
  {
    id: 'n-awcert', topicId: 'a-awcert', kind: 'incomplete',
    you: 'Out of AD Compliance · Major Damage · No Longer Meets its Type Design',
    fix: 'The certificate itself stays effective as long as maintenance and alterations follow Parts 43 and 91 and the aircraft stays U.S.-registered (unless surrendered, suspended, or revoked). Being out of AD compliance makes the airplane unairworthy; complying with ADs is the owner/operator’s responsibility.',
    c: ['cfr14:21.181(a)', 'cfr14:91.403(a)']
  },
  {
    id: 'n-5cs', topicId: 'v-lost', kind: 'incomplete',
    you: 'Lost Procedures 5 C’s',
    fix: 'The “5 C’s” is a popular memory aid but isn’t in FAA publications. On the checkride, back it with the FAA guidance: climb (watching traffic and weather) for better radio, navigation, and radar coverage; fix your position with VOR or GPS; communicate with any facility for radar vectors or direction-finding help; squawk 7700 if in distress and not already talking to ATC.',
    c: ['phak:16-34', 'aim:6-3-2']
  },
  {
    id: 'n-docs', topicId: 'p-resp', kind: 'incomplete',
    you: 'Must Have Medical, Government Issued Photo ID, Pilot Certificate on Person',
    fix: 'The rule says in your physical possession or readily accessible in the aircraft.',
    c: ['cfr14:61.3']
  },
  // ── Wording ──
  {
    id: 'n-license', topicId: 'p-qual', kind: 'wording',
    you: 'Private Pilot License',
    fix: 'The FAA term is private pilot certificate. Examiners notice the difference.',
    c: ['cfr14:61.5']
  },
  {
    id: 'n-ads-heading', topicId: 'a-inspect', kind: 'wording',
    you: 'ADs → Annual, VOR, 100 HR, Altimeter/Static, Transponder, ELT',
    fix: 'That list is required inspections, not ADs. ADs are a separate item (one-time or recurring compliance under Part 39). The Study Guide shows them as two topics.',
    c: ['cfr14:91.409', 'cfr14:91.403(a)']
  },
  {
    id: 'n-fuel', topicId: 'a-fuel', kind: 'wording',
    you: 'Fuel Rating',
    fix: 'Called fuel grade. Your POH approves 100LL (blue) and grade 100 (green).',
    c: ['poh:2-8']
  },
  {
    id: 'n-external', topicId: 'e-pressures', kind: 'wording',
    you: 'EXTERNAL FACTORS: Aircraft Performance, Airport Operations, Aero-Medical Factors, FAA Rules',
    fix: 'Kept in your layout, as you asked. Note that in the FAA’s PAVE checklist, “E” means External pressures (get-there-itis, passengers, schedules). That topic has been added to your E section.',
    c: ['phak:2-9']
  }
];
