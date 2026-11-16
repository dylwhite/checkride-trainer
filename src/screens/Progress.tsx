import { IconBook, IconChecklist, IconChevron, IconGear } from '../components/Icons';
import { Ring } from '../components/Ring';
import { PAVE, SAMPLE_PROFILE, type Pave } from '../data/sample';

export function Progress() {
  return (
    <main class="screen stack-lg">
      <h1 class="title" style={{ paddingTop: 'var(--s2)' }}>Progress</h1>
      <section class="stack">
        <h2 class="label">Readiness by PAVE · sample</h2>
        <div class="card rings">
          {(Object.keys(PAVE) as Pave[]).map((k) => (
            <Ring key={k} pct={SAMPLE_PROFILE.readiness[k]} color={PAVE[k].color} label={PAVE[k].short} />
          ))}
        </div>
        <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Readiness by ACS area, badges and history arrive in Phases 4–5.</p>
      </section>
      <nav class="list" aria-label="More">
        <a class="list-item" href="#/guide" style={{ '--c': 'var(--pave-v)' }}>
          <span class="li-icon"><IconBook /></span>
          <span class="li-text"><b>Study Guide</b><br /><span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Your PAVE outline, completed</span></span>
          <IconChevron class="chev" />
        </a>
        <a class="list-item" href="#/notes" style={{ '--c': 'var(--pave-e)' }}>
          <span class="li-icon"><IconChecklist /></span>
          <span class="li-text"><b>Notes Check</b><br /><span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Fixes to your outline, with sources</span></span>
          <IconChevron class="chev" />
        </a>
        <a class="list-item" href="#/settings" style={{ '--c': 'var(--text-2)' }}>
          <span class="li-icon"><IconGear /></span>
          <span class="li-text"><b>Settings</b><br /><span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Appearance, question mix, backup</span></span>
          <IconChevron class="chev" />
        </a>
      </nav>
    </main>
  );
}
