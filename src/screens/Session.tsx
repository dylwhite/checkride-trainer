import { useEffect, useMemo, useState } from 'preact/hooks';
import { burst } from '../components/Burst';
import { ChartView } from '../components/ChartView';
import { IconCheck, IconClose, IconHalf, IconX } from '../components/Icons';
import { Cites, ResultSheet, type Verdict } from '../components/ResultSheet';
import { Rich } from '../components/Rich';
import { PAVE } from '../data/types';
import { go, query } from '../lib/router';
import { buildSession, DRILL_LABEL, drillFilter, fill, logAnswer, type SessionStep } from '../lib/session';

const KEYS = ['A', 'B', 'C', 'D', 'E'];
const KIND_LABEL = { scenario: 'Scenario', recall: 'Quick recall', chart: 'Chart' };

function center(e: Event) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2] as const;
}

// Shuffle answer choices once per step so the right answer moves around.
function useChoiceOrder(step: SessionStep) {
  return useMemo(() => {
    const n = step.item.choices?.length ?? 0;
    const order = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, [step]);
}

export function Session() {
  const q = query();
  const drill = q.get('drill');
  const seconds = Number(q.get('t') || 0);
  const [steps, setSteps] = useState<SessionStep[] | null>(null);
  const [i, setI] = useState(0);
  const [earned, setEarned] = useState(0);
  const [tally, setTally] = useState({ ok: 0, partial: 0, miss: 0 });
  const [left, setLeft] = useState(seconds);
  const timed = seconds > 0;

  useEffect(() => {
    (async () => {
      const filter = drill ? await drillFilter(drill) : () => true;
      setSteps(buildSession(timed ? 40 : 6, filter));
    })();
  }, []);

  useEffect(() => {
    if (!timed) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  if (!steps) return <main class="screen full" />;
  const timeUp = timed && left === 0;
  const done = i >= steps.length;

  function finish(v: Verdict, xp: number) {
    logAnswer(steps![i].item.id, v);
    setEarned((x) => x + xp);
    setTally((t) => ({ ...t, [v]: t[v] + 1 }));
  }
  function next() {
    if (timeUp) setI(steps!.length);
    else setI(i + 1);
    window.scrollTo(0, 0);
  }
  const title = drill ? DRILL_LABEL[drill] ?? 'Drill' : 'Mission';
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;

  return (
    <main class="screen full">
      <div class="q-top">
        <button class="icon-btn" aria-label="Exit (answers so far are saved)" onClick={() => go(drill ? 'drills' : 'today')}>
          <IconClose width={24} height={24} />
        </button>
        {timed ? (
          <>
            <div class="progress" role="timer" aria-label={`${mm} left`}>
              <div style={{ width: (left / seconds) * 100 + '%', background: left < 30 ? 'var(--partial)' : undefined }} />
            </div>
            <span class="q-count mono">{mm}</span>
          </>
        ) : (
          <>
            <div class="progress" role="progressbar" aria-valuenow={i} aria-valuemin={0} aria-valuemax={steps.length} aria-label="Session progress">
              <div style={{ width: (i / steps.length) * 100 + '%' }} />
            </div>
            <span class="q-count">{Math.min(i + 1, steps.length)}/{steps.length}</span>
          </>
        )}
      </div>

      {steps.length === 0 ? (
        <div class="card soon"><p class="h3">Nothing to drill here yet.</p><p class="muted">Answer a few missions first so the app can find your weak spots.</p></div>
      ) : !done ? (
        <StepView key={i} step={steps[i]} flash={drill === 'recall'} onAnswered={finish} onNext={next} />
      ) : (
        <div class="stack-lg" style={{ textAlign: 'center', paddingTop: 'var(--s10)' }}>
          <div class="verdict-icon" style={{ '--c': 'var(--accent)', margin: '0 auto', width: '72px', height: '72px' }}>
            <IconCheck width={40} height={40} />
          </div>
          <h1 class="title">{title} complete</h1>
          <p class="muted">
            You earned <b class="mono" style={{ color: 'var(--accent)' }}>{earned} XP</b>.
          </p>
          <div class="chips" style={{ justifyContent: 'center' }}>
            <span class="chip" style={{ color: 'var(--ok)' }}><IconCheck width={14} height={14} /> {tally.ok} nailed</span>
            <span class="chip" style={{ color: 'var(--partial)' }}><IconHalf width={14} height={14} /> {tally.partial} partial</span>
            <span class="chip" style={{ color: 'var(--miss)' }}><IconX width={14} height={14} /> {tally.miss} missed</span>
          </div>
          <button class="btn btn-primary btn-block" onClick={() => go(drill ? 'drills' : 'today')}>{drill ? 'Back to Drills' : 'Back to Today'}</button>
          <button class="btn btn-ghost btn-block" onClick={() => location.reload()}>Go again</button>
        </div>
      )}
    </main>
  );
}

export function StepView({ step, flash = false, onAnswered, onNext }: { step: SessionStep; flash?: boolean; onAnswered: (v: Verdict, xp: number) => void; onNext: () => void }) {
  const { item, vars } = step;
  const f = (t: string) => fill(t, vars);
  const pv = PAVE[item.pave];
  const order = useChoiceOrder(step);
  const [picked, setPicked] = useState<number | null>(null);
  const [sheet, setSheet] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [grade, setGrade] = useState<Verdict | null>(null);

  function pick(idx: number, e: Event) {
    if (picked !== null) return;
    setPicked(idx);
    const ok = !!item.choices![idx].ok;
    if (ok) burst(...center(e));
    navigator.vibrate?.(ok ? 15 : [20, 40, 20]);
    onAnswered(ok ? 'ok' : 'miss', ok ? item.xp : 0);
    setTimeout(() => setSheet(true), ok ? 380 : 450);
  }

  function selfGrade(v: Verdict, e: Event) {
    setGrade(v);
    if (v === 'ok') burst(...center(e));
    onAnswered(v, v === 'ok' ? item.xp : v === 'partial' ? Math.round(item.xp / 2) : 0);
  }

  const chosen = picked !== null ? item.choices![picked] : null;
  const mc = !!item.choices && !(flash && item.answer);

  return (
    <div class="stack-lg">
      <div class="chips">
        <span class="chip chip-pave" style={{ '--c': pv.color }}><span class="dot" />{pv.short}</span>
        <span class="chip">{KIND_LABEL[item.kind]}</span>
        {item.emergency && <span class="chip" style={{ color: 'var(--miss)' }}>⚠ Emergency</span>}
        {item.acs.slice(0, 1).map((a) => <span key={a} class="chip mono">{a}</span>)}
      </div>

      {item.kind === 'recall' && !mc && (
        <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Say it out loud, then reveal and grade yourself.</p>
      )}

      {(item.setup || item.readout) && (
        <div class="card scenario" style={{ '--c': pv.color }}>
          {item.setup?.map((s, k) => <p key={k}>{f(s)}</p>)}
          {item.readout && (
            <div class="readout">
              <span class="tag row between">
                <span class="label">{item.readout.tag}</span>
                {item.readout.cat && <span class={`fc fc-${item.readout.cat.toLowerCase()}`}>{item.readout.cat}</span>}
              </span>
              {item.readout.text}
            </div>
          )}
        </div>
      )}

      {item.chart && <ChartView chart={item.chart} />}

      {mc ? (
        <>
          <p class="prompt">{f(item.prompt)}</p>
          <div class="choices" role="group" aria-label="Answer choices">
            {order.map((idx, pos) => {
              const c = item.choices![idx];
              let cls = 'choice';
              if (picked !== null) {
                if (c.ok) cls += ' is-correct' + (picked === idx ? ' pop' : '');
                else if (picked === idx) cls += ' is-wrong shake';
                else cls += ' is-dim';
              }
              return (
                <button key={idx} class={cls} disabled={picked !== null} onClick={(e) => pick(idx, e)}>
                  <span class="key" aria-hidden="true">{KEYS[pos]}</span>
                  <span class="txt">{f(c.t)}</span>
                  {picked !== null && c.ok && <IconCheck class="mark" style={{ color: 'var(--ok)' }} aria-label="correct answer" />}
                  {picked === idx && !c.ok && <IconX class="mark" style={{ color: 'var(--miss)' }} aria-label="your answer" />}
                </button>
              );
            })}
          </div>
          {sheet && chosen && (
            <ResultSheet
              verdict={chosen.ok ? 'ok' : 'miss'}
              xp={chosen.ok ? item.xp : 0}
              subtitle={chosen.ok ? undefined : chosen.why && f(chosen.why)}
              explanation={item.explain.map(f)}
              think={item.think && f(item.think)}
              citations={item.c}
              furtherReading={item.read}
              nextLabel={item.next ? 'Next: quick recall' : 'Next'}
              onNext={onNext}
            />
          )}
        </>
      ) : (
        <>
          <div class="card recall">
            <p class="h2">{f(item.prompt)}</p>
            {revealed && (
              <div class="answer stack" style={{ '--s4': '10px' }}>
                {item.answer!.map((a, k) => <p key={k}>• <Rich text={f(a)} /></p>)}
                <div class="chips" style={{ paddingTop: 'var(--s2)' }}><Cites keys={item.c} /></div>
              </div>
            )}
          </div>
          {!revealed ? (
            <button class="btn btn-primary btn-block" onClick={() => setRevealed(true)}>Reveal answer</button>
          ) : !grade ? (
            <div class="stack">
              <p class="label" style={{ textAlign: 'center' }}>How did you do?</p>
              <div class="grade">
                <button style={{ '--c': 'var(--ok)' }} onClick={(e) => selfGrade('ok', e)}><IconCheck />Nailed it</button>
                <button style={{ '--c': 'var(--partial)' }} onClick={(e) => selfGrade('partial', e)}><IconHalf />Partial</button>
                <button style={{ '--c': 'var(--miss)' }} onClick={(e) => selfGrade('miss', e)}><IconX />Missed</button>
              </div>
            </div>
          ) : (
            <div class="stack">
              <div class="callout" style={{ textAlign: 'center' }}>
                {grade === 'ok' && <><b style={{ color: 'var(--ok)' }}>+{item.xp} XP.</b> Nice.</>}
                {grade === 'partial' && <><b style={{ color: 'var(--partial)' }}>+{Math.round(item.xp / 2)} XP.</b> Saved. Spaced repetition (Phase 4) will bring this back sooner.</>}
                {grade === 'miss' && <><b style={{ color: 'var(--miss)' }}>Saved.</b> Spaced repetition (Phase 4) will bring this back in a new scenario.</>}
              </div>
              <button class="btn btn-primary btn-block" onClick={onNext}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
