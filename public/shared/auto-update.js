/* WHDC automatic in-app updates: check active deployment, refresh safely. */
(()=>{
  'use strict';
  if(!/^https?:$/.test(location.protocol))return;
  const whdcDesktopBrowser=!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)&&!(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(whdcDesktopBrowser&&'serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.filter(r=>new URL(r.scope).origin===location.origin&&new URL(r.scope).pathname==='/').map(r=>r.unregister()))).catch(()=>{});
    if('caches' in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('whdc-public-shell-')).map(k=>caches.delete(k)))).catch(()=>{});
  }
  const sources=location.pathname==='/bible-reader.html'
    ? ['/bible-reader.html','/bible/reader.js','/bible/scripture-study.js','/bible/study-notes.js','/shared/styles.css','/bible/reader.css']
    : ['/index.html','/devotionals/app.js','/shared/styles.css','/content.json','/audio/audio-player.js'];
  const baseline=new Map();
  let checking=false, pending=false, refreshing=false, oldController=!!navigator.serviceWorker?.controller;
  const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const fingerprint=async(path)=>{
    const url=new URL(path,location.origin);
    url.searchParams.set('_whdc_update_check',String(Date.now()));
    const response=await fetch(url.href,{method:'HEAD',cache:'no-store'});
    if(!response.ok)throw Error('Update check failed');
    const tag=response.headers.get('etag');
    const modified=response.headers.get('last-modified');
    const size=response.headers.get('content-length');
    if(tag)return 'etag:'+tag;
    if(modified&&size)return 'modified:'+modified+':'+size;
    // Some hosts omit validators. Use a full GET and hash as fallback.
    const full=await fetch(url.href,{cache:'no-store'});
    if(!full.ok)throw Error('Update check failed');
    const bytes=await full.arrayBuffer();
    if(crypto?.subtle){
      const hash=await crypto.subtle.digest('SHA-256',bytes);
      return 'sha256:'+Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
    }
    return 'bytes:'+bytes.byteLength+':'+new TextDecoder().decode(bytes).slice(0,100);
  };
  // Never interrupt an active reading, audio session, or settings edit.
  // An update is installed only after the reader explicitly taps Refresh now.
  const showPending=()=>{
    if(document.getElementById('whdc-update-notice'))return;
    const el=document.createElement('div');
    el.id='whdc-update-notice';
    el.setAttribute('role','status');
    el.style.cssText='position:fixed;bottom:calc(78px + env(safe-area-inset-bottom, 0px));left:16px;right:16px;max-width:420px;margin:auto;z-index:2147483647;padding:14px 18px;background:#f7f5f0;color:#263b40;border:2px solid #7e93ab;border-radius:12px;box-shadow:0 6px 24px #0002;font:16px/1.5 system-ui,sans-serif';
    el.innerHTML='<strong>An app update is ready.</strong> Your current reading and audio will not be interrupted. <button type="button" style="padding:6px 12px;margin-left:8px;cursor:pointer">Refresh now</button> <button type="button" data-dismiss style="padding:6px 10px;margin-left:4px;cursor:pointer">Later</button>';
    el.querySelector('button').addEventListener('click',()=>{refreshing=true;location.reload()});
    el.querySelector('[data-dismiss]').addEventListener('click',()=>el.remove());
    document.body.appendChild(el);
  };
  const refresh=()=>{if(refreshing)return;pending=true;if(!document.hidden)showPending();};
  let lastCacheRefresh=0;
  const refreshDownloadedCache=()=>{
    if(whdcDesktopBrowser||!navigator.onLine||!navigator.serviceWorker)return;
    const now=Date.now();if(now-lastCacheRefresh<30000)return;
    lastCacheRefresh=now;
    navigator.serviceWorker.ready.then(reg=>{
      const worker=navigator.serviceWorker.controller||reg.active;
      worker?.postMessage({type:'WHDC_REFRESH_ON_OPEN'});
    }).catch(()=>{});
  };
  const check=async()=>{
    refreshDownloadedCache();
    if(checking||refreshing||!navigator.onLine)return 'error';
    checking=true;
    try{
      // Compare only after all initial fingerprints are established.
      const results=await Promise.all(sources.map(async path=>[path,await fingerprint(path)]));
      let changed=false;
      for(const [path,value] of results){
        if(baseline.has(path)&&baseline.get(path)!==value)changed=true;
        baseline.set(path,value);
      }
      if(changed)refresh();
      if(!whdcDesktopBrowser&&navigator.serviceWorker){
        const registration=await navigator.serviceWorker.getRegistration('/');
        if(registration)await registration.update();
      }
      return changed ? 'changed' : 'unchanged';
    }catch(error){return 'error';}
    finally{checking=false;}
  };
  window.WHDCCheckForUpdates=check;
  if(!whdcDesktopBrowser&&navigator.serviceWorker){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(oldController)refresh();
      oldController=true;
    });
    // Bible page can be the first page opened; register here too.
    if(location.protocol==='https:')navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{});
  }
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden){if(pending)showPending();else check();}
  });
  window.addEventListener('focus',()=>{if(pending)showPending();else check();});
  window.addEventListener('online',check);
  // No automatic refresh on input blur: a reader may be editing settings.
  window.addEventListener('load',()=>{check();setInterval(check,90000);});
})();
