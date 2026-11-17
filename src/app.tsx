import { TabBar } from './components/TabBar';
import { useRoute } from './lib/router';
import { Progress } from './screens/Progress';
import { Review } from './screens/Review';
import { Checkride } from './screens/Checkride';
import { Drills } from './screens/Drills';
import { Fly } from './screens/Fly';
import { NotesCheck, StudyGuide } from './screens/Notes';
import { Oral } from './screens/Oral';
import { Session } from './screens/Session';
import { Settings } from './screens/Settings';
import { Today } from './screens/Today';

export function App() {
  const route = useRoute();
  const fullScreen = route === 'question' || route === 'checkride';
  let screen;
  switch (route) {
    case 'question': screen = <Session />; break;
    case 'fly': screen = <Fly />; break;
    case 'oral': screen = <Oral />; break;
    case 'checkride': screen = <Checkride />; break;
    case 'drills': screen = <Drills />; break;
    case 'progress': screen = <Progress />; break;
    case 'settings': screen = <Settings />; break;
    case 'guide': screen = <StudyGuide />; break;
    case 'notes': screen = <NotesCheck />; break;
    case 'review': screen = <Review />; break;
    default: screen = <Today />;
  }
  return (
    <div class="app">
      {screen}
      {!fullScreen && <TabBar route={route} />}
    </div>
  );
}
