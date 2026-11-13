// Uses WHDC's existing reader session and optimistic-revision sync endpoint.
(function(){
  'use strict';
  const key='whdc-good-scroll-saved-v1',metaKey='whdc-good-scroll-sync-v1';
  const parse=raw=>{const value=JSON.parse(raw||'[]');if(!Array.isArray(value)||value.some(id=>typeof id!=='string'||!id||id.length>80))throw Error('Saved Good Scroll data is invalid. Export a backup before repairing it.');return [...new Set(value)];};
  const get=()=>parse(localStorage.getItem(key));
  function notify(message){window.dispatchEvent(new CustomEvent('whdc:good-scroll-saved',{detail:{message}}));}
  function merge(base,local,remote){const b=new Set(base||[]),l=new Set(local),r=new Set(remote);return [...new Set([...local,...remote])].filter(id=>!b.has(id)||(l.has(id)&&r.has(id)));}
  let running=false;
  async function request(path,options){const r=await fetch('/api/reader/'+path,{credentials:'same-origin',cache:'no-store',...options});if(!r.ok)throw Error('Account sync unavailable. Your posts remain saved on this device.');return r.json();}
  async function sync(){
    if(running||location.hostname!=='whdcdevotions.com'||!navigator.onLine)return;
    running=true;
    try{
      const account=await request('me');if(!account.signedIn){notify('Saved on this device. Sign in through Settings to sync.');return;}
      for(let attempt=0;attempt<3;attempt++){
        const snapshot=localStorage.getItem(key),local=parse(snapshot),cloud=(await request('sync')).items?.[key];
        const remote=parse(cloud?.value),meta=JSON.parse(localStorage.getItem(metaKey)||'null');
        const baseline=meta?.account===account.email?meta.ids:null;
        const merged=merge(baseline,local,remote),value=JSON.stringify(merged);
        const response=await fetch('/api/reader/sync',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({key,value,baseRevision:cloud?.revision||0})});
        if(response.status===409)continue;
        if(!response.ok)throw Error('Sync unavailable. Posts remain saved on this device.');
        const result=await response.json();
        // Keep edits made while the request was in flight, including removals.
        const latest=get(),final=merge(local,latest,merged);
        localStorage.setItem(key,JSON.stringify(final));localStorage.setItem(metaKey,JSON.stringify({account:account.email,ids:merged,revision:result.revision}));
        notify('Saved posts synchronized.');if(JSON.stringify(final)!==value)continue;return;
      }
      notify('Saved locally. Sync will retry shortly.');
    }catch(e){notify(e.message);}finally{running=false;}
  }
  function schedule(){if(navigator.locks?.request)return navigator.locks.request('whdc-good-scroll-sync',sync);return sync();}
  function toggle(id){const ids=get(),next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];localStorage.setItem(key,JSON.stringify(next));notify('Saved on this device.');schedule();return next.includes(id);}
  window.WHDCGoodScrollSaved={get,toggle,sync:schedule,merge};
  window.addEventListener('online',schedule);window.addEventListener('pageshow',schedule);
  window.addEventListener('storage',e=>{if(e.key===key)notify('Saved posts updated.');});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
  setInterval(schedule,20000);schedule();
})();
