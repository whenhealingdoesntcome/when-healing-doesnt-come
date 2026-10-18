
(()=>{'use strict';
const root=document.getElementById('trip-reports-list');if(!root)return;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
async function load(){
 try{
 const res=await fetch('/api/trip-reports');if(!res.ok)throw new Error('Unable to load trip reports');
 const reports=await res.json();root.replaceChildren();root.className='trip-reports-list';
 if(!reports.length){root.append(el('p','trip-report-empty','Trip reports will appear here as teams share their stories.'));return;}
 for(const report of reports){
  const card=el('article','trip-report');
  const images=Array.isArray(report.image_urls)?report.image_urls:[];let slide=0;
  if(images.length){
   const banner=el('div','trip-report-banner');const img=el('img');img.alt=`${report.title} trip photo 1`;img.loading='lazy';img.src=images[0];banner.append(img);
   const count=el('span','trip-report-count');
   const show=()=>{img.src=images[slide];img.alt=`${report.title} trip photo ${slide+1}`;count.textContent=`${slide+1} / ${images.length}`;};
   show();banner.append(count);
   if(images.length>1){
    const prev=el('button','prev','‹'),next=el('button','next','›');
    prev.type=next.type='button';prev.setAttribute('aria-label',`Previous photo for ${report.title}`);next.setAttribute('aria-label',`Next photo for ${report.title}`);
    prev.onclick=()=>{slide=(slide-1+images.length)%images.length;show();};next.onclick=()=>{slide=(slide+1)%images.length;show();};banner.append(prev,next);
    let paused=false;banner.addEventListener('mouseenter',()=>paused=true);banner.addEventListener('mouseleave',()=>paused=false);
    banner.addEventListener('focusin',()=>paused=true);banner.addEventListener('focusout',()=>paused=false);
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const timer=setInterval(()=>{if(!document.hidden&&!paused&&banner.isConnected){slide=(slide+1)%images.length;show();}if(!banner.isConnected)clearInterval(timer);},5500);
    }
   }
   card.append(banner);
  }
  const content=el('div','trip-report-content');content.append(el('h3','',report.title));
  const meta=[report.location,report.trip_date].filter(Boolean).join(' · ');if(meta)content.append(el('p','trip-meta',meta));
  content.append(el('p','trip-report-description',report.description));
  const quotes=(report.quotes||[]).filter(q=>q&&q.text);
  if(quotes.length){const wrap=el('div','trip-quotes');for(const q of quotes){const block=el('blockquote','trip-quote');block.append(el('p','',`“${q.text}”`));if(q.name)block.append(el('cite','',`— ${q.name}`));wrap.append(block);}content.append(wrap);}
  card.append(content);root.append(card);
 }
 }catch(e){root.replaceChildren(el('p','trip-report-empty','Trip reports are temporarily unavailable.'));}
}
load();
})();
