if(new URLSearchParams(location.search).has('embedded')){document.documentElement.classList.add('whdc-embedded-resource-admin');const style=document.createElement('style');style.textContent='body>header,.whdc-tool-header{display:none!important}body{margin:0!important;padding:4px!important}h1{display:none!important}';document.head.appendChild(style)}
(()=>{'use strict';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=[],editing='',busy=false;
const form=$('#editor'),notice=$('#notice'),panel=$('#resourceEditorPanel');
const fields=['type','title','creator','description','content','url','image_url','topics','sort_order','featured','published'];
async function api(method,body){const r=await fetch('/api/admin/resources',{method,cache:'no-store',credentials:'same-origin',headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const j=await r.json();if(!r.ok)throw Error(j.error||'Request failed');return j}
function mode(){const isArticle=form.elements.type.value==='article';form.querySelector('.article-only').hidden=!isArticle;form.elements.url.required=!isArticle}
function reset(open=true){editing='';form.reset();$('#editHeading').textContent='Add Resource';mode();panel.open=open;if(open)panel.scrollIntoView({block:'nearest'})}
function edit(id){const r=records.find(x=>x.id===id);if(!r)return;editing=id;for(const key of fields){const el=form.elements[key];if(!el)continue;if(el.type==='checkbox')el.checked=!!r[key];else el.value=key==='topics'?(Array.isArray(r.topics)?r.topics.join(', '):r.topics||''):r[key]??''}$('#editHeading').textContent='Edit: '+r.title;mode();panel.open=true;panel.scrollIntoView({block:'start',behavior:'smooth'})}
function render(){const q=$('#resourceSearch').value.trim().toLowerCase(),type=$('#resourceTypeFilter').value,status=$('#resourceStatusFilter').value,sort=$('#resourceSort').value;
let shown=records.filter(r=>(type==='all'||r.type===type)&&(status==='all'||(status==='published')===!!r.published)&&(!q||[r.title,r.creator,r.description,...(Array.isArray(r.topics)?r.topics:[])].join(' ').toLowerCase().includes(q)));
shown.sort((a,b)=>sort==='order'?(Number(a.sort_order||0)-Number(b.sort_order||0))||String(a.title).localeCompare(String(b.title)):sort==='type'?String(a.type).localeCompare(String(b.type))||String(a.title).localeCompare(String(b.title)):sort==='title-desc'?String(b.title).localeCompare(String(a.title)):String(a.title).localeCompare(String(b.title)));
$('#resourceCount').textContent=`Showing ${shown.length} of ${records.length} resources`;
$('#list').innerHTML=shown.map(r=>'<div class="item"><span><button type="button" class="resource-title" data-edit="'+esc(r.id)+'">'+esc(r.title)+'</button><span class="resource-meta">'+esc(r.type.charAt(0).toUpperCase()+r.type.slice(1))+' · <span class="resource-status '+(r.published?'':'draft')+'">'+(r.published?'Published':'Draft')+'</span></span></span><span class="resource-actions"><button type="button" data-edit="'+esc(r.id)+'">Edit</button><button type="button" data-delete="'+esc(r.id)+'">Delete</button></span></div>').join('')||'<p>No matching resources.</p>';
$('#list').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>edit(b.dataset.edit)));
$('#list').querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',async()=>{const id=b.dataset.delete;if(!confirm('Delete this resource permanently?'))return;try{await api('DELETE',{id});if(editing===id)reset(false);await refresh();notice.textContent='Resource deleted.'}catch(e){notice.textContent=e.message}}));
}
async function refresh(){records=await api('GET');render()}
async function save(published){if(busy)return;const b=Object.fromEntries(fields.map(k=>[k,form.elements[k]?.type==='checkbox'?form.elements[k].checked:form.elements[k]?.value||'']));b.topics=b.topics.split(',').map(x=>x.trim()).filter(Boolean);b.published=published;b.id=editing||b.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);if(!b.id){notice.textContent='Please enter a valid title';return}busy=true;try{await api('POST',b);editing=b.id;$('#editHeading').textContent='Edit: '+b.title;form.elements.published.checked=published;notice.textContent=(published?'Published ':'Saved draft: ')+b.title+'. You can continue editing.';await refresh();panel.open=true}catch(err){notice.textContent=err.message}finally{busy=false}}
form.elements.type.onchange=mode;
form.onsubmit=e=>{e.preventDefault();save(false)};
$('#savePublish').onclick=()=>{if(!form.reportValidity())return;save(true)};
$('#reset').onclick=()=>reset(true);
$('#closeResourceEditor').onclick=()=>{panel.open=false};
['resourceSearch','resourceTypeFilter','resourceStatusFilter','resourceSort'].forEach(id=>$('#'+id).addEventListener(id==='resourceSearch'?'input':'change',render));
mode();refresh().catch(e=>notice.textContent=e.message);
})();
