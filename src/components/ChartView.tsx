import { useEffect, useRef, useState } from 'preact/hooks';
import type { ChartRef } from '../data/types';
import { IconClose, IconMap } from './Icons';

const EDITION = '29 Oct 2026 edition';
const BASE = import.meta.env.BASE_URL;

function Label({ chart }: { chart: ChartRef }) {
  return (
    <div class="chart-label">
      <span>{chart.chart} Sectional · {EDITION}</span>
      <b>Not for navigation</b>
    </div>
  );
}

// Inline excerpt; tap to open a full-screen pinch-to-zoom viewer.
export function ChartView({ chart }: { chart: ChartRef }) {
  const [open, setOpen] = useState(false);
  return (
    <figure class="chart">
      <button class="chart-thumb" onClick={() => setOpen(true)} aria-label={`Open chart excerpt: ${chart.caption}. Pinch to zoom.`}>
        <img src={BASE + chart.src} alt={`Sectional chart excerpt: ${chart.caption}`} loading="lazy" />
        <span class="chart-zoom"><IconMap width={16} height={16} /> Tap to zoom</span>
      </button>
      <figcaption>
        {chart.caption}
        <Label chart={chart} />
      </figcaption>
      {open && <ChartZoom chart={chart} onClose={() => setOpen(false)} />}
    </figure>
  );
}

function ChartZoom({ chart, onClose }: { chart: ChartRef; onClose: () => void }) {
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef<{ d: number; s: number; cx: number; cy: number; x: number; y: number } | null>(null);
  const lastTap = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', esc);
    };
  }, []);

  const clamp = (s: number) => Math.min(6, Math.max(1, s));

  function down(e: PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    if (p.length === 2) {
      start.current = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), s: t.s, cx: (p[0].x + p[1].x) / 2, cy: (p[0].y + p[1].y) / 2, x: t.x, y: t.y };
    } else if (p.length === 1) {
      const now = Date.now();
      if (now - lastTap.current < 300) setT((o) => (o.s > 1 ? { s: 1, x: 0, y: 0 } : { s: 2.5, x: 0, y: 0 }));
      lastTap.current = now;
      start.current = { d: 0, s: t.s, cx: e.clientX, cy: e.clientY, x: t.x, y: t.y };
    }
  }
  function move(e: PointerEvent) {
    if (!pts.current.has(e.pointerId) || !start.current) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    const st = start.current;
    if (p.length === 2 && st.d) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const cx = (p[0].x + p[1].x) / 2, cy = (p[0].y + p[1].y) / 2;
      setT({ s: clamp((st.s * d) / st.d), x: st.x + (cx - st.cx), y: st.y + (cy - st.cy) });
    } else if (p.length === 1) {
      setT((o) => ({ ...o, x: st.x + (e.clientX - st.cx), y: st.y + (e.clientY - st.cy) }));
    }
  }
  function up(e: PointerEvent) {
    pts.current.delete(e.pointerId);
    const p = [...pts.current.values()];
    start.current = p.length === 1 ? { d: 0, s: t.s, cx: p[0].x, cy: p[0].y, x: t.x, y: t.y } : null;
    if (t.s <= 1.02) setT({ s: 1, x: 0, y: 0 });
  }

  return (
    <div class="zoom" role="dialog" aria-modal="true" aria-label={`Chart excerpt: ${chart.caption}`}>
      <div class="zoom-bar">
        <Label chart={chart} />
        <button class="icon-btn zoom-close" onClick={onClose} aria-label="Close chart">
          <IconClose width={26} height={26} />
        </button>
      </div>
      <div class="zoom-area" ref={box} onPointerDown={down as any} onPointerMove={move as any} onPointerUp={up as any} onPointerCancel={up as any}>
        <img
          src={BASE + chart.src}
          alt={`Sectional chart excerpt: ${chart.caption}`}
          draggable={false}
          style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})` }}
        />
      </div>
      <p class="zoom-hint">Pinch or double-tap to zoom · drag to pan</p>
    </div>
  );
}
