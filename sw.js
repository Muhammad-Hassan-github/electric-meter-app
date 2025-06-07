const CACHE_NAME = "meter-app-v12";
const basePath = self.location.pathname.replace(/\/sw\.js$/, '/');
const urlsToCache = [
  `${basePath}`,              // base path, e.g. '/' or '/Rizwan Foods Corner/'
  `${basePath}index.html`,
  `${basePath}app.js`,
  `${basePath}manifest.json`,
  `${basePath}icon-192.png`,
  `${basePath}icon-512.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).catch((err) => {
      console.error("Cache addAll failed:", err);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
