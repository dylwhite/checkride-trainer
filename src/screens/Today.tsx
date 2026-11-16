import { IconClock, IconFlame, IconStack } from '../components/Icons';
import { Ring } from '../components/Ring';
import { levelFor, useProgress } from '../lib/useProgress';
import { PAVE, type Pave } from '../data/types';
import { go } from '../lib/router';
import { FlightCard } from './Fly';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Night flight?';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}


export function Today() {
  const r = useProgress();
  if (!r) return <main class="screen" />;
  const lv = levelFor(r.xp);
  const p = { streak: r.streak, xp: r.xp, level: lv.name, nextLevel: lv.next, levelCeil: lv.ceil, readiness: r.pave };
  const pct = lv.next ? Math.round(((r.xp - lv.floor) / (lv.ceil - lv.floor)) * 100) : 100;
  return (
    <main class="screen stack-lg">
      <header class="today-head stack">
        <div class="row between">
          <span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>{r.dueCount > 0 ? `${r.dueCount} topic${r.dueCount > 1 ? 's' : ''} due for review` : r.nextDue ? `Next review ${r.nextDue}` : r.answered ? 'All caught up' : 'Welcome aboard'}</span>
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
          <span class="muted" style={{ fontSize: 'var(--fs-xs)' }}>{p.nextLevel ? `${(p.levelCeil - p.xp).toLocaleString()} XP to ${p.nextLevel}` : 'Top level reached. Keep your edge sharp.'}</span>
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
        <h2 id="mission-title" class="h2">Mixed checkride prep</h2>
        <p class="muted">Scenarios around KHIO, the quick-recall facts behind them, a chart question or an emergency. Different every time.</p>
        <div class="mission-meta">
          <span><IconClock /> ~5 min</span>
          <span><IconStack /> about 8 questions</span>
        </div>
        <div class="chips" aria-label="Topics">
          {(['P', 'A', 'V', 'E'] as Pave[]).map((k) => (
            <span key={k} class="chip chip-pave" style={{ '--c': PAVE[k].color }}>
              <span class="dot" />{PAVE[k].short}
            </span>
          ))}
        </div>
        <button class="btn btn-primary btn-block" onClick={() => go('question')}>Start mission</button>
      </section>

      <section>
        <FlightCard />
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
