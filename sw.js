const CACHE='trackcls-v1';
self.addEventListener('install', e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html']).catch(()=>{}))); });
self.addEventListener('activate', e=>{ e.waitUntil((async()=>{ const ks=await caches.keys(); await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))); await self.clients.claim(); })()); });
self.addEventListener('fetch', e=>{
  const req=e.request; if(req.method!=='GET') return; const url=new URL(req.url);
  if(req.mode==='navigate'){ e.respondWith((async()=>{ try{ const net=await fetch(req); const c=await caches.open(CACHE); c.put('./index.html', net.clone()); return net; }catch(_){ return (await caches.match('./index.html'))||(await caches.match('./'))||Response.error(); } })()); return; }
  if(url.origin===self.location.origin){ e.respondWith((async()=>{ const cached=await caches.match(req); if(cached) return cached; try{ const net=await fetch(req); const c=await caches.open(CACHE); c.put(req, net.clone()); return net; }catch(_){ return cached||Response.error(); } })()); }
});
