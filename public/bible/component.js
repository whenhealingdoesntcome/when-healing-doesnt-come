/* WHDC native PWA Bible section. No iframe. */
(()=>{'use strict';
let saved=null, loaded=false, loading=null;
const scripts=['/bible/reader.js?v=20261024-bible-layout-v5','/bible/scripture-study.js?v=20261024-bible-layout-v5','/bible/study-notes.js?v=20261024-bible-layout-v5','/bible/verse-study.js?v=20261024-bible-layout-v5'];
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
async function mount(target){if(!target)return;
 if(saved){saved.classList.toggle('dark',document.body.classList.contains('dark'));target.replaceChildren(saved);setupToolbar(saved);setupSettings(saved);saved=null;return}
 if(loading){await loading;if(saved){target.replaceChildren(saved);setupToolbar(saved);setupSettings(saved);saved=null}return}
 loading=(async()=>{
  const r=await fetch('/bible/component-template.html?v=20261024-bible-layout-v5',{cache:'no-cache'});if(!r.ok)throw Error('Bible interface unavailable');
  const template=document.createElement('template');template.innerHTML=await r.text();
  const root=document.createElement('div');root.id='whdcBibleRoot';root.append(template.content);
  root.classList.toggle('dark',document.body.classList.contains('dark'));target.replaceChildren(root);setupToolbar(root);setupSettings(root);
  if(!loaded){for(const src of scripts)await script(src);loaded=true}
  // Surface failures on iOS instead of leaving an indefinite loading message.
  const reading=root.querySelector('#reading');
  if(reading){setTimeout(()=>{if(root.isConnected && /Loading Scripture|Opening Scripture/.test(reading.textContent||'')){reading.innerHTML='<p role="alert">The Bible Reader could not finish loading on this device. <a href="/bible-reader.html">Open the Bible Reader</a>.</p>';console.error('Bible initialization timed out');}},10000)}
  // The reader initializes asynchronously. Report a stalled reader rather than showing a permanent spinner.
  setTimeout(()=>{const reading=root.querySelector('#reading');if(root.isConnected&&reading&&/Loading Scripture|Opening Scripture/.test(reading.textContent||'')){reading.innerHTML='<p role="alert">Scripture did not finish loading. <a href="/bible-reader.html">Open the standalone Bible Reader</a>.</p>';console.error('WHDC Bible reader initialization stalled');}},12000);
 })().catch(e=>{target.innerHTML='<p role="alert">Unable to load Bible Reader. <a href="/bible-reader.html">Open the standalone reader</a>.</p>';console.error(e)}).finally(()=>loading=null);
 await loading;
}
function beforeRender(){const root=document.getElementById('whdcBibleRoot');if(root){saved=root;root.remove()}}
window.WHDCBibleComponent={mount,beforeRender};
})();
