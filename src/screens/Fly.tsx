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
  extra?: { afterId: string; id: string; note: string }[]; // consequence legs added by missed decisions
}

// What a missed in-flight decision leads to next (all verified bank items).
type Conseq = { id: string; note: string; setup?: string[] }; // setup replaces the item's own scene text

const CONSEQUENCE: Record<string, Conseq> = {
  's-carb-ice': { id: 's-restart-items', note: 'The ice kept building. The engine sputters and quits.' },
  'e-low-volt': { id: 's-lostcomm', note: 'The battery kept draining. A few minutes later the radios go silent.', setup: ['Nobody answers your calls and you can’t hear anything. You turn back toward KHIO, where the tower is open and the weather is good VFR.'] },
  's-vacuum': { id: 's-imc-180', note: 'Distracted by the failed gyros, you drift into a cloud bank and lose sight of the ground.', setup: [] },
  's-thunderstorm': { id: 's-imc-180', note: 'Heavy rain from the storm’s edge wipes out your visibility. You can’t see the ground.', setup: [] },
  's-cascades-climb': { id: 's-precautionary', note: 'Climb performance isn’t what you hoped, and the ridgeline is close. You turn away and decide to land and reassess.', setup: ['The engine runs fine. You’ve picked a large, smooth field to land in.'] },
  's-mountain-wave': { id: 's-emerg-landing-items', note: 'The downdraft wins. The engine can’t hold altitude and you need a place to put it down.' },
  'e-efato': { id: 's-emerg-landing-items', note: 'With no runway left and no power, you’re landing off-airport.' },
  'e-door': { id: 's-precautionary', note: 'The noise and distraction are getting to you. You decide to land and sort it out on the ground.', setup: ['The engine runs fine. You’ve picked a large, smooth field to land in.'] }
};

// What launching on a no-go day leads to, for the first reason the flight shouldn’t have gone.
function launchConsequence(story: Story): Conseq | null {
  const why = story.noGo[0] ?? '';
  if (why.includes('icing')) return { id: 's-icing', note: 'You launched anyway. Over the Cascades you enter a thin cloud layer, and ice starts forming on the windshield and wing struts.', setup: [] };
  if (why.includes('Weather')) return { id: 's-imc-180', note: 'You launched anyway. The clouds get lower and the visibility worse, until you’re in cloud and can’t see the ground.', setup: [] };
  if (why.includes('Crosswind')) return { id: 's2-xw-goaround', note: `You launched anyway. On final at ${story.dest.name}, the windsock is standing straight out across the runway.` };
  if (why.includes('Weight')) return { id: 's-cg-effects', note: 'You launched anyway. The airplane feels different from the moment the nosewheel lifts off.' };
  if (why.includes('position light')) return { id: 's-inop-navlight', note: 'You launched anyway.', setup: [`The left position light is inoperative, and you’ll land at ${story.dest.name} about 20 minutes after sunset.`] };
  if (why.includes('IMSAFE')) return { id: 's-precautionary', note: 'You launched anyway. Halfway there you feel foggy and slow to respond, and decide to get on the ground.', setup: ['The engine runs fine. You’ve picked a large, smooth field to land in.'] };
  return null; // e.g. an expired annual: nothing happens in flight, but the debrief explains why it was illegal
}

const withSetup = (it: NonNullable<ReturnType<typeof byId>>, c: Conseq) => (c.setup ? { ...it, setup: c.setup.length ? c.setup : undefined } : it);

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
  const shouldGo = story.noGo.length === 0;
  type FLeg = { id: string; title: string; phase: number; item: NonNullable<ReturnType<typeof byId>>; vars?: Record<string, string>; note?: string };
  const legs: FLeg[] = useMemo(() => {
    const out: FLeg[] = [];
    if (s.goCall === 'go' && !shouldGo) {
      const c = launchConsequence(story);
      const it = c && byId(c.id);
      if (c && it) out.push({ id: c.id, title: 'Consequence', phase: 2, item: withSetup(it, c), note: c.note });
      return out;
    }
    for (const l of story.flight) {
      out.push(l);
      for (const x of s.extra ?? []) if (x.afterId === l.id) {
        const it = byId(x.id);
        const c = CONSEQUENCE[x.afterId];
        if (it) out.push({ id: x.id, title: 'Consequence', phase: l.phase, item: c ? withSetup(it, c) : it, note: x.note });
      }
    }
    return out;
  }, [s.seed, s.goCall, (s.extra ?? []).length]);
  // Step layout: 0 intro · 1..B briefing · B+1 go/no-go · then flight legs · then debrief
  const B = brief.length;
  const goStep = B + 1;
  const firstLeg = goStep + 1;
  const debrief = firstLeg + legs.length;
  const stopAfterGo = s.goCall === 'nogo';
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
            onAnswered={(v) => { logAnswer(brief[step - 1].item.id, v, { topic: brief[step - 1].item.topic, xp: v === 'ok' ? 15 : 0 }); s.results.push({ title: brief[step - 1].title, v }); }}
            onNext={() => advance({ results: s.results })} />
        </div>
      )}

      {step === goStep && (
        <GoNoGo story={story} onDecide={(call) => {
          const ok = (call === 'go') === shouldGo;
          logAnswer('story-gonogo', ok ? 'ok' : 'miss', { topic: 'p-adm', xp: ok ? 25 : 0 });
          advance({ goCall: call, results: [...s.results, { title: 'Go/no-go call', v: ok ? 'ok' : 'miss' }] });
        }} />
      )}

      {step >= firstLeg && step < debrief && (
        <div class="stack">
          <p class="label" style={{ color: legs[step - firstLeg].note ? 'var(--miss)' : 'var(--accent)' }}>{legs[step - firstLeg].title}</p>
          {legs[step - firstLeg].note && <div class="card" style={{ borderLeft: '4px solid var(--miss)' }}><p>{legs[step - firstLeg].note}</p></div>}
          <StepView key={step} step={{ item: legs[step - firstLeg].item, vars: legs[step - firstLeg].vars ?? {} }}
            onAnswered={(v) => {
              const leg = legs[step - firstLeg];
              logAnswer(leg.item.id, v, { topic: leg.item.topic, xp: v === 'ok' ? 20 : 0 });
              s.results.push({ title: leg.note ? 'Consequence' : leg.title, v });
              const c = !leg.note && v === 'miss' ? CONSEQUENCE[leg.id] : undefined;
              if (c && !(s.extra ?? []).some((x) => x.afterId === leg.id)) s.extra = [...(s.extra ?? []), { afterId: leg.id, id: c.id, note: c.note }];
            }}
            onNext={() => advance({ results: s.results, extra: s.extra })} />
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
