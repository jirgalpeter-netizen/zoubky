#!/usr/bin/env bash
# Sestaví webovou verzi (PWA) pro GitHub Pages do $1 (výchozí /root/repos/zoubky/docs).
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-/root/repos/zoubky/docs}; PY=${PY:-/opt/zoubky-venv/bin/python}
rm -rf "$OUT" && mkdir -p "$OUT"
cp -r assets "$OUT/hra"
cp web/index.html web/soukromi.html "$OUT/"
"$PY" -I media.py build/media >/dev/null
cp -r build/media/ikony build/media/obrazky "$OUT/"
URL=https://jirgalpeter-netizen.github.io/zoubky/
"$PY" -I -c "import qrcode,qrcode.image.svg,sys; qrcode.make('$URL', image_factory=qrcode.image.svg.SvgPathFillImage, box_size=10, border=2).save(sys.argv[1])" "$OUT/qr.svg"
cat > "$OUT/manifest.webmanifest" <<JSON
{ "name": "Zoubky – čištění zubů", "short_name": "Zoubky", "lang": "cs", "start_url": "./hra/", "scope": "./",
  "display": "fullscreen", "orientation": "landscape", "background_color": "#7fd3ff", "theme_color": "#3fa9f5",
  "description": "Naučná hra pro děti od 3 let o čištění zubů.",
  "icons": [ { "src": "ikony/icon-192.png", "sizes": "192x192", "type": "image/png" },
             { "src": "ikony/icon-512.png", "sizes": "512x512", "type": "image/png" },
             { "src": "ikony/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" } ] }
JSON
VER=$(cd "$OUT" && find . -type f ! -name sw.js | sort | xargs sha1sum | sha1sum | cut -c1-10)
FILES=$(cd "$OUT" && find . -type f ! -name sw.js ! -name qr.svg | sort | sed 's|^\./||' | sed 's/.*/"&"/' | paste -sd, -)
cat > "$OUT/sw.js" <<JS
// Offline mezipaměť hry – verze se mění s obsahem
const C = 'zoubky-$VER';
const FILES = ['./', $FILES];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))); });
JS
touch "$OUT/.nojekyll"
echo "web hotov: $OUT ($(find "$OUT" -type f | wc -l) souborů, verze $VER)"
