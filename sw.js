var cacheName = 'CSv2';

var cachedFiles = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './sw.js',

  './android-chrome-96x96.png',
  './apple-touch-icon-60x60.png',
  './apple-touch-icon-76x76.png',
  './pizza96.png',
  './browserconfig.xml',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon.ico',
  './mstile-150x150.png',
  './safari-pinned-tab.svg',
  './manifest.json',
  './apple-touch-icon.png',

  './image/flatBreadPizza.jpg',
  './image/bigHeroPizza2.jpg',
  './image/thinCrustPizza.jpg',
  './image/cheeseCrust.jpg',
  './image/jalapeno.jpg',
  './image/cheese.jpg',
  './image/olive.jpg',
];

self.addEventListener('install', function (evt) {
  console.log('Service Worker Install Event'); //Add the files to the cache
  evt.waitUntil(
    caches
      .open(cacheName)
      .then(function (cache) {
        console.log('Caching files');
        return cache.addAll(cachedFiles);
      })
      .then(function () {
        return self.skipWaiting();
      })
      .catch(function (err) {
        console.log('Cache Failed', err);
      })
  );
});

self.addEventListener('activate', function (evt) {
  console.log('Service Worker Activated');
  evt.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== cacheName) {
            console.log('Removing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  console.log('Fetch Event ' + evt.request.url);
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    })
  );
});
//page 319

self.addEventListener('push', function (evt) {
  console.log('Push Event Received');
  var options = {
    body: "See What's New!",
    icon: './android-chrome-96x96.png',
    data: {
      timestamp: Date.now(),
      loc: 'insex.html#info',
    },

    actions: [{ action: 'go', title: 'Go Now' }],
  };
  evt.waitUntil(
    self.registration.showNotification('NCC Computer Science', options)
  );
});


