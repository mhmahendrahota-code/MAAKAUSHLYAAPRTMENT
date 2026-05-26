const CACHE_NAME = 'makaushlya-app-v5';

// Only pre-cache truly static assets — NOT index.html (must always be fresh)
const STATIC_ASSETS = [
  '/logo.jpg',
  '/manifest.json'
];

// Install: pre-cache only static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete ALL old caches to force fresh load after every deployment
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: NETWORK-FIRST strategy to prevent stale blank pages
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 1. Bypass: API calls and non-GET methods — always real-time
  if (url.pathname.startsWith('/api') || e.request.method !== 'GET') {
    return;
  }

  // 2. Navigation requests (SPA index.html) — ALWAYS network-first
  //    This prevents blank pages when a new JS bundle is deployed
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Vite hashed JS/CSS assets (/assets/*.js, /assets/*.css)
  //    Cache-first: safe because Vite content-hashes the filenames on each build
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // 4. Everything else: network-first, cache as fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
