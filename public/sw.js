// Service worker de AdmiX: cachea lo estático y guarda la última página visitada
// para que la app abra aunque no haya internet.
const CACHE = "admix-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function guardar(req, res) {
  if (res && res.ok) {
    const copia = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copia));
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server")) return;

  // Páginas: primero la red; si falla, la última copia guardada.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => guardar(req, res))
        .catch(() => caches.match(req).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // Archivos estáticos: primero la copia guardada.
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/__grok/") ||
    url.pathname === "/favicon.svg"
  ) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => guardar(req, res))),
    );
  }
});
