// Examiner "what if?" follow-ups for the Mock DPE Oral, keyed by item id.
// Every model answer was checked against the cited source.
export interface WhatIf {
  q: string;
  a: string[];
  c: string[];
}

export const WHAT_IF: Record<string, WhatIf[]> = {
  's-khio-vis': [
    {
      q: 'What if visibility improves to 4 SM, but the ceiling drops to 900 ft overcast?',
      a: ['Still no basic VFR in the surface area: the **ceiling must be at least 1,000 ft** to take off, land, or enter the pattern.', 'You could request **Special VFR** from the tower: by day, clear of clouds with at least 1 SM. KHIO isn’t on the list of airports where fixed-wing SVFR is prohibited.'],
      c: ['cfr14:91.155(c)', 'cfr14:91.157(b)', 'cfr14:91 App. D']
    },
    {
      q: 'What if the tower is closed? Does that change anything?',
      a: ['When the tower is closed, KHIO becomes **Class E**. It’s still a surface area designated for the airport, so the **1,000 ft ceiling and 3 SM ground visibility** rules still apply.'],
      c: ['cs:KHIO', 'cfr14:91.155(c)', 'cfr14:91.155(d)']
    }
  ],
  's-carb-ice': [
    {
      q: 'You pull carb heat and the engine gets rougher. Now what?',
      a: ['That’s expected: **melted ice is going through the engine**, and carb heat also reduces power. **Leave the heat on** until it runs smoothly, then turn it off and readjust the throttle.'],
      c: ['phak:7-10', 'poh:3-13']
    }
  ],
  's-night-fuel': [
    {
      q: 'What if you’ll land before sunset instead?',
      a: ['Then the day rule applies: enough fuel to the first point of intended landing plus **30 minutes** at normal cruise.'],
      c: ['cfr14:91.151(a)']
    }
  ],
  's-lostcomm': [
    {
      q: 'What if only your receiver failed, and you can still transmit?',
      a: ['Remain outside or above the Class D until you know the traffic flow, then **tell the tower your aircraft type, position, altitude, intention to land, and ask to be controlled with light signals**.', 'About **3 to 5 miles** out, report your position and join the pattern, then watch for light signals.'],
      c: ['aim:4-2-13']
    }
  ],
  's-bend-takeoff': [
    {
      q: 'What if Bend’s runway were dry grass instead of paved?',
      a: ['POH note: increase distances by **15% of the ground roll** figure. 1,190 ft × 15% ≈ 180 ft more, so plan on about **1,370 ft of ground roll**.'],
      c: ['poh:5-12']
    },
    {
      q: 'And with a steady 9-knot headwind?',
      a: ['POH: **decrease distances 10% for each 9 knots of headwind**, so about 1,070 ft ground roll and 2,025 ft total. For tailwinds up to 10 knots, **increase 10% per 2 knots**.'],
      c: ['poh:5-12']
    }
  ],
  's-cascades-climb': [
    {
      q: 'What if it’s a 40 °C day instead?',
      a: ['POH at 8,000 ft and 40 °C: only about **265 fpm**; at 10,000 ft, **175 fpm**. Hot days and high terrain stack against a 152.'],
      c: ['poh:5-13']
    }
  ],
  'e-low-volt': [
    {
      q: 'After the master reset, the low-voltage light goes out. Now what?',
      a: ['Turn the **radios back on** (last checklist step) and keep monitoring the ammeter and light. If it comes back: alternator off, nonessentials off, and land as soon as practical.'],
      c: ['poh:3-8']
    }
  ],
  's-annual': [
    {
      q: 'What if the annual had been signed off on November 3, 2025?',
      a: ['Then it’s good through **November 30, 2026**: annuals run for the preceding 12 calendar months.'],
      c: ['cfr14:91.409(a)']
    }
  ],
  's-flight-review': [
    {
      q: 'What could you have done instead of a flight review to stay legal?',
      a: ['Pass a **practical test** for a new certificate or rating (or a proficiency check), or complete **one or more phases of the FAA WINGS** program in that period.'],
      c: ['cfr14:61.56(d)', 'cfr14:61.56(e)']
    }
  ],
  'e-efato': [
    {
      q: 'Why 60 KIAS and not a faster speed?',
      a: ['60 KIAS is the POH speed for **engine failure after takeoff** and also **maximum glide**: it gives you the most distance per foot of altitude in the 152.'],
      c: ['poh:3-3', 'poh:3-4']
    }
  ],
  's-wake': [
    {
      q: 'What if the jet ahead had been departing instead of landing?',
      a: ['Then **land well prior to its rotation point**: its vortices begin where it rotated.'],
      c: ['aim:7-4-6']
    }
  ],
  'c-pdx-shelf': [
    {
      q: 'What if you stayed at 2,000 ft under that shelf instead?',
      a: ['The **40/23** shelf’s floor is **2,300 ft MSL**, so at 2,000 MSL you’re below it and don’t need to contact Portland Approach for that sector. Mind terrain, obstacles, and the minimum safe altitudes.'],
      c: ['cug:p. 16', 'cfr14:91.119']
    }
  ]
};
