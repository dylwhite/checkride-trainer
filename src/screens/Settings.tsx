import { useEffect, useState } from 'preact/hooks';
import { MINIMUMS } from '../data/minimums';
import { DEFAULT_MIX, getMix, quotas, setMix, type Mix } from '../lib/mix';

const KINDS: { k: keyof Mix; label: string; hint: string }[] = [
  { k: 'scenario', label: 'Scenarios', hint: 'Think-like-a-pilot decisions' },
  { k: 'recall', label: 'Quick recall', hint: 'Numbers, rules, definitions' },
  { k: 'chart', label: 'Sectional charts', hint: 'Reading real chart excerpts' }
];

function MixSetting() {
  const [mix, set] = useState<Mix | null>(null);
  useEffect(() => { getMix().then(set); }, []);
  if (!mix) return null;
  const total = mix.scenario + mix.recall + mix.chart || 1;
  const pct = (k: keyof Mix) => Math.round((mix[k] / total) * 100);
  const update = (m: Mix) => { set(m); setMix(m); };
  const q = quotas(mix, 6);
  const isDefault = KINDS.every(({ k }) => mix[k] === DEFAULT_MIX[k]);
  return (
    <section class="stack">
      <h2 class="label">Question mix</h2>
      <div class="card stack">
        {KINDS.map(({ k, label, hint }) => (
          <label class="stack" style={{ gap: '4px' }}>
            <span class="row between"><span><b>{label}</b> <span class="muted" style={{ fontSize: 'var(--fs-xs)' }}>{hint}</span></span><b class="mono">{pct(k)}%</b></span>
            <input type="range" min={0} max={100} step={5} value={mix[k]} aria-label={`${label} share`}
              onInput={(e) => update({ ...mix, [k]: Number((e.target as HTMLInputElement).value) })} />
          </label>
        ))}
        <p class="muted" style={{ fontSize: 'var(--fs-xs)' }}>
          A 6-question mission right now: {q.scenario} scenario, {q.recall} recall, {q.chart} chart. Applies to missions, mixed and PAVE drills, and the timed drill. Emergencies show up in every kind.
        </p>
        {!isDefault && <button class="btn btn-ghost" onClick={() => update(DEFAULT_MIX)}>Reset to 60 / 25 / 15</button>}
      </div>
    </section>
  );
}
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
      <MixSetting />
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
      <p class="muted" style={{ fontSize: 'var(--fs-xs)', textAlign: 'center' }}>
        Study aid only. Not for navigation. Always defer to current FAA publications and your aircraft’s POH.
      </p>
    </main>
  );
}
