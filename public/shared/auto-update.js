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
    : ['/index.html','/devotionals/app.js','/shared/styles.css','/audio/audio-player.js','/shared/shared-nav.js'];
  const baseline=new Map();
  let checking=false, pending=false, refreshing=false, dismissedVersion=null;
  // Hash actual bytes rather than ETag/Last-Modified, which can vary across
  // Cloudflare responses without a change to the deployed application.
  const fingerprint=async(path)=>{
    const url=new URL(path,location.origin);
    url.searchParams.set('_whdc_update_check',String(Date.now()));
    const response=await fetch(url.href,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    if(!response.ok)throw Error('Update check failed: '+path);
    const bytes=await response.arrayBuffer();
    if(!globalThis.crypto?.subtle)throw Error('Secure digest unavailable');
    const hash=await crypto.subtle.digest('SHA-256',bytes);
    return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
  };
  // Never interrupt an active reading, audio session, or settings edit.
  // An update is installed only after the reader explicitly taps Refresh now.
  let currentVersion=null;
  const showPending=()=>{
    if(document.getElementById('whdc-update-notice'))return;
    const el=document.createElement('div');
    el.id='whdc-update-notice';
    el.setAttribute('role','status');
    el.style.cssText='position:fixed;bottom:calc(78px + env(safe-area-inset-bottom, 0px));left:16px;right:16px;max-width:420px;margin:auto;z-index:2147483647;padding:14px 18px;background:#f7f5f0;color:#263b40;border:2px solid #7e93ab;border-radius:12px;box-shadow:0 6px 24px #0002;font:16px/1.5 system-ui,sans-serif';
    el.innerHTML='<strong>An app update is ready.</strong> Your current reading and audio will not be interrupted. <button type="button" style="padding:6px 12px;margin-left:8px;cursor:pointer">Refresh now</button> <button type="button" data-dismiss style="padding:6px 10px;margin-left:4px;cursor:pointer">Later</button>';
    el.querySelector('button').addEventListener('click',()=>{refreshing=true;location.reload()});
    el.querySelector('[data-dismiss]').addEventListener('click',()=>{el.remove();pending=false;dismissedVersion=currentVersion;});
    document.body.appendChild(el);
  };
  const refresh=()=>{if(refreshing)return;pending=true;if(!document.hidden)showPending();};
  const check=async()=>{
    if(checking||refreshing||!navigator.onLine)return 'error';
    checking=true;
    try{
      // Compare only after all initial fingerprints are established.
      const results=await Promise.all(sources.map(async path=>[path,await fingerprint(path)]));
      let changed=false;
      currentVersion=results.map(([,value])=>value).join(':');
      for(const [path,value] of results){
        if(baseline.has(path)&&baseline.get(path)!==value)changed=true;
        baseline.set(path,value);
      }
      if(changed&&currentVersion!==dismissedVersion)refresh();
      // Service worker updates can still be discovered by the browser, but
      // they must never trigger an automatic page reload.
      return changed ? 'changed' : 'unchanged';
    }catch(error){return 'error';}
    finally{checking=false;}
  };
  window.WHDCCheckForUpdates=check;
  if(!whdcDesktopBrowser&&navigator.serviceWorker){
    // A controller change alone is not evidence that app files changed.
    // Do not reload or show a notification for it.
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
