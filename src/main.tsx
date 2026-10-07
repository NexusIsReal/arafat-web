import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './components/ui';
import './index.css';

// Enforce Josephite Learning branding (overrides any platform-injected icon/title)
document.querySelectorAll('link[rel="icon"]').forEach((el) => el.remove());
const fav = document.createElement('link');
fav.rel = 'icon';
fav.type = 'image/png';
fav.href = '/logo.png';
document.head.appendChild(fav);
document.title = 'Josephite Learning — St. Josephite School & College, Banpara, Natore';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
