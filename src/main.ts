import './app.css';
import App from './App.svelte';
import { initResolveConnection } from './lib/api/resolve';

initResolveConnection();

// Initialize the Svelte app
const app = new App({
  target: document.getElementById('app')
});

export default app;

// Keep the connection to DaVinci Resolve alive
setInterval(() => {
  // Send ping to main process to keep the app alive
  if (window.valuvaAPI) {
    window.valuvaAPI.keepAlive();
  }
}, 1000); 