const CACHE_NAME = 'portfolio-cache-v1.3';
const ASSETS_TO_CACHE = [
  '/',
  '/static/css/style.css?v=1.3.6',
  '/static/js/main.js?v=1.3.6',
  '/static/Resume/Shlok_Bam_VIT.pdf',
  '/static/images/about/profile.png',
  '/static/favicon.ico',
  '/static/favicon-32x32.png',
  '/static/favicon-16x16.png',
  '/static/apple-touch-icon.png',
  '/manifest.json'
];

// Install Event - Caching basic layout & files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate caching model
self.addEventListener('fetch', (event) => {
  // Ignore external analytics/chat APIs and non-GET requests
  if (event.request.method !== 'GET' || 
      event.request.url.includes('/api/') || 
      event.request.url.includes('google-analytics') || 
      event.request.url.includes('groq.com') ||
      event.request.url.includes('web3forms.com')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with the new response
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback
            console.log('[Service Worker] Resource fetch failed; serving from cache fallback.');
            return cachedResponse;
          });

        // Return cached response instantly if exists, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
