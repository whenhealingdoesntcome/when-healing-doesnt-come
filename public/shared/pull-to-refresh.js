/* Pull-to-check-for-updates on the main WHDC app only. */
(()=>{
 'use strict';
 if(location.pathname==='/bible-reader.html'||!('ontouchstart' in window))return;
 let startY=null,tracking=false,running=false,dirty=false;
 const threshold=85;
 const bar=document.createElement('div');
 bar.id='whdc-pull-refresh';
 bar.setAttribute('role','status');bar.setAttribute('aria-live','polite');
 bar.style.cssText='position:fixed;z-index:2147483600;top:0;left:50%;transform:translate(-50%,-120%);transition:transform .18s ease;padding:9px 16px;border-radius:0 0 14px 14px;background:var(--card,#fff);color:var(--ink,#263b40);border:1px solid var(--line,#ddd);box-shadow:0 3px 12px #0002;font:13px system-ui,sans-serif;pointer-events:none';
 bar.textContent='Pull to check for updates';
 const show=(message,offset=0)=>{bar.textContent=message;bar.style.transform=`translate(-50%,${offset}px)`;};
 const hide=()=>show('',-100);
 const atTop=()=>window.scrollY<=2&&document.scrollingElement?.scrollTop<=2;
 const editable=el=>el?.closest?.('input:not([type="checkbox"]):not([type="radio"]),textarea,select,[contenteditable="true"]');
 document.addEventListener('input',e=>{if(editable(e.target))dirty=true;},true);
 document.addEventListener('submit',()=>{dirty=false;},true);
 document.addEventListener('touchstart',e=>{
  if(running||!atTop()||e.touches.length!==1||editable(e.target)||e.target.closest?.('[data-no-pull-refresh]')){startY=null;return;}
  startY=e.touches[0].clientY;tracking=true;
 },{passive:true});
 document.addEventListener('touchmove',e=>{
  if(!tracking||startY===null||e.touches.length!==1)return;
  const distance=e.touches[0].clientY-startY;
  if(distance<0){tracking=false;hide();return;}
  if(!atTop()){tracking=false;hide();return;}
  if(distance>18)show(distance>=threshold?'Release to check for updates':'Pull to check for updates',Math.min(38,distance/5));
 },{passive:true});
 document.addEventListener('touchend',async e=>{
  if(!tracking||startY===null)return;
  const distance=(e.changedTouches[0]?.clientY??startY)-startY;
  tracking=false;startY=null;
  if(distance<threshold){hide();return;}
  if(dirty||editable(document.activeElement)){show('Save your changes before refreshing',24);setTimeout(hide,2400);return;}
  if(!navigator.onLine){show('Offline: saved content is still available',24);setTimeout(hide,2400);return;}
  running=true;show('Checking for updates…',24);
  try{
   const result=await window.WHDCCheckForUpdates?.();
   if(result==='changed')return; // Existing auto-update logic handles safe reload.
   show(result==='error'?'Could not check for updates':'You’re up to date',24);
  }catch{show('Could not check for updates',24);}
  finally{running=false;setTimeout(hide,1900);}
 },{passive:true});
 document.addEventListener('touchcancel',()=>{tracking=false;startY=null;hide();},{passive:true});
 document.body.appendChild(bar);
})();
