self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Service worker basique
  event.respondWith(
    fetch(event.request).catch(() => {
      // Pour satisfaire le critère d'installabilité hors ligne
      return new Response(
        'Vous êtes hors ligne, mais l\'application est installée.',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    })
  );
});
