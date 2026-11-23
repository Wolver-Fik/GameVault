/* GameVault service worker: Network-First for HTML, Cache-First for assets. */
/* v1.2.6: selector de plataforma nativo en el editor, desplegable en móvil. */
var CACHE = 'gamevault-v1.2.6';
var ROOT = new URL('./', self.registration.scope).href;
var PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/i18n.js',
  './js/storage.js',
  './js/app.js',
  './js/i18n/en.js',
  './js/i18n/es.js',
  './js/i18n/pt.js',
  './js/i18n/fr.js',
  './js/i18n/it.js',
  './js/i18n/de.js',
  './js/i18n/ru.js',
  './js/i18n/ja.js',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
].map(function (path) { return new URL(path, ROOT).href; });

function putInCache(request, response) {
  if (!response || !response.ok) return;
  var copy = response.clone();
  caches.open(CACHE).then(function (cache) {
    return cache.put(request, copy);
  }).catch(function () {});
}

function networkFirst(request) {
  return fetch(request).then(function (response) {
    putInCache(request, response);
    return response;
  }).catch(function () {
    return caches.match(request, { ignoreSearch: true }).then(function (hit) {
      return hit || caches.match(new URL('./index.html', ROOT).href);
    });
  });
}

function cacheFirst(request) {
  return caches.match(request, { ignoreSearch: true }).then(function (hit) {
    if (hit) {
      fetch(request).then(function (response) { putInCache(request, response); }).catch(function () {});
      return hit;
    }
    return fetch(request).then(function (response) {
      putInCache(request, response);
      return response;
    });
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          return key !== CACHE ? caches.delete(key) : Promise.resolve(false);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url;
  try { url = new URL(request.url); } catch (e) { return; }

  /* Wikipedia/Wikimedia/Wikidata (API, entidades y caratulas) van directo a la red. */
  if (/(^|\.)(wikipedia\.org|wikimedia\.org|wikidata\.org)$/i.test(url.hostname)) return;

  if (url.origin !== self.location.origin) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  var isHtml = request.mode === 'navigate' ||
    request.destination === 'document' ||
    (request.destination === '' && (url.pathname === '/' || /\.html?$/.test(url.pathname)));

  if (isHtml) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});
