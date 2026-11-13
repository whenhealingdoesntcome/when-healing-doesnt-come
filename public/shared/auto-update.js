/* Compare deployment content manifest. Never reload without user action. */
(()=>{'use strict';if(!/^https?:$/.test(location.protocol))return;
let baseline=null,checking=null,pending=null,dismissed=null;
function notice(){if(!pending||pending===dismissed||document.getElementById('whdc-update-notice'))return;
const el=document.createElement('div');el.id='whdc-update-notice';el.setAttribute('role','status');el.style.cssText='position:fixed;bottom:calc(78px + env(safe-area-inset-bottom,0px));left:16px;right:16px;max-width:420px;margin:auto;z-index:2147483647;padding:14px 18px;background:#f7f5f0;color:#263b40;border:2px solid #7e93ab;border-radius:12px;box-shadow:0 6px 24px #0002;font:16px/1.5 system-ui,sans-serif';
el.innerHTML='<strong>An app update is ready.</strong> Your reading and audio will not be interrupted. <button type="button" data-refresh>Refresh now</button> <button type="button" data-later>Later</button>';
el.querySelector('[data-refresh]').onclick=()=>window.dispatchEvent(new Event('whdc:before-manual-refresh'));location.reload();el.querySelector('[data-later]').onclick=()=>{dismissed=pending;el.remove()};document.body.appendChild(el)}
function check(){if(checking)return checking;if(!navigator.onLine)return Promise.resolve('error');checking=(async()=>{try{const response=await fetch('/update-manifest.json?check='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});if(!response.ok)throw Error('Manifest unavailable');const data=await response.json();if(data.schema!==1||!(/^[a-f0-9]{64}$/.test(data.version)))throw Error('Invalid manifest');if(baseline===null){baseline=data.version;return 'unchanged'}if(data.version===baseline)return 'unchanged';pending=data.version;if(!document.hidden)notice();return 'changed'}catch{return 'error'}finally{checking=null}})();return checking}
window.WHDCCheckForUpdates=check;
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(pending)notice();check()}});window.addEventListener('focus',check);window.addEventListener('online',check);window.addEventListener('load',()=>{check();setInterval(check,90000)});
})();
