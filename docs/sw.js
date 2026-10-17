// Offline mezipaměť hry – verze se mění s obsahem
const C = 'zoubky-8afcf881b3';
const FILES = ['./', "hra/index.html","hra/js/album.js","hra/js/base.js","hra/js/chars.js","hra/js/draw.js","hra/js/level.js","hra/js/map.js","hra/js/prep.js","hra/js/scenes.js","hra/js/web.js","hra/voice/manifest.js","ikony/apple-touch-icon.png","ikony/icon-192.png","ikony/icon-512.png","ikony/ios-1024.png","ikony/maskable-512.png","index.html","manifest.webmanifest","obrazky/ukazka-1.png","obrazky/ukazka-2.png","obrazky/ukazka-3.png","obrazky/ukazka-4.png","obrazky/ukazka-5.png","soukromi.html"];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))); });
