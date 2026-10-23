/* WHDC reading-position bookmarks. Device-only; no account or network. */
(()=>{'use strict';
const KEY='whdc-resume-reading-v1';
const bible=location.pathname.includes('bible-reader');
const area=()=>document.getElementById(bible?'reading':'app');
const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const put=(part,value)=>{try{const all=get();all[part]=value;localStorage.setItem(KEY,JSON.stringify(all))}catch{}};
const id=()=>{if(bible){const book=document.getElementById('book')?.value;return book?'bible:'+book:null}const match=decodeURIComponent(location.hash).match(/^#devotional\/([^/?]+)/);return match?'devotional:'+match[1]:null};
let lastId=null,lastY=0,lastSave=0,ready=false,notice=null,ignoreUntil=Date.now()+1300;
function dismiss(){notice?.remove();notice=null}
function save(){const key=id();if(!key||!area()||notice||Date.now()<ignoreUntil)return;const y=Math.max(0,window.scrollY);if(y<80)return;const now=Date.now();if(now-lastSave<1200)return;lastSave=now;put(key,{y,at:now,chapter:bible?document.getElementById('chapter')?.value:null})}
function offer(key){dismiss();const entry=get()[key];if(!entry||entry.y<120||Date.now()-entry.at>1000*60*60*24*60)return;
const bar=document.createElement('div');bar.className='whdc-resume-prompt';bar.setAttribute('role','group');bar.setAttribute('aria-label','Resume reading');
const label=document.createElement('span');label.textContent='Continue where you left off?';
const yes=document.createElement('button');yes.type='button';yes.textContent='Resume';yes.setAttribute('aria-label','Resume reading from saved position');
const no=document.createElement('button');no.type='button';no.textContent='Start here';no.setAttribute('aria-label','Dismiss saved reading position');
yes.addEventListener('click',()=>{dismiss();ignoreUntil=Date.now()+1800;window.scrollTo({top:Math.min(entry.y,Math.max(0,document.documentElement.scrollHeight-innerHeight)),behavior:'instant'});});
no.addEventListener('click',()=>{dismiss();ignoreUntil=Date.now()+1000;put(key,{y:0,at:Date.now()})});
bar.append(label,yes,no);document.body.appendChild(bar);notice=bar;
}
function update(){const key=id();if(!key){dismiss();lastId=null;return}if(key===lastId)return;lastId=key;dismiss();ignoreUntil=Date.now()+1100;setTimeout(()=>{if(id()===key&&area()?.querySelector(bible?'.scripture':'#listen'))offer(key)},bible?950:450)}
window.addEventListener('scroll',save,{passive:true});
window.addEventListener('pagehide',()=>{if(!notice&&id()&&window.scrollY>80)put(id(),{y:window.scrollY,at:Date.now(),chapter:bible?document.getElementById('chapter')?.value:null})});
window.addEventListener('hashchange',update);
const observer=new MutationObserver(()=>{if(!ready){ready=true;update()}else update()});
function start(){if(area())observer.observe(area(),{childList:true,subtree:false});update();if(bible){document.getElementById('book')?.addEventListener('change',()=>{lastId=null;dismiss()});document.getElementById('chapter')?.addEventListener('change',()=>{ignoreUntil=Date.now()+1500;dismiss()});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
