import { useState } from 'preact/hooks';
import { IconBook, IconChecklist, IconChevron, IconGear } from '../components/Icons';
import { Ring } from '../components/Ring';
import { OUTLINE } from '../data/outline';
import { PAVE, type Pave } from '../data/types';
import { exportBackup, importBackup } from '../lib/backup';
import { mastery } from '../lib/progress';
import { go } from '../lib/router';
import { useProgress } from '../lib/useProgress';

export function Progress() {
  const r = useProgress();
  const [msg, setMsg] = useState('');
  if (!r) return <main class="screen" />;

  const topicTitle = (id: string) => OUTLINE.find((t) => t.id === id)?.title ?? id;
  const now = Date.now();
  const due = [...r.topics.entries()].filter(([, s]) => s.due <= now).sort((a, b) => a[1].due - b[1].due);
  const weakest = [...r.topics.entries()].filter(([, s]) => s.seen >= 1).sort((a, b) => a[1].box - b[1].box || a[1].ok / a[1].seen - b[1].ok / b[1].seen).slice(0, 5);
  const covered = OUTLINE.filter((t) => r.topics.has(t.id)).length;

  return (
    <main class="screen stack-lg">
      <h1 class="title" style={{ paddingTop: 'var(--s2)' }}>Progress</h1>

      <section class="stack">
        <h2 class="label">Checkride readiness by PAVE</h2>
        <div class="card rings">
          {(Object.keys(PAVE) as Pave[]).map((k) => <Ring key={k} pct={r.pave[k]} color={PAVE[k].color} label={PAVE[k].short} />)}
        </div>
        <div class="stats">
          <div><b class="mono">{r.answered}</b><span>answers</span></div>
          <div><b class="mono">{covered}/{OUTLINE.length}</b><span>topics started</span></div>
          <div><b class="mono">{r.dueCount}</b><span>due now</span></div>
        </div>
        <p class="muted" style={{ fontSize: 'var(--fs-xs)' }}>A topic counts as ready after you get it right on several spaced reviews. Misses reset it, and it comes back sooner in a different question.</p>
      </section>

      <section class="stack">
        <h2 class="label">By ACS area of operation</h2>
        <div class="card stack" style={{ '--s4': '12px' }}>
          {r.areas.map((a) => (
            <div key={a.area} class="acs-row">
              <div class="row between"><span><b class="mono">{a.area}</b> · {a.name}</span><span class="mono muted">{a.pct}%</span></div>
              <div class="xp-track" role="progressbar" aria-valuenow={a.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Area ${a.area} readiness`}>
                <div class="xp-fill" style={{ width: a.pct + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {due.length > 0 && (
        <section class="stack">
          <div class="row between">
            <h2 class="label">Due for review</h2>
            <button class="btn btn-ghost" style={{ minHeight: 36, padding: '0 12px' }} onClick={() => go('question')}>Review now</button>
          </div>
          <div class="list">
            {due.slice(0, 6).map(([t]) => (
              <button key={t} class="list-item" onClick={() => go(`question?drill=topic:${t}&t=300`)}>
                <span class="li-text">{topicTitle(t)}</span><IconChevron class="chev" />
              </button>
            ))}
          </div>
        </section>
      )}

      {weakest.length > 0 && (
        <section class="stack">
          <h2 class="label">Weakest topics</h2>
          <div class="list">
            {weakest.map(([t, s]) => (
              <button key={t} class="list-item" onClick={() => go(`question?drill=topic:${t}&t=300`)}>
                <span class="li-text">{topicTitle(t)}<br /><span class="muted" style={{ fontSize: 'var(--fs-xs)' }}>{s.ok}/{s.seen} right · mastery {Math.round(mastery(s) * 100)}%</span></span>
                <IconChevron class="chev" />
              </button>
            ))}
          </div>
        </section>
      )}

      <nav class="list" aria-label="More">
        <a class="list-item" href="#/guide" style={{ '--c': 'var(--pave-v)' }}>
          <span class="li-icon"><IconBook /></span>
          <span class="li-text"><b>Study Guide</b><br /><span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Your PAVE outline, completed and linked to practice</span></span>
          <IconChevron class="chev" />
        </a>
        <a class="list-item" href="#/notes" style={{ '--c': 'var(--pave-e)' }}>
          <span class="li-icon"><IconChecklist /></span>
          <span class="li-text"><b>Notes Check</b><br /><span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Fixes to your outline, with sources</span></span>
          <IconChevron class="chev" />
        </a>
        <a class="list-item" href="#/settings" style={{ '--c': 'var(--text-2)' }}>
          <span class="li-icon"><IconGear /></span>
          <span class="li-text"><b>Settings</b><br /><span class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Appearance and personal minimums</span></span>
          <IconChevron class="chev" />
        </a>
      </nav>

      <section class="stack">
        <h2 class="label">Backup</h2>
        <div class="card stack">
          <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}>Your progress lives only on this iPhone. Export a backup now and then (save it to Files or email it to yourself), and import it if you ever reinstall.</p>
          <button class="btn btn-ghost btn-block" onClick={async () => setMsg((await exportBackup()) === 'cancelled' ? '' : 'Backup created.')}>Export backup</button>
          <label class="btn btn-ghost btn-block" style={{ cursor: 'pointer' }}>
            Import backup
            <input type="file" accept="application/json,.json" class="sr-only" onChange={async (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (!f) return;
              if (!confirm('Replace the progress on this phone with the backup?')) return;
              try { setMsg(await importBackup(f)); setTimeout(() => location.reload(), 1200); } catch (err) { setMsg((err as Error).message); }
            }} />
          </label>
          {msg && <p class="callout" role="status">{msg}</p>}
        </div>
      </section>
    </main>
  );
}
