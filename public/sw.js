/* AllConverter.tools service worker: makes visited tools work offline and
   receives files shared to the installed app. */
const VERSION = "v2";
const STATIC_CACHE = `allconverter-static-${VERSION}`; // hashed build files, icons, fonts, wasm
const PAGE_CACHE = `allconverter-pages-${VERSION}`;    // HTML and route data
const SHARE_CACHE = "allconverter-shared-files";       // files received through the share sheet
const OFFLINE_URL = "/offline/";
const PRECACHE_URLS = ["/", OFFLINE_URL];

// Never run on a local dev server. Dev chunk URLs are not content-hashed, so
// the cache-first rule below would keep serving old JavaScript after the code
// changes and break Turbopack ("module factory is not available"). On
// localhost this worker wipes its caches, unregisters itself and stays out of
// the way of every request.
const IS_LOCAL = ["localhost", "127.0.0.1", "[::1]"].includes(self.location.hostname);

if (IS_LOCAL) {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.matchAll({ type: "window" }))
        .then((clients) => clients.forEach((client) => client.navigate(client.url)))
        .catch(() => {})
    );
  });
}

self.addEventListener("install", (event) => {
  if (IS_LOCAL) return;
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  if (IS_LOCAL) return;
  const keep = new Set([STATIC_CACHE, PAGE_CACHE, SHARE_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const isStatic = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/vendor/") ||
  /\.(png|jpg|jpeg|svg|webp|ico|woff2?|wasm)$/.test(url.pathname);

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const copy = response.clone();
    caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
  }
  return response;
}

async function networkFirst(request, isNavigation) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
    }
    return response;
  } catch (error) {
    // Route data requests carry a changing ?_rsc= value, so match without the query.
    const cached = (await caches.match(request)) || (await caches.match(request, { ignoreSearch: true }));
    if (cached) return cached;
    if (isNavigation) {
      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;
    }
    throw error;
  }
}

/** Files shared to the installed app: keep them for the /open/ page, then go there. */
async function receiveShare(request) {
  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((f) => f instanceof File);
    const cache = await caches.open(SHARE_CACHE);
    await Promise.all((await cache.keys()).map((key) => cache.delete(key)));
    await Promise.all(
      files.map((file, i) =>
        cache.put(
          `/__shared__/${i}`,
          new Response(file, {
            headers: {
              "Content-Type": file.type || "application/octet-stream",
              "X-File-Name": encodeURIComponent(file.name || `file-${i + 1}`),
            },
          })
        )
      )
    );
  } catch (e) {
    // fall through to the page, which will simply show nothing shared
  }
  return Response.redirect("/open/?shared=1", 303);
}

self.addEventListener("fetch", (event) => {
  if (IS_LOCAL) return;
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.method === "POST" && url.pathname === "/share-target/") {
    event.respondWith(receiveShare(request));
    return;
  }
  if (request.method !== "GET") return;

  if (isStatic(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request, request.mode === "navigate"));
});

// The page tells us which files it loaded so the current tool is ready offline
// even on a first visit, before this worker was in control.
self.addEventListener("message", (event) => {
  if (IS_LOCAL || !event.data || event.data.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls
    .map((u) => { try { return new URL(u, self.location.origin); } catch (e) { return null; } })
    .filter((u) => u && u.origin === self.location.origin);
  event.waitUntil(
    Promise.all(
      urls.map(async (url) => {
        const cache = await caches.open(isStatic(url) ? STATIC_CACHE : PAGE_CACHE);
        if (await cache.match(url.href)) return;
        try {
          const response = await fetch(url.href);
          if (response.ok) await cache.put(url.href, response);
        } catch (e) { /* offline or blocked: skip */ }
      })
    )
  );
});
