import { useMemo, useState } from 'preact/hooks';
import { burst } from '../components/Burst';
import { ChartView } from '../components/ChartView';
import { IconCheck, IconClose, IconHalf, IconOral, IconX } from '../components/Icons';
import { Cites, type Verdict } from '../components/ResultSheet';
import { Rich } from '../components/Rich';
import { bank, byId } from '../data/bank';
import { WHAT_IF } from '../data/oral';
import { cite } from '../data/sources';
import { PAVE, type Item } from '../data/types';
import { useImmersive } from '../lib/immersive';
import { go } from '../lib/router';
import { fill, logAnswer } from '../lib/session';

type Exchange =
  | { kind: 'mc'; item: Item; vars: Record<string, string> }
  | { kind: 'open'; item: Item; vars: Record<string, string>; q: string; a: string[]; c: string[]; tag: string };

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

function buildOral(rounds = 3): Exchange[] {
  const all = bank();
  const leads = shuffle(all.filter((i) => (i.kind === 'scenario' || i.kind === 'chart') && i.choices && i.id !== 'wb-calc'));
  // Prefer scenarios that have authored "what if" follow-ups, then fill with others.
  const withWhatIf = leads.filter((i) => WHAT_IF[i.id]);
  const chosen = [...withWhatIf.slice(0, 2), ...leads.filter((i) => !WHAT_IF[i.id])].slice(0, rounds);
  const out: Exchange[] = [];
  for (const item of shuffle(chosen)) {
    const vars: Record<string, string> = {};
    for (const [k, o] of Object.entries(item.vars ?? {})) vars[k] = pick(o);
    out.push({ kind: 'mc', item, vars });
    out.push({ kind: 'open', item, vars, tag: 'Why?', q: 'Why? Walk me through the rule or concept behind your answer.', a: item.explain, c: item.c });
    for (const w of WHAT_IF[item.id] ?? []) out.push({ kind: 'open', item, vars, tag: 'What if…', q: w.q, a: w.a, c: w.c });
    out.push({
      kind: 'open', item, vars, tag: 'Where is that?',
      q: 'Where would you find that? Name the regulation, AIM paragraph, or POH section.',
      a: item.c.map((k) => { const r = cite(k); return `**${r.label}**: ${r.doc.title}`; }),
      c: item.c
    });
    const follow = item.next ? byId(item.next, all) : pick(all.filter((i) => i.kind === 'recall' && i.topic === item.topic && i.id !== item.id));
    if (follow) out.push(follow.answer
      ? { kind: 'open', item: follow, vars, tag: 'Quick recall', q: follow.prompt, a: follow.answer, c: follow.c }
      : { kind: 'mc', item: follow, vars });
  }
  return out;
}

export function Oral() {
  const [started, setStarted] = useState(false);
  if (!started) return <OralIntro onStart={() => setStarted(true)} />;
  return <OralRun />;
}

function OralIntro({ onStart }: { onStart: () => void }) {
  return (
    <main class="screen stack-lg">
      <h1 class="title" style={{ paddingTop: 'var(--s2)' }}>Mock DPE Oral</h1>
      <div class="card stack examiner-intro">
        <div class="examiner-avatar"><IconOral /></div>
        <p class="h3">“Let’s talk through a few situations. I’ll ask why, ask what-if, and ask where it’s written.”</p>
        <p class="muted">Answer out loud or type it, then reveal the model answer and grade yourself honestly. Three scenarios, about 10 minutes. Stop any time; answers are saved.</p>
      </div>
      <button class="btn btn-primary btn-block" onClick={onStart}>Start the oral</button>
    </main>
  );
}

function OralRun() {
  useImmersive();
  const ex = useMemo(() => buildOral(3), []);
  const [i, setI] = useState(0);
  const [tally, setTally] = useState({ ok: 0, partial: 0, miss: 0 });
  const done = i >= ex.length;
  const record = (it: Item, v: Verdict) => { logAnswer(it.id, v, { topic: it.topic, xp: v === 'ok' ? 15 : v === 'partial' ? 7 : 0 }); setTally((t) => ({ ...t, [v]: t[v] + 1 })); };

  return (
    <main class="screen full">
      <div class="q-top">
        <button class="icon-btn" aria-label="End the oral (answers so far are saved)" onClick={() => go('oral')}>
          <IconClose width={24} height={24} />
        </button>
        <div class="progress" role="progressbar" aria-valuenow={i} aria-valuemin={0} aria-valuemax={ex.length} aria-label="Oral progress">
          <div style={{ width: (i / ex.length) * 100 + '%', background: 'var(--pave-a)' }} />
        </div>
        <span class="q-count">{Math.min(i + 1, ex.length)}/{ex.length}</span>
      </div>
      {!done ? (
        <ExchangeView key={i} ex={ex[i]} onDone={(v) => record(ex[i].item, v)} onNext={() => { setI(i + 1); window.scrollTo(0, 0); }} />
      ) : (
        <div class="stack-lg" style={{ textAlign: 'center', paddingTop: 'var(--s10)' }}>
          <div class="verdict-icon" style={{ '--c': 'var(--pave-a)', margin: '0 auto', width: '72px', height: '72px' }}><IconOral width={36} height={36} /></div>
          <h1 class="title">That’s the oral</h1>
          <p class="muted">“Good discussion. Let’s review the ones you weren’t sure about.”</p>
          <div class="chips" style={{ justifyContent: 'center' }}>
            <span class="chip" style={{ color: 'var(--ok)' }}><IconCheck width={14} height={14} /> {tally.ok} nailed</span>
            <span class="chip" style={{ color: 'var(--partial)' }}><IconHalf width={14} height={14} /> {tally.partial} partial</span>
            <span class="chip" style={{ color: 'var(--miss)' }}><IconX width={14} height={14} /> {tally.miss} missed</span>
          </div>
          <button class="btn btn-primary btn-block" onClick={() => location.reload()}>Another oral</button>
          <button class="btn btn-ghost btn-block" onClick={() => go('today')}>Back to Today</button>
        </div>
      )}
    </main>
  );
}

function ExchangeView({ ex, onDone, onNext }: { ex: Exchange; onDone: (v: Verdict) => void; onNext: () => void }) {
  const f = (t: string) => fill(t, ex.vars);
  const item = ex.item;
  const pv = PAVE[item.pave];
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [grade, setGrade] = useState<Verdict | null>(null);
  const order = useMemo(() => shuffle([...Array(item.choices?.length ?? 0).keys()]), [ex]);

  const examiner = ex.kind === 'mc' ? (item.kind === 'recall' ? 'Quick one:' : 'Here’s the situation.') : ex.tag;

  return (
    <div class="stack-lg">
      <div class="chips">
        <span class="chip chip-pave" style={{ '--c': pv.color }}><span class="dot" />{pv.short}</span>
        {item.emergency && <span class="chip" style={{ color: 'var(--miss)' }}>⚠ Emergency</span>}
        <span class="chip mono">{item.acs[0]}</span>
      </div>

      <div class="bubble">
        <span class="bubble-who"><IconOral width={16} height={16} /> Examiner · {examiner}</span>
        {ex.kind === 'mc' ? (
          <>
            {item.setup?.map((s, k) => <p key={k}>{f(s)}</p>)}
            {item.readout && <div class="readout"><span class="tag"><span class="label">{item.readout.tag}</span></span>{item.readout.text}</div>}
            <p class="prompt" style={{ marginTop: 'var(--s3)' }}>{f(item.prompt)}</p>
          </>
        ) : (
          <p class="prompt">{f(ex.q)}</p>
        )}
      </div>

      {ex.kind === 'mc' && item.chart && <ChartView chart={item.chart} />}

      {ex.kind === 'mc' ? (
        <>
          <div class="choices" role="group" aria-label="Your answer">
            {order.map((idx, pos) => {
              const c = item.choices![idx];
              let cls = 'choice';
              if (picked !== null) cls += c.ok ? ' is-correct' : picked === idx ? ' is-wrong' : ' is-dim';
              return (
                <button key={idx} class={cls} disabled={picked !== null} onClick={(e) => {
                  setPicked(idx);
                  if (c.ok) { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); }
                  onDone(c.ok ? 'ok' : 'miss');
                }}>
                  <span class="key" aria-hidden="true">{'ABCDE'[pos]}</span>
                  <span class="txt">{f(c.t)}</span>
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div class="stack">
              <div class="callout">
                {item.choices![picked].ok
                  ? <><b style={{ color: 'var(--ok)' }}>“Okay.”</b> {item.kind === 'recall' ? 'Correct.' : 'Now tell me why.'}</>
                  : <><b style={{ color: 'var(--miss)' }}>“Are you sure?”</b> {f(item.choices![picked].why ?? '')}</>}
              </div>
              <button class="btn btn-primary btn-block" onClick={onNext}>Continue</button>
            </div>
          )}
        </>
      ) : (
        <>
          {!revealed && (
            <>
              <textarea class="answer-box" rows={4} placeholder="Type your answer, or say it out loud…" value={typed} onInput={(e) => setTyped((e.target as HTMLTextAreaElement).value)} aria-label="Your answer" />
              <button class="btn btn-primary btn-block" onClick={() => setRevealed(true)}>Reveal model answer</button>
            </>
          )}
          {revealed && (
            <div class="card stack" style={{ '--s4': '10px' }}>
              {typed && <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}><b>You said:</b> {typed}</p>}
              <p class="label">Model answer</p>
              {ex.a.map((a, k) => <p key={k}><Rich text={f(a)} /></p>)}
              <div class="chips"><Cites keys={ex.c} /></div>
            </div>
          )}
          {revealed && !grade && (
            <div class="grade">
              {(['ok', 'partial', 'miss'] as Verdict[]).map((v) => (
                <button key={v} style={{ '--c': v === 'ok' ? 'var(--ok)' : v === 'partial' ? 'var(--partial)' : 'var(--miss)' }}
                  onClick={(e) => { setGrade(v); onDone(v); if (v === 'ok') { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); } }}>
                  {v === 'ok' ? <IconCheck /> : v === 'partial' ? <IconHalf /> : <IconX />}
                  {v === 'ok' ? 'Nailed it' : v === 'partial' ? 'Partial' : 'Missed'}
                </button>
              ))}
            </div>
          )}
          {grade && <button class="btn btn-primary btn-block" onClick={onNext}>Continue</button>}
        </>
      )}
    </div>
  );
}
