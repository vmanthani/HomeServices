/* PESTNEST service worker — offline app shell + PWA installability.
   Bump CACHE_VERSION whenever cached assets change to force an update. */
const CACHE_VERSION = "pestnest-v1";
const CORE_ASSETS = [
  "index.html",
  "pest-control.html",
  "termite-treatment.html",
  "bed-bug-treatment.html",
  "rodent-control.html",
  "about.html",
  "contact.html",
  "privacy-policy.html",
  "terms-conditions.html",
  "cookie-policy.html",
  "refund-policy.html",
  "disclaimer.html",
  "grievance-redressal.html",
  "css/style.css",
  "js/config.js",
  "js/main.js",
  "manifest.json",
  "fonts/poppins-800.woff2",
  "fonts/inter-var.woff2",
  "images/Logo.jpeg",
  "images/icons/icon-192.png",
  "images/icons/icon-512.png"
];

/* Install — precache the app shell (tolerate individual failures). */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

/* Activate — drop old caches. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch strategy:
   - Navigations (HTML): network-first, fall back to cached page, then index.html.
   - Other same-origin GETs: stale-while-revalidate. */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("index.html"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
