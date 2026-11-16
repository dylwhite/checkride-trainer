import { TabBar } from './components/TabBar';
import { IconFly } from './components/Icons';
import { useRoute } from './lib/router';
import { Placeholder } from './screens/Placeholder';
import { Progress } from './screens/Progress';
import { Drills } from './screens/Drills';
import { NotesCheck, StudyGuide } from './screens/Notes';
import { Oral } from './screens/Oral';
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
    case 'oral': screen = <Oral />; break;
    case 'drills': screen = <Drills />; break;
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
