(()=>{'use strict';
const root=document.getElementById('daily-content');
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const array=v=>Array.isArray(v)?v:[];
function section(parent,title,values){if(!array(values).length)return;const s=el('section','daily-section');s.append(el('h3','',title));const ul=el('ul');for(const v of values){if(typeof v==='string'&&v.trim())ul.append(el('li','',v));}if(ul.childElementCount){s.append(ul);parent.append(s);}}
// 365 distinct, curated Scripture references. The verse text is retrieved in
// the World English Bible (WEB), rather than reusing the old KJV wording.
// Scripture is served only from this website. No third-party requests in visitors' browsers.
async function renderDailyVerse(date){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')) return;
  const wrapper=document.getElementById('verse-of-the-day');
  const textNode=document.getElementById('daily-verse-text');
  const referenceNode=document.getElementById('daily-verse-reference');
  wrapper.hidden=false;
  try{
    const response=await fetch('/daily-verses.json',{cache:'force-cache'});
    if(!response.ok)throw Error('Local Scripture file missing');
    const verses=await response.json();
    if(!Array.isArray(verses)||verses.length!==365)throw Error('Incomplete Scripture collection');
    const dayNumber=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
    const verse=verses[((dayNumber%365)+365)%365];
    if(!verse||!verse.reference||!verse.text)throw Error('Incomplete Scripture');
    textNode.textContent='“'+verse.text+'”';
    referenceNode.textContent=verse.reference+' · WEB';
  }catch(e){
    textNode.textContent='Today’s Scripture is temporarily unavailable.';
    referenceNode.textContent='';
  }
}

async function load(){try{const r=await fetch('/api/ministry-of-the-day',{cache:'no-store'});if(!r.ok)throw Error('Unavailable');const data=await r.json();root.replaceChildren();
const date=data.date;if(date){const [y,m,d]=date.split('-').map(Number);document.getElementById('daily-date').textContent=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,d)));}
renderDailyVerse(date);
const m=data.ministry;if(!m){root.append(el('p','daily-loading','There are no published ministries yet. Please check back soon.'));return;}
const card=el('article','daily-card daily-detail-card');
const photos=array(m.image_urls).filter(u=>typeof u==='string'&&(u.startsWith('/api/photos/')||/^https?:\/\//.test(u)));
const inner=el('div','daily-detail-inner');
const top=el('div','detail-top');
top.append(el('p','eyebrow dark',`${String(m.category||'').toUpperCase()} MISSIONS${m.manna_sent?' · MANNA SENT':''}`),el('h2','',m.name));
if(m.security_notice)top.append(el('p','security-notice',m.security_notice));if(m.location)top.append(el('p','detail-location',m.location));

if(true){const gallery=el('div','detail-gallery');(photos.length&&!m.security_notice?photos:['/noimage_prayercard.jpg']).forEach((url,i)=>{const img=el('img');img.src=url;img.alt=`${m.name} photo ${i+1}`;img.loading=i===0?'eager':'lazy';gallery.append(img);});inner.append(gallery);
inner.append(top);}
if(m.mission_statement){const statement=el('section','mission-statement');statement.append(el('p','eyebrow dark','OUR MISSION'),el('p','',m.mission_statement));inner.append(statement);}
if(m.description){const s=el('section','detail-section');s.append(el('h3','','About this ministry'),el('p','preline',m.description));inner.append(s);}
function detailEntries(title,values){if(!array(values).length)return;const s=el('section','detail-section');s.append(el('h3','',title));const ul=el('ul','detail-list');for(const v of values){if(typeof v==='string'&&v.trim())ul.append(el('li','',v));}if(ul.childElementCount){s.append(ul);inner.append(s);}}
detailEntries('How to pray',m.prayer_requests);
detailEntries('Praise reports',m.praise_reports);
if(m.website_url){try{const u=new URL(m.website_url);if(['http:','https:'].includes(u.protocol)){const a=el('a','detail-link','Visit ministry website');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';inner.append(a);}}catch{}}
// Daily Prayer only: count a browser once per ministry per Colorado day.
const prayer=el('section','daily-prayer-action');
const btn=el('button','daily-prayed-button','I Prayed for This Ministry');btn.type='button';
const count=el('p','daily-prayer-count','Loading prayer count…');
prayer.append(btn,count);inner.append(prayer);
const storageKey=`manna-prayer-${date}-${m.id}`;
let token='';try{token=localStorage.getItem('manna-prayer-browser-token')||'';if(!token){token=crypto.randomUUID();localStorage.setItem('manna-prayer-browser-token',token);}}catch{token=crypto.randomUUID();}
let already=false;try{already=localStorage.getItem(storageKey)==='yes';}catch{}
if(already){btn.disabled=true;btn.textContent='Thank You for Praying';}
const showCount=n=>{count.textContent=`${n} ${n===1?'person has':'people have'} prayed for this ministry today`;};
fetch('/api/daily-prayer-count',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(v=>{if(v.date===date)showCount(v.count);}).catch(()=>{count.textContent='Prayer count unavailable';});
btn.onclick=async()=>{btn.disabled=true;try{const r=await fetch('/api/daily-prayer-count',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token})});const v=await r.json();if(!r.ok||v.date!==date)throw Error(v.error||'Please reload the page');showCount(v.count);btn.textContent='Thank You for Praying';try{localStorage.setItem(storageKey,'yes');}catch{}}catch(err){btn.disabled=false;count.textContent=err.message||'Could not record your prayer. Please try again.';}};
card.append(inner);root.append(card);
}catch{root.replaceChildren(el('p','daily-loading','Today’s ministry could not be loaded. Please try again later.'));}}
load();})();
