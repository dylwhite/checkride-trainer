import { useEffect, useState } from 'preact/hooks';
import { IconDrills } from '../components/Icons';
import { bank } from '../data/bank';
import { PAVE, type Pave } from '../data/types';
import { go } from '../lib/router';
import { weakTopics } from '../lib/session';

const FIVE_MIN = 300;

export function Drills() {
  const all = bank();
  const [weak, setWeak] = useState<string[] | null>(null);
  useEffect(() => { weakTopics().then(setWeak); }, []);
  const count = (f: (i: (typeof all)[number]) => boolean) => all.filter(f).length;
  const start = (k: string) => go(`question?drill=${k}&t=${FIVE_MIN}`);

  const kinds = [
    { k: 'mixed', label: 'Mixed', sub: 'Everything, shuffled', n: all.length, c: 'var(--accent)' },
    { k: 'scenario', label: 'Scenarios', sub: 'Make the call', n: count((i) => i.kind === 'scenario'), c: 'var(--accent)' },
    { k: 'recall', label: 'Flashcards', sub: 'Quick recall, self-graded', n: count((i) => i.kind === 'recall'), c: 'var(--accent)' },
    { k: 'chart', label: 'Charts', sub: 'Sectional excerpts', n: count((i) => i.kind === 'chart'), c: 'var(--accent)' },
    { k: 'emergency', label: 'Emergencies', sub: 'Memory items and decisions', n: count((i) => !!i.emergency), c: 'var(--miss)' }
  ];

  return (
    <main class="screen stack-lg">
      <div style={{ paddingTop: 'var(--s2)' }}>
        <h1 class="title">Drills</h1>
        <p class="muted" style={{ marginTop: 'var(--s2)' }}>5-minute rapid fire. Stop any time; every answer is saved.</p>
      </div>

      <button class="card card-tap mission stack" onClick={() => start('weak')} disabled={weak !== null && weak.length === 0}>
        <p class="label" style={{ color: 'var(--partial)' }}>Your weakest areas</p>
        <p class="h2">Weak-spot drill</p>
        <p class="muted" style={{ fontSize: 'var(--fs-sm)' }}>
          {weak === null ? 'Checking your answers…' : weak.length === 0 ? 'Answer a few questions first. Then this targets the topics you miss most.' : `Targets the topics you miss most (${weak.length}).`}
        </p>
      </button>

      <section class="stack">
        <h2 class="label">By type</h2>
        <div class="drill-grid">
          {kinds.map((d) => (
            <button key={d.k} class="card card-tap drill" style={{ '--c': d.c }} onClick={() => start(d.k)}>
              <IconDrills />
              <b>{d.label}</b>
              <span class="muted">{d.sub}</span>
              <span class="mono drill-n">{d.n}</span>
            </button>
          ))}
        </div>
      </section>

      <section class="stack">
        <h2 class="label">By PAVE area</h2>
        <div class="drill-grid">
          {(Object.keys(PAVE) as Pave[]).map((p) => (
            <button key={p} class="card card-tap drill" style={{ '--c': PAVE[p].color }} onClick={() => start(p)}>
              <span class="drill-letter">{p}</span>
              <b>{PAVE[p].name}</b>
              <span class="mono drill-n">{count((i) => i.pave === p)}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
