const CACHE_NAME = 'boredom-buster-v9'; // Bump version number
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './activities.json',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});