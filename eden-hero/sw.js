// 이든 히어로: 한 번 열면 인터넷 없이도 플레이 (이 폴더 안에서만 동작)
var CACHE = 'eden-hero-v2';
var CORE = ['./', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('eden-hero-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (req.mode === 'navigate') { // 온라인이면 항상 최신, 오프라인이면 보관본
    e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (r) {
      if (r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put('./', cp); }); }
      return r;
    })['catch'](function () { return caches.match('./'); }));
    return;
  }
  var mine = url.origin === location.origin && url.pathname.indexOf('/eden-hero/') !== -1;
  var font = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!mine && !font) return;
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (r) {
      if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); }
      return r;
    })['catch'](function () { return hit; });
    return hit || net;
  }));
});
