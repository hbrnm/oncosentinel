import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { VaultGate } from './components/VaultGate';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VaultGate>
      <App />
    </VaultGate>
  </React.StrictMode>
);

// Register PWA service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

