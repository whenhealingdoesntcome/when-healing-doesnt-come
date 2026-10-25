const CACHE='whdc-public-shell-v34-resources-legacy-cleanup';
const SHELL=['/','/index.html','/devotionals/app.js','/shared/auto-update.js','/shared/pull-to-refresh.js','/shared/shared-nav.js','/audio/audio-player.js','/shared/styles.css','/content.json','/manifest.webmanifest','/images/header-logo.png','/images/icons/favicon.png','/images/icons/icon-192.png','/images/icons/icon-512.png','/images/icons/apple-touch-icon.png','/images/misty-mountain-divider.jpg','/images/todays-pick-banner.png','/resources/resources.css','/bible-reader.html','/bible/component.js','/bible/component.css','/bible/component-template.html','/bible/reader.js','/bible/scripture-study.js','/bible/study-notes.js','/bible/reader.css','/bible/manifest.json','/bible/paragraphs.json'];
const CORE=['/index.html','/devotionals/app.js','/shared/shared-nav.js','/shared/styles.css','/content.json','/bible-reader.html','/bible/reader.js','/bible/reader.css'];

// iOS Safari rejects redirected Response objects returned for navigation by a
// service worker. Recreate same-origin HTML as a fresh, non-redirected Response.
function cleanDocumentResponse(response){
 if(!response||!response.ok)return null;
 const contentType=response.headers.get('content-type')||'';
 if(!contentType.toLowerCase().includes('text/html'))return null;
 if(response.redirected){
  try{if(new URL(response.url).origin!==self.location.origin)return null}catch{return null}
 }
 const headers=new Headers();
 headers.set('Content-Type',contentType);
 headers.set('Cache-Control','no-store');
 return new Response(response.body,{status:200,statusText:'OK',headers});
}

// Populate the cache opportunistically. One unavailable optional resource must not
// prevent the worker from installing and controlling the offline app.
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 const results=await Promise.allSettled(SHELL.map(async path=>{
  const response=await fetch(path,{cache:'reload'});
  if(!response.ok||response.type==='opaque')throw Error('Cannot cache '+path);
  if(path==='/'||path==='/index.html'||path==='/bible-reader.html'||path==='/resources.html'){
   const document=cleanDocumentResponse(response);
   if(!document)throw Error('Not a public HTML document: '+path);
   await cache.put(path,document);
  }else if(!response.redirected){await cache.put(path,response)}
 }));
 // If the landing document cannot be cached, retain the previous working SW.
 const landing=await cache.match('/index.html');
 if(!landing)throw Error('Offline entry page unavailable; preserving previous worker');
 // The other assets will be cached as users visit while online.
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 // Preserve older shell caches as a fallback until a later successful update.
 await self.clients.claim();
})()));
const cacheLookup=async(path,request)=>{
 const own=await caches.open(CACHE);
 return await own.match(request||path)||await caches.match(request||path)||await caches.match(path);
};
const fastNetwork=async(request,ms=1300)=>{
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),ms);
 try{return await fetch(request,{signal:controller.signal})}
 finally{clearTimeout(timeout)}
};
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
   }catch{return await cacheLookup(path,req)||Response.error()}
  })());return;
 }
 if(req.mode==='navigate'){
  // Serve the offline shell immediately when a network connection is unavailable
  // or stalled. Browser Home Screen launches must not hang indefinitely.
  const page=path==='/bible-reader.html'?'/bible-reader.html':path==='/resources.html'?'/resources.html':'/index.html';
  event.respondWith((async()=>{
   const cachedRaw=await cacheLookup(page);
   const cached=cachedRaw?cleanDocumentResponse(cachedRaw):null;
   try{
    const response=await fastNetwork(req,1500);
    const document=cleanDocumentResponse(response);
    if(document){
     const cache=await caches.open(CACHE);
     await cache.put(page,document.clone());
     return document;
    }
    // Do not send a redirected or non-HTML response to a navigation request.
    return cached||response;
   }catch{return cached||new Response('This page has not been saved for offline use.',{status:503,headers:{'Content-Type':'text/plain'}})}
  })());return;
 }
 // Bible integration code must update together. Keep Scripture downloads untouched.
 if(['/bible/component.js','/bible/component.css','/bible/component-template.html','/bible/reader.js','/bible/scripture-study.js','/bible/study-notes.js','/bible/verse-study.js'].includes(path)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   try{const response=await fastNetwork(req,4000);if(response.ok&&response.type==='basic'){await cache.put(req,response.clone());return response}}catch{}
   return await cache.match(req)||Response.error();
  })());return;
 }
 if(SHELL.includes(path)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cacheLookup(path);
   // Keep the application runnable even if a network request hangs or fails.
   if(cached){event.waitUntil(fetch(req).then(r=>{if(r.ok&&r.type==='basic')return cache.put(path,r)}).catch(()=>{}));return cached}
   try{const response=await fetch(req);if(response.ok)await cache.put(path,response.clone());return response}
   catch{return Response.error()}
  })());return;
 }
 if(!/\.(?:js|css|png|jpg|jpeg|webp|svg|woff2?|json|ico)$/i.test(path))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cacheLookup(path,req);
  if(cached)return cached;
  try{const response=await fetch(req);if(response.ok&&response.type==='basic')await cache.put(req,response.clone());return response}
  catch{return Response.error()}
 })());
});

// Refresh only the small public app shell on online launches. Downloaded Bible
// books are kept in their separate opt-in cache and are never bulk-downloaded.
const REFRESH_SHELL=SHELL.filter(path=>!path.startsWith('/bible/')&&path!=='/content.json');
let shellRefreshPromise=null;
async function replaceIfChanged(cache,path,response){
 if(!response.ok||response.redirected||response.type==='opaque')return false;
 const previous=await cache.match(path);
 const oldTag=previous?.headers.get('etag'),newTag=response.headers.get('etag');
 const oldModified=previous?.headers.get('last-modified'),newModified=response.headers.get('last-modified');
 if(previous&&oldTag&&newTag&&oldTag===newTag)return false;
 if(previous&&oldModified&&newModified&&oldModified===newModified&&previous.headers.get('content-length')===response.headers.get('content-length'))return false;
 const next=path==='/'||path==='/index.html'||path==='/bible-reader.html'?cleanDocumentResponse(response):response;
 if(!next)return false;
 // If no validators are available, compare bytes before replacing the cache.
 if(previous){const [oldBytes,newBytes]=await Promise.all([previous.clone().arrayBuffer(),next.clone().arrayBuffer()]);if(oldBytes.byteLength===newBytes.byteLength){const a=new Uint8Array(oldBytes),b=new Uint8Array(newBytes);let same=true;for(let i=0;i<a.length;i++)if(a[i]!==b[i]){same=false;break}if(same)return false}}
 await cache.put(path,next);return true;
}
async function refreshPublicShell(){
 if(shellRefreshPromise)return shellRefreshPromise;
 shellRefreshPromise=(async()=>{
  const cache=await caches.open(CACHE);let changed=0;
  await Promise.allSettled(REFRESH_SHELL.map(async path=>{
   const response=await fetch(path,{cache:'no-store'});
   if(await replaceIfChanged(cache,path,response))changed++;
  }));
  return changed;
 })();
 try{return await shellRefreshPromise}finally{shellRefreshPromise=null}
}
// Only inspect Bible books the reader explicitly downloaded. Conditional HEAD
// requests avoid re-downloading 66 full books on each launch.
let bibleRefreshPromise=null;
async function refreshDownloadedBible(){
 if(bibleRefreshPromise)return bibleRefreshPromise;
 bibleRefreshPromise=(async()=>{
  const cache=await caches.open('whdc-webu-offline-v1');const entries=await cache.keys();let changed=0;
  const paths=entries.map(req=>new URL(req.url).pathname).filter(path=>/^\/bible\/[A-Z0-9]{3}\.json$/.test(path));
  // Bound concurrent requests to avoid a burst of 66 simultaneous requests.
  for(let i=0;i<paths.length;i+=4)await Promise.allSettled(paths.slice(i,i+4).map(async path=>{
   const previous=await cache.match(path);if(!previous)return;
   const head=await fetch(path,{method:'HEAD',cache:'no-store'});if(!head.ok)return;
   const oldTag=previous.headers.get('etag'),newTag=head.headers.get('etag');
   const oldModified=previous.headers.get('last-modified'),newModified=head.headers.get('last-modified');
   if(oldTag&&newTag&&oldTag===newTag)return;
   if(oldModified&&newModified&&oldModified===newModified&&previous.headers.get('content-length')===head.headers.get('content-length'))return;
   // No validators: do not re-download the Bible automatically. Existing
   // downloads remain available; user-initiated Download Bible can refresh.
   if(!(oldTag&&newTag)&&!(oldModified&&newModified))return;
   const response=await fetch(path,{cache:'no-store'});
   if(await replaceIfChanged(cache,path,response))changed++;
  }));
  return changed;
 })();
 try{return await bibleRefreshPromise}finally{bibleRefreshPromise=null}
}
self.addEventListener('message',event=>{
 if(event.data?.type!=='WHDC_REFRESH_ON_OPEN')return;
 event.waitUntil((async()=>{
  const [shell,bible]=await Promise.allSettled([refreshPublicShell(),refreshDownloadedBible()]);
  event.ports?.[0]?.postMessage({ok:true,shellChanged:shell.status==='fulfilled'?shell.value:0,bibleChanged:bible.status==='fulfilled'?bible.value:0});
 })().catch(()=>event.ports?.[0]?.postMessage({ok:false})));
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
 if(typeof msg.type==='string'&&msg.type.startsWith('WHDC_BADGE_CLEAR_ONE:'))event.waitUntil((async()=>{
  const type=msg.type.slice('WHDC_BADGE_CLEAR_ONE:'.length);
  if(!['announcement','daily','plan'].includes(type)){event.ports?.[0]?.postMessage({ok:false});return;}
  await badgeUpdate(type,true);
  const prefix={announcement:'whdc-news-',daily:'whdc-daily-',plan:'whdc-plan-'}[type];
  for(const notice of await self.registration.getNotifications())if((notice.tag||'').startsWith(prefix))notice.close();
  event.ports?.[0]?.postMessage({ok:true});
 })().catch(()=>event.ports?.[0]?.postMessage({ok:false})));
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
  const tag=event.notification.tag||'';const type=tag.startsWith('whdc-news-')?'announcement':tag.startsWith('whdc-daily-')?'daily':tag.startsWith('whdc-plan-')?'plan':null;if(type){await badgeUpdate(type,true).catch(()=>{});const prefix={announcement:'whdc-news-',daily:'whdc-daily-',plan:'whdc-plan-'}[type];for(const notice of await self.registration.getNotifications())if((notice.tag||'').startsWith(prefix))notice.close();}
  if(url.origin!==self.location.origin)return;
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients)if(new URL(client.url).origin===url.origin){await client.navigate(url.href);return client.focus()}
  return self.clients.openWindow(url.href);
 })());
});
