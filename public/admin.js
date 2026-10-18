const $ = s => document.querySelector(s);
const form=$('#editor'), list=$('#list'), message=$('#message');
let items=[];
let photos=[];
const fields=['manna_sent','hide_name','name','contact_email','category','location','mission_statement','description','website_url','prayer_requests','praise_reports','image_urls'];
const arrays=['prayer_requests','praise_reports','image_urls'];
function notice(text){message.textContent=text;}
function selected(){return items.find(x=>x.id===form.elements.id.value);}
function renderPhotos(){
 const root=$('#photos');root.replaceChildren();
 for(let i=0;i<photos.length;i++){
  const wrap=document.createElement('div');wrap.className='photo';
  const img=document.createElement('img');img.src=photos[i];img.alt=`Ministry photo ${i+1}`;img.loading='lazy';
  const controls=document.createElement('div');
  for(const [label,step] of [['←',-1],['→',1]]){
   const b=document.createElement('button');b.type='button';b.textContent=label;b.title='Move photo';b.disabled=i+step<0||i+step>=photos.length;
   b.onclick=()=>{[photos[i],photos[i+step]]=[photos[i+step],photos[i]];renderPhotos();};controls.append(b);
  }
  const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.onclick=()=>{photos.splice(i,1);renderPhotos();};controls.append(remove);
  wrap.append(img,controls);root.append(wrap);
 }
}
function show(item){form.reset();form.elements.id.value=item?.id||'';fields.forEach(k=>{if(k==='manna_sent'||k==='hide_name'){form.elements[k].checked=Boolean(item?.[k]);return;}if(k!=='image_urls')form.elements[k].value=item?(arrays.includes(k)?item[k].join('\n'):item[k]):(k==='category'?'local':'');});photos=item?.image_urls?.slice()||[];renderPhotos();const linkBox=$('#nfc-link-panel');if(linkBox){linkBox.hidden=!item;const link=$('#nfc-link');link.value=item?.slug?`${window.location.origin}/?ministry=${encodeURIComponent(item.slug)}`:'';const status=$('#nfc-link-status');status.textContent=item?.status==='published'?'Ready to share after moving to the church domain.':'Draft: link will work publicly only after publishing.';}
$('#photoUpload').disabled=!item;$('#publish').disabled=!item||item.status==='published';$('#unpublish').disabled=!item||item.status!=='published';$('#delete').disabled=!item;$('#status').textContent=item?`${item.status.toUpperCase()} · Last updated ${item.updated_at}`:'New ministry · Draft';}
function render(){list.replaceChildren();for(const item of items){const b=document.createElement('button');b.type='button';b.className='item';b.textContent=`${item.name} · ${item.status}`;b.onclick=()=>show(item);list.append(b);}}
async function api(path,options={}){const r=await fetch(path,{...options,headers:{'content-type':'application/json',...(options.headers||{})}});const d=await r.json();if(!r.ok)throw new Error(d.error||`Request failed (${r.status})`);return d;}
async function refresh(id){items=await api('/api/admin/ministries');render();show(items.find(x=>x.id===id)||null);}
$('#new').onclick=()=>show(null);
form.onsubmit=async e=>{e.preventDefault();try{const data={};for(const k of fields){const value=(k==='manna_sent'||k==='hide_name')?form.elements[k].checked:(k==='image_urls'?photos.join('\n'):form.elements[k].value);data[k]=arrays.includes(k)?value.split('\n').map(x=>x.trim()).filter(Boolean):value;}const id=form.elements.id.value;const result=await api(id?`/api/admin/ministries/${id}`:'/api/admin/ministries',{method:id?'PUT':'POST',body:JSON.stringify(data)});await refresh(id||result.id);notice('Saved. Publication status was not changed.'+(result.removed_photos?` Removed ${result.removed_photos} photo(s).`: '')+(result.photo_cleanup_incomplete?' Some files may need R2 cleanup.':''));}catch(err){notice(err.message);}};
async function change(action){const item=selected();if(!item)return;if(action==='publish'&&!confirm(`Publish ${item.name} to the public directory? ${item.hide_name?'The name and identifying fields will be hidden, but PRAYER REQUESTS and PRAISE REPORTS remain public. Check these for names, places and other clues.':'Confirm all content is safe to share.'}`))return;try{await api(`/api/admin/ministries/${item.id}/${action}`,{method:'POST'});await refresh(item.id);notice(action==='publish'?'Published successfully.':'Returned to private draft.');}catch(err){notice(err.message);}}
$('#publish').onclick=()=>change('publish');$('#unpublish').onclick=()=>change('unpublish');
refresh().catch(err=>notice(err.message));

$('#photoUpload').onchange=async e=>{
 const id=form.elements.id.value;
 if(!id){notice('Save the new ministry first, then upload photos.');return;}
 const files=[...e.target.files];
 try{
  for(const file of files){
   if(file.size>8*1024*1024)throw new Error(`${file.name} is over 8 MB`);
   notice(`Uploading ${file.name}…`);
   const body=new FormData();body.append('photo',file);
   const response=await fetch(`/api/admin/ministries/${id}/photos`,{method:'POST',body});
   const result=await response.json();if(!response.ok)throw new Error(result.error||'Upload failed');
  }
  await refresh(id);notice(`${files.length} photo(s) uploaded. You can reorder or remove photos, then save changes.`);
 }catch(err){await refresh(id);notice(err.message);}finally{e.target.value='';}
};

// Two-stage confirmation helps prevent accidental permanent deletion.
$('#delete').onclick=async()=>{
 const item=selected();
 if(!item)return;
 const first=confirm(`Permanently delete "${item.name}"?\\n\\nThis removes the ministry from the admin dashboard and public website. This cannot be undone.`);
 if(!first)return;
 const typed=prompt(`To confirm, type the exact ministry name:\\n${item.name}`);
 if(typed===null)return;
 if(typed!==item.name){notice('Deletion canceled: the ministry name did not match.');return;}
 const button=$('#delete');button.disabled=true;
 try{
   const result=await api(`/api/admin/ministries/${item.id}`,{
     method:'DELETE',
     body:JSON.stringify({confirm_name:typed,confirm_delete:true})
   });
   await refresh();
   notice(`Deleted "${item.name}".`+(result.photo_cleanup_incomplete?' Some stored photo cleanup may need attention in R2.':''));
 }catch(err){button.disabled=false;notice(`Could not delete: ${err.message}`);}
};

const copyNfc=$('#copy-nfc-link');if(copyNfc)copyNfc.onclick=async()=>{const value=$('#nfc-link').value;if(!value)return;try{await navigator.clipboard.writeText(value);notice('Direct prayer card link copied. Wait until the church-domain migration before programming NFC tags.');}catch{const input=$('#nfc-link');input.focus();input.select();notice('Select and copy the link shown in the field.');}};
