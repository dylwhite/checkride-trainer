import { useEffect, useMemo, useState } from 'preact/hooks';
import { IconCheck, IconFly, IconPlaneSmall, IconX } from '../components/Icons';
import { Cites, type Verdict } from '../components/ResultSheet';
import { byId } from '../data/bank';
import { buildStory, type Story } from '../data/story';
import { useImmersive } from '../lib/immersive';
import { go } from '../lib/router';
import { logAnswer } from '../lib/session';
import { load, save } from '../lib/storage';
import { StepView } from './Session';

export interface StorySave {
  seed: number;
  step: number; // index into the step list
  results: { title: string; v: Verdict }[];
  goCall?: 'go' | 'nogo';
  done?: boolean;
}

const PHASES = ['Brief', 'Depart', 'En route', 'Arrive', 'Debrief'];
const SEASON_TEXT = { summer: 'summer', fall: 'fall', winter: 'winter', spring: 'spring' };

export function storyFor(seed: number) {
  return buildStory(seed, (id) => byId(id));
}

export function RouteStrip({ story, phase }: { story: Story; phase: number }) {
  const progress = Math.min(1, phase / 4);
  return (
    <div class="card flight-card stack" style={{ padding: 'var(--s4)' }}>
      <svg class="horizon-bg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H400 V70 L0 80 Z" fill="var(--accent)" fill-opacity="0.08" />
        <path d="M0 80 L400 70" stroke="var(--accent)" stroke-opacity="0.35" stroke-width="1.5" />
      </svg>
      <div class="route">
        <span>KHIO</span>
        <div class="route-line">
          <div class="done" style={{ width: progress * 100 + '%' }} />
          <IconPlaneSmall class="plane" style={{ left: progress * 100 + '%' }} />
        </div>
        <span>{story.dest.id}</span>
      </div>
      <div class="phase-strip" aria-label={`Phase: ${PHASES[phase]}`}>
        {PHASES.map((p, i) => <span key={p} class={i < phase ? 'on' : i === phase ? 'now' : ''} />)}
      </div>
      <div class="row between" style={{ fontSize: 'var(--fs-xs)' }}>
        {PHASES.map((p, i) => <span key={p} class={i === phase ? '' : 'muted'} style={{ fontWeight: i === phase ? 700 : 500 }}>{p}</span>)}
      </div>
    </div>
  );
}

export function Fly() {
  const [save0, setSave] = useState<StorySave | null | undefined>(undefined);
  useEffect(() => { load<StorySave | null>('story', null).then(setSave); }, []);
  if (save0 === undefined) return <main class="screen" />;
  if (!save0 || save0.done) return <FlyHome last={save0} onStart={async () => { const s = { seed: Date.now() % 2147483647, step: 0, results: [] }; await save('story', s); setSave(s); }} />;
  return <FlyRun s={save0} onChange={(s) => { setSave(s); save('story', s); }} />;
}

function FlyHome({ last, onStart }: { last: StorySave | null; onStart: () => void }) {
  return (
    <main class="screen stack-lg">
      <h1 class="title" style={{ paddingTop: 'var(--s2)' }}>Fly</h1>
      <div class="card mission stack">
        <IconFly width={36} height={36} style={{ color: 'var(--accent)' }} />
        <p class="h2">A cross-country from KHIO</p>
        <p class="muted">A random destination, season, and set of conditions. Start with a PAVE briefing, make the go/no-go call, then fly it. Problems will come up. Bad calls lead to a debrief, never a game over.</p>
        <button class="btn btn-primary btn-block" onClick={onStart}>{last?.done ? 'Plan another flight' : 'Plan a flight'}</button>
      </div>
      <p class="muted" style={{ fontSize: 'var(--fs-xs)' }}>Weather reports in Fly are fictional and for training only. Airport data comes from the Chart Supplement (NW, 29 Oct–24 Dec 2026).</p>
    </main>
  );
}

function FlyRun({ s, onChange }: { s: StorySave; onChange: (s: StorySave) => void }) {
  useImmersive();
  const story = useMemo(() => storyFor(s.seed), [s.seed]);
  const brief = story.briefing;
  const legs = story.flight;
  const shouldGo = story.noGo.length === 0;
  // Step layout: 0 intro · 1..B briefing · B+1 go/no-go · then flight legs · then debrief
  const B = brief.length;
  const goStep = B + 1;
  const firstLeg = goStep + 1;
  const debrief = firstLeg + legs.length;
  const stopAfterGo = s.goCall !== undefined && (s.goCall === 'nogo' || !shouldGo);
  const step = stopAfterGo && s.step > goStep ? debrief : s.step;
  const phase = step <= goStep ? 0 : step >= debrief ? 4 : legs[step - firstLeg].phase;
  const advance = (patch: Partial<StorySave> = {}) => { onChange({ ...s, ...patch, step: s.step + 1 }); window.scrollTo(0, 0); };

  return (
    <main class="screen full stack-lg">
      <div class="row between" style={{ paddingTop: 'var(--s1)' }}>
        <button class="icon-btn" aria-label="Leave flight (progress is saved)" onClick={() => go('today')}><IconX width={22} height={22} /></button>
        <span class="label">{story.dest.name} · {SEASON_TEXT[story.season]} {story.tod}</span>
        <span style={{ width: 48 }} />
      </div>
      <RouteStrip story={story} phase={phase} />

      {step === 0 && (
        <div class="stack-lg">
          <div class="card stack">
            <p class="label">Flight plan</p>
            <p class="h2">KHIO → {story.dest.name} ({story.dest.id})</p>
            <p class="muted">
              {story.dest.name}: elevation {story.dest.elev.toLocaleString()} ft, runway {story.dest.rwy} ({story.dest.len.toLocaleString()} ft), {story.dest.freq}, {story.dest.airspace}.
              {story.dest.east ? ' The route crosses the Cascades.' : ''} {story.tod === 'evening' ? 'You’ll arrive after sunset.' : ''}
            </p>
            <div class="chips"><Cites keys={[`cs:${story.dest.id}`]} /></div>
          </div>
          <button class="btn btn-primary btn-block" onClick={() => advance()}>Start the PAVE briefing</button>
        </div>
      )}

      {step >= 1 && step <= B && (
        <div class="stack">
          <p class="label" style={{ color: 'var(--accent)' }}>Briefing · {brief[step - 1].title}</p>
          <StepView key={step} step={{ item: brief[step - 1].item, vars: {} }}
            onAnswered={(v) => { logAnswer(brief[step - 1].item.id, v); s.results.push({ title: brief[step - 1].title, v }); }}
            onNext={() => advance({ results: s.results })} />
        </div>
      )}

      {step === goStep && (
        <GoNoGo story={story} onDecide={(call) => {
          const ok = (call === 'go') === shouldGo;
          logAnswer('story-gonogo', ok ? 'ok' : 'miss');
          advance({ goCall: call, results: [...s.results, { title: 'Go/no-go call', v: ok ? 'ok' : 'miss' }] });
        }} />
      )}

      {step >= firstLeg && step < debrief && (
        <div class="stack">
          <p class="label" style={{ color: 'var(--accent)' }}>{legs[step - firstLeg].title}</p>
          <StepView key={step} step={{ item: legs[step - firstLeg].item, vars: legs[step - firstLeg].vars ?? {} }}
            onAnswered={(v) => { logAnswer(legs[step - firstLeg].item.id, v); s.results.push({ title: legs[step - firstLeg].title, v }); }}
            onNext={() => advance({ results: s.results })} />
        </div>
      )}

      {step >= debrief && <Debrief story={story} s={s} shouldGo={shouldGo} onDone={() => { onChange({ ...s, done: true }); go('fly'); }} />}
    </main>
  );
}

function GoNoGo({ story, onDecide }: { story: Story; onDecide: (c: 'go' | 'nogo') => void }) {
  return (
    <div class="stack-lg">
      <div class="card stack">
        <p class="label">Decision time</p>
        <p class="h2">Go or no-go?</p>
        <p class="muted">Think back through Pilot, Aircraft, enVironment, and External pressures. You’re the final authority.</p>
      </div>
      <div class="choices">
        <button class="choice" onClick={() => onDecide('go')}><span class="key">✓</span><span class="txt"><b>Go</b>: everything checks out.</span></button>
        <button class="choice" onClick={() => onDecide('nogo')}><span class="key">✕</span><span class="txt"><b>No-go</b>: something on the PAVE list stops this flight.</span></button>
      </div>
    </div>
  );
}

function Debrief({ story, s, shouldGo, onDone }: { story: Story; s: StorySave; shouldGo: boolean; onDone: () => void }) {
  const callOk = (s.goCall === 'go') === shouldGo;
  const ok = s.results.filter((r) => r.v === 'ok').length;
  return (
    <div class="stack-lg">
      <div class="card stack" style={{ borderLeft: `4px solid ${callOk ? 'var(--ok)' : 'var(--miss)'}` }}>
        <p class="label">Debrief</p>
        <p class="h2">{callOk ? (shouldGo ? 'Good flight.' : 'Good no-go call.') : shouldGo ? 'This one was flyable.' : 'This flight shouldn’t have launched.'}</p>
        {story.noGo.length > 0 ? (
          <>
            <p class="muted">What should have stopped it:</p>
            <ul class="guide-user">{story.noGo.map((n) => <li key={n}>{n}</li>)}</ul>
          </>
        ) : (
          <p class="muted">Everything was within the rules and your personal minimums.{s.goCall === 'nogo' ? ' Being conservative is never wrong, but know why you said no.' : ''}</p>
        )}
      </div>
      <div class="list">
        {s.results.map((r, i) => (
          <div key={i} class="list-item">
            <span class="li-icon" style={{ '--c': r.v === 'ok' ? 'var(--ok)' : r.v === 'partial' ? 'var(--partial)' : 'var(--miss)' }}>
              {r.v === 'ok' ? <IconCheck /> : <IconX />}
            </span>
            <span class="li-text">{r.title}</span>
            <span class="muted">{r.v === 'ok' ? 'Good' : r.v === 'partial' ? 'Partial' : 'Review'}</span>
          </div>
        ))}
      </div>
      <p class="muted" style={{ textAlign: 'center' }}>{ok} of {s.results.length} decisions were good. Missed topics come back in Drills → Weak-spot drill.</p>
      <button class="btn btn-primary btn-block" onClick={onDone}>Finish</button>
    </div>
  );
}

// Card on the Today screen: continue the saved flight, or plan one.
export function FlightCard() {
  const [sv, setSv] = useState<StorySave | null | undefined>(undefined);
  useEffect(() => { load<StorySave | null>('story', null).then(setSv); }, []);
  if (sv === undefined) return null;
  const active = sv && !sv.done;
  const story = active ? storyFor(sv!.seed) : null;
  return (
    <button class="card card-tap flight-card stack" onClick={() => go('fly')} aria-label={active ? `Continue your flight to ${story!.dest.name}` : 'Plan a cross-country flight'}>
      <svg class="horizon-bg" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H400 V96 L0 108 Z" fill="var(--accent)" fill-opacity="0.08" />
        <path d="M0 108 L400 96" stroke="var(--accent)" stroke-opacity="0.35" stroke-width="1.5" />
      </svg>
      <p class="label">{active ? 'Continue your flight' : 'Fly a cross-country'}</p>
      <div class="route">
        <span>KHIO</span>
        <div class="route-line">
          <div class="done" style={{ width: active ? '40%' : '0%' }} />
          <IconPlaneSmall class="plane" style={{ left: active ? '40%' : '0%' }} />
        </div>
        <span>{active ? story!.dest.id : '????'}</span>
      </div>
      <p>{active ? `Your ${story!.season} flight to ${story!.dest.name} is waiting.` : 'A random destination, real airport data, and a PAVE go/no-go briefing.'}</p>
    </button>
  );
}
