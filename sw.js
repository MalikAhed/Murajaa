// Tawjihi in a Flash — Service Worker v5
// Strategy:
//   - content.json & index.html  → network-first (fresh on every load, cache fallback)
//   - icons / manifest / fonts   → cache-first
//   - everything else            → stale-while-revalidate
// Plus: skipWaiting on message + update banner support.

const VERSION = 'v5';
const STATIC_CACHE  = `fc-static-${VERSION}`;
const RUNTIME_CACHE = `fc-runtime-${VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon192.png',
  './icon512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(c => c.addAll(STATIC_ASSETS).catch(() => {}))
  );
  // Don't auto-skip — let the app prompt the user via the update banner.
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING' || (e.data && e.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

function isHTML(req) {
  return req.mode === 'navigate' ||
         (req.headers.get('accept') || '').includes('text/html');
}

function isContentJson(url) {
  return url.pathname.endsWith('/content.json') || url.pathname.endsWith('content.json');
}

function isStatic(url) {
  return /\.(png|jpg|jpeg|svg|webp|ico|webmanifest|woff2?|ttf)$/i.test(url.pathname);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache the SW file or GitHub API write requests
  if (url.pathname.endsWith('/sw.js')) return;
  if (url.host === 'api.github.com') return;

  // Network-first for HTML and content.json (so updates arrive immediately)
  if (isHTML(req) || isContentJson(url)) {
    e.respondWith(networkFirst(req));
    return;
  }

  // Cache-first for static assets
  if (isStatic(url)) {
    e.respondWith(cacheFirst(req));
    return;
  }

  // Default: stale-while-revalidate
  e.respondWith(staleWhileRevalidate(req));
});

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(req, { cache: 'no-store' });
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(req) || await caches.match(req);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const resp = await fetch(req);
    if (resp && resp.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(req, resp.clone());
    }
    return resp;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const network = fetch(req).then(resp => {
    if (resp && resp.ok) cache.put(req, resp.clone());
    return resp;
  }).catch(() => null);
  return cached || network || new Response('Offline', { status: 503 });
}

// ─── Push notifications (unchanged) ──────────────────────────────────
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'FlashCards', body: 'Time to review your cards!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon192.png',
      badge: './icon192.png',
      tag: 'daily-reminder',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
