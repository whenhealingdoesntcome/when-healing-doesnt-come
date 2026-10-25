export const ADMIN_EDITOR_UTILS_JS = "const $=s=>document.querySelector(s),safe=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nlet items=[],editing=null,writerName='Heather Kusunoki';\nlet mainTab='draft',guestTab='pending';\nconst editorNotesPage=new URLSearchParams(location.search).has('editorNotes');\nconst submissionsPage=new URLSearchParams(location.search).has('submissions')||editorNotesPage;\n// Review pages use the shared header, but not the main dashboard workspaces.\n// Keep the Resource Library and devotional library exclusive to /admin.\nif(submissionsPage){\n document.querySelectorAll('#whatsNewAdmin,#devotionalLibrary,#resourceLibrary,#dashboardPreviewHeading').forEach(el=>{\n  const section=el.id==='dashboardPreviewHeading'?el.closest('details'):el;\n  if(section)section.hidden=true;\n });\n}\n\nasync function api(path,opts={}){const r=await fetch(path,{credentials:'same-origin',cache:'no-store',...opts});let data;try{data=await r.json()}catch{throw Error('Server returned an unexpected response')}if(!r.ok)throw Error(data.error||'Request failed');return data}\nconst scriptureUrl=reference=>'https://www.biblegateway.com/passage/?search='+encodeURIComponent(reference)+'&version=WEB';\nconst message=(s,err=false)=>{let n=$('#message');if(n){n.textContent=s;n.style.color=err?'#9b3d36':''}};\nfunction formatted(s){return safe(s).replace(/\\*\\*([^*\\n]+)\\*\\*/g,'<strong>$1</strong>').replace(/(^|[^*])\\*([^*\\n]+)\\*/g,'$1<em>$2</em>')}\nfunction paragraphs(s){return String(s||'').split(/\\n\\s*\\n/).map(t=>`<p>${formatted(t).replace(/\\n/g,'<br>')}</p>`).join('')}\nfunction formatSelection(field,mark){const el=$(`#editor textarea[name=\"${field}\"]`);if(!el)return;const a=el.selectionStart,b=el.selectionEnd,selected=el.value.slice(a,b),placeholder=mark==='**'?'bold text':'italic text',inside=selected||placeholder;el.setRangeText(mark+inside+mark,a,b,'select');el.focus();el.setSelectionRange(a+mark.length,a+mark.length+inside.length)}\nfunction richCommand(field,action){
 const el=document.querySelector('#editor textarea[name="'+field+'"]');if(!el)return;
 if(action==='preview'){
  let pane=el.nextElementSibling;
  if(!pane||!pane.classList.contains('whdc-rich-preview')){pane=document.createElement('div');pane.className='whdc-rich-preview';el.after(pane)}
  const show=pane.hidden!==false;pane.hidden=!show;
  if(show){pane.innerHTML=richPreview(el.value);pane.style.cssText='padding:16px;border:1px solid #b8c9c1;border-radius:9px;background:#fffefa;line-height:1.7;white-space:normal';}
  return;
 }
 const a=el.selectionStart,b=el.selectionEnd,selected=el.value.slice(a,b);
 let replacement=selected;
 if(action==='link'){
  const url=prompt('Link URL (https://...)','https://');if(!url||!/^https:\/\/[^\\s]+$/i.test(url)){if(url)alert('Use a valid https:// link.');return}
  replacement='['+(selected||'link text')+']('+url+')';
 }else{
  const prefix={heading:'## ',bullet:'- ',number:'1. ',quote:'> '}[action];
  if(!prefix)return;
  const block=selected||'Text';
  replacement=block.split('\\n').map(line=>prefix+line).join('\\n');
 }
 el.setRangeText(replacement,a,b,'select');el.focus();el.dispatchEvent(new Event('input',{bubbles:true}));
}
function richPreview(markdown){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const inline=s=>escape(s).replace(/\\[([^\\]]+)\\]\\((https:\\/\\/[^\\s)]+)\\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\\*\\*([^*\\n]+)\\*\\*/g,'<strong>$1</strong>').replace(/(^|[^*])\\*([^*\\n]+)\\*/g,'$1<em>$2</em>');
 return String(markdown||'').split(/\\n\\s*\\n/).map(block=>{
  const lines=block.split('\\n');
  if(lines.every(x=>/^\\s*[-*] /.test(x)))return '<ul>'+lines.map(x=>'<li>'+inline(x.replace(/^\\s*[-*] /,''))+'</li>').join('')+'</ul>';
  if(lines.every(x=>/^\\s*\\d+\\. /.test(x)))return '<ol>'+lines.map(x=>'<li>'+inline(x.replace(/^\\s*\\d+\\. /,''))+'</li>').join('')+'</ol>';
  if(lines.every(x=>/^\\s*> /.test(x)))return '<blockquote>'+lines.map(x=>inline(x.replace(/^\\s*> /,''))).join('<br>')+'</blockquote>';
  if(lines[0].startsWith('## '))return '<h2>'+inline(lines[0].slice(3))+'</h2>'+ (lines.length>1?'<p>'+lines.slice(1).map(inline).join('<br>')+'</p>':'');
  return '<p>'+lines.map(inline).join('<br>')+'</p>';
 }).join('');
}
function wireFormatting(){document.querySelectorAll('[data-rich]').forEach(b=>b.onclick=()=>richCommand(b.dataset.field,b.dataset.rich));document.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>formatSelection(b.dataset.field,b.dataset.format));document.querySelectorAll('#editor textarea[name=\"short\"],#editor textarea[name=\"deeper\"],#editor textarea[name=\"reflection\"]').forEach(el=>el.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&!e.altKey&&['b','i'].includes(e.key.toLowerCase())){e.preventDefault();formatSelection(el.name,e.key.toLowerCase()==='b'?'**':'*')}}))}\nasync function bindScriptureFields(root){const b=root.querySelector('[data-fetch-scripture]');if(!b)return;const ref=root.querySelector('[name=\"reference\"]'),ctx=root.querySelector('[name=\"contextReferences\"]'),out=root.querySelector('[name=\"mainScriptureText\"]'),status=root.querySelector('[data-scripture-status]');const load=async()=>{try{status.textContent='Retrieving WEBU…';const r=await fetch('/api/scripture?reference='+encodeURIComponent(ref.value));const d=await r.json();if(!r.ok)throw Error(d.error||'Lookup failed');if(d.verses.length<1||d.verses.length>2)throw Error('Main Scripture must be one or two verses');out.value=d.verses.map(v=>v.text).join(' ');if(ctx.value.trim()){const cr=await fetch('/api/scripture?reference='+encodeURIComponent(ctx.value));const cd=await cr.json();if(!cr.ok)throw Error(cd.error||'Invalid context passage')}status.textContent='Scripture verified and ready to save.';return true}catch(e){status.textContent=e.message;return false}};b.onclick=load;root.whdcValidateScripture=load;root.dataset.scriptureReady='1'}";
