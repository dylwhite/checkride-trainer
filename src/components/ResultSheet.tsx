import { useEffect, useRef } from 'preact/hooks';
import type { Citation } from '../data/sample';
import { IconCheck, IconExternal, IconHalf, IconX } from './Icons';
import { Rich } from './Rich';

export type Verdict = 'ok' | 'partial' | 'miss';

const VERDICT = {
  ok: { title: 'Correct', Icon: IconCheck, color: 'var(--ok)' },
  partial: { title: 'Partly right', Icon: IconHalf, color: 'var(--partial)' },
  miss: { title: 'Not quite', Icon: IconX, color: 'var(--miss)' }
};

interface Props {
  verdict: Verdict;
  xp: number;
  subtitle?: string;
  explanation: string[];
  think?: string;
  citations: Citation[];
  furtherReading?: { label: string; url: string }[];
  nextLabel: string;
  onNext: () => void;
}

export function ResultSheet(p: Props) {
  const v = VERDICT[p.verdict];
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <>
      <div class="scrim" />
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="verdict-title" tabIndex={-1} ref={ref} style={{ '--c': v.color }}>
        <div class="grabber" />
        <div class="stack">
          <div class="verdict">
            <div class="verdict-icon"><v.Icon /></div>
            <div>
              <h2 id="verdict-title" class="h2">{v.title}</h2>
              {p.subtitle && <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}>{p.subtitle}</p>}
            </div>
            {p.xp > 0 && <span class="xp-gain" aria-label={`plus ${p.xp} XP`}>+{p.xp} XP</span>}
          </div>

          <div class="why stack" style={{ '--s4': '10px' }}>
            {p.explanation.map((t, i) => <p key={i}><Rich text={t} /></p>)}
          </div>

          {p.think && (
            <div class="callout">
              <b>Think like a pilot · </b>
              {p.think}
            </div>
          )}

          <div>
            <p class="label" style={{ marginBottom: 'var(--s2)' }}>Source</p>
            <div class="chips">
              {p.citations.map((c) =>
                c.url ? (
                  <a key={c.label} class="chip chip-cite" href={c.url} target="_blank" rel="noopener">{c.label}</a>
                ) : (
                  <span key={c.label} class="chip chip-cite">{c.label}</span>
                )
              )}
            </div>
          </div>

          {p.furtherReading && p.furtherReading.length > 0 && (
            <div>
              <p class="label">Further reading</p>
              {p.furtherReading.map((r) => (
                <a key={r.url} class="reading" href={r.url} target="_blank" rel="noopener">
                  <IconExternal />
                  {r.label}
                </a>
              ))}
            </div>
          )}

          <button class="btn btn-primary btn-block" onClick={p.onNext}>{p.nextLabel}</button>
        </div>
      </div>
    </>
  );
}
