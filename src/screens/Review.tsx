// Every question in the app, with the correct answer, the wrong options and why they're wrong,
// and sources, so a CFI can review the content. Open it at #/review.
import { useMemo, useState } from 'preact/hooks';
import { Rich } from '../components/Rich';
import { Cites } from '../components/ResultSheet';
import { bank } from '../data/bank';
import { OUTLINE } from '../data/outline';
import { PAVE, type Item, type Pave } from '../data/types';
import { fill } from '../lib/session';

const KIND = { scenario: 'Scenario', recall: 'Recall', chart: 'Chart' } as const;

function firstVars(i: Item) {
  return Object.fromEntries(Object.entries(i.vars ?? {}).map(([k, o]) => [k, o[0]]));
}

function ItemCard({ i }: { i: Item }) {
  const v = firstVars(i);
  const f = (s: string) => fill(s, v);
  return (
    <article class="card stack" style={{ '--s4': '8px' }}>
      <div class="row between" style={{ flexWrap: 'wrap', gap: 6 }}>
        <span class="chip">{KIND[i.kind]}{i.emergency ? ' · Emergency' : ''}{i.id.startsWith('g-') ? ' · Generated' : ''}</span>
        <span class="mono muted" style={{ fontSize: 'var(--fs-xs)' }}>{i.id}</span>
      </div>
      {i.chart && <p class="muted" style={{ fontSize: 'var(--fs-xs)' }}>Chart: {i.chart.caption} ({i.chart.chart} sectional)</p>}
      {i.setup?.map((s, k) => <p key={k} class="muted"><Rich text={f(s)} /></p>)}
      {i.readout && <pre class="mono" style={{ whiteSpace: 'pre-wrap', fontSize: 'var(--fs-xs)' }}>{f(i.readout.text)}</pre>}
      <p><b><Rich text={f(i.prompt)} /></b></p>
      {i.choices ? (
        <ul class="review-choices">
          {i.choices.map((c, k) => (
            <li key={k} class={c.ok ? 'ok' : ''}>
              <span aria-hidden="true">{c.ok ? '✓ ' : '✕ '}</span><span class="sr-only">{c.ok ? 'Correct: ' : 'Wrong: '}</span>
              <Rich text={f(c.t)} />
              {!c.ok && c.why && <span class="muted"> · <Rich text={f(c.why)} /></span>}
            </li>
          ))}
        </ul>
      ) : (
        i.answer && <p class="review-choices"><span class="ok">✓ {i.answer.map(f).join('; ')}</span></p>
      )}
      {i.explain?.map((s, k) => <p key={k} style={{ fontSize: 'var(--fs-sm)' }}><Rich text={f(s)} /></p>)}
      <div class="chips"><Cites keys={i.c} /></div>
    </article>
  );
}

export function Review() {
  const [q, setQ] = useState('');
  const all = useMemo(() => bank(), []);
  const needle = q.trim().toLowerCase();
  const match = (i: Item) => !needle || JSON.stringify(i).toLowerCase().includes(needle);
  const shown = all.filter(match);
  return (
    <main class="screen stack-lg">
      <div style={{ paddingTop: 'var(--s2)' }}>
        <a href="#/progress" class="muted" style={{ textDecoration: 'none', fontSize: 'var(--fs-sm)' }}>‹ Progress</a>
        <h1 class="title">Question review</h1>
        <p class="muted" style={{ marginTop: 'var(--s2)' }}>
          All {all.length} questions, grouped by PAVE topic, with the correct answer (✓), each wrong option and why it’s wrong, and the FAA or POH sources.
          Made for a CFI to check. To report a problem, note the question ID shown on the card.
          Generated questions (weather, fuel, performance, and so on) show one example; the app varies the numbers each time.
        </p>
      </div>
      <input class="search" type="search" placeholder="Search questions, answers, or IDs" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} aria-label="Search questions" />
      {needle && <p class="muted">{shown.length} matching</p>}
      {(Object.keys(PAVE) as Pave[]).map((p) => {
        const topics = OUTLINE.filter((t) => t.pave === p).map((t) => ({ t, items: shown.filter((i) => i.topic === t.id) })).filter((x) => x.items.length);
        if (!topics.length) return null;
        return (
          <section key={p} class="stack">
            <h2 class="h2" style={{ color: PAVE[p].color }}>{PAVE[p].name}</h2>
            {topics.map(({ t, items }) => (
              <details key={t.id} class="review-topic" open={!!needle}>
                <summary><b>{t.title}</b> <span class="muted">({items.length})</span></summary>
                <div class="stack" style={{ marginTop: 'var(--s3)' }}>{items.map((i) => <ItemCard key={i.id} i={i} />)}</div>
              </details>
            ))}
          </section>
        );
      })}
    </main>
  );
}
