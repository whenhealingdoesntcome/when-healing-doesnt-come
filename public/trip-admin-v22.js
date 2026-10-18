
(()=>{'use strict';
const $=s=>document.querySelector(s),form=$('#trip-editor'),list=$('#trip-list'),message=$('#trip-message');
let items=[],photos=[];
const notice=t=>message.textContent=t;
const selected=()=>items.find(x=>x.id===form.elements.id.value);
async function api(path,opts={}){
 const r=await fetch(path,{...opts,headers:{'content-type':'application/json',...(opts.headers||{})}});
 const d=await r.json();if(!r.ok)throw new Error(d.error||`Request failed: ${r.status}`);return d;
}
function renderPhotos(){
 const root=$('#trip-photos');root.replaceChildren();
 photos.forEach((url,i)=>{
  const wrap=document.createElement('div');wrap.className='photo';
  const img=document.createElement('img');img.src=url;img.alt=`Trip photo ${i+1}`;
  const buttons=document.createElement('div');
  for(const [label,step] of [['←',-1],['→',1]]){
   const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=i+step<0||i+step>=photos.length;
   b.onclick=()=>{[photos[i],photos[i+step]]=[photos[i+step],photos[i]];renderPhotos();};buttons.append(b);
  }
  const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';
  remove.onclick=()=>{photos.splice(i,1);renderPhotos();};buttons.append(remove);
  wrap.append(img,buttons);root.append(wrap);
 });
}
function show(item){
 form.reset();form.elements.id.value=item?.id||'';
 for(const k of ['title','location','trip_date','description'])form.elements[k].value=item?.[k]||'';
 (item?.quotes||[]).forEach((q,i)=>{form.elements[`quote${i+1}`].value=q.text;form.elements[`name${i+1}`].value=q.name;});
 photos=item?.image_urls?.slice()||[];renderPhotos();
 $('#trip-upload').disabled=!item;$('#trip-publish').disabled=!item||item.status==='published';
 $('#trip-unpublish').disabled=!item||item.status!=='published';$('#trip-delete').disabled=!item;
 $('#trip-status').textContent=item?`${item.status.toUpperCase()} · Last updated ${item.updated_at}`:'New trip · Draft';
}
function render(){list.replaceChildren();for(const item of items){
 const b=document.createElement('button');b.type='button';b.className='item';b.textContent=`${item.title} · ${item.status}`;b.onclick=()=>show(item);list.append(b);
}}
async function refresh(id){items=await api('/api/admin/trip-reports');render();show(items.find(x=>x.id===id)||null);}
$('#trip-new').onclick=()=>show(null);
form.onsubmit=async e=>{
 e.preventDefault();
 const data={};for(const k of ['title','location','trip_date','description'])data[k]=form.elements[k].value;
 data.image_urls=photos.slice();data.quotes=[];
 for(let i=1;i<=3;i++){const text=form.elements[`quote${i}`].value.trim(),name=form.elements[`name${i}`].value.trim();if(text)data.quotes.push({text,name});}
 try{const id=form.elements.id.value;
 const r=await api(id?`/api/admin/trip-reports/${id}`:'/api/admin/trip-reports',{method:id?'PUT':'POST',body:JSON.stringify(data)});
 await refresh(id||r.id);notice('Saved. Publish separately when ready.');
 }catch(err){notice(err.message);}
};
async function change(action){
 const item=selected();if(!item)return;
 if(action==='publish'&&!confirm(`Publish “${item.title}” publicly, including all photos and quotes? Confirm that every team member has approved public sharing.`))return;
 try{await api(`/api/admin/trip-reports/${item.id}/${action}`,{method:'POST'});await refresh(item.id);notice(action==='publish'?'Published.':'Returned to private draft.');}catch(err){notice(err.message);}
}
$('#trip-publish').onclick=()=>change('publish');$('#trip-unpublish').onclick=()=>change('unpublish');
$('#trip-upload').onchange=async e=>{
 const id=form.elements.id.value;if(!id){notice('Save the report before uploading photos.');return;}
 const files=[...e.target.files];
 try{for(const file of files){
 if(file.size>8*1024*1024)throw new Error(`${file.name} exceeds 8 MB`);
 notice(`Uploading ${file.name}…`);
 const data=new FormData();data.append('photo',file);
 const r=await fetch(`/api/admin/trip-reports/${id}/photos`,{method:'POST',body:data});
 const result=await r.json();if(!r.ok)throw new Error(result.error||'Upload failed');
 }await refresh(id);notice(`${files.length} photo(s) uploaded. Reorder and save if desired.`);
 }catch(err){await refresh(id);notice(err.message);}finally{e.target.value='';}
};
$('#trip-delete').onclick=async()=>{
 const item=selected();if(!item)return;
 if(!confirm(`Permanently delete “${item.title}” and its uploaded photos?`))return;
 const typed=prompt(`Type the exact trip title to confirm deletion:\n${item.title}`);
 if(typed!==item.title)return notice('Deletion canceled.');
 try{const r=await api(`/api/admin/trip-reports/${item.id}`,{method:'DELETE',body:JSON.stringify({confirm_title:typed,confirm_delete:true})});
 await refresh();notice('Trip report deleted.'+(r.photo_cleanup_incomplete?' Some photos may require manual cleanup.':''));}
 catch(err){notice(err.message);}
};
refresh().catch(err=>notice(err.message));
})();
