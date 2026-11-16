// Simple, original line icons drawn for this app (24×24 grid, stroke = currentColor).
import type { JSX } from 'preact';

type P = JSX.SVGAttributes<SVGSVGElement>;
const base = (props: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.8,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': true,
  ...props
});

export const IconToday = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></svg>
);
export const IconFly = (p: P) => (
  <svg {...base(p)}><path d="M2.5 13.5l7-1.5 5.5-6.5c.8-.9 2.4-.8 2.9.3.3.6.1 1.3-.4 1.8L12 13l1.5 6.5-1.8.9-3-4.8-4.2 1.4-1 1.5-1.2-.4.6-2.6-1.9-1.5z" /></svg>
);
export const IconOral = (p: P) => (
  <svg {...base(p)}><path d="M4 5.5h16v10H9l-5 4v-14z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
);
export const IconDrills = (p: P) => (
  <svg {...base(p)}><path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z" /></svg>
);
export const IconProgress = (p: P) => (
  <svg {...base(p)}><path d="M4 20V11M10 20V5M16 20v-6M22 20H2" /></svg>
);
export const IconFlame = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <defs>
      <linearGradient id="flame-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FBBF24" />
        <stop offset="1" stop-color="#F97316" />
      </linearGradient>
    </defs>
    <path fill="url(#flame-g)" d="M12 2c.6 3.2 4.7 5.3 4.7 10.1A4.9 4.9 0 0 1 12 17a4.9 4.9 0 0 1-4.7-4.9c0-1.9.9-3.4 1.9-4.3.2 1.6 1 2.6 2 2.9C11 8.5 11 5 12 2z" transform="translate(0 2.5)" />
  </svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const IconStack = (p: P) => (
  <svg {...base(p)}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></svg>
);
export const IconClose = (p: P) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base({ 'stroke-width': 2.6, ...p })}><path class="draw" d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const IconX = (p: P) => (
  <svg {...base({ 'stroke-width': 2.6, ...p })}><path class="draw" d="M7 7l10 10M17 7L7 17" /></svg>
);
export const IconHalf = (p: P) => (
  <svg {...base({ 'stroke-width': 2.6, ...p })}><path class="draw" d="M6 12h12" /></svg>
);
export const IconBook = (p: P) => (
  <svg {...base(p)}><path d="M4 4.5h6a2 2 0 0 1 2 2V20a1.5 1.5 0 0 0-1.5-1.5H4v-14zM20 4.5h-6a2 2 0 0 0-2 2V20a1.5 1.5 0 0 1 1.5-1.5H20v-14z" /></svg>
);
export const IconChecklist = (p: P) => (
  <svg {...base(p)}><path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" /></svg>
);
export const IconGear = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3" /></svg>
);
export const IconChevron = (p: P) => (
  <svg {...base(p)}><path d="M9 5l7 7-7 7" /></svg>
);
export const IconExternal = (p: P) => (
  <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const IconPlaneSmall = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M21 11.2h-6.4L10 3.5H8l2.4 7.7H5.6L3.8 9H2.5l1.2 3-1.2 3h1.3l1.8-2.2h4.8L8 20.5h2l4.6-7.7H21a.8.8 0 0 0 0-1.6z" />
  </svg>
);
export const IconInfo = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const IconMap = (p: P) => (
  <svg {...base(p)}><path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4zM9 4v13M15 6.5v13" /></svg>
);
