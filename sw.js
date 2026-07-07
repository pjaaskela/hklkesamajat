// HUOM 2026-07-07: Cloudflare cachettaa /sw.js:n reunalla max-age=14400 (4h)
// RIIPPUMATTA origin-päivityksistä tai selaimen omasta välimuistista/yksityistilasta
// — havaittu kun sw.js jäi jumiin v3:een vaikka mokki.html päivittyi normaalisti.
// Siksi mokki.html rekisteröi tämän AINA versioidulla URL:lla (sw.js?v=N) — kun
// CACHE_NAME vaihtuu tässä, muista päivittää SAMA numero mokki.html:n
// `serviceWorker.register('sw.js?v=N')`-riville, muuten Cloudflaren reunavälimuisti
// voi jälleen tarjoilla vanhaa versiota tuntikausia eteenpäin.
//
// v5 (2026-07-07): /mokki.html POISTETTU precachesta. Se sisälsi koko sivun
// inline-JS:n (mm. tiedotteet-bannerin logiikan) — jos verkko hetkeksi pätkii
// navigoinnin aikana, fetch-käsittelijä palautti tämän VANHAN, asennushetkellä
// precacheen jääneen HTML:n `caches.match()`-fallbackilla, mikä sai mokki.html:n
// näyttämään pysyvästi vanhaa koodia riippumatta origin-päivityksistä. Itse
// dokumenttia EI PIDÄ ikinä precachetä — vain aidosti staattiset resurssit
// (manifest, ikoni) ovat turvallisia tässä listassa.
const CACHE_NAME = 'hkl-v5';
const PRECACHE = ['/manifest.json', '/icon-192.png'];

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
  // Älä sekaannu cross-origin API-kutsuihin (esim. api.hklkesamajat.fi) —
  // niitä ei koskaan precachettu, joten hetkellinen verkkokatko sai
  // caches.match():n palauttamaan undefined ja respondWith():n hajoamaan
  // pysyvästi ilman uudelleenyritystä (havaittu 2026-07-07, tiedotteet-banneri
  // ei näkynyt osalle käyttäjistä). Anna selaimen hoitaa nämä normaalisti.
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) {
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

// Server push (VAPID, 2026-07-07) — payload: {title, body, url, tag}
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
