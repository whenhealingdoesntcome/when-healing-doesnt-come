/* WHDC native PWA Bible section. No iframe. */
(()=>{'use strict';
let saved=null, loaded=false, loading=null;
const scripts=['/bible/reader.js?v=20261024-integrated-v4','/bible/scripture-study.js?v=20261024-integrated-v4','/bible/study-notes.js?v=20261024-integrated-v4','/bible/verse-study.js?v=20261024-integrated-v4'];
function script(src){return new Promise((resolve,reject)=>{const e=document.createElement('script');e.src=src;e.onload=resolve;e.onerror=reject;document.body.append(e)})}
function setupToolbar(root){
 const toolbar=root.querySelector('.mobile-bible-toolbar');if(!toolbar)return;
 const update=()=>{if(!root.isConnected)return;const header=document.querySelector('body > header, #app > header, .site-header, .whdc-header');const height=header?Math.max(0,header.getBoundingClientRect().bottom):0;root.style.setProperty('--whdc-shared-header-height',height+'px');root.style.setProperty('--whdc-bible-toolbar-height',toolbar.offsetHeight+'px')};
 update();requestAnimationFrame(update);
 if(!root.__toolbarBound){root.__toolbarBound=true;window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true});}
}
async function mount(target){if(!target)return;
 if(saved){saved.classList.toggle('dark',document.body.classList.contains('dark'));target.replaceChildren(saved);setupToolbar(saved);saved=null;return}
 if(loading){await loading;if(saved){target.replaceChildren(saved);setupToolbar(saved);saved=null}return}
 loading=(async()=>{
  const r=await fetch('/bible/component-template.html?v=20261024-integrated-v4',{cache:'no-cache'});if(!r.ok)throw Error('Bible interface unavailable');
  const template=document.createElement('template');template.innerHTML=await r.text();
  const root=document.createElement('div');root.id='whdcBibleRoot';root.append(template.content);
  root.classList.toggle('dark',document.body.classList.contains('dark'));target.replaceChildren(root);setupToolbar(root);
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
