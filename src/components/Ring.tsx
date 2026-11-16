// Circular readiness gauge, styled like an instrument bezel.
export function Ring({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <div class="ring" role="img" aria-label={`${label} readiness ${pct} percent`}>
      <svg viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--raised)" stroke-width="7" />
        <circle
          cx="36" cy="36" r={r} fill="none" stroke={color} stroke-width="7" stroke-linecap="round"
          stroke-dasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray var(--t-slow) var(--ease)' }}
        />
        <text x="36" y="41" text-anchor="middle" font-size="15" font-weight="700" fill="var(--text)">{pct}</text>
      </svg>
      <span class="ring-name">{label}</span>
    </div>
  );
}
