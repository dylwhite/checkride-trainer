import { TabBar } from './components/TabBar';
import { IconBook, IconChecklist, IconDrills, IconFly, IconOral } from './components/Icons';
import { useRoute } from './lib/router';
import { Placeholder } from './screens/Placeholder';
import { Progress } from './screens/Progress';
import { Question } from './screens/Question';
import { Settings } from './screens/Settings';
import { Today } from './screens/Today';

export function App() {
  const route = useRoute();
  const fullScreen = route === 'question';
  let screen;
  switch (route) {
    case 'question': screen = <Question key={Date.now()} />; break;
    case 'fly': screen = <Placeholder title="Fly" Icon={IconFly} color="var(--accent)" phase={3} blurb="Branching cross-countries from KHIO, starting with a PAVE go/no-go briefing." />; break;
    case 'oral': screen = <Placeholder title="Oral" Icon={IconOral} color="var(--pave-a)" phase={3} blurb="A mock DPE oral that chains “why?” and “what if?” follow-ups." />; break;
    case 'drills': screen = <Placeholder title="Drills" Icon={IconDrills} color="var(--partial)" phase={3} blurb="5-minute rapid-fire sessions by category or your weakest areas." />; break;
    case 'progress': screen = <Progress />; break;
    case 'settings': screen = <Settings />; break;
    case 'guide': screen = <Placeholder title="Study Guide" Icon={IconBook} color="var(--pave-v)" phase={4} blurb="Your corrected, completed PAVE outline, linked to questions." />; break;
    case 'notes': screen = <Placeholder title="Notes Check" Icon={IconChecklist} color="var(--pave-e)" phase={2} blurb="Everything in your outline that’s wrong, outdated or incomplete, with sources." />; break;
    default: screen = <Today />;
  }
  return (
    <div class="app">
      {screen}
      {!fullScreen && <TabBar route={route} />}
    </div>
  );
}
