import { useEffect, useMemo, useState } from 'preact/hooks';
import { IconCheck, IconHalf, IconOral, IconX } from '../components/Icons';
import type { Verdict } from '../components/ResultSheet';
import { buildCheckride } from '../lib/checkride';
import { useImmersive } from '../lib/immersive';
import { go } from '../lib/router';
import { logAnswer } from '../lib/session';
import { load, save } from '../lib/storage';
import { ExchangeView } from './Oral';

export interface CheckrideSave { seed: number; i: number; tally: Record<Verdict, number>; done?: boolean }

export function useCheckrideSave() {
  const [s, setS] = useState<CheckrideSave | null | undefined>(undefined);
  useEffect(() => { load<CheckrideSave | null>('checkride', null).then(setS); }, []);
  return s;
}

export async function startCheckride() {
  await save('checkride', { seed: Date.now() % 2147483647, i: 0, tally: { ok: 0, partial: 0, miss: 0 } });
  go('checkride');
}

export function Checkride() {
  useImmersive();
  const [s, setS] = useState<CheckrideSave | null | undefined>(undefined);
  useEffect(() => { load<CheckrideSave | null>('checkride', null).then(setS); }, []);
  const plan = useMemo(() => (s ? buildCheckride(s.seed) : null), [s?.seed]);
  if (s === undefined) return <main class="screen full" />;
  if (!s || !plan) { go('oral'); return null; }

  const ex = plan.exchanges;
  const done = s.i >= ex.length;
  const cur = ex[Math.min(s.i, ex.length - 1)];
  const sec = plan.sections[cur.section];
  const firstOfSection = s.i === 0 || ex[s.i - 1]?.section !== cur.section;
  const update = (patch: Partial<CheckrideSave>) => { const n = { ...s, ...patch }; setS(n); save('checkride', n); };

  return (
    <main class="screen full stack">
      <div class="q-top">
        <button class="icon-btn" aria-label="Pause the checkride (your place is saved)" onClick={() => go('oral')}><IconX width={22} height={22} /></button>
        <div class="progress" role="progressbar" aria-valuenow={s.i} aria-valuemin={0} aria-valuemax={ex.length} aria-label="Checkride progress">
          <div style={{ width: (s.i / ex.length) * 100 + '%', background: 'var(--pave-a)' }} />
        </div>
        <span class="q-count">{Math.min(s.i + 1, ex.length)}/{ex.length}</span>
      </div>

      {!done && (
        <div class="row between">
          <span class="label" style={{ color: 'var(--pave-a)' }}>ACS {sec.code} · {sec.title}</span>
          <span class="mono muted" style={{ fontSize: 'var(--fs-xs)' }}>{cur.section + 1}/{plan.sections.length}</span>
        </div>
      )}
      {!done && firstOfSection && (
        <div class="bubble section-intro">
          <span class="bubble-who"><IconOral width={16} height={16} /> Examiner</span>
          <p class="h3">“{sec.intro}”</p>
        </div>
      )}

      {!done ? (
        <ExchangeView key={s.i} ex={cur}
          onDone={(v) => { logAnswer(cur.item.id, v, { topic: cur.item.topic, xp: v === 'ok' ? 15 : v === 'partial' ? 7 : 0 }); s.tally[v]++; }}
          onNext={() => { update({ i: s.i + 1, tally: s.tally }); window.scrollTo(0, 0); }} />
      ) : (
        <div class="stack-lg" style={{ textAlign: 'center', paddingTop: 'var(--s8)' }}>
          <div class="verdict-icon" style={{ '--c': 'var(--pave-a)', margin: '0 auto', width: '72px', height: '72px' }}><IconOral width={36} height={36} /></div>
          <h1 class="title">That’s the oral.</h1>
          <p class="muted">“Let’s go fly to {plan.story.dest.name}.” You covered every area from Pilot Qualifications to Night Operations.</p>
          <div class="chips" style={{ justifyContent: 'center' }}>
            <span class="chip" style={{ color: 'var(--ok)' }}><IconCheck width={14} height={14} /> {s.tally.ok} nailed</span>
            <span class="chip" style={{ color: 'var(--partial)' }}><IconHalf width={14} height={14} /> {s.tally.partial} partial</span>
            <span class="chip" style={{ color: 'var(--miss)' }}><IconX width={14} height={14} /> {s.tally.miss} missed</span>
          </div>
          <button class="btn btn-primary btn-block" onClick={() => { update({ done: true }); go('fly'); }}>Fly the cross-country</button>
          <button class="btn btn-ghost btn-block" onClick={() => { update({ done: true }); go('oral'); }}>Back to Oral</button>
        </div>
      )}
    </main>
  );
}
