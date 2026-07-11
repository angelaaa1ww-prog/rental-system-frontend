import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre style={{ color: 'black', background: '#f5f5f5', padding: '1rem', overflowX: 'auto' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// One-time, production-safe service worker cache clear.
// On first visit after deployment, this will unregister active SWs, clear caches,
// and reload once so the browser fetches the latest app shell.
try {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const SW_CLEARED_FLAG = 'ghv-sw-cleared-v1';
    const shouldRun = !localStorage.getItem(SW_CLEARED_FLAG);

    if (shouldRun) {
      navigator.serviceWorker.getRegistrations().then(async (regs) => {
        for (const r of regs) {
          try { await r.unregister(); } catch (e) { /* ignore */ }
        }
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        } catch (e) { /* ignore */ }

        try { localStorage.setItem(SW_CLEARED_FLAG, '1'); } catch (e) { /* ignore */ }

        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.set('ghv_reloaded', '1');
          window.location.replace(url.toString());
        }, 350);
      }).catch((err) => {
        console.warn('SW cleanup failed:', err);
        try { localStorage.setItem(SW_CLEARED_FLAG, '1'); } catch (e) { /* ignore */ }
      });
    } else {
      const qp = new URL(window.location.href).searchParams;
      const reloaded = qp.get('ghv_reloaded') === '1';
      try {
        localStorage.removeItem(SW_CLEARED_FLAG);
        if (reloaded) {
          const url = new URL(window.location.href);
          url.searchParams.delete('ghv_reloaded');
          window.history.replaceState(null, '', url.toString());
        }
      } catch (e) {
        console.warn('Failed to finalize SW cleared flow:', e);
      }
    }
  }
} catch (e) {
  console.warn('SW clear helper error:', e);
}

// ✅ Register service worker for PWA (only in production)
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  const qp = new URL(window.location.href).searchParams;
  const reloaded = qp.get('ghv_reloaded') === '1';

  // Skip registration on the immediate reload after clearing to let the browser fetch a fresh shell.
  if (!reloaded) {
    window.addEventListener('load', () => {
      try {
        navigator.serviceWorker
          .register('./sw.js')
          .then((reg) => console.log('Service Worker registered:', reg))
          .catch((err) => console.warn('SW failed to register:', err));
      } catch (err) {
        console.warn('Service worker registration error:', err);
      }
    });
  }
}

reportWebVitals();