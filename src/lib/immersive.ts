import { useEffect } from 'preact/hooks';

// Hides the tab bar while a focused session (oral, flight) is on screen.
export function useImmersive() {
  useEffect(() => {
    document.body.classList.add('immersive');
    return () => document.body.classList.remove('immersive');
  }, []);
}
