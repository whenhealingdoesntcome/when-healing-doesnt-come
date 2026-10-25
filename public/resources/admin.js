function whdcTableRow(line){
 if(!/^\s*\|/.test(line)||! /\|\s*$/.test(line))return null;
 return line.trim().slice(1,-1).split(/(?<!\\)\|/).map(s=>s.trim().replace(/\\\|/g,'|'));
}
function whdcTableSeparator(line){const cells=whdcTableRow(line);return !!cells&&cells.length>1&&cells.every(s=>/^:?-{3,}:?$/.test(s));}
function whdcRenderTable(lines,inline){const heads=whdcTableRow(lines[0]);if(!heads||!whdcTableSeparator(lines[1]))return '';
 const cells=(values,tag)=>'<tr>'+heads.map((_,i)=>'<'+tag+'>'+inline(values[i]||'')+'</'+tag+'>').join('')+'</tr>';
 return '<div class="whdc-table-scroll" tabindex="0" role="region" aria-label="Scrollable article table"><table class="whdc-article-table"><thead>'+cells(heads,'th')+'</thead><tbody>'+lines.slice(2).map(line=>cells(whdcTableRow(line)||[],'td')).join('')+'</tbody></table></div>';
}
if(!document.querySelector('link[data-whdc-resource-table-style]')){const style=document.createElement('link');style.rel='stylesheet';style.href='/resources/resources.css?v=20261024-resource-mobile-fix';style.dataset.whdcResourceTableStyle='1';document.head.append(style)}
if(new URLSearchParams(location.search).has('embedded')){document.documentElement.classList.add('whdc-embedded-resource-admin')}
(()=>{'use strict';
function enablePopupFormatting(root){
 const fields=root.querySelectorAll('textarea[name="short"],textarea[name="deeper"],textarea[name="reflection"],textarea[name="content"],textarea[name="description"],textarea[name="note"],textarea[name="notes"],textarea[name="review_note"],textarea[name="admin_feedback"],textarea[name="editor_notes"],textarea[name="writer_notes"]');
 fields.forEach(el=>{
  if(el.dataset.richReady||el.readOnly||el.disabled)return;el.dataset.richReady='1';
  const toolbar=document.createElement('div');toolbar.className='whdc-rich-toolbar';toolbar.setAttribute('role','toolbar');toolbar.setAttribute('aria-label','Text formatting');
  const controls=[['B','bold'],['I','italic'],['H2','heading'],['•','bullets'],['1.','numbers'],['Link','link'],['Table','table'],['Preview','preview']];
  const tableControls=[['+ Row','add-row'],['+ Column','add-column'],['Remove row','remove-row'],['Remove column','remove-column']];
  const preview=document.createElement('div');preview.className='whdc-rich-preview';preview.hidden=true;
  const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=s=>escapeHtml(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,(_,label,url)=>'<a target="_blank" rel="noopener noreferrer" href="'+url+'">'+label+'</a>').replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
  const updatePreview=()=>{let html='',list='';const close=()=>{if(list){html+='</'+list+'>';list=''}};const lines=el.value.split('\n');for(let i=0;i<lines.length;i++){const line=lines[i];if(i+1<lines.length&&whdcTableRow(line)&&whdcTableSeparator(lines[i+1])){close();const rows=[line,lines[++i]];while(i+1<lines.length&&whdcTableRow(lines[i+1]))rows.push(lines[++i]);html+=whdcRenderTable(rows,inline);continue}const h=line.match(/^#{1,3}\s+(.+)/),bul=line.match(/^\s*[-*]\s+(.+)/),num=line.match(/^\s*\d+\.\s+(.+)/);if(h){close();html+='<h3>'+inline(h[1])+'</h3>'}else if(bul||num){const tag=bul?'ul':'ol';if(list!==tag){close();html+='<'+tag+'>';list=tag}html+='<li>'+inline((bul||num)[1])+'</li>'}else{close();html+=line.trim()?'<p>'+inline(line)+'</p>':'<div style="height:.6em"></div>'}}close();preview.innerHTML=html||'<p>Nothing to preview yet.</p>'};
  const apply=action=>{
   if(action==='preview'){preview.hidden=!preview.hidden;if(!preview.hidden)updatePreview();return}
   let a=el.selectionStart,b=el.selectionEnd,selected=el.value.slice(a,b),replacement='';
   if(action==='table'){replacement='| Column 1 | Column 2 |\n|---|---|\n| Text | Text |';}
   else if(['add-row','add-column','remove-row','remove-column'].includes(action)){
    const lines=el.value.split('\n');const lineIndex=el.value.slice(0,a).split('\n').length-1;let start=lineIndex;
    while(start>=0&&!whdcTableSeparator(lines[start]))start--;
    if(start<1){window.alert('Place your cursor inside a Markdown table first.');return}
    start--;let end=start+2;while(end<lines.length&&whdcTableRow(lines[end]))end++;
    if(lineIndex<start||lineIndex>=end){window.alert('Place your cursor inside a Markdown table first.');return}
    const rows=lines.slice(start,end).map(whdcTableRow);const width=rows[0].length;
    if(action==='add-row')rows.push(Array(width).fill(''));
    if(action==='remove-row'){if(rows.length<=3){window.alert('Keep at least one data row.');return}rows.splice(Math.max(2,lineIndex-start),1)}
    if(action==='add-column')rows.forEach((r,i)=>r.push(i===1?'---':i===0?'New column':''));
    if(action==='remove-column'){if(width<=2){window.alert('Keep at least two columns.');return}rows.forEach(r=>r.pop())}
    const replacementRows=rows.map(r=>'| '+r.join(' | ')+' |').join('\n');
    a=lines.slice(0,start).join('\n').length+(start?1:0);b=a+lines.slice(start,end).join('\n').length;replacement=replacementRows;
   }
   else if(action==='bold'||action==='italic'){const mark=action==='bold'?'**':'*';replacement=mark+(selected||'text')+mark}
   else if(action==='link'){const url=window.prompt('Link URL (https://):');if(!url)return;try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol))throw Error()}catch{window.alert('Enter a valid http or https URL.');return}replacement='['+(selected||'link text')+']('+url+')'}
   else{a=el.value.lastIndexOf('\n',Math.max(0,a-1))+1;b=el.value.indexOf('\n',b);if(b<0)b=el.value.length;replacement=el.value.slice(a,b).split('\n').map((line,i)=>action==='heading'?'## '+line:action==='bullets'?'- '+line:(i+1)+'. '+line).join('\n')}
   el.setRangeText(replacement,a,b,'end');el.dispatchEvent(new Event('input',{bubbles:true}));el.focus();if(!preview.hidden)updatePreview()
  };
  for(const [label,action] of controls){const button=document.createElement('button');button.type='button';button.className='whdc-format-button';button.textContent=label;button.title=action==='bullets'?'Bulleted list':action==='numbers'?'Numbered list':action==='heading'?'Heading':action;button.setAttribute('aria-label',button.title);button.addEventListener('mousedown',e=>e.preventDefault());button.addEventListener('click',()=>apply(action));toolbar.append(button)}
  const menu=document.createElement('details');menu.className='whdc-table-tools';const summary=document.createElement('summary');summary.textContent='Edit table';menu.append(summary);const menuButtons=document.createElement('div');menuButtons.className='whdc-table-actions';for(const [label,action] of tableControls){const button=document.createElement('button');button.type='button';button.className='whdc-format-button';button.textContent=label;button.addEventListener('click',()=>apply(action));menuButtons.append(button)}menu.append(menuButtons);toolbar.append(menu);
  el.before(toolbar);el.after(preview);el.addEventListener('input',()=>{if(!preview.hidden)updatePreview()});el.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&['b','i'].includes(e.key.toLowerCase())){e.preventDefault();apply(e.key.toLowerCase()==='b'?'bold':'italic')}});
 });
}

const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=[],editing='',busy=false,selected=new Set(),previousFocus=null,activeStatus='all',localPreviewUrl=null,previewGeneration=0;
const form=$('#editor'),notice=$('#notice'),modal=$('#resourceModal');
// The resources dashboard is embedded in an iframe. Temporarily move that iframe
// to the parent document so the editor overlays the visible page, not just the tab.
// Do not reparent the live iframe: moving an iframe reloads its document on
// mobile Safari, losing the editor while leaving the dashboard backdrop visible.
// Render the editor in a dedicated overlay iframe in the parent document.
// Never resize or reparent the dashboard iframe: doing so breaks iOS Safari.
const editorParams=new URLSearchParams(location.search);
const isEditorWindow=editorParams.get('resourceEditor')==='1';
let editorOverlay=null;
function openEditorWindow(id){
 if(isEditorWindow||window.parent===window)return false;
 try{
  const doc=window.parent.document;
  const overlay=doc.createElement('div');
  overlay.setAttribute('data-whdc-resource-overlay','');
  Object.assign(overlay.style,{position:'fixed',inset:'0',zIndex:'2147483646',background:'rgba(24,30,29,.4)',display:'flex',alignItems:'center',justifyContent:'center'});
  const frame=doc.createElement('iframe');
  const url=new URL(location.href);
  url.searchParams.set('resourceEditor','1');
  if(id)url.searchParams.set('resourceEditId',id);
  else url.searchParams.delete('resourceEditId');
  frame.src=url.href;
  frame.title='Resource editor';
  Object.assign(frame.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',background:'transparent'});
  overlay.appendChild(frame);
  doc.body.appendChild(overlay);
  editorOverlay=overlay;
  return true;
 }catch(err){console.warn('Unable to open editor in parent document',err);return false}
}
function closeEditorWindow(){
 try{if(isEditorWindow){const overlay=window.frameElement?.closest('[data-whdc-resource-overlay]');overlay?.remove();window.parent.document.querySelectorAll('iframe').forEach(f=>{if(f!==window.frameElement)f.contentWindow?.postMessage({whdcResourceEditor:'saved'},'*')})}else editorOverlay?.remove()}catch(e){}
 editorOverlay=null;
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin)return;
 if(event.data?.whdcResourceEditor==='close'){editorOverlay?.remove();editorOverlay=null;refresh().catch(()=>{})}
 if(event.data?.whdcResourceEditor==='saved'){refresh().catch(()=>{})}
});
if(modal)enablePopupFormatting(modal);
const fields=['type','title','creator','description','content','url','image_url','image_position_x','image_position_y','topics','sort_order','featured','published'];
async function api(method,body){const r=await fetch('/api/admin/resources',{method,cache:'no-store',credentials:'same-origin',headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const j=await r.json();if(!r.ok)throw Error(j.error||'Request failed');return j}
function isYoutubeResource(url){try{const raw=String(url||'').trim();if(!raw)return false;const u=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw);const host=u.hostname.toLowerCase().replace(/^www\./,'');return host==='youtu.be'||host==='youtube.com'||host==='m.youtube.com'||host==='music.youtube.com'||host==='youtube-nocookie.com';}catch{return false;}}
function editorResourceType(r){return r.type==='website'&&isYoutubeResource(r.url)?'video':r.type;}
function mode(){form.querySelector('.article-only').hidden=form.elements.type.value!=='article';form.elements.url.required=['video','website','podcast'].includes(form.elements.type.value)}
function updateCrop(){const img=$('#imagePreview');const x=form.elements.image_position_x.value,y=form.elements.image_position_y.value;img.style.objectPosition=x+'% '+y+'%';$('#cropXValue').textContent=x+'%';$('#cropYValue').textContent=y+'%'}
for(const axis of ['image_position_x','image_position_y'])form.elements[axis].addEventListener('input',updateCrop);$('#resetImageCrop').onclick=()=>{form.elements.image_position_x.value=50;form.elements.image_position_y.value=50;updateCrop()};
function preview(url){updateCrop();const img=$('#imagePreview');img.hidden=!url;if(url)img.src=url;else img.removeAttribute('src');$('#removeResourceImage').hidden=!url}
function releaseLocalPreview(){localPreviewUrl=null;previewGeneration++}
async function localPreview(file){const generation=++previewGeneration;const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Unable to read the selected picture.'));reader.readAsDataURL(file)});if(generation!==previewGeneration)return;localPreviewUrl=dataUrl;preview(dataUrl)}
$('#imagePreview').addEventListener('error',()=>{const img=$('#imagePreview');if(img.src.startsWith('data:image/')){$('#uploadStatus').textContent='The selected image could not be previewed. Try another JPG, PNG, WebP or GIF.';return}if(localPreviewUrl){preview(localPreviewUrl);return}img.hidden=true;$('#uploadStatus').textContent='The saved image URL could not be loaded.'});
function show(){if(!isEditorWindow&&openEditorWindow(editing))return;previousFocus=document.activeElement;modal.hidden=false;document.body.classList.add('resource-editor-open');document.body.style.overflow='hidden';if(!matchMedia('(max-width: 600px)').matches)form.elements.title.focus()}
function close(){modal.hidden=true;document.body.classList.remove('resource-editor-open');document.body.style.overflow='';closeEditorWindow();previousFocus?.focus()}
function reset(){releaseLocalPreview();editing='';$('#deleteResource').hidden=true;form.reset();$('#resourceImageFile').value='';$('#editHeading').textContent='New Resource';$('#uploadStatus').textContent='JPG, PNG, WebP or GIF, up to 5 MB.';preview('');updateCrop();mode();show()}
function edit(id){releaseLocalPreview();$('#deleteResource').hidden=false;const r=records.find(x=>x.id===id);if(!r)return;editing=id;form.reset();for(const key of fields){const el=form.elements[key];if(!el)continue;if(el.type==='checkbox')el.checked=!!r[key];else el.value=key==='type'?editorResourceType(r):key==='topics'?(Array.isArray(r.topics)?r.topics.join(', '):r.topics||''):r[key]??''}$('#resourceImageFile').value='';$('#editHeading').textContent='Edit: '+r.title;preview(r.image_url);updateCrop();mode();show()}
function filtered(){const q=$('#resourceSearch').value.trim().toLowerCase(),type=$('#resourceTypeFilter').value,status=activeStatus,sort=$('#resourceSort').value;const shown=records.filter(r=>(type==='all'||editorResourceType(r)===type)&&(status==='all'||(status==='published')===!!r.published)&&(!q||[r.title,r.creator,r.description,...(Array.isArray(r.topics)?r.topics:[])].join(' ').toLowerCase().includes(q)));shown.sort((a,b)=>sort==='order'?(Number(a.sort_order||0)-Number(b.sort_order||0))||String(a.title).localeCompare(String(b.title)):sort==='type'?String(editorResourceType(a)).localeCompare(String(editorResourceType(b)))||String(a.title).localeCompare(String(b.title)):sort==='title-desc'?String(b.title).localeCompare(String(a.title)):String(a.title).localeCompare(String(b.title)));return shown}
function render(){for(const tab of document.querySelectorAll('[data-status-tab]')){const active=tab.dataset.statusTab===activeStatus;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active))}$('#draftCount').textContent='('+records.filter(r=>!r.published).length+')';$('#publishedCount').textContent='('+records.filter(r=>!!r.published).length+')';$('#allCount').textContent='('+records.length+')';const shown=filtered();$('#resourceCount').textContent=`Showing ${shown.length} of ${records.length} resources`;
$('#list').innerHTML=shown.map(r=>'<div class="item whdc-row"><input class="resource-check whdc-select" type="checkbox" aria-label="Select '+esc(r.title)+'" data-select="'+esc(r.id)+'" '+(selected.has(r.id)?'checked':'')+'><span class="resource-main whdc-row-body"><button type="button" class="resource-title" data-edit="'+esc(r.id)+'">'+esc(r.title)+'</button><span class="resource-meta">'+esc(editorResourceType(r).charAt(0).toUpperCase()+editorResourceType(r).slice(1))+' · '+(r.published?'Published':'Draft')+(r.featured?' · Featured':'')+'</span></span><span class="resource-actions whdc-row-actions"><button type="button" data-edit="'+esc(r.id)+'">Edit</button></span></div>').join('')||'<p>No matching resources.</p>';
$('#list').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));$('#list').querySelectorAll('[data-select]').forEach(c=>c.onchange=()=>{c.checked?selected.add(c.dataset.select):selected.delete(c.dataset.select);updateBulk()});updateBulk()}
function updateBulk(){const shown=filtered();$('#bulkBar').hidden=!selected.size;$('#selectedCount').textContent=selected.size+' selected';$('#selectAll').checked=!!shown.length&&shown.every(r=>selected.has(r.id));$('#selectAll').indeterminate=shown.some(r=>selected.has(r.id))&&!$('#selectAll').checked}
async function refresh(){const data=await api('GET');if(!Array.isArray(data))throw Error('Resource list returned an unexpected response');records=data;selected=new Set([...selected].filter(id=>records.some(r=>r.id===id)));render()}
async function upload(){const file=$('#resourceImageFile').files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)||file.size>5000000){$('#uploadStatus').textContent='Use JPG, PNG, WebP or GIF under 5 MB.';$('#resourceImageFile').value='';return}
busy=true;$('#uploadStatus').textContent='Preparing picture…';
try{await localPreview(file);$('#uploadStatus').textContent='Picture selected. Uploading to Cloudflare…';
const data=new FormData();data.append('image',file);
const res=await fetch('/api/admin/resource-image',{method:'POST',body:data,credentials:'same-origin',cache:'no-store'});const result=await res.json().catch(()=>({}));
if(!res.ok||!result.url)throw Error(result.error||'Upload failed (HTTP '+res.status+').');
const imageUrl=new URL(result.preview_url||result.url,location.origin);
if(imageUrl.origin!==location.origin||!/^\/(api\/resource-image|admin\/resources\/image)\//.test(imageUrl.pathname))throw Error('The upload returned an unexpected image address.');
const verify=await fetch(imageUrl.href,{credentials:'same-origin',cache:'no-store'});
if(!verify.ok)throw Error('The uploaded image cannot be retrieved (HTTP '+verify.status+').');
if(!(verify.headers.get('content-type')||'').startsWith('image/'))throw Error('The image address did not return an image.');
form.elements.image_url.value=result.url;$('#uploadStatus').textContent='Picture uploaded and verified. Save the resource to keep it.';
}catch(e){$('#uploadStatus').textContent='Upload failed: '+e.message+' The preview will remain visible, but this new picture has NOT been saved.';$('#resourceImageFile').value='';}
finally{busy=false}}
async function save(published){if(busy)return;if(!form.reportValidity())return;const b=Object.fromEntries(fields.map(k=>[k,form.elements[k]?.type==='checkbox'?form.elements[k].checked:form.elements[k]?.value||'']));b.topics=b.topics.split(',').map(x=>x.trim()).filter(Boolean);if(b.type==='video'){if(!isYoutubeResource(b.url)){notice.textContent='Video resources need a YouTube link.';return;}b.type='website';}else if(b.type==='website'&&isYoutubeResource(b.url)){notice.textContent='YouTube links belong in Videos. Choose Video as the type.';return;}b.published=published;b.id=editing||b.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);if(!b.id){notice.textContent='Please enter a valid title';return}busy=true;try{await api('POST',b);editing=b.id;$('#editHeading').textContent='Edit: '+b.title;form.elements.published.checked=published;notice.textContent=(published?'Published ':'Saved draft: ')+b.title;await refresh();if(isEditorWindow)window.parent.document.querySelectorAll('iframe').forEach(f=>{if(f!==window.frameElement)f.contentWindow?.postMessage({whdcResourceEditor:'saved'},'*')})}catch(err){notice.textContent=err.message}finally{busy=false}}
async function deleteCurrentResource(){
 if(busy||!editing)return;
 const id=editing;
 const r=records.find(x=>x.id===id);
 const title=r?.title||form.elements.title.value||id;
 if(!confirm('Permanently delete "'+title+'"? This cannot be undone.'))return;
 busy=true;
 notice.textContent='Deleting resource…';
 try{
  await api('DELETE',{id});
  selected.delete(id);
  editing='';
  await refresh();
  close();
  if(isEditorWindow){try{window.parent.postMessage({whdcResourceEditor:'saved'},'*')}catch(e){}}
 }catch(err){notice.textContent='Delete failed: '+err.message;}
 finally{busy=false;}
}
async function bulk(action){const ids=[...selected];if(!ids.length||busy)return;if(action==='delete'&&!confirm('Permanently delete '+ids.length+' selected resources? This cannot be undone.'))return;busy=true;notice.textContent='Updating '+ids.length+' resources…';let done=0;try{for(const id of ids){const r=records.find(x=>x.id===id);if(!r)continue;if(action==='delete')await api('DELETE',{id});else{const b={...r,topics:Array.isArray(r.topics)?r.topics:[],published:action==='publish'?true:action==='draft'?false:!!r.published,featured:action==='feature'?true:action==='unfeature'?false:!!r.featured};await api('POST',b)}done++}selected.clear();await refresh();notice.textContent=done+' resources updated.'}catch(e){notice.textContent=done+' updated before error: '+e.message;await refresh()}finally{busy=false}}
$('#savePublishTop')?.addEventListener('click',()=>$('#savePublish').click());$('#previewResourceTop')?.addEventListener('click',()=>{const b=[...modal.querySelectorAll('.whdc-rich-toolbar .whdc-format-button')].find(x=>x.textContent.trim()==='Preview');if(b)b.click();else form.elements.content?.focus()});$('#deleteResource').onclick=deleteCurrentResource;$('#newResource').onclick=reset;$('#closeResourceEditor').onclick=close;$('#closeResourceEditorBottom').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const controls=[...modal.querySelectorAll('button,input,select,textarea')].filter(el=>!el.hidden&&!el.disabled&&el.offsetParent!==null);if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
form.elements.type.onchange=mode;form.onsubmit=e=>{e.preventDefault();save(false)};$('#savePublish').onclick=()=>save(true);$('#resourceImageFile').onchange=upload;$('#removeResourceImage').onclick=()=>{releaseLocalPreview();form.elements.image_url.value='';$('#resourceImageFile').value='';preview('');$('#uploadStatus').textContent='Picture removed. Save to apply.'};
$('#selectAll').onchange=e=>{for(const r of filtered())e.target.checked?selected.add(r.id):selected.delete(r.id);render()};$('#clearSelection').onclick=()=>{selected.clear();render()};for(const [id,action] of [['bulkPublish','publish'],['bulkDraft','draft'],['bulkFeature','feature'],['bulkUnfeature','unfeature'],['bulkDelete','delete']])$('#'+id).onclick=()=>bulk(action);for(const tab of document.querySelectorAll('[data-status-tab]'))tab.addEventListener('click',()=>{activeStatus=tab.dataset.statusTab;render()});for(const id of ['resourceSearch','resourceTypeFilter','resourceSort'])$('#'+id).addEventListener(id==='resourceSearch'?'input':'change',render);
mode();preview('');render();
refresh().then(()=>{
 if(isEditorWindow){const id=editorParams.get('resourceEditId');if(id)edit(id);else reset();}
}).catch(e=>{notice.textContent='Unable to load resources: '+e.message+'. Check your connection and reload this dashboard.';if(isEditorWindow&&!editorParams.get('resourceEditId'))reset()});
})();
