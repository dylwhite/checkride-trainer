export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || 'dark';
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', t === 'dark' ? '#0B1220' : '#F3F6FB');
  try {
    localStorage.setItem('theme', t);
  } catch {
    /* ignore */
  }
}
