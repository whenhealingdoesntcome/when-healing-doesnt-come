import { GOOD_SCROLL_VIDEO_JS } from '../good-scroll-video.js';
import { GOOD_SCROLL_DESIGN_JS } from '../good-scroll-design.js';
function goodScrollAdmin(){
  'use strict';
  const $=id=>document.getElementById('gs-'+id),D=window.WHDCGoodScrollDesign;
  const keys=['type','title','text','reference','caption','background','color','align'];
  const designKeys=['font','position','image_x','image_y','zoom','mode','fit','frame','video_text'];
  let posts=[],current=null,imageKey='',dirty=false,busy=false,previewVersion=0,previewChain=Promise.resolve();
  const status=$('status');
  async function api(path,opts={}){const r=await fetch(path,{credentials:'same-origin',cache:'no-store',...opts});let data;try{data=await r.json();}catch{throw Error('The server returned an unexpected response.');}if(!r.ok)throw Error((data.error||'Request failed')+' (HTTP '+r.status+')');return data;}
  function data(){const p={id:current||undefined,image_key:imageKey,design:{}};for(const key of keys)p[key]=$(key).value;for(const key of designKeys)p.design[key]=key==='video_text'?$(key).checked:['image_x','image_y','zoom','frame'].includes(key)?Number($(key).value):$(key).value;return p;}
  function preview(){const version=++previewVersion,p=data();
    const video=D.isVideo(p);$('preview').hidden=video;$('video-preview').hidden=!video;
    if(video){try{D.mountVideo($('video-preview'),p);$('preview-status').textContent='4:5 video frame. Text and frame are included in supported video exports.';}catch(e){$('preview-status').textContent=e.message;}return;}
    $('video-preview').replaceChildren();

previewChain=previewChain.catch(()=>{}).then(async()=>{if(version!==previewVersion)return;try{const canvas=document.createElement('canvas');await D.render(canvas,p);if(version!==previewVersion)return;const target=$('preview');target.width=1080;target.height=1350;target.getContext('2d').drawImage(canvas,0,0);$('preview-status').textContent='';}catch(e){if(version===previewVersion){$('preview').getContext('2d').clearRect(0,0,1080,1350);$('preview-status').textContent=e.message;}}});}
  function discard(){return !dirty||confirm('Discard unsaved changes to this post?');}
  function populate(post={}){
    current=post.id||null;imageKey=post.image_key||'';const d=D.design(post);
    $('form').reset();for(const key of keys)$(key).value=post[key]??({type:'encouragement',background:'#e6ece3',color:'#405b49',align:'center'}[key]||'');
    for(const key of designKeys){if(key==='video_text')$(key).checked=d[key];else $(key).value=d[key];}
    for(const key of ['background','color'])$(key+'-hex').value=$(key).value;
    document.getElementById('editor-heading').textContent=current?'Edit: '+(post.title||'Untitled draft'):'Create a post';
    $('delete').hidden=!current;$('duplicate').hidden=!current;$('unpublish').hidden=post.status!=='published';
    dirty=false;status.textContent=current?'Editing '+post.status+' post':'';preview();
  }
  function list(){const query=$('search').value.toLowerCase(),filter=$('filter').value,visible=posts.filter(p=>(!filter||p.status===filter)&&[p.title,p.text,p.reference,p.caption,p.type].join(' ').toLowerCase().includes(query));$('list').replaceChildren();for(const p of visible){const li=document.createElement('li'),label=document.createElement('span'),button=document.createElement('button');label.textContent=(p.title||'Untitled draft')+' · '+p.type+' · '+p.status;button.type='button';button.textContent='Edit';button.disabled=busy;button.onclick=()=>{if(discard()){populate(p);scrollTo({top:0,behavior:'smooth'});}};li.append(label,button);$('list').append(li);}$('library-status').textContent=visible.length+' of '+posts.length+' posts';}
  async function load(){posts=await api('/api/admin/good-scroll');list();}
  async function task(fn){if(busy)return;busy=true;const buttons=[...document.querySelectorAll('button,input,select,textarea')];buttons.forEach(b=>b.disabled=true);$('form').setAttribute('aria-busy','true');try{await fn();}catch(e){status.textContent=e.message;}finally{busy=false;buttons.forEach(b=>b.disabled=false);$('form').removeAttribute('aria-busy');updateImportSelection();list();}}
  async function save(state){const p=data();p.status=state;for(const key of ['background','color'])if(!/^#[a-f0-9]{6}$/i.test($(key+'-hex').value))throw Error('Enter valid six-digit HEX colors.');
    if(!/^#[a-f0-9]{6}$/i.test(p.background)||!/^#[a-f0-9]{6}$/i.test(p.color))throw Error('Enter valid six-digit HEX colors.');
    if(state==='published'){
      if(!p.title.trim()||!p.text.trim())throw Error('Publishing requires a title and graphic text (or an accessible transcript for a finished card).');
      if(p.type==='scripture'&&!p.reference.trim())throw Error('A Scripture reference is required to publish.');
      if(p.design.mode==='artwork'&&!imageKey)throw Error('Upload a finished card before publishing.');
      if(!D.isVideo(p))await D.render(document.createElement('canvas'),p);else{
        D.text(document.createElement('canvas').getContext('2d'),p,true);
        p.id=p.id||crypto.randomUUID();
        const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel video preparation';const controller=new AbortController();cancel.onclick=()=>controller.abort();status.after(cancel);
        try{const file=await window.WHDCGoodScrollVideo.file(p,percent=>{status.textContent='Preparing framed video: '+percent+'%. Keep this tab visible. This takes about the video’s length.';},controller.signal);
          status.textContent='Saving framed video…';const media=await api('/api/admin/good-scroll/image',{method:'POST',headers:{'content-type':file.type.split(';')[0]},body:file});p.design.video_key=media.key;
        }finally{cancel.remove();}
      }
    }
    status.textContent='Saving…';const result=await api('/api/admin/good-scroll',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(p)});
    // Keep working in the saved post. Do not clear user input if refreshing the library fails.
    current=result.id;dirty=false;$('delete').hidden=false;$('duplicate').hidden=false;$('unpublish').hidden=state!=='published';
    status.textContent=state==='published'?'Post published.':'Draft saved.';
    try{await load();}catch(e){status.textContent+=' Library refresh failed: '+e.message;}
  }
  async function upload(file){
    if(!file)return;const video=['video/mp4','video/webm'].includes(file.type),max=video?50:5;
    if(file.size>max*1024*1024)throw Error('File must be '+max+' MB or smaller.');
    if(!['image/jpeg','image/png','image/webp','video/mp4','video/webm'].includes(file.type))throw Error('Choose JPEG, PNG, WebP, MP4 or WebM.');
    if(video){
      const url=URL.createObjectURL(file),player=document.createElement('video');player.preload='metadata';
      try{await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Video metadata timed out. Try an MP4 encoded with H.264.')),15000);player.onloadedmetadata=()=>{clearTimeout(timer);resolve();};player.onerror=()=>{clearTimeout(timer);reject(Error('This browser cannot play this video. Try an MP4 encoded with H.264.'));};player.src=url;});if(!player.videoWidth||!player.videoHeight)throw Error('Video has no visible picture.');}
      finally{player.removeAttribute('src');player.load();URL.revokeObjectURL(url);}
    }else{const bitmap=await createImageBitmap(file);const valid=$('mode').value!=='artwork'||bitmap.width*5===bitmap.height*4;bitmap.close();if(!valid)throw Error('Finished cards must have a 4:5 aspect ratio.');}
    const result=await api('/api/admin/good-scroll/image',{method:'POST',headers:{'content-type':file.type},body:file});imageKey=result.key;if(video){$('mode').value='text';$('crop')?.setAttribute('open','');}dirty=true;preview();
  }
  for(const key of [...keys,...designKeys])$(key).addEventListener('input',()=>{dirty=true;if(['background','color'].includes(key))$(key+'-hex').value=$(key).value;preview();});
  for(const key of ['background','color'])$(key+'-hex').addEventListener('input',()=>{dirty=true;const input=$(key+'-hex');input.setCustomValidity(/^#[a-f0-9]{6}$/i.test(input.value)?'':'Use # followed by six hexadecimal digits.');if(input.validity.valid){$(key).value=input.value;preview();}});
  $('image').onchange=()=>task(async()=>{status.textContent='Uploading…';try{await upload($('image').files[0]);status.textContent='Media uploaded. Save to keep this change.';}finally{$('image').value='';}});
  $('remove-image').onclick=()=>{imageKey='';dirty=true;preview();};
  $('form').onsubmit=e=>{e.preventDefault();task(()=>save(e.submitter?.dataset.status||'draft'));};
  $('new').onclick=()=>{if(discard())populate();};
  $('duplicate').onclick=()=>{if(!discard())return;const p=data();delete p.id;p.title=(p.title+' (copy)').slice(0,120);populate(p);dirty=true;status.textContent='Copy ready. Save Draft to add it to the library.';};
  $('unpublish').onclick=()=>task(()=>save('draft'));
  $('delete').onclick=()=>{if(!current||!confirm('Permanently delete this post?'))return;task(async()=>{await api('/api/admin/good-scroll?id='+encodeURIComponent(current),{method:'DELETE'});populate();await load();status.textContent='Post deleted.';});};
  function updateImportSelection(){
    const count=$('import').files.length;
    $('import-selection').textContent=count?count+' card'+(count===1?'':'s')+' selected. Ready to import.':'No cards selected.';
    $('import-submit').disabled=busy||!count;
  }
  $('import').onchange=()=>{$('import-status').textContent='';updateImportSelection();};
  $('import-submit').onclick=()=>task(async()=>{
    const files=[...$('import').files].sort((a,b)=>a.name.localeCompare(b.name));
    if(!files.length)return;if(!discard())return;
    let added=0,skipped=0;const errors=[];
    for(const [index,file] of files.entries()){
      $('import-status').textContent='Importing '+(index+1)+' of '+files.length+'…';
      try{
        const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))].slice(0,16).map(x=>x.toString(16).padStart(2,'0')).join('');
        const id=[digest.slice(0,8),digest.slice(8,12),digest.slice(12,16),digest.slice(16,20),digest.slice(20)].join('-');
        if((await api('/api/admin/good-scroll?id='+encodeURIComponent(id))).post){skipped++;continue;}
        populate({design:{mode:'artwork'}});$('import-status').textContent='Importing '+(index+1)+' of '+files.length+'…';await upload(file);
        const title=file.name.replace(/\.[^.]+$/,'').replace(/_/g,' ').slice(0,120);
        await api('/api/admin/good-scroll',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...data(),id,title,status:'draft',create_only:true})});added++;
      }catch(e){errors.push(file.name+': '+e.message);}
    }
    populate();$('import').value='';$('import-status').textContent=added+' drafts imported; '+skipped+' existing cards skipped.'+(errors.length?' Failed: '+errors.join('; '):' Add a readable transcript, category and reference before publishing.');
    try{await load();}catch(e){$('import-status').textContent+=' Library refresh failed: '+e.message;}
  });
  $('search').oninput=list;$('filter').onchange=list;
  window.addEventListener('beforeunload',e=>{if(dirty||busy){e.preventDefault();e.returnValue='';}});
  populate();updateImportSelection();load().catch(e=>{$('library-status').textContent=e.message;});
}
// Wrangler/esbuild can inject __name() into serialized functions. Supply it in the browser script.
export const GOOD_SCROLL_JS='const __name=(target,value)=>target;\n'+GOOD_SCROLL_DESIGN_JS+'\n'+GOOD_SCROLL_VIDEO_JS+'\n('+goodScrollAdmin.toString()+')();';
