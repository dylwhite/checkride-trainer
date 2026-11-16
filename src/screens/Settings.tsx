import { useState } from 'preact/hooks';
import { MINIMUMS } from '../data/minimums';
import { getTheme, setTheme, type Theme } from '../lib/theme';

export function Settings() {
  const [theme, setT] = useState<Theme>(getTheme());
  const choose = (t: Theme) => { setTheme(t); setT(t); };
  return (
    <main class="screen stack-lg">
      <div style={{ paddingTop: 'var(--s2)' }}>
        <a href="#/progress" class="muted" style={{ textDecoration: 'none', fontSize: 'var(--fs-sm)' }}>‹ Progress</a>
        <h1 class="title">Settings</h1>
      </div>
      <section class="stack">
        <h2 class="label">Appearance</h2>
        <div class="segmented" role="group" aria-label="Theme">
          <button aria-pressed={theme === 'dark'} onClick={() => choose('dark')}>Dark</button>
          <button aria-pressed={theme === 'light'} onClick={() => choose('light')}>Light</button>
        </div>
      </section>
      <section class="stack">
        <h2 class="label">Your personal minimums</h2>
        <div class="card stack" style={{ '--s4': '10px' }}>
          <div class="row between"><span>Ceiling</span><b class="mono">{MINIMUMS.ceiling.toLocaleString()} ft</b></div>
          <div class="row between"><span>Visibility</span><b class="mono">{MINIMUMS.visibility} SM</b></div>
          <div class="row between"><span>Max crosswind</span><b class="mono">{MINIMUMS.crosswind} kt</b></div>
          <div class="row between"><span>Flight rules</span><b>VFR only</b></div>
          <div class="row between"><span>Sleep</span><b class="mono">{MINIMUMS.sleepHours} h</b></div>
          <div class="row between"><span>Food within</span><b class="mono">{MINIMUMS.foodHours} h</b></div>
          <p class="muted" style={{ fontSize: 'var(--fs-xs)' }}>Used for go/no-go calls in Fly. These are your limits, not FAA rules. To change them, tell Claude Code.</p>
        </div>
      </section>
      <section class="card stack">
        <p class="h3">Coming later</p>
        <p class="muted">Question mix (scenario / recall / chart), daily reminder time, and backup export/import.</p>
      </section>
      <p class="muted" style={{ fontSize: 'var(--fs-xs)', textAlign: 'center' }}>
        Study aid only. Not for navigation. Always defer to current FAA publications and your aircraft’s POH.
      </p>
    </main>
  );
}
