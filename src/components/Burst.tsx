// A small confetti burst from a point on screen (skipped when Reduce Motion is on).
export function burst(x: number, y: number, color = 'var(--ok)') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.createElement('div');
  el.className = 'burst';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  const colors = [color, 'var(--accent)', 'var(--partial)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('i');
    const a = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
    const d = 50 + Math.random() * 60;
    p.style.setProperty('--dx', Math.cos(a) * d + 'px');
    p.style.setProperty('--dy', Math.sin(a) * d - 20 + 'px');
    p.style.setProperty('--c', colors[i % 3]);
    el.appendChild(p);
  }
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}
