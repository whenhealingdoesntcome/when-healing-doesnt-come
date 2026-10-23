/* WHDC reading continuity. Positions remain on this device. */
(()=>{'use strict';
const KEY='whdc-resume-reading-v1',LAST='whdc-last-topic-devotional-v1';
const bible=location.pathname.includes('bible-reader');
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const write=(key,value)=>{try{const all=read();all[key]=value;localStorage.setItem(KEY,JSON.stringify(all))}catch{}};
const devotionalId=()=>document.querySelector('#todayPickSection[data-whdc-devotional-id]')?.getAttribute('data-whdc-devotional-id')||null;
const current=()=>bible?(document.getElementById('book')?.value?'bible:'+document.getElementById('book').value:null):(devotionalId()?'devotional:'+devotionalId():null);
let active=null,readyAt=0,lastSave=0,restoring=false,bar=null,observer=null;
function storePosition(force=false){if(restoring||!active||(!force&&Date.now()-lastSave<600))return;const y=Math.max(0,scrollY);if(y<65&&!force)return;lastSave=Date.now();const chapter=bible?document.getElementById('chapter')?.value:null;write(active,{y,chapter,at:Date.now()});}
function moveTo(y){restoring=true;const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);window.scrollTo({top:Math.min(Math.max(0,y),max),behavior:'instant'});setTimeout(()=>{restoring=false},350)}
function restore(key){if(bible){const p=new URLSearchParams(location.search);if(p.has('references')||p.has('search')||p.has('q'))return;}const entry=read()[key];if(!entry||entry.y<65||Date.now()-entry.at>60*86400000)return;moveTo(entry.y)}
function removeBar(){bar?.remove();bar=null}
function topicReturn(){if(bible)return;removeBar();if(devotionalId())return;let saved;try{saved=JSON.parse(sessionStorage.getItem(LAST)||'null')}catch{};if(!saved?.id||!saved?.title)return;
 const el=document.createElement('aside');el.className='whdc-resume-return';el.setAttribute('aria-label','Continue previous devotional');
 const button=document.createElement('button');button.type='button';button.className='whdc-resume-return-button';button.textContent='Continue reading: '+saved.title;button.setAttribute('aria-label','Return to '+saved.title+' at your saved reading position');button.addEventListener('click',()=>{location.hash='#devotional/'+encodeURIComponent(saved.id)});
 const close=document.createElement('button');close.type='button';close.className='whdc-resume-return-close';close.textContent='×';close.setAttribute('aria-label','Dismiss continue reading suggestion');close.addEventListener('click',()=>{sessionStorage.removeItem(LAST);removeBar()});el.append(button,close);document.body.appendChild(el);bar=el;
}
function track(){const key=current();if(key===active)return;active=key;readyAt=Date.now();removeBar();if(!key){topicReturn();return}
 if(!bible){const id=devotionalId();const title=document.querySelector('#todayPickSection h1, #todayPickSection h2, #todayPickSection h3')?.textContent?.trim()||'Your devotional';if(location.hash.startsWith('#devotional/')){try{sessionStorage.setItem(LAST,JSON.stringify({id,title}))}catch{}}}
 const captured=key;const delay=bible?550:180;setTimeout(()=>{if(current()===captured)restore(captured)},delay);
}
function bibleChapterChanged(){if(!bible||!active)return;const key=current();if(key!==active){track();return}const saved=read()[key];const ch=document.getElementById('chapter')?.value;if(saved&&String(saved.chapter)!==String(ch)){write(key,{y:0,chapter:ch,at:Date.now()})}}
function start(){const root=document.getElementById(bible?'reading':'app');if(!root)return;observer=new MutationObserver(()=>{if(bible){track()}else{track();if(!current()&&!bar)topicReturn()}});observer.observe(root,{childList:true,subtree:!bible});track();if(bible){const book=document.getElementById('book');book?.addEventListener('change',()=>{storePosition(true);active=null});document.getElementById('chapter')?.addEventListener('change',()=>{storePosition(true);setTimeout(bibleChapterChanged,150)});}
 if(!bible)document.addEventListener('click',e=>{if(active&&e.target.closest('a,button,[data-nav],[data-open]'))storePosition(true)},true);window.addEventListener('scroll',()=>{if(Date.now()-readyAt>650)storePosition()},{passive:true});window.addEventListener('pagehide',()=>storePosition(true));window.addEventListener('hashchange',()=>setTimeout(track,100));
 if(bible){const params=new URLSearchParams(location.search);const explicit=params.has('book')||params.has('chapter')||params.has('references')||params.has('search')||params.has('q');if(explicit)return;const savedBook=(()=>{try{return localStorage.getItem('whdc-bible-book')}catch{return null}})();const entry=savedBook&&read()['bible:'+savedBook];if(entry?.chapter){try{localStorage.setItem('whdc-bible-chapter',String(entry.chapter))}catch{}}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
