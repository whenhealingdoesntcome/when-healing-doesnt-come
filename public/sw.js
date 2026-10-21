const CACHE='whdc-public-shell-v10-memory-reminders';
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

const BADGE_DB='whdc-badges-v1';
function badgeStore(mode='readonly'){
 return new Promise((resolve,reject)=>{const req=indexedDB.open(BADGE_DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('state');req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result;const tx=db.transaction('state',mode);resolve({db,tx,store:tx.objectStore('state')})}});
}
async function badgeRead(key,fallback){const {db,store}=await badgeStore();return new Promise(resolve=>{const req=store.get(key);req.onsuccess=()=>{db.close();resolve(req.result??fallback)};req.onerror=()=>{db.close();resolve(fallback)}})}
async function badgeWrite(key,value){const {db,tx,store}=await badgeStore('readwrite');return new Promise(resolve=>{store.put(value,key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();resolve()}})}
async function badgeUpdate(type,clear=false){
 if(!('setAppBadge' in self.navigator))return;
 const prefs=await badgeRead('prefs',{announcement:true,daily:true,plan:true});
 const counts=await badgeRead('counts',{announcement:0,daily:0,plan:0});
 if(!['announcement','daily','plan'].includes(type))return;
 counts[type]=clear?0:Math.min(99,(counts[type]||0)+1);
 await badgeWrite('counts',counts);
 const total=['announcement','daily','plan'].reduce((n,k)=>n+(prefs[k]===false?0:counts[k]||0),0);
 if(total)await self.navigator.setAppBadge(Math.min(total,99));else await self.navigator.clearAppBadge();
}
self.addEventListener('message',event=>{
 const msg=event.data||{};
 if(msg.type==='WHDC_BADGE_CLEAR')event.waitUntil(badgeUpdate(msg.badgeType,true).catch(()=>{}));
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
