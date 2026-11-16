import { TabBar } from './components/TabBar';
import { useRoute } from './lib/router';
import { Progress } from './screens/Progress';
import { Drills } from './screens/Drills';
import { Fly } from './screens/Fly';
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
    case 'fly': screen = <Fly />; break;
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
