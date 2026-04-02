importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded');

  const VERSION = 'v1.0.2';
  const CACHE_NAMES = {
    api: `api-cache-${VERSION}`,
    images: `images-cache-${VERSION}`,
    static: `static-resources-${VERSION}`,
    navigation: `navigation-cache-${VERSION}`,
  };

  // Skip waiting and claim clients immediately for faster updates
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precaching only static assets that DON'T change between builds frequently
  workbox.precaching.precacheAndRoute([
    { url: '/manifest.webmanifest', revision: VERSION },
    { url: '/pwa-192.png', revision: VERSION },
    { url: '/pwa-512.png', revision: VERSION },
    { url: '/apple-touch-icon.png', revision: VERSION }
  ]);

  // Handle navigation requests (index.html) with NetworkFirst
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.navigation,
    })
  );

  // Caching images - CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.images,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Caching API calls - NetworkFirst
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.api,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        }),
      ],
    })
  );

  // General assets (JS/CSS) - StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'script' || 
      request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAMES.static,
    })
  );

} else {
  console.error('Workbox failed to load');
}
