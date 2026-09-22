// Nome do cache — mude essa versão (v1 -> v2, v3...) sempre que quiser forçar
// os usuários a baixarem uma versão nova do app na próxima visita.
const CACHE_NAME = 'curriculo-ats-v1';

// "App shell": tudo que é necessário pro app funcionar sozinho, offline.
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/libs/html2canvas.min.js',
  '/libs/jspdf.umd.min.js',
  '/libs/docx.min.js',
  '/styles/tailwind.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png'
];

// INSTALAÇÃO: baixa e guarda todo o app shell no cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ATIVAÇÃO: apaga caches de versões antigas do app.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// REQUISIÇÕES: "cache primeiro, rede como reforço" — abre instantâneo mesmo
// offline, e atualiza o cache em segundo plano quando há internet.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Não intercepta chamadas a outros domínios (ex: nenhuma neste app, mas
  // é uma proteção padrão caso isso mude no futuro).
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // sem internet: usa o que já está em cache

      // Responde com o cache imediatamente (se existir); a rede atualiza por trás.
      return cached || networkFetch;
    })
  );
});
