const CACHE_NAME = 'makaushlya-app-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/logo.jpg',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Request Interception
self.addEventListener('fetch', (e) => {
  // Never intercept API endpoints or non-GET methods to ensure real-time data sync
  if (e.request.url.includes('/api') || e.request.method !== 'GET') {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }).catch(() => {
      // Fallback in case of absolute offline network failure for navigation/page requests
      if (e.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});
