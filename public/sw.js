const CACHE='whdc-public-shell-v7-auto-refresh';
const SHELL=['/','/index.html','/devotionals/app.js','/shared/auto-update.js','/shared/styles.css','/content.json','/manifest.webmanifest','/images/header-logo.png','/images/icons/favicon.png','/images/icons/icon-192.png','/images/icons/icon-512.png','/images/icons/apple-touch-icon.png','/images/misty-mountain-divider.jpg','/images/todays-pick-banner.png','/bible-reader.html','/bible/reader.js','/bible/reader.css','/bible/manifest.json','/bible/paragraphs.json'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.all(SHELL.map(async path=>{try{const response=await fetch(path,{cache:'reload'});if(response.ok)await cache.put(path,response)}catch{}}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const name of await caches.keys())if(name.startsWith('whdc-public-shell-')&&name!==CACHE)await caches.delete(name);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/admin')||url.pathname.startsWith('/editor')||url.pathname.startsWith('/writer')||url.pathname.startsWith('/cdn-cgi/'))return;
 if(req.mode==='navigate'&&(url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/bible-reader.html')){
  event.respondWith((async()=>{try{return await fetch(req)}catch{return await caches.match(url.pathname==='/bible-reader.html'?'/bible-reader.html':'/index.html')||Response.error()}})());return;
 }
 if(SHELL.includes(url.pathname)){
  event.respondWith((async()=>{
   try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);await cache.put(url.pathname,response.clone())}return response}
   catch{return await caches.match(url.pathname)||Response.error()}
  })());
 }
});

self.addEventListener('push',event=>{
 event.waitUntil((async()=>{
  let data={};try{data=event.data?.json()||{}}catch{}
  const url=new URL(typeof data.url==='string'?data.url:'/',self.location.origin);
  if(url.origin!==self.location.origin)return;
  await self.registration.showNotification(typeof data.title==='string'?data.title.slice(0,100):"When Healing Doesn't Come",{body:typeof data.body==='string'?data.body.slice(0,220):'A new update is available.',icon:'/images/icons/icon-192.png',badge:'/images/icons/icon-192.png',tag:typeof data.tag==='string'?data.tag.slice(0,100):'whdc-notice',data:{url:url.href}});
 })());
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const url=new URL(event.notification.data?.url||'/',self.location.origin);
  if(url.origin!==self.location.origin)return;
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients)if(new URL(client.url).origin===url.origin){await client.navigate(url.href);return client.focus()}
  return self.clients.openWindow(url.href);
 })());
});
