import { useState } from 'preact/hooks';
import { burst } from '../components/Burst';
import { IconCheck, IconClose, IconHalf, IconX } from '../components/Icons';
import { ResultSheet, type Verdict } from '../components/ResultSheet';
import { Rich } from '../components/Rich';
import { PAVE, SAMPLE_SESSION } from '../data/sample';
import { go } from '../lib/router';

const KEYS = ['A', 'B', 'C', 'D', 'E'];

export function Question() {
  const [scenario, recall] = SAMPLE_SESSION;
  const [step, setStep] = useState(0); // 0 scenario · 1 recall · 2 done
  const [picked, setPicked] = useState<number | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [grade, setGrade] = useState<Verdict | null>(null);
  const [earned, setEarned] = useState(0);

  const total = SAMPLE_SESSION.length;
  const done = step + (showSheet || grade ? 1 : 0);

  function pick(i: number, e: MouseEvent) {
    if (picked !== null) return;
    setPicked(i);
    const ok = !!scenario.choices[i].correct;
    if (ok) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
      setEarned((x) => x + scenario.xp);
    }
    navigator.vibrate?.(ok ? 15 : [20, 40, 20]);
    setTimeout(() => setShowSheet(true), ok ? 380 : 450);
  }

  function selfGrade(v: Verdict, e: MouseEvent) {
    setGrade(v);
    const gained = v === 'ok' ? recall.xp : v === 'partial' ? Math.round(recall.xp / 2) : 0;
    setEarned((x) => x + gained);
    if (v === 'ok') {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    }
  }

  const pv = PAVE[step === 0 ? scenario.pave : recall.pave];

  return (
    <main class="screen full">
      <div class="q-top">
        <button class="icon-btn" aria-label="Exit session (progress is saved)" onClick={() => go('today')}>
          <IconClose width={24} height={24} />
        </button>
        <div class="progress" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total} aria-label="Session progress">
          <div style={{ width: (done / total) * 100 + '%' }} />
        </div>
        <span class="q-count">{Math.min(step + 1, total)}/{total}</span>
      </div>

      {step === 0 && (
        <div class="stack-lg" key="s0">
          <div class="chips">
            <span class="chip chip-pave" style={{ '--c': pv.color }}><span class="dot" />{pv.short}</span>
            <span class="chip">Scenario</span>
            <span class="chip mono">{scenario.acs}</span>
          </div>
          <div class="card scenario" style={{ '--c': pv.color }}>
            {scenario.setup.map((s, i) => <p key={i}>{s}</p>)}
            {scenario.readout && (
              <div class="readout">
                <span class="tag row between">
                  <span class="label">{scenario.readout.tag}</span>
                  <span class={`fc fc-${scenario.readout.category.toLowerCase()}`}>{scenario.readout.category}</span>
                </span>
                {scenario.readout.text}
              </div>
            )}
          </div>
          <p class="prompt">{scenario.prompt}</p>
          <div class="choices" role="group" aria-label="Answer choices">
            {scenario.choices.map((c, i) => {
              const isPicked = picked === i;
              let cls = 'choice';
              if (picked !== null) {
                if (c.correct) cls += ' is-correct' + (isPicked ? ' pop' : '');
                else if (isPicked) cls += ' is-wrong shake';
                else cls += ' is-dim';
              }
              return (
                <button key={i} class={cls} disabled={picked !== null} onClick={(e) => pick(i, e as unknown as MouseEvent)}>
                  <span class="key" aria-hidden="true">{KEYS[i]}</span>
                  <span class="txt">{c.text}</span>
                  {picked !== null && c.correct && <IconCheck class="mark" style={{ color: 'var(--ok)' }} aria-label="correct answer" />}
                  {picked !== null && isPicked && !c.correct && <IconX class="mark" style={{ color: 'var(--miss)' }} aria-label="your answer" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 1 && (
        <div class="stack-lg" key="s1">
          <div class="chips">
            <span class="chip chip-pave" style={{ '--c': pv.color }}><span class="dot" />{pv.short}</span>
            <span class="chip">Quick recall</span>
            <span class="chip mono">{recall.acs}</span>
          </div>
          <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Pin down the fact behind that scenario. Say it out loud, then reveal.</p>
          <div class="card recall">
            <p class="h2">{recall.prompt}</p>
            {revealed && (
              <div class="answer stack" style={{ '--s4': '10px' }}>
                {recall.answer.map((a, i) => <p key={i}>• <Rich text={a} /></p>)}
                <div class="chips" style={{ paddingTop: 'var(--s2)' }}>
                  {recall.citations.map((c) => (
                    <a key={c.label} class="chip chip-cite" href={c.url} target="_blank" rel="noopener">{c.label}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
          {!revealed ? (
            <button class="btn btn-primary btn-block" onClick={() => setRevealed(true)}>Reveal answer</button>
          ) : !grade ? (
            <div class="stack">
              <p class="label" style={{ textAlign: 'center' }}>How did you do?</p>
              <div class="grade">
                <button style={{ '--c': 'var(--ok)' }} onClick={(e) => selfGrade('ok', e as unknown as MouseEvent)}><IconCheck />Nailed it</button>
                <button style={{ '--c': 'var(--partial)' }} onClick={(e) => selfGrade('partial', e as unknown as MouseEvent)}><IconHalf />Partial</button>
                <button style={{ '--c': 'var(--miss)' }} onClick={(e) => selfGrade('miss', e as unknown as MouseEvent)}><IconX />Missed</button>
              </div>
            </div>
          ) : (
            <div class="stack">
              <div class="callout" style={{ textAlign: 'center' }}>
                {grade === 'ok' && <><b style={{ color: 'var(--ok)' }}>+{recall.xp} XP.</b> This topic will come back in a few days.</>}
                {grade === 'partial' && <><b style={{ color: 'var(--partial)' }}>+{Math.round(recall.xp / 2)} XP.</b> You’ll see this again tomorrow, in a new scenario.</>}
                {grade === 'miss' && <><b style={{ color: 'var(--miss)' }}>No worries.</b> This comes back later today in a different situation.</>}
              </div>
              <button class="btn btn-primary btn-block" onClick={() => setStep(2)}>Finish</button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div class="stack-lg" style={{ textAlign: 'center', paddingTop: 'var(--s10)' }} key="s2">
          <div class="verdict-icon" style={{ '--c': 'var(--accent)', margin: '0 auto', width: '72px', height: '72px' }}>
            <IconCheck width={40} height={40} />
          </div>
          <h1 class="title">Preview complete</h1>
          <p class="muted">You earned <b class="mono" style={{ color: 'var(--accent)' }}>{earned} XP</b>. A real mission will be 5–10 minutes and saves after every question.</p>
          <button class="btn btn-primary btn-block" onClick={() => go('today')}>Back to Today</button>
        </div>
      )}

      {showSheet && picked !== null && (
        <ResultSheet
          verdict={scenario.choices[picked].correct ? 'ok' : 'miss'}
          xp={scenario.choices[picked].correct ? scenario.xp : 0}
          subtitle={scenario.choices[picked].correct ? undefined : scenario.choices[picked].whyNot}
          explanation={scenario.explanation}
          think={scenario.thinkLikeAPilot}
          citations={scenario.citations}
          furtherReading={scenario.furtherReading}
          nextLabel="Next: quick recall"
          onNext={() => {
            setShowSheet(false);
            setStep(1);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </main>
  );
}
