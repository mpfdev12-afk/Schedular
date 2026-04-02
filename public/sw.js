importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded');

  // Skip waiting and claim clients immediately for faster updates
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precaching only static assets that DON'T change between builds frequently
  workbox.precaching.precacheAndRoute([
    { url: '/manifest.webmanifest', revision: '1' },
    { url: '/pwa-192.png', revision: '1' },
    { url: '/pwa-512.png', revision: '1' },
    { url: '/apple-touch-icon.png', revision: '1' }
  ]);

  // Handle navigation requests (index.html) with NetworkFirst
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'navigation-cache',
    })
  );

  // Caching images - CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
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
      cacheName: 'api-cache',
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
      cacheName: 'static-resources',
    })
  );

} else {
  console.error('Workbox failed to load');
}
