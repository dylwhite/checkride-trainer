// Tiny hash router: #/today, #/fly, #/question … (hash URLs work on GitHub Pages
// and when launched from the home screen with no network).
import { useEffect, useState } from 'preact/hooks';

export function currentRoute(): string {
  const h = location.hash.replace(/^#\/?/, '');
  return h.split('?')[0] || 'today';
}

export function useRoute(): string {
  const [route, setRoute] = useState(currentRoute());
  useEffect(() => {
    const on = () => {
      setRoute(currentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(route: string) {
  location.hash = '#/' + route;
}
