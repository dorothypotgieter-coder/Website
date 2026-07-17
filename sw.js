
const VERSION='evan-batumi-v1';
const SHELL=[
  './','./index.html','./results.html','./game-highlights.html','./videos.html','./offline.html',
  './pwa.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;
  if(req.destination==='video' || req.headers.has('range')) return;
  if(req.mode==='navigate') {
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy));return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('./offline.html'))));
    return;
  }
  if(req.destination==='image') {
    event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy));}return res;})));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>{
    const update=fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy));}return res;}).catch(()=>hit);
    return hit||update;
  }));
});
