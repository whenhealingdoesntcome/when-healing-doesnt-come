/* WHDC native PWA Bible section. No iframe. */
(()=>{'use strict';
let saved=null, loaded=false, loading=null;
const scripts=['/bible/reader.js','/bible/scripture-study.js','/bible/study-notes.js','/bible/verse-study.js'];
function script(src){return new Promise((resolve,reject)=>{const e=document.createElement('script');e.src=src;e.onload=resolve;e.onerror=reject;document.body.append(e)})}
async function mount(target){if(!target)return;
 if(saved){saved.classList.toggle('dark',document.body.classList.contains('dark'));target.replaceChildren(saved);saved=null;return}
 if(loading){await loading;if(saved){target.replaceChildren(saved);saved=null}return}
 loading=(async()=>{
  const r=await fetch('/bible/component-template.html');if(!r.ok)throw Error('Bible interface unavailable');
  const template=document.createElement('template');template.innerHTML=await r.text();
  const root=document.createElement('div');root.id='whdcBibleRoot';root.append(template.content);
  root.classList.toggle('dark',document.body.classList.contains('dark'));target.replaceChildren(root);
  if(!loaded){for(const src of scripts)await script(src);loaded=true}
 })().catch(e=>{target.innerHTML='<p role="alert">Unable to load Bible Reader. <a href="/bible-reader.html">Open the standalone reader</a>.</p>';console.error(e)}).finally(()=>loading=null);
 await loading;
}
function beforeRender(){const root=document.getElementById('whdcBibleRoot');if(root){saved=root;root.remove()}}
window.WHDCBibleComponent={mount,beforeRender};
})();
