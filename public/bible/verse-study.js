/* Verse-anchored study actions shared by search results and full chapters.
   Existing paragraph annotations and notes remain untouched. */
(()=>{'use strict';
const root=document.getElementById('reading');if(!root)return;
const KEY='whdc-bible-verse-study-v1',FAV='whdc-favorite-verses-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const save=data=>{try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch{return false}};
const colors={god:'#ffe06b',love:'#f38bb7',promises:'#65c9f5',instruction:'#9ed88d',commands:'#ffb16a',prayer:'#a67ae6',jesus:'#ff7381',warnings:'#b7855e',people:'#66d3d2',other:'#cdd4db',spirit:'#f2d86f'};
const css=document.createElement('style');css.textContent=`
.whdc-verse-tools{display:inline-flex;vertical-align:middle;gap:3px;margin-left:7px}
.whdc-verse-tools button{font:inherit;font-size:.73rem;padding:3px 6px;border:1px solid currentColor;border-radius:6px;background:transparent;color:inherit;cursor:pointer}
.whdc-verse-tools button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.whdc-verse-study-highlight{border-radius:3px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.whdc-verse-study-underline{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}
.whdc-verse-study-circle{outline:1.5px solid var(--whdc-verse-color,currentColor);border-radius:8px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.whdc-verse-study-note{font-size:.75em;margin-left:3px}
#whdcVerseDialog{border:1px solid #b9aa91;border-radius:12px;background:#f7f5f0;color:#393f4a;max-width:min(470px,calc(100vw - 24px));width:100%;padding:18px;box-shadow:0 8px 30px #0005}
#whdcVerseDialog::backdrop{background:#0008}
#whdcVerseDialog textarea{width:100%;box-sizing:border-box;min-height:100px;margin:9px 0;padding:9px;font:inherit}
#whdcVerseDialog select{max-width:100%;font:inherit;padding:5px}
#whdcVerseDialog .whdc-verse-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
#whdcVerseDialog button{padding:7px 10px;border:1px solid currentColor;border-radius:7px;background:transparent;color:inherit;font:inherit}
body.dark #whdcVerseDialog{background:#223132;color:#eef3ed;border-color:#536b63;color-scheme:dark}
`;document.head.append(css);
const dialog=document.createElement('dialog');dialog.id='whdcVerseDialog';dialog.innerHTML=`<form method="dialog"><strong id="whdcVerseTitle"></strong><p>Study tools for this verse. Saved changes appear in search results and the full chapter.</p><label>Marking <select id="whdcVerseKind"><option value="none">No marking</option><option value="highlight">Highlight</option><option value="circle">Circle</option><option value="underline">Underline</option></select></label> <label>Theme <select id="whdcVerseTheme"></select></label><label for="whdcVerseNote" style="display:block;margin-top:10px">Verse note</label><textarea id="whdcVerseNote" maxlength="12000" placeholder="My observations and reflections"></textarea><div class="whdc-verse-actions"><button type="button" id="whdcVerseFavorite">♡ Save Verse</button><button type="button" id="whdcVerseRemove">Remove Study Marks</button><button type="button" id="whdcVerseSave">Save Changes</button><button value="cancel">Cancel</button></div><p id="whdcVerseStatus" role="status"></p></form>`;document.body.append(dialog);
const theme=dialog.querySelector('#whdcVerseTheme');Object.keys(colors).forEach(k=>theme.add(new Option(k==='spirit'?'Holy Spirit':k[0].toUpperCase()+k.slice(1),k)));
let selected=null;
function ref(el){const book=el.dataset.book,ch=Number(el.dataset.chapter),v=Number(el.dataset.verse);return book&&Number.isInteger(ch)&&Number.isInteger(v)?`${book}:${ch}:${v}`:null}
function clean(el){el.classList.remove('whdc-verse-study-highlight','whdc-verse-study-underline','whdc-verse-study-circle');el.style.removeProperty('background-color');el.style.removeProperty('--whdc-verse-color');el.querySelector('.whdc-verse-study-note')?.remove()}
function apply(){const all=read();root.querySelectorAll('.verse-unit[data-book][data-chapter][data-verse]').forEach(el=>{const id=ref(el);if(!id)return;clean(el);const data=all[id];if(data?.kind&&data.kind!=='none'){el.classList.add('whdc-verse-study-'+data.kind);if(data.kind==='highlight')el.style.backgroundColor=colors[data.theme]||colors.other;else el.style.setProperty('--whdc-verse-color',colors[data.theme]||colors.other)}if(data?.note){const note=document.createElement('span');note.className='whdc-verse-study-note';note.textContent=' 📝';note.title='Saved verse note';el.append(note)}
 const result=el.closest('.result-item');if((result||data)&&!el.parentElement.querySelector('.whdc-verse-tools[data-ref="'+id+'"]')){const holder=document.createElement('span');holder.className='whdc-verse-tools';holder.dataset.ref=id;const btn=document.createElement('button');btn.type='button';btn.textContent='✎ Study verse';btn.setAttribute('aria-label','Study '+id.replaceAll(':',' '));btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(el)});holder.append(btn);el.insertAdjacentElement('afterend',holder)}
 });}
function open(el){selected=el;const id=ref(el),data=read()[id]||{};dialog.querySelector('#whdcVerseTitle').textContent='Study '+id.replaceAll(':',' ');dialog.querySelector('#whdcVerseKind').value=data.kind||'none';theme.value=data.theme||'god';dialog.querySelector('#whdcVerseNote').value=data.note||'';dialog.querySelector('#whdcVerseStatus').textContent='';dialog.showModal()}
function commit(clear=false){if(!selected)return;const id=ref(selected),all=read();if(clear)delete all[id];else{const kind=dialog.querySelector('#whdcVerseKind').value,themeValue=theme.value,note=dialog.querySelector('#whdcVerseNote').value.trim();if(kind==='none'&&!note)delete all[id];else all[id]={kind,theme:themeValue,note}}if(save(all)){dialog.close();apply()}else dialog.querySelector('#whdcVerseStatus').textContent='Unable to save on this device.'}
dialog.querySelector('#whdcVerseSave').onclick=()=>commit();dialog.querySelector('#whdcVerseRemove').onclick=()=>commit(true);
dialog.querySelector('#whdcVerseFavorite').onclick=()=>{if(!selected)return;const id=ref(selected);const sup=selected.querySelector('sup.verse');const clone=selected.cloneNode(true);clone.querySelectorAll('sup.verse,.chapter,.whdc-verse-study-note').forEach(x=>x.remove());const text=clone.textContent.trim();const reference=sup?.title||id;try{const favorites=JSON.parse(localStorage.getItem(FAV)||'[]');const item={id:reference.toLowerCase(),reference,text,paragraphs:[text],source:'bible',createdAt:new Date().toISOString()};const i=favorites.findIndex(x=>x.id===item.id);if(i>=0)favorites[i]=item;else favorites.push(item);localStorage.setItem(FAV,JSON.stringify(favorites));dialog.querySelector('#whdcVerseStatus').textContent='Verse saved to Favorites.'}catch{dialog.querySelector('#whdcVerseStatus').textContent='Unable to save favorite.'}};
// Search results receive a Study button; chapter annotations also follow the verse.
const observer=new MutationObserver(()=>{if(!root.querySelector('.scripture'))return;observer.disconnect();apply();observer.observe(root,{childList:true,subtree:false})});observer.observe(root,{childList:true,subtree:false});apply();
})();
