import { IconClock, IconFlame, IconPlaneSmall, IconStack, IconInfo } from '../components/Icons';
import { Ring } from '../components/Ring';
import { PAVE, SAMPLE_PROFILE, type Pave } from '../data/sample';
import { go } from '../lib/router';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Night flight?';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const PHASES = ['Brief', 'Depart', 'En route', 'Arrive', 'Debrief'];

export function Today() {
  const p = SAMPLE_PROFILE;
  const pct = Math.round(((p.xp - p.levelFloor) / (p.levelCeil - p.levelFloor)) * 100);
  return (
    <main class="screen stack-lg">
      <header class="today-head stack">
        <div class="row between">
          <span class="preview-banner"><IconInfo width={14} height={14} /> Design preview · sample data</span>
          <span class="streak" aria-label={`${p.streak} day streak`}>
            <IconFlame />
            {p.streak}
          </span>
        </div>
        <h1 class="title">{greeting()}</h1>
        <div class="xp">
          <div class="row between">
            <span class="h3">{p.level}</span>
            <span class="muted mono" style={{ fontSize: 'var(--fs-sm)' }}>
              {p.xp.toLocaleString()} / {p.levelCeil.toLocaleString()} XP
            </span>
          </div>
          <div class="xp-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress to ${p.nextLevel}`}>
            <div class="xp-fill" style={{ width: pct + '%' }} />
          </div>
          <span class="muted" style={{ fontSize: 'var(--fs-xs)' }}>{(p.levelCeil - p.xp).toLocaleString()} XP to {p.nextLevel}</span>
        </div>
      </header>

      <section class="card mission stack" aria-labelledby="mission-title">
        <svg class="mission-art" viewBox="0 0 150 110" aria-hidden="true">
          <circle cx="90" cy="55" r="48" fill="none" stroke="var(--accent)" stroke-opacity="0.35" stroke-width="1.5" />
          <circle cx="90" cy="55" r="34" fill="none" stroke="var(--accent)" stroke-opacity="0.25" stroke-width="1.5" />
          <path d="M42 62 L138 48" stroke="var(--accent)" stroke-width="2" stroke-opacity="0.7" />
          <path d="M72 55 h12 l6 6 l6 -6 h12" stroke="var(--partial)" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </svg>
        <p class="label" style={{ color: 'var(--accent)' }}>Today’s Mission</p>
        <h2 id="mission-title" class="h2">Low clouds over the valley</h2>
        <p class="muted">Marine layer’s in. Make the go/no-go calls a DPE would ask about.</p>
        <div class="mission-meta">
          <span><IconClock /> ~5 min</span>
          <span><IconStack /> 8 questions</span>
        </div>
        <div class="chips" aria-label="Topics">
          {(['V', 'P', 'A'] as Pave[]).map((k) => (
            <span key={k} class="chip chip-pave" style={{ '--c': PAVE[k].color }}>
              <span class="dot" />{PAVE[k].short}
            </span>
          ))}
        </div>
        <button class="btn btn-primary btn-block" onClick={() => go('question')}>Start mission</button>
      </section>

      <section>
        <button class="card card-tap flight-card stack" onClick={() => go('fly')} aria-label={`Continue your flight from ${p.flight.from} to ${p.flight.to}`}>
          <svg class="horizon-bg" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="var(--accent)" stop-opacity="0.10" />
                <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 0 H400 V96 L0 108 Z" fill="url(#sky)" />
            <path d="M0 108 L400 96" stroke="var(--accent)" stroke-opacity="0.35" stroke-width="1.5" />
            <path d="M180 128 L220 128 M190 140 L210 140" stroke="var(--text-2)" stroke-opacity="0.35" stroke-width="1.5" />
          </svg>
          <div class="row between">
            <p class="label">Continue your flight</p>
            <span class="muted" style={{ fontSize: 'var(--fs-xs)' }}>{p.flight.chapter}</span>
          </div>
          <div class="route">
            <span>{p.flight.from}</span>
            <div class="route-line">
              <div class="done" style={{ width: p.flight.progress * 100 + '%' }} />
              <IconPlaneSmall class="plane" style={{ left: p.flight.progress * 100 + '%' }} />
            </div>
            <span>{p.flight.to}</span>
          </div>
          <div class="phase-strip" aria-label={`Phase: ${PHASES[p.flight.phase]}`}>
            {PHASES.map((ph, i) => (
              <span key={ph} class={i < p.flight.phase ? 'on' : i === p.flight.phase ? 'now' : ''} />
            ))}
          </div>
          <p>{p.flight.teaser}</p>
        </button>
      </section>

      <section class="stack" aria-labelledby="ready-title">
        <div class="row between">
          <h2 id="ready-title" class="label">Checkride readiness</h2>
          <a href="#/progress" class="muted" style={{ fontSize: 'var(--fs-sm)', textDecoration: 'none' }}>Details</a>
        </div>
        <div class="card rings">
          {(Object.keys(PAVE) as Pave[]).map((k) => (
            <Ring key={k} pct={p.readiness[k]} color={PAVE[k].color} label={PAVE[k].short} />
          ))}
        </div>
      </section>
    </main>
  );
}
