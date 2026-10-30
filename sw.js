// 삐약마을 offline cache + 업데이트 + 마을 소식 알림 (1d30fc13)
const CACHE = 'piyak-1d30fc13', NOTI = 'piyak-notify';
const CORE = ['./', './index.html', './three.min.js', './GLTFLoader.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== NOTI).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && (req.mode === 'navigate' || url.pathname.endsWith('/index.html'))) { // 온라인이면 항상 최신 게임, 오프라인이면 보관본
    e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); } return r; }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; }).catch(() => hit)));
});
// 하루 한 번 마을 소식 (게임이 미리 3주치 소식을 적어 둠)
const dk = d => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
async function daily() {
  const c = await caches.open(NOTI), r = await c.match('./__notify.json'); if (!r) return;
  const P = await r.json(); if (!P.on) return;
  const d = new Date(), k = dk(d), h = d.getHours(); if (h < 8 || h >= 21) return;
  for (const f of ['./__notified', './__played']) { const x = await c.match(f); if (x && (await x.text()) === String(k)) return; }
  const it = (P.days || []).find(x => x.k === k); if (!it) return;
  await self.registration.showNotification(it.t, { body: it.b, icon: './icon-192.png', badge: './icon-192.png', tag: 'piyak-daily', data: { url: './' } });
  await c.put('./__notified', new Response(String(k)));
}
self.addEventListener('periodicsync', e => { if (e.tag === 'piyak-daily') e.waitUntil(daily()); });
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => { for (const w of ws) if ('focus' in w) return w.focus(); return clients.openWindow('./'); })); });
