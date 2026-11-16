import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app';
import { requestPersistence } from './lib/storage';
import './styles/tokens.css';
import './styles/app.css';

render(<App />, document.getElementById('app')!);

// Offline support: caches the whole app on first visit, updates automatically.
registerSW({ immediate: true });
requestPersistence();
