const CACHE='whdc-public-shell-v14-reliable-offline';
const SHELL=['/','/index.html','/devotionals/app.js','/shared/auto-update.js','/shared/shared-nav.js','/audio/audio-player.js','/shared/styles.css','/content.json','/manifest.webmanifest','/images/header-logo.png','/images/icons/favicon.png','/images/icons/icon-192.png','/images/icons/icon-512.png','/images/icons/apple-touch-icon.png','/images/misty-mountain-divider.jpg','/images/todays-pick-banner.png','/bible-reader.html','/bible/reader.js','/bible/scripture-study.js','/bible/study-notes.js','/bible/reader.css','/bible/manifest.json','/bible/paragraphs.json'];
const CORE=['/index.html','/devotionals/app.js','/shared/shared-nav.js','/shared/styles.css','/content.json','/bible-reader.html','/bible/reader.js','/bible/reader.css'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Do not activate a new worker with a partially downloaded core application.
 await Promise.all(CORE.map(async path=>{const response=await fetch(path,{cache:'reload'});if(!response.ok)throw Error('Offline shell unavailable: '+path);await cache.put(path,response)}));
 await Promise.all(SHELL.filter(path=>!CORE.includes(path)).map(async path=>{try{const response=await fetch(path,{cache:'reload'});if(response.ok)await cache.put(path,response)}catch{}}));
 // Public content is optional: do not fail the installation if the API is unavailable.
 await Promise.all(['/api/devotionals','/api/reading-plans'].map(async path=>{
  try{const response=await fetch(path,{cache:'no-store'});if(response.ok&&response.type==='basic'&&!response.headers.has('set-cookie'))await cache.put(path,response)}catch{}
 }));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const name of await caches.keys())if(name.startsWith('whdc-public-shell-')&&name!==CACHE)await caches.delete(name);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 const path=url.pathname;
 // Never store authenticated, private, or account-specific responses.
 if(path.startsWith('/admin')||path.startsWith('/editor')||path.startsWith('/writer')||path.startsWith('/cdn-cgi/'))return;
 if(path.startsWith('/api/')){
  // Only cache published, public read-only resources. Other APIs stay network-only.
  if(!['/api/devotionals','/api/reading-plans','/api/scripture'].includes(path))return;
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   try{const response=await fetch(req);
    if(response.ok&&response.type==='basic'&&!response.headers.has('set-cookie'))await cache.put(req,response.clone());
    return response;
   }catch{return await cache.match(req)||Response.error()}
  })());return;
 }
 if(req.mode==='navigate'){
  // All public app views share index.html; Bible Reader has its own document.
  const page=path==='/bible-reader.html'?'/bible-reader.html':'/index.html';
  event.respondWith((async()=>{
   const cached=await caches.match(page);
   try{const response=await fetch(req);
    if(response.ok){if(path==='/'||path==='/index.html'||path==='/bible-reader.html'){
     const cache=await caches.open(CACHE);await cache.put(page,response.clone());
    }return response}
    return cached||response;
   }catch{return cached||Response.error()}
  })());return;
 }
 if(SHELL.includes(path)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cache.match(path);
   // Keep the application runnable even if a network request hangs or fails.
   if(cached){event.waitUntil(fetch(req).then(r=>{if(r.ok&&r.type==='basic')return cache.put(path,r)}).catch(()=>{}));return cached}
   try{const response=await fetch(req);if(response.ok)await cache.put(path,response.clone());return response}
   catch{return Response.error()}
  })());return;
 }
 if(!/\.(?:js|css|png|jpg|jpeg|webp|svg|woff2?|json|ico)$/i.test(path))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  if(cached)return cached;
  try{const response=await fetch(req);if(response.ok&&response.type==='basic')await cache.put(req,response.clone());return response}
  catch{return Response.error()}
 })());
});

const BADGE_DB='whdc-badges-v1';
function badgeStore(mode='readonly'){
 return new Promise((resolve,reject)=>{const req=indexedDB.open(BADGE_DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('state');req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result;const tx=db.transaction('state',mode);resolve({db,tx,store:tx.objectStore('state')})}});
}
async function badgeRead(key,fallback){const {db,store}=await badgeStore();return new Promise(resolve=>{const req=store.get(key);req.onsuccess=()=>{db.close();resolve(req.result??fallback)};req.onerror=()=>{db.close();resolve(fallback)}})}
async function badgeWrite(key,value){const {db,tx,store}=await badgeStore('readwrite');return new Promise(resolve=>{store.put(value,key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();resolve()}})}
async function badgeUpdate(type,clear=false){
 const prefs=await badgeRead('prefs',{announcement:true,daily:true,plan:true});
 const counts=await badgeRead('counts',{announcement:0,daily:0,plan:0});
 if(!['announcement','daily','plan'].includes(type))return;
 counts[type]=clear?0:Math.min(99,(counts[type]||0)+1);
 await badgeWrite('counts',counts);
 const total=['announcement','daily','plan'].reduce((n,k)=>n+(prefs[k]===false?0:counts[k]||0),0);
 if('setAppBadge' in self.navigator){if(total)await self.navigator.setAppBadge(Math.min(total,99));else await self.navigator.clearAppBadge();}
}
self.addEventListener('message',event=>{
 const msg=event.data||{};
 if(msg.type==='WHDC_ALERT_STATUS')event.waitUntil((async()=>{
  const counts=await badgeRead('counts',{announcement:0,daily:0,plan:0});
  const prefs=await badgeRead('prefs',{announcement:true,daily:true,plan:true});
  // A notification may have arrived before the latest service worker activated.
  // Recover still-visible push notifications rather than displaying an empty inbox.
  const notices=await self.registration.getNotifications();
  for(const n of notices){const tag=n.tag||'';const kind=tag.startsWith('whdc-news-')?'announcement':tag.startsWith('whdc-daily-')?'daily':tag.startsWith('whdc-plan-')?'plan':null;if(kind)counts[kind]=Math.max(Number(counts[kind])||0,1)}
  await badgeWrite('counts',counts);
  const total=['announcement','daily','plan'].reduce((n,k)=>n+(prefs[k]===false?0:counts[k]||0),0);
  if('setAppBadge' in self.navigator){try{if(total)await self.navigator.setAppBadge(Math.min(total,99));else await self.navigator.clearAppBadge()}catch{}}
  const alerts=notices.map(n=>{const tag=n.tag||'';const kind=tag.startsWith('whdc-news-')?'announcement':tag.startsWith('whdc-daily-')?'daily':tag.startsWith('whdc-plan-')?'plan':null;return kind?{type:kind,title:n.title||'',body:n.body||''}:null}).filter(Boolean);
  event.ports?.[0]?.postMessage({counts,prefs,alerts});
 })().catch(()=>event.ports?.[0]?.postMessage(null)));
 if(msg.type==='WHDC_ALERT_CLEAR_ALL')event.waitUntil((async()=>{await badgeWrite('counts',{announcement:0,daily:0,plan:0});if('clearAppBadge'in self.navigator)await self.navigator.clearAppBadge();const notices=await self.registration.getNotifications();notices.forEach(n=>n.close());event.ports?.[0]?.postMessage({ok:true});})().catch(()=>event.ports?.[0]?.postMessage({ok:false})));
 if(msg.type==='WHDC_BADGE_CLEAR')event.waitUntil((async()=>{
  await badgeUpdate(msg.badgeType,true);
  const prefix={announcement:'whdc-news-',daily:'whdc-daily-',plan:'whdc-plan-'}[msg.badgeType];
  if(prefix)for(const notice of await self.registration.getNotifications())if((notice.tag||'').startsWith(prefix))notice.close();
 })().catch(()=>{}));
 if(msg.type==='WHDC_BADGE_PREFS')event.waitUntil((async()=>{const prefs={announcement:msg.prefs?.announcement!==false,daily:msg.prefs?.daily!==false,plan:msg.prefs?.plan!==false};await badgeWrite('prefs',prefs);const counts=await badgeRead('counts',{announcement:0,daily:0,plan:0});const total=['announcement','daily','plan'].reduce((n,k)=>n+(prefs[k]===false?0:counts[k]||0),0);if('setAppBadge'in self.navigator){if(total)await self.navigator.setAppBadge(Math.min(99,total));else await self.navigator.clearAppBadge()}})().catch(()=>{}));
});
self.addEventListener('push',event=>{
 event.waitUntil((async()=>{
  let data={};try{data=event.data?.json()||{}}catch{}
  const url=new URL(typeof data.url==='string'?data.url:'/',self.location.origin);
  if(url.origin!==self.location.origin)return;
  const badgeType=data.badgeType||(/^whdc-news-/.test(data.tag||'')?'announcement':/^whdc-daily-/.test(data.tag||'')?'daily':/^whdc-plan-/.test(data.tag||'')?'plan':null);
  if(badgeType)await badgeUpdate(badgeType).catch(()=>{});
  await self.registration.showNotification(typeof data.title==='string'?data.title.slice(0,100):"Notification",{body:typeof data.body==='string'?data.body.slice(0,220):'A new update is available.',icon:'/images/icons/icon-192.png',badge:'/images/icons/icon-192.png',tag:typeof data.tag==='string'?data.tag.slice(0,100):'whdc-notice',data:{url:url.href}});
 })());
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const url=new URL(event.notification.data?.url||'/',self.location.origin);
  const tag=event.notification.tag||'';const type=tag.startsWith('whdc-news-')?'announcement':tag.startsWith('whdc-daily-')?'daily':tag.startsWith('whdc-plan-')?'plan':null;if(type)await badgeUpdate(type,true).catch(()=>{});
  if(url.origin!==self.location.origin)return;
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients)if(new URL(client.url).origin===url.origin){await client.navigate(url.href);return client.focus()}
  return self.clients.openWindow(url.href);
 })());
});
