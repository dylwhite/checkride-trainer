// Chart batch 2: real Seattle sectional excerpts (FAA, 29 Oct 2026 edition) along likely routes.
// Every symbol reading is checked against the FAA Chart Users' Guide and the Chart Supplement.
import type { ChartRef, Item } from './types';

type C = [string, boolean, string?];
const ch = (list: C[]) => list.map(([t, ok, why]) => (ok ? { t, ok: true } : { t, why }));
const K = (o: Omit<Item, 'kind' | 'xp' | 'choices' | 'pave'> & { choices: C[]; chart: ChartRef }): Item => ({ kind: 'chart', pave: 'V', xp: 15, ...o, choices: ch(o.choices) });

const OLM: ChartRef = { src: 'charts/olm.jpg', chart: 'Seattle', caption: 'Olympia (OLM), Joint Base Lewis-McChord, and the Rainier MOA' };
const HOOD: ChartRef = { src: 'charts/hood.jpg', chart: 'Seattle', caption: 'Mt. Hood and the Columbia Gorge' };
const AST: ChartRef = { src: 'charts/kast.jpg', chart: 'Seattle', caption: 'Astoria (AST) and the north Oregon coast' };
const SLE: ChartRef = { src: 'charts/ksle.jpg', chart: 'Seattle', caption: 'Salem (SLE) and Independence (7S5)' };

export const CHARTS2: Item[] = [
  // ───── Olympia ─────
  K({ id: 'c2-olm-night', topic: 'v-airport', acs: ['PA.I.E.K2', 'PA.XI.A.K2'], chart: OLM,
    setup: ['You’re arriving at Olympia late at night. The data block reads “CT – 124.4 ★ C” and “209 *L 55 122.95”. The Chart Supplement says the tower operates 1600–0400Z‡.'],
    prompt: 'The tower is closed. How do you get the runway lights on?',
    choices: [
      ['The asterisk before L means lighting limitations: per the Supplement, activate the lights on the CTAF, 124.4.', true],
      ['Click the mic on 122.95, the UNICOM frequency shown in the data block.', false, 'The Supplement says to activate the lights on the CTAF, which here is the tower frequency, 124.4.'],
      ['The L means the lights are on all night, so no action is needed.', false, 'The asterisk means lighting limitations exist; check the Supplement.'],
      ['Call Seattle Center and ask them to turn the lights on.', false, 'The Supplement lists pilot activation on the CTAF.']
    ],
    explain: ['CUG: **★ = part-time tower**, **C** follows the CTAF, **\\*L = lighting limitations exist; refer to the Chart Supplement**. KOLM Supplement: when the tower is closed, **activate HIRL Rwy 17–35, MALSR, REIL, and taxiway lights on the CTAF (124.4)**. The airspace becomes **Class E** when the tower is closed.'],
    c: ['cug:p. 15', 'cs:KOLM'] }),
  K({ id: 'c2-olm-sua', topic: 'v-airspace', acs: ['PA.I.E.K3'], chart: OLM,
    setup: ['East of Olympia you see blue hatched boundaries labeled R-6703A through J, and a magenta boundary labeled RAINIER 1 MOA.'],
    prompt: 'Which can you fly through VFR without permission while active?',
    choices: [
      ['The Rainier MOA, with extreme caution. The restricted areas need permission from the using or controlling agency.', true],
      ['Both, with extreme caution and your transponder on.', false, 'Entering an active restricted area requires permission (§91.133).'],
      ['Neither: both are closed to civil aircraft whenever active.', false, 'VFR flight through an active MOA is allowed, with caution.'],
      ['The restricted areas, as long as you stay above 1,500 AGL.', false, 'Restricted areas have charted altitudes; you need permission to enter when active.']
    ],
    explain: ['**Restricted areas** (blue hatched) contain often-invisible hazards like artillery firing; no person may operate in one **without permission of the using or controlling agency** when it’s active. **MOAs** (magenta) separate military training from IFR traffic; **VFR pilots should use extreme caution**. Times and altitudes are listed in the SUA table on the chart margin.'],
    c: ['cfr14:91.133(a)', 'aim:3-4-3', 'aim:3-4-5', 'cug:p. 17', 'cug:p. 20'] }),
  K({ id: 'c2-olm-mef', topic: 'v-airspace', acs: ['PA.I.E.K2', 'PA.VI.A.K1'], chart: OLM,
    setup: ['Near Olympia, a large blue “47” sits in the quadrant.'],
    prompt: 'What does it tell you?',
    choices: [
      ['4,700 ft MSL: the highest elevation in that quadrant, including obstacles, rounded up with an allowance.', true],
      ['Fly at least 4,700 ft MSL to stay legal over that quadrant.', false, 'An MEF isn’t a minimum legal altitude; it shows the highest elevation in the quadrant.'],
      ['The tallest obstacle in the quadrant is 4,700 ft AGL.', false, 'MEFs are in feet MSL and include terrain and obstacles.'],
      ['The floor of controlled airspace is 4,700 ft MSL there.', false, 'Airspace floors are shown with vignettes or boxed numbers, not MEFs.']
    ],
    explain: ['The **Maximum Elevation Figure** represents the highest elevation within a quadrant (30′ × 30′), **including terrain and other vertical obstacles**, in **hundreds of feet MSL**, rounded up.'],
    c: ['cug:p. 12'] }),
  K({ id: 'c2-olm-obst', topic: 'v-airspace', acs: ['PA.I.E.K2'], chart: OLM,
    setup: ['North of Olympia, an obstruction is labeled “398 (207)”. You plan to pass near it at 900 ft MSL.'],
    prompt: 'How much clearance above its top will you have?',
    choices: [
      ['About 500 ft: its top is 398 ft MSL (it’s 207 ft tall).', true],
      ['About 690 ft: its top is 207 ft MSL.', false, 'The number in parentheses is height above ground, not MSL.'],
      ['About 300 ft: add the two numbers to get its top, 605 ft MSL.', false, 'The top number is already the top’s elevation in MSL.'],
      ['It can’t be known without the ground elevation.', false, 'The top elevation MSL is printed: 398.']
    ],
    explain: ['CUG: obstruction elevation of the **top in feet MSL**, with the **height above ground in parentheses** below it.'],
    c: ['cug:p. 11'] }),
  K({ id: 'c2-olm-refuge', topic: 'v-airspace', acs: ['PA.I.E.K3'], chart: OLM,
    setup: ['Your route north from Olympia passes over the area labeled NISQUALLY NATIONAL WILDLIFE REFUGE.'],
    prompt: 'What altitude should you plan over it?',
    choices: [
      ['At least 2,000 ft above the surface, as the AIM requests.', true],
      ['At least 500 ft above the surface, the usual minimum over open areas.', false, 'The AIM requests 2,000 ft over wildlife refuges.'],
      ['At least 1,000 ft above the highest obstacle within 2,000 ft.', false, 'That’s the congested-area rule in §91.119.'],
      ['Any altitude; refuges only restrict drones.', false, 'Pilots are requested to stay at least 2,000 ft above the surface.']
    ],
    explain: ['AIM 7-5-6: pilots are **requested to maintain at least 2,000 ft above the surface** of National Wildlife Refuges, National Parks, Wilderness areas, and similar lands. The chart outlines these areas.'],
    c: ['aim:7-5-6', 'cug:p. 29'] }),
  K({ id: 'c2-olm-pvt', topic: 'v-airport', acs: ['PA.I.E.K2'], chart: OLM,
    setup: ['On the way to Olympia you have a rough-running engine and spot GOWER FLD (Pvt), shown as a circled R, “130 – 18”.'],
    prompt: 'What do you know about it?',
    choices: [
      ['It’s private use, not open to the public without permission. In an emergency, any suitable field is fair game.', true],
      ['It’s a restricted military field; landing there is prohibited.', false, 'Pvt means private use, not military.'],
      ['It’s a public airport with an 1,800 ft runway and full services.', false, 'Pvt means private use, not available to the general public.'],
      ['The R means it has radar service.', false, 'The R marks a private (restricted) landing area.']
    ],
    explain: ['CUG: **Pvt = private use, not available to the general public**. Elevation is 130 ft and the longest runway is about 1,800 ft. In an emergency the PIC may deviate as needed (§91.3(b)).'],
    c: ['cug:p. 64', 'cug:p. 23', 'cfr14:91.3(b)'] }),

  // ───── Mt. Hood ─────
  K({ id: 'c2-hood-mef', topic: 'v-mountain', acs: ['PA.I.E.K2', 'PA.VI.A.K1'], chart: HOOD,
    setup: ['Mt. Hood’s summit is charted at 11,239 ft. The quadrant’s MEF reads “116”.'],
    prompt: 'Why is the MEF higher than the summit?',
    choices: [
      ['11,239 + 100 ft possible error + 200 ft allowance for uncharted obstacles = 11,539, rounded up to 11,600.', true],
      ['It adds a required 1,000 ft of terrain clearance, then rounds down.', false, 'MEFs add a possible-error value and a 200 ft allowance, then round up.'],
      ['It’s the summit rounded up to the next 500 ft.', false, 'Rounding is up to the next 100 ft, after adding error and allowance.'],
      ['It includes a 2,000 ft mountainous-area buffer.', false, 'That buffer is an IFR rule, not part of an MEF.']
    ],
    explain: ['CUG: for a natural terrain feature, add the **possible vertical error (100 ft)** and a **200 ft allowance for uncharted obstacles**, then **round up** to the next 100 ft. 11,239 + 300 = 11,539 → **11,600**.'],
    c: ['cug:p. 13'] }),
  K({ id: 'c2-hood-wilderness', topic: 'v-mountain', acs: ['PA.I.E.K3', 'PA.VI.A.R1'], chart: HOOD,
    setup: ['You’d like to sightsee around Mt. Hood. The summit is inside the Mt. Hood Wilderness Area outline.'],
    prompt: 'What should you plan for?',
    choices: [
      ['At least 2,000 ft above the surface over the wilderness area, plus strong winds and downdrafts near the peak: give it a wide berth.', true],
      ['500 ft above the summit is fine in a 152.', false, 'The AIM requests 2,000 ft over wilderness areas, and mountain winds call for more margin.'],
      ['Wilderness areas are prohibited airspace; stay out entirely.', false, 'It’s a requested minimum altitude, not prohibited airspace.'],
      ['Stay within 1,000 ft of the slopes to use the ridge lift.', false, 'Mountain wave and downdrafts near terrain can exceed a 152’s climb ability.']
    ],
    explain: ['AIM 7-5-6 requests **2,000 ft above the surface** over wilderness areas. Mt. Hood’s 11,239 ft summit also means density altitude, downdrafts, and the 152’s limited climb all matter.'],
    c: ['aim:7-5-6', 'cug:p. 29', 'phak:12-10'] }),
  K({ id: 'c2-hood-isogonic', topic: 'v-nav', acs: ['PA.VI.A.K5a'], chart: HOOD,
    setup: ['A dashed magenta line labeled 14°30′E crosses the excerpt. Your true course across it is 090°.'],
    prompt: 'What is your magnetic course?',
    choices: [
      ['About 076°: subtract easterly variation.', true],
      ['About 105°: add easterly variation.', false, 'East is least: subtract easterly variation.'],
      ['090°: variation only matters for headings, not courses.', false, 'True course converts to magnetic course using variation.'],
      ['About 082°: subtract half the variation.', false, 'Subtract the full variation.']
    ],
    explain: ['An **isogonic line** connects points of equal variation. To go from true to magnetic: **subtract easterly, add westerly** (“east is least, west is best”). 090 − 14.5 ≈ **076°**.'],
    c: ['phak:16-8', 'cug:p. 32'] }),
  K({ id: 'c2-hood-magdist', topic: 'v-nav', acs: ['PA.VI.A.K2'], chart: HOOD,
    setup: ['A magenta-boxed note says: “Magnetic disturbance of as much as 8° exists at ground level between Bridal Veil and Troutdale.”'],
    prompt: 'What does it mean for you?',
    choices: [
      ['Expect your magnetic compass to be off by up to 8° in that area; cross-check with GPS and landmarks.', true],
      ['GPS signals are unreliable there; use the compass.', false, 'The note is about magnetic disturbance, which affects the compass.'],
      ['The isogonic lines there are wrong by 8°.', false, 'It’s a local disturbance, not an error in the charted variation.'],
      ['Flight below 8,000 ft is prohibited there.', false, 'The note is advisory and creates no restriction.']
    ],
    explain: ['Local magnetic disturbances deflect the compass. Cross-check with other sources (GPS, landmarks along the Columbia River) and don’t rely on the compass alone there.'],
    c: ['phak:8-24'] }),

  // ───── Astoria ─────
  K({ id: 'c2-ast-classe', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.C.R1'], chart: AST,
    vars: { wx: ['OVC008, 5 SM', 'BKN009, 6 SM'] },
    setup: ['Astoria is surrounded by a dashed magenta line. The ASOS reports {wx}.'],
    prompt: 'Can you land there VFR?',
    choices: [
      ['Not under basic VFR: it’s a Class E surface area, which needs a 1,000 ft ceiling. You’d need a special VFR clearance (and it’s far below your minimums).', true],
      ['Yes: it’s Class G, so 1 SM and clear of clouds is enough.', false, 'Dashed magenta is a Class E surface area, not Class G.'],
      ['Yes: Class E only needs 3 SM visibility.', false, 'Within a surface area you also can’t operate beneath a ceiling below 1,000 ft.'],
      ['Yes, as long as you announce on the CTAF.', false, 'Radio calls don’t change the weather minimums.']
    ],
    explain: ['**Dashed magenta = Class E surface area.** Under basic VFR, you may not operate beneath the ceiling within the surface area when it’s **below 1,000 ft**, or take off or land unless **ground visibility is at least 3 SM** (§91.155(c), (d)). Special VFR needs an ATC clearance (§91.157).'],
    c: ['cug:p. 17', 'cfr14:91.155(c)', 'cfr14:91.155(d)', 'cfr14:91.157(a)'] }),
  K({ id: 'c2-ast-rco', topic: 'v-nav', acs: ['PA.I.D.K5', 'PA.VI.A.K1'], chart: AST,
    setup: ['Over the Astoria VOR-DME box you see “122.3”, and below it “MC MINNVILLE” in a thin box.'],
    prompt: 'What is 122.3 for?',
    choices: [
      ['Talking to McMinnville Radio (Flight Service) through a remote outlet near the VOR, e.g. to open or close a flight plan.', true],
      ['The Astoria CTAF.', false, 'Astoria’s CTAF is 122.8, shown in its data block.'],
      ['The VOR’s voice identifier frequency.', false, 'The VOR frequency is 114.0, inside the box.'],
      ['The frequency for Astoria’s ASOS.', false, 'The ASOS is 135.375, shown by the airport.']
    ],
    explain: ['CUG: frequencies **above a thin-line box** are remoted to the NAVAID site and the name in the box is the **FSS** providing the voice service. The Supplement lists **RCO 122.3 (McMinnville Radio)**.'],
    c: ['cug:p. 26', 'cs:KAST'] }),
  K({ id: 'c2-ast-warning', topic: 'v-airspace', acs: ['PA.I.E.K3'], chart: AST,
    setup: ['Offshore, a blue boundary is labeled W-570C. You’re thinking of flying a few miles out along the coast.'],
    prompt: 'What is it?',
    choices: [
      ['A warning area: from 3 NM off the coast outward, with activity that may be hazardous to nonparticipating aircraft. Check its status first.', true],
      ['A wildlife area where you should stay above 2,000 ft.', false, 'That’s a refuge outline. W- means warning area.'],
      ['A restricted area you may never enter.', false, 'Warning areas are over international waters; they warn of hazards rather than forbid entry.'],
      ['A route for whale-watching tour aircraft.', false, 'W-570C is special use airspace.']
    ],
    explain: ['AIM: a **warning area** is airspace extending from **3 NM outward from the coast** that contains activity that may be **hazardous to nonparticipating aircraft**. Check the SUA table and with ATC or FSS. And in a single-engine 152, gliding distance to shore matters.'],
    c: ['aim:3-4-4', 'cug:p. 20'] }),

  // ───── Salem ─────
  K({ id: 'c2-sle-closed', topic: 'v-airport', acs: ['PA.I.E.K1', 'PA.III.B.K1'], chart: SLE,
    setup: ['Salem’s data block: “CT – 119.1 ★ C ATIS 124.55” and “213 *L 58 122.95”. You’re arriving after the tower has closed for the night.'],
    prompt: 'What’s the airspace and the radio plan?',
    choices: [
      ['Class E; self-announce on the CTAF, 119.1 (the tower frequency), and activate the lights there.', true],
      ['Still Class D; call the tower on 119.1 for a landing clearance.', false, 'The Supplement says Class D only while the tower operates; otherwise Class E.'],
      ['Class G; self-announce on UNICOM 122.95.', false, 'It becomes Class E, and the CTAF is 119.1.'],
      ['Class E; self-announce on 122.9, the standard CTAF.', false, 'Use the CTAF listed for the airport: 119.1.']
    ],
    explain: ['Supplement: **Salem Tower 119.1 (1500–0500Z‡)**; **Class D while in service, other times Class E**; **CTAF 119.1**; when the tower is closed, lights are activated on the CTAF. The C after the tower frequency marks it as the CTAF.'],
    c: ['cs:KSLE', 'cug:p. 15'] }),
  K({ id: 'c2-sle-classd', topic: 'v-airspace', acs: ['PA.I.E.K1', 'PA.I.E.K2'], chart: SLE,
    setup: ['The dashed blue circle around Salem has a boxed “27” and the note “See NOTAMs/Supplement for Class D eff hrs”.'],
    prompt: 'Before entering it while the tower is open, what do you need?',
    choices: [
      ['Two-way radio communication with Salem Tower before entering, below 2,700 ft MSL.', true],
      ['An explicit clearance to enter, like Class B.', false, 'Class D needs two-way radio communication, not a clearance to enter.'],
      ['A Mode C transponder and ADS-B Out.', false, 'Not required for Class D itself; check nearby Class B/C rules.'],
      ['Nothing: the boxed 27 means it starts at 2,700 ft.', false, 'The boxed number is the ceiling; Class D starts at the surface.']
    ],
    explain: ['**Dashed blue = Class D**, from the surface to the boxed ceiling (**2,700 ft MSL**). Establish **two-way radio communication** with the tower before entering (§91.129(c)).'],
    c: ['cug:p. 16', 'cfr14:91.129(c)', 'cs:KSLE'] }),
  K({ id: 'c2-sle-glider', topic: 'v-airport', acs: ['PA.I.E.K2', 'PA.III.B.K1'], chart: SLE,
    setup: ['Independence State (7S5) shows “*RP” and, next to it, a G in a diamond.'],
    prompt: 'What should you expect in the pattern?',
    choices: [
      ['Glider operations; the asterisk sends you to the Supplement, which says gliders and ultralights use right traffic for Runway 16–34.', true],
      ['Right traffic for all aircraft on every runway.', false, 'The asterisk means special conditions; the Supplement says right traffic is for gliders and ultralights.'],
      ['A GPS approach is available; the G marks it.', false, 'The G-in-diamond marks glider operations.'],
      ['A grass runway; the G stands for grass.', false, 'Runway 16–34 is asphalt; the symbol marks glider operations.']
    ],
    explain: ['CUG: **\\*RP** means special conditions or restrictions on the right pattern; see the Chart Supplement. The **glider symbol** marks glider operations. 7S5 Supplement: **glider and ultralights use right traffic for Rwy 16–34**; ultralights on and near the airport.'],
    c: ['cug:p. 16', 'cug:p. 31', 'cs:K7S5'] }),
  K({ id: 'c2-sle-refuge', topic: 'v-airspace', acs: ['PA.I.E.K3'], chart: SLE,
    setup: ['Departing Independence southbound, you’ll pass over the Ankeny National Wildlife Refuge. Nearby, an obstruction group reads “1449 (321)”.'],
    prompt: 'Which plan respects both?',
    choices: [
      ['Climb to at least 2,000 ft above the refuge’s surface, which also clears the 1,449 ft MSL obstruction tops.', true],
      ['Stay at 1,000 ft MSL: the obstructions are only 321 ft tall.', false, 'Their tops are 1,449 ft MSL, above 1,000.'],
      ['Stay at 1,500 ft MSL: 51 ft above the obstructions is legal.', false, 'Too close to the towers, and well below the 2,000 ft refuge request.'],
      ['Any altitude; the refuge only matters during nesting season.', false, 'The AIM request has no season.']
    ],
    explain: ['Obstruction top **1,449 ft MSL**, height **321 ft AGL** (in parentheses). The AIM requests **2,000 ft above the surface** over wildlife refuges.'],
    c: ['cug:p. 11', 'aim:7-5-6'] })
];
