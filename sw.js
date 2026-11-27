/* GameVault service worker: Network-First for HTML, Cache-First for assets. */
/* v1.5.4: fallback de navegación offline robusto para subruta/GitHub Pages y versión de caché sincronizada. */
var CACHE = 'gamevault-v1.5.4';
var ROOT = new URL('./', self.registration.scope).href;
var INDEX = new URL('./index.html', ROOT).href;
var PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/i18n.js',
  './js/storage.js',
  './js/scraper.js',
  './js/ios-install.js',
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

/* Devuelve una promesa: el evento que la origina decide cuándo termina mediante
   event.waitUntil(), de modo que ninguna escritura quede fuera de su ciclo de vida. */
function putInCache(request, response) {
  if (!response || !response.ok) return Promise.resolve(false);
  var copy = response.clone();
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, copy);
  }).then(function () { return true; }).catch(function () { return false; });
}

function networkFirst(request, event) {
  var done = fetch(request).then(function (response) {
    return putInCache(request, response).then(function () { return response; });
  }).catch(function () {
    return caches.match(request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return caches.match(INDEX, { ignoreSearch: true }).then(function (indexHit) {
        return indexHit || caches.match(ROOT, { ignoreSearch: true });
      });
    });
  });
  event.waitUntil(done);
  return done;
}

function cacheFirst(request, event) {
  var lookup = caches.match(request, { ignoreSearch: true });
  var response = lookup.then(function (hit) {
    if (hit) return hit;
    return fetch(request).then(function (res) {
      return putInCache(request, res).then(function () { return res; });
    });
  });
  /* Con acierto en caché se responde al instante, pero la revalidación también
     se registra en el evento: si el SW se cierra, la escritura no se pierde. */
  var revalidate = lookup.then(function (hit) {
    if (!hit) return false;
    return fetch(request).then(function (res) {
      return putInCache(request, res);
    }).catch(function () { return false; });
  });
  event.waitUntil(response);
  event.waitUntil(revalidate);
  return response;
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
          return key.indexOf('gamevault-') === 0 && key !== CACHE ? caches.delete(key) : Promise.resolve(false);
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
    event.respondWith(networkFirst(request, event));
  } else {
    event.respondWith(cacheFirst(request, event));
  }
});
