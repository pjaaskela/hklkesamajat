const CACHE_NAME = 'hkl-v3';
const PRECACHE = ['/mokki.html', '/manifest.json', '/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && e.request.url.includes(self.location.origin)) {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});

// Page → SW: fire a local notification (used for "mitä uutta" on login)
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(d.title || 'HKL-Kesämajat', {
      body: d.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: d.tag || 'hkl-whats-new',
      renotify: true,
      data: { url: d.url || '/mokki.html' },
    });
  }
});

// Server push (future VAPID support) — payload: {title, body, url}
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'HKL-Kesämajat', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'hkl-push',
      renotify: true,
      data: { url: data.url || '/mokki.html' },
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/mokki.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('mokki.html') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
