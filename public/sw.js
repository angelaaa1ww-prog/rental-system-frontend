const CACHE_NAME = 'ghv-rental-v2';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

// =============================================
// INSTALL — cache essential files
// =============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// =============================================
// ACTIVATE — clean old caches
// =============================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// =============================================
// FETCH — serve from cache or network
// =============================================
self.addEventListener('fetch', event => {
  // Skip non-GET and API requests — always fetch live
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/index.html');
    })
  );
});

// =============================================
// PUSH NOTIFICATIONS
// Triggered when backend sends a push
// =============================================
self.addEventListener('push', event => {
  let data = { title: 'Gifted Hands Ventures', body: 'You have a new notification' };

  try {
    data = event.data.json();
  } catch (_) {
    data.body = event.data?.text() || data.body;
  }

  const options = {
    body:    data.body,
    icon:    '/logo192.png',
    badge:   '/logo192.png',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
    actions: [
      { action: 'open',    title: '📲 Open App' },
      { action: 'dismiss', title: '✕ Dismiss'   },
    ],
    requireInteraction: data.urgent || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Gifted Hands Ventures', options)
  );
});

// =============================================
// NOTIFICATION CLICK — open app
// =============================================
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});