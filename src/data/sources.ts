// Every source the app cites, with the exact edition used to write and verify content.
// Citations in content are short strings like "cfr14:91.155(d)", "aim:6-3-2", "phak:2-5", "poh:3-3".

export interface SourceDoc {
  id: string;
  short: string; // label prefix shown on citation chips
  title: string;
  edition: string;
  url?: string;
}

export const SOURCES: Record<string, SourceDoc> = {
  acs: { id: 'acs', short: 'ACS', title: 'Private Pilot – Airplane Airman Certification Standards', edition: 'FAA-S-ACS-6C, Nov 2023', url: 'https://www.faa.gov/training_testing/testing/acs/private_airplane_acs_6.pdf' },
  phak: { id: 'phak', short: 'PHAK', title: "Pilot's Handbook of Aeronautical Knowledge", edition: 'FAA-H-8083-25C', url: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak' },
  afh: { id: 'afh', short: 'AFH', title: 'Airplane Flying Handbook', edition: 'FAA-H-8083-3C', url: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook' },
  awh: { id: 'awh', short: 'AWH', title: 'Aviation Weather Handbook', edition: 'FAA-H-8083-28B', url: 'https://www.faa.gov/regulationspolicies/handbooksmanuals/aviation/faa-h-8083-28-aviation-weather-handbook' },
  rmh: { id: 'rmh', short: 'RMH', title: 'Risk Management Handbook', edition: 'FAA-H-8083-2A', url: 'https://www.faa.gov/regulationspolicies/handbooksmanuals/risk-management-handbook-faa-h-8083-2a' },
  wbh: { id: 'wbh', short: 'W&B Hbk', title: 'Aircraft Weight and Balance Handbook', edition: 'FAA-H-8083-1B', url: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation' },
  aim: { id: 'aim', short: 'AIM', title: 'Aeronautical Information Manual', edition: 'Effective 9 Jul 2026', url: 'https://www.faa.gov/air_traffic/publications/atpubs/aim_html/' },
  cfr14: { id: 'cfr14', short: '14 CFR', title: 'Title 14, Code of Federal Regulations', edition: 'eCFR, current as of 12 Nov 2026', url: 'https://www.ecfr.gov/current/title-14' },
  cfr49: { id: 'cfr49', short: '49 CFR', title: 'Title 49 CFR Part 830 (NTSB)', edition: 'eCFR, current as of 12 Nov 2026', url: 'https://www.ecfr.gov/current/title-49/part-830' },
  cug: { id: 'cug', short: 'Chart Users’ Guide', title: 'FAA Aeronautical Chart Users’ Guide', edition: '9 Jul 2026', url: 'https://aeronav.faa.gov/user_guide/cug-complete_20260709.pdf' },
  cs: { id: 'cs', short: 'Chart Supplement NW', title: 'Chart Supplement, Northwest U.S.', edition: '29 Oct – 24 Dec 2026', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/' },
  sec: { id: 'sec', short: 'Seattle Sectional', title: 'Seattle VFR Sectional Chart', edition: '29 Oct 2026 edition', url: 'https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/vfr/' },
  poh: { id: 'poh', short: 'C152 POH', title: 'Cessna 1985 Model 152 Pilot’s Operating Handbook', edition: 'Original Issue, 20 Aug 1984' },
  gtn: { id: 'gtn', short: 'GTN 650 Guide', title: 'Garmin GTN 625/635/650 Pilot’s Guide', edition: '190-01004-03 Rev. M', url: 'https://static.garmin.com/pumac/190-01004-03_M.pdf' },
  gtx: { id: 'gtx', short: 'GTX 345 Guide', title: 'Garmin GTX 335/345 Pilot’s Guide', edition: '190-01499-00 Rev. C' }
};

export interface ResolvedCite {
  label: string;
  url?: string;
  doc: SourceDoc;
}

// AIM chapter/section pages, e.g. "6-3-2" -> chap6_section_3.html
function aimUrl(ref: string) {
  const [c, s] = ref.split('-');
  return `https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap${c}_section_${s}.html`;
}

export function cite(key: string): ResolvedCite {
  const i = key.indexOf(':');
  const id = key.slice(0, i);
  const ref = key.slice(i + 1);
  const doc = SOURCES[id];
  if (!doc) throw new Error('Unknown source ' + key);
  switch (id) {
    case 'cfr14': {
      if (ref.startsWith('141 App. B')) return { doc, label: '14 CFR Part 141 App. B' + ref.slice(10), url: 'https://www.ecfr.gov/current/title-14/part-141' };
      if (ref.startsWith('91 App. D')) return { doc, label: '14 CFR Part 91 App. D', url: 'https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91/appendix-Appendix%20D%20to%20Part%2091' };
      const sec = ref.replace(/\(.*$/, '');
      return { doc, label: `14 CFR ${ref}`, url: `https://www.ecfr.gov/current/title-14/section-${sec}` };
    }
    case 'cfr49': {
      const sec = ref.replace(/\(.*$/, '');
      return { doc, label: `49 CFR ${ref}`, url: `https://www.ecfr.gov/current/title-49/section-${sec}` };
    }
    case 'aim':
      return { doc, label: `AIM ${ref}`, url: aimUrl(ref) };
    case 'acs':
      return { doc, label: ref, url: doc.url };
    case 'poh':
      return { doc, label: `C152 POH ${ref}` };
    case 'cs':
      return { doc, label: `Chart Supplement · ${ref}`, url: doc.url };
    default:
      return { doc, label: `${doc.short} ${ref}`, url: doc.url };
  }
}
