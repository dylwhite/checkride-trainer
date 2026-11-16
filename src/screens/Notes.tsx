import { useState } from 'preact/hooks';
import { IconCheck, IconInfo, IconX } from '../components/Icons';
import { Cites } from '../components/ResultSheet';
import { Rich } from '../components/Rich';
import { NOTES, type NoteKind } from '../data/notes';
import { OUTLINE } from '../data/outline';
import { PAVE, type Pave } from '../data/types';

const KIND: Record<NoteKind, { label: string; color: string; Icon: any; blurb: string }> = {
  wrong: { label: 'Wrong', color: 'var(--miss)', Icon: IconX, blurb: 'Fix these first. An examiner would catch them.' },
  incomplete: { label: 'Incomplete', color: 'var(--partial)', Icon: IconInfo, blurb: 'Right as far as it goes, but missing details an examiner may ask about.' },
  wording: { label: 'Wording', color: 'var(--accent)', Icon: IconCheck, blurb: 'Terminology and organization.' }
};

function Back() {
  return <a href="#/progress" class="muted" style={{ textDecoration: 'none', fontSize: 'var(--fs-sm)' }}>‹ Progress</a>;
}

export function NotesCheck() {
  const topic = (id: string) => OUTLINE.find((t) => t.id === id);
  return (
    <main class="screen stack-lg">
      <div style={{ paddingTop: 'var(--s2)' }}>
        <Back />
        <h1 class="title">Notes Check</h1>
        <p class="muted" style={{ marginTop: 'var(--s2)' }}>
          Your outline checked against the FAA sources and your POH. {NOTES.length} items to review.
        </p>
      </div>
      {(['wrong', 'incomplete', 'wording'] as NoteKind[]).map((k) => {
        const K = KIND[k];
        const list = NOTES.filter((n) => n.kind === k);
        return (
          <section key={k} class="stack" aria-labelledby={`nk-${k}`}>
            <div class="row" style={{ gap: 'var(--s2)' }}>
              <span class="note-kind" style={{ '--c': K.color }}><K.Icon width={16} height={16} /></span>
              <h2 id={`nk-${k}`} class="h3">{K.label} · {list.length}</h2>
            </div>
            <p class="muted" style={{ fontSize: 'var(--fs-sm)', marginTop: 'var(--s1)' }}>{K.blurb}</p>
            {list.map((n) => {
              const t = topic(n.topicId);
              return (
                <article key={n.id} class={`card note note-${n.kind}`} style={{ '--c': K.color }}>
                  {t && <p class="label" style={{ color: PAVE[t.pave].color }}>{PAVE[t.pave].short} · {t.title}</p>}
                  <p class="note-you"><span class="sr-only">You wrote: </span>“{n.you}”</p>
                  <p><Rich text={n.fix} /></p>
                  <div class="chips"><Cites keys={n.c} /></div>
                </article>
              );
            })}
          </section>
        );
      })}
    </main>
  );
}

export function StudyGuide() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <main class="screen stack-lg">
      <div style={{ paddingTop: 'var(--s2)' }}>
        <Back />
        <h1 class="title">Study Guide</h1>
        <p class="muted" style={{ marginTop: 'var(--s2)' }}>Your PAVE outline, completed and sourced. Topics marked “Added” weren’t in your outline.</p>
      </div>
      {(Object.keys(PAVE) as Pave[]).map((p) => (
        <section key={p} class="stack" aria-labelledby={`sg-${p}`}>
          <h2 id={`sg-${p}`} class="h2" style={{ color: PAVE[p].color }}>{PAVE[p].name}</h2>
          <div class="list">
            {OUTLINE.filter((t) => t.pave === p).map((t) => {
              const isOpen = open === t.id;
              return (
                <div key={t.id}>
                  <button class="list-item" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : t.id)} style={{ '--c': PAVE[p].color }}>
                    <span class="li-text">
                      <b>{t.title}</b>
                      {t.added && <span class="chip" style={{ marginLeft: 8, minHeight: 22, padding: '1px 8px' }}>Added</span>}
                      <br />
                      <span class="muted mono" style={{ fontSize: 'var(--fs-xs)' }}>{t.acs.slice(0, 3).join(' · ')}</span>
                    </span>
                    <span aria-hidden="true" class="muted">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div class="guide-body stack">
                      {t.user.length > 0 && (
                        <div>
                          <p class="label">Your notes</p>
                          <ul class="guide-user">{t.user.map((u, k) => <li key={k}>{u}</li>)}</ul>
                        </div>
                      )}
                      {t.facts.length > 0 && (
                        <div class="stack" style={{ '--s4': '10px' }}>
                          <p class="label">Key details</p>
                          {t.facts.map((fct, k) => (
                            <div key={k} class="guide-fact">
                              <p><Rich text={fct.t} /></p>
                              <div class="chips"><Cites keys={fct.c} /></div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div>
                        <p class="label">Read more</p>
                        <div class="chips"><Cites keys={t.refs} /></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
