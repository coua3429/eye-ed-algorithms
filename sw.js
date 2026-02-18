// Eye Emergency DST Service Worker - Version 2.0

const CACHE_NAME = 'eye-emergency-v2'; // Updated version number
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/data/red-eye.json',
  '/data/flashes-floaters.json',
  '/data/double-vision.json',
  '/data/ocular-trauma.json',
  '/data/sudden-visual-loss.json',
  '/data/disc-swelling.json',
  '/data/painful-eyeball.json',
  '/data/corneal-ulcers.json',
  '/data/cellulitis.json'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker v2.0 installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v2.0');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker v2.0 activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the new service worker takes control immediately
  return self.clients.claim();
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});