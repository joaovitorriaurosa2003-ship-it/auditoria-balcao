// Service worker do app Auditoria Balcão.
// Necessário para o Chrome oferecer "Instalar app".
// Estratégia: network-first só para arquivos do próprio site (mesma origem).
// Requisições do Firebase, Google Fonts e CDNs passam direto, sem cache,
// para não interferir na conexão em tempo real do Firestore.
const CACHE_NAME = "auditoria-balcao-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/logo-pao-delicia.png",
  "./assets/logo-kaluf-gomes.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase, fontes, CDN: deixa o navegador cuidar

  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || (req.mode === "navigate" ? caches.match("./index.html") : undefined))
      )
  );
});
