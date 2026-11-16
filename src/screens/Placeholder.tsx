import type { ComponentType } from 'preact';

export function Placeholder({ title, blurb, phase, Icon, color }: {
  title: string; blurb: string; phase: number; Icon: ComponentType<any>; color: string;
}) {
  return (
    <main class="screen stack-lg">
      <h1 class="title" style={{ paddingTop: 'var(--s2)' }}>{title}</h1>
      <div class="card soon" style={{ '--c': color }}>
        <Icon />
        <p class="h3">{blurb}</p>
        <p class="muted" style={{ marginTop: 'var(--s2)' }}>Arrives in Phase {phase}.</p>
      </div>
    </main>
  );
}
