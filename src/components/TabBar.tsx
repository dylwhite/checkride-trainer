import { IconDrills, IconFly, IconOral, IconProgress, IconToday } from './Icons';

const TABS = [
  { route: 'today', label: 'Today', Icon: IconToday },
  { route: 'fly', label: 'Fly', Icon: IconFly },
  { route: 'oral', label: 'Oral', Icon: IconOral },
  { route: 'drills', label: 'Drills', Icon: IconDrills },
  { route: 'progress', label: 'Progress', Icon: IconProgress }
];
const UNDER_PROGRESS = ['settings', 'guide', 'notes'];

export function TabBar({ route }: { route: string }) {
  const active = UNDER_PROGRESS.includes(route) ? 'progress' : route;
  return (
    <nav class="tabbar" aria-label="Main">
      <ul>
        {TABS.map(({ route: r, label, Icon }) => (
          <li key={r}>
            <a class="tab" href={`#/${r}`} aria-current={active === r ? 'page' : undefined}>
              <Icon />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
