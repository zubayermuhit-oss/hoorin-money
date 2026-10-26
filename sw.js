/* Hoorin Money service worker
 * Hosted at https://zubayermuhit-oss.github.io/hoorin-money/
 * Update CACHE_VERSION when you make a major asset update.
 */
const CACHE_VERSION = "hoorin-money-v1";
const APP_PREFIX = self.registration.scope;
const CORE_URLS = [
  APP_PREFIX,
  APP_PREFIX + "index.html",
  APP_PREFIX + "manifest.webmanifest",
  APP_PREFIX + "icons/icon-192.png",
  APP_PREFIX + "icons/icon-512.png",
  APP_PREFIX + "icons/icon-512-maskable.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // Cache only same-origin app files; installation should not fail if index.html
    // redirects or an optional icon is missing.
    await Promise.all(CORE_URLS.map(async url => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok && new URL(response.url).origin === self.location.origin) {
          await cache.put(url, response);
        }
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("hoorin-money-") && key !== CACHE_VERSION)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Never cache Google OAuth, Google Drive API, or any cross-origin request.
  if (url.origin !== self.location.origin) return;
  if (request.method !== "GET") return;
  if (url.pathname.includes("/.well-known/")) return;

  // For page navigation, try network first to get app updates; use cached app offline.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          cache.put(request, response.clone()).catch(() => {});
          return response;
        }
      } catch (_) {}
      return (await cache.match(request)) ||
             (await cache.match(APP_PREFIX + "index.html")) ||
             new Response("Hoorin Money is offline. Open the app again when connected once.", {
               status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
             });
    })());
    return;
  }

  // For same-origin assets, use cache first and refresh the cache in the background.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    const networkPromise = fetch(request).then(response => {
      if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
      return response;
    }).catch(() => null);
    return cached || await networkPromise || new Response("", { status: 504 });
  })());
});
