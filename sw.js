const CACHE='vietnam2027-v2';
const ASSETS=['/','/Vietnam_2027_Mobile_Itinerary.html','/vietnam-illustrated-map.png','/app-icon.png','/manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('vietnam2027-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(url.origin!==location.origin||event.request.method!=='GET')return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('/',copy));}
   return response;
  }).catch(()=>caches.match('/')));
 }else event.respondWith(caches.match(event.request).then(cached=>{
  if(cached)return cached;
  return fetch(event.request).then(response=>{
   if(response.ok&&url.pathname.startsWith('/assets/')){
    const copy=response.clone();
    event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));
   }
   return response;
  });
 }));
});
self.addEventListener('message',event=>{
 if(event.data?.type==='CACHE_STATUS')event.waitUntil(caches.open(CACHE).then(cache=>cache.match('/')).then(hit=>{if(hit)event.source.postMessage({type:'CACHE_READY'});}));
});
