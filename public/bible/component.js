/* WHDC native PWA Bible section. No iframe. */
(()=>{'use strict';
let saved=null, loaded=false, loading=null;
const scripts=['/bible/reader.js?v=20261024-mobile-diagnostic-v14','/bible/scripture-study.js?v=20261024-mobile-diagnostic-v14','/bible/study-notes.js?v=20261024-mobile-diagnostic-v14','/bible/verse-study.js?v=20261024-mobile-diagnostic-v14'];
function script(src){return new Promise((resolve,reject)=>{const e=document.createElement('script');e.src=src;e.onload=resolve;e.onerror=reject;document.body.append(e)})}
function setupSettings(root){
 const gear=root.querySelector('#mobileReaderSettings');
 const panel=root.querySelector('#mobileReaderOptions');
 if(!gear||!panel||gear.dataset.whdcBound)return;
 gear.dataset.whdcBound='1';
 panel.classList.add('whdc-settings-popover');
 panel.open=false;
 root.append(panel);
 if(!panel.querySelector('.whdc-settings-close'))panel.insertAdjacentHTML('afterbegin','<button type="button" class="whdc-settings-close" aria-label="Close reader settings">×</button><p class="whdc-settings-title">Bible Reader Settings</p>');
 const close=()=>{panel.open=false;gear.setAttribute('aria-expanded','false')};
 const position=()=>{
  const bar=root.querySelector('.mobile-bible-toolbar');
  const y=bar?bar.getBoundingClientRect().bottom:gear.getBoundingClientRect().bottom;
  panel.style.top=Math.max(0,y+5)+'px';
  panel.style.right='max(12px, env(safe-area-inset-right))';
  panel.style.left='auto';
  panel.style.maxHeight=Math.max(160,window.innerHeight-y-16)+'px';
 };
 gear.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();const open=!panel.open;if(open){position();const search=root.querySelector('#bibleSearchPanel');if(search){search.classList.remove('whdc-mobile-search-open');search.style.display='none'}}panel.open=open;gear.setAttribute('aria-expanded',String(open));});
 panel.querySelector('.whdc-settings-close').addEventListener('click',close);
 document.addEventListener('pointerdown',e=>{if(panel.open&&!panel.contains(e.target)&&!gear.contains(e.target))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.open)close()});
 window.addEventListener('resize',()=>{if(panel.open)position()});
}
function setupToolbar(root){
 const toolbar=root.querySelector('.mobile-bible-toolbar');if(!toolbar)return;
 const update=()=>{if(!root.isConnected)return;const header=document.querySelector('body > header, #app > header, .site-header, .whdc-header');const height=header?Math.max(0,header.getBoundingClientRect().bottom):0;root.style.setProperty('--whdc-shared-header-height',height+'px');root.style.setProperty('--whdc-bible-toolbar-height',toolbar.offsetHeight+'px')};
 update();requestAnimationFrame(update);
 if(!root.__toolbarBound){root.__toolbarBound=true;window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true});}
}
let activeTarget=null, pendingRoot=null, mountGeneration=0;
function showError(target, message){
 if(!target?.isConnected)return;
 const p=document.createElement('p');p.setAttribute('role','alert');
 p.textContent='Bible Reader could not load: '+message+'. ';
 const a=document.createElement('a');a.href='/bible-reader.html';a.textContent='Open the standalone Bible Reader';p.append(a);
 target.replaceChildren(p);
}
async function mount(target){
 if(!target)return;
 activeTarget=target;
 const generation=++mountGeneration;
 if(saved){
  const root=saved;saved=null;target.replaceChildren(root);
  root.classList.toggle('dark',document.body.classList.contains('dark'));
  setupToolbar(root);setupSettings(root);return;
 }
 if(loading){
  try{await loading}catch(e){showError(target,e.message||'initialization error')}
  if(activeTarget===target&&target.isConnected&&pendingRoot){
   target.replaceChildren(pendingRoot);setupToolbar(pendingRoot);setupSettings(pendingRoot);pendingRoot=null;
  }
  return;
 }
 const timeout=(ms)=>new Promise((_,reject)=>setTimeout(()=>reject(new Error('timed out after '+Math.round(ms/1000)+' seconds')),ms));
 loading=(async()=>{
  const response=await Promise.race([fetch('/bible/component-template.html?v=20261024-mobile-diagnostic-v14',{cache:'no-store'}),timeout(12000)]);
  if(!response.ok)throw new Error('interface request HTTP '+response.status);
  const html=await response.text();
  if(!html.includes('id="reading"'))throw new Error('Bible interface missing Scripture container');
  const template=document.createElement('template');template.innerHTML=html;
  const root=document.createElement('div');root.id='whdcBibleRoot';root.append(template.content);
  root.classList.toggle('dark',document.body.classList.contains('dark'));
  const destination=activeTarget;
  if(destination?.isConnected){destination.replaceChildren(root);setupToolbar(root);setupSettings(root)}
  else pendingRoot=root;
  if(!loaded){
   for(const src of scripts){
    await Promise.race([script(src),timeout(12000)]).catch(e=>{throw new Error('script '+src.split('?')[0]+': '+e.message)});
   }
   loaded=true;
  }
  // Detect an initialization stall even when the reader's own error handler never runs.
  setTimeout(()=>{
   if(!root.isConnected)return;
   const reading=root.querySelector('#reading');
   if(reading && /Loading Scripture|Opening Scripture/i.test(reading.textContent||'')){
    reading.innerHTML='<p role="alert">Bible Scripture initialization did not finish. <a href="/bible-reader.html">Open the standalone Bible Reader</a>.</p>';
   }
  },12000);
 })();
 try{await loading}
 catch(e){console.error('WHDC Bible component failed:',e);showError(activeTarget,e.message||'unknown error')}
 finally{loading=null}
}
function beforeRender(){const root=document.getElementById('whdcBibleRoot');if(root){saved=root;root.remove()}activeTarget=null}
window.WHDCBibleComponent={mount,beforeRender};
})();
