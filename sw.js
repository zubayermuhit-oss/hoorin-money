const CACHE_NAME="hoorin-money-pwa-v3";
const APP_SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith("hoorin-money-pwa-")&&key!==CACHE_NAME).map(key=>caches.delete(key)));await self.clients.claim()})())});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   if(event.request.mode==="navigate"){
     try{const response=await fetch(event.request);if(response.ok)cache.put("./index.html",response.clone());return response}
     catch(e){return (await cache.match("./index.html"))||Response.error()}
   }
   const cached=await cache.match(event.request);
   if(cached)return cached;
   try{const response=await fetch(event.request);if(response.ok)cache.put(event.request,response.clone());return response}
   catch(e){return Response.error()}
 })());
});
