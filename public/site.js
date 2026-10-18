const categories=[{id:'local',label:'Local Missions',sub:'IN OUR COMMUNITY',description:'Serving our neighbors and sharing the hope of Christ close to home.'},{id:'national',label:'National Missions',sub:'ACROSS OUR NATION',description:'Supporting ministries and church planting efforts throughout the United States.'},{id:'international',label:'International Missions',sub:'AROUND THE WORLD',description:'Joining in prayer for ministry partners serving across the globe.'}];
const directory=document.getElementById('directory-sections');
const dialog=document.getElementById('ministry-dialog');
const detail=document.getElementById('dialog-content');
const ministryLink=slug=>{const url=new URL(window.location.href);url.searchParams.set('ministry',slug);url.hash='';return url.toString();};
const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const parseArray=value=>{if(Array.isArray(value))return value;if(typeof value==='string'){try{const result=JSON.parse(value);return Array.isArray(result)?result:[]}catch{return []}}return []};
const safePhotos=m=>Array.isArray(m.image_urls)?m.image_urls.filter(u=>typeof u==='string'&&(/^https?:\/\//i.test(u)||u.startsWith('/api/photos/'))):[];
const entries=(parent,title,values)=>{if(!Array.isArray(values)||!values.length)return;const section=make('section','detail-section');section.append(make('h3','',title));const list=make('ul','detail-list');values.forEach(v=>{if(typeof v==='string'&&v.trim())list.append(make('li','',v));});if(list.childNodes.length){section.append(list);parent.append(section);}};
function openMinistry(m){detail.replaceChildren();const photos=safePhotos(m);const top=make('div','detail-top');top.append(make('p','eyebrow dark',`${m.category.toUpperCase()} MISSIONS${m.manna_sent?' · MANNA SENT':''}`),make('h2','',m.name));if(m.security_notice)top.append(make('p','security-notice',m.security_notice));if(m.location)top.append(make('p','detail-location',m.location));
if(true){const gallery=make('div','detail-gallery');(photos.length&&!m.security_notice?photos:['/noimage_prayercard.jpg']).forEach((url,i)=>{const img=make('img');img.src=url;img.alt=`${m.name} photo ${i+1}`;img.loading=i===0?'eager':'lazy';gallery.append(img);});detail.append(gallery);
detail.append(top);}
if(m.mission_statement){const statement=make('section','mission-statement');statement.append(make('p','eyebrow dark','OUR MISSION'),make('p','',m.mission_statement));detail.append(statement);}
if(m.description){const description=make('section','detail-section');description.append(make('h3','','About this ministry'));const p=make('p','preline',m.description);description.append(p);detail.append(description);}
entries(detail,'Praise reports',m.praise_reports);entries(detail,'How to pray',m.prayer_requests);
if(m.website_url){try{const url=new URL(m.website_url);if(['https:','http:'].includes(url.protocol)){const link=make('a','detail-link','Visit ministry website ↗');link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';detail.append(link);}}catch{}}
dialog.showModal();document.body.classList.add('modal-open');}
let allMinistries=[];
let activeCategory='local';
const isMannaSent=m=>m.manna_sent===true||m.manna_sent===1||m.manna_sent==='1';
const filterControls=document.querySelectorAll('[data-category-filter]');
function selectCategory(category,scroll=false){
  if(!['local','national','international','manna-sent'].includes(category))return;
  activeCategory=category;
  filterControls.forEach(control=>{
    const active=control.dataset.categoryFilter===category;
    control.classList.toggle('is-active',active);
    if(control.tagName==='BUTTON')control.setAttribute('aria-pressed',String(active));
    else if(active)control.setAttribute('aria-current','true');
    else control.removeAttribute('aria-current');
  });
  render(allMinistries,false);
  if(scroll)document.getElementById('ministry-partners').scrollIntoView({behavior:'smooth',block:'start'});
}
filterControls.forEach(control=>control.addEventListener('click',event=>{
  event.preventDefault();
  selectCategory(control.dataset.categoryFilter,true);
}));
function render(ministries,handleDeepLink=true){directory.replaceChildren();const shown=activeCategory==='manna-sent'?ministries.filter(isMannaSent):ministries.filter(m=>m.category===activeCategory);
if(activeCategory==='manna-sent'&&!shown.length){directory.append(make('p','loading','No Manna Sent ministry partners are currently listed.'));return;}
categories.filter(cat=>activeCategory==='manna-sent'||cat.id===activeCategory).forEach(cat=>{const group=shown.filter(m=>m.category===cat.id);
if(activeCategory==='manna-sent'&&!group.length)return;const section=make('section','category-section');section.id=cat.id;section.setAttribute('aria-labelledby',`${cat.id}-heading`);const head=make('div','section-heading');const left=make('div','section-heading-left');left.append(make('h2','category-display-heading',activeCategory==='manna-sent'?'FROM OUR FAMILY TO THE FIELD':cat.sub),make('p','section-description',activeCategory==='manna-sent'?'Meet the missionaries sent out from our Manna Church family to share the hope of Christ, serve others, and make disciples around the world.':cat.description));head.append(left);section.append(head);
if(group.length){const grid=make('div','card-grid');group.forEach(m=>{const card=make('article','ministry-card');const photos=safePhotos(m);const image=make('div','card-image');if(true){const img=make('img');img.src=photos.length&&!m.security_notice?photos[0]:'/noimage_prayercard.jpg';img.alt=`${m.name} ministry photograph`;img.loading='lazy';image.append(img);}else{image.classList.add('image-placeholder');image.append(make('span','','✳'));}card.append(image);const body=make('div','card-body');body.append(make('p','card-category',`${cat.sub}${m.manna_sent?' · MANNA SENT':''}`),make('h3','',m.name));if(m.security_notice)body.append(make('p','security-notice',m.security_notice));if(m.location)body.append(make('p','card-location',m.location));if(m.mission_statement)body.append(make('p','card-excerpt',m.mission_statement));const btn=make('button','card-action','Read Prayer Card');btn.type='button';btn.setAttribute('aria-label',`Read prayer card for ${m.name}`);btn.addEventListener('click',()=>openMinistry(m));body.append(btn);card.append(body);grid.append(card);});section.append(grid);}else{const empty=make('div','empty-state');empty.append(make('p','','Ministry prayer cards are coming soon.'));section.append(empty);}directory.append(section);});
// Deep links use the existing, immutable ministry slug; no NFC tags are needed yet.
const slug=new URLSearchParams(window.location.search).get('ministry');
if(handleDeepLink&&slug){const match=ministries.find(m=>m.slug===slug);if(match){openMinistry(match);}else{const warning=make('p','loading','This prayer card is not currently available. Browse the published ministries below.');warning.setAttribute('role','status');directory.prepend(warning);}}
}
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');detail.replaceChildren();});
fetch('/api/ministries',{cache:'no-store',headers:{'accept':'application/json'}}).then(r=>{if(!r.ok)throw Error('Directory unavailable');return r.json();}).then(data=>{const items=Array.isArray(data)?data:(Array.isArray(data.ministries)?data.ministries:(Array.isArray(data.results)?data.results:null));if(!items)throw Error('Unexpected response');allMinistries=items.map(m=>({...m,category:String(m.category||'').toLowerCase().trim(),image_urls:parseArray(m.image_urls),prayer_requests:parseArray(m.prayer_requests),praise_reports:parseArray(m.praise_reports)}));filterControls.forEach(control=>{const active=control.dataset.categoryFilter===activeCategory;control.classList.toggle('is-active',active);if(control.tagName==='BUTTON')control.setAttribute('aria-pressed',String(active));});render(allMinistries);}).catch(()=>{directory.replaceChildren();const p=make('p','loading error-message','The ministry directory is temporarily unavailable. Please try again later.');p.setAttribute('role','alert');directory.append(p);});
