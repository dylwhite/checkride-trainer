import { TabBar } from './components/TabBar';
import { IconDrills, IconFly, IconOral } from './components/Icons';
import { useRoute } from './lib/router';
import { Placeholder } from './screens/Placeholder';
import { Progress } from './screens/Progress';
import { NotesCheck, StudyGuide } from './screens/Notes';
import { Session } from './screens/Session';
import { Settings } from './screens/Settings';
import { Today } from './screens/Today';

export function App() {
  const route = useRoute();
  const fullScreen = route === 'question';
  let screen;
  switch (route) {
    case 'question': screen = <Session />; break;
    case 'fly': screen = <Placeholder title="Fly" Icon={IconFly} color="var(--accent)" phase={3} blurb="Branching cross-countries from KHIO, starting with a PAVE go/no-go briefing." />; break;
    case 'oral': screen = <Placeholder title="Oral" Icon={IconOral} color="var(--pave-a)" phase={3} blurb="A mock DPE oral that chains “why?” and “what if?” follow-ups." />; break;
    case 'drills': screen = <Placeholder title="Drills" Icon={IconDrills} color="var(--partial)" phase={3} blurb="5-minute rapid-fire sessions by category or your weakest areas." />; break;
    case 'progress': screen = <Progress />; break;
    case 'settings': screen = <Settings />; break;
    case 'guide': screen = <StudyGuide />; break;
    case 'notes': screen = <NotesCheck />; break;
    default: screen = <Today />;
  }
  return (
    <div class="app">
      {screen}
      {!fullScreen && <TabBar route={route} />}
    </div>
  );
}
