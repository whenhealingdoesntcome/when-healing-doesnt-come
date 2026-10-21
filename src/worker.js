const ANNOUNCEMENT_ADMIN_JS="(()=>{\n const form=document.getElementById('announcementForm');if(!form)return;\n const title=document.getElementById('announcementTitle'),body=document.getElementById('announcementBody'),visible=document.getElementById('announcementVisible'),status=document.getElementById('announcementStatus');\n const formatSelection=(marker)=>{const start=body.selectionStart,end=body.selectionEnd,old=body.value,selected=old.slice(start,end);if(!selected){body.focus();return;}const replacement=marker+selected+marker;if(old.length+marker.length*2>4000){status.textContent='Announcement exceeds 4,000 characters.';return;}body.value=old.slice(0,start)+replacement+old.slice(end);body.focus();body.setSelectionRange(start+marker.length,end+marker.length);body.dispatchEvent(new Event('input',{bubbles:true}));};\n for(const [id,marker] of [['announcementBold','**'],['announcementItalic','*']]){const btn=document.getElementById(id);if(btn)btn.addEventListener('click',()=>formatSelection(marker));}\n body.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&!e.altKey&&['b','i'].includes(e.key.toLowerCase())){e.preventDefault();formatSelection(e.key.toLowerCase()==='b'?'**':'*');}});\n const summary=document.getElementById('announcementSummary'),publish=document.getElementById('announcementPublish'),save=document.getElementById('announcementSave'),hide=document.getElementById('announcementHide');\n async function request(opts){const response=await fetch('/api/admin/announcement',{credentials:'same-origin',cache:'no-store',...opts});const result=await response.json();if(!response.ok)throw Error(result.error||'Request failed');return result;}\n function updateSummary(){summary.textContent=(title.value.trim()||\"What's New\")+' \u00b7 '+(visible.checked?'Visible on Home':'Hidden from Home');}\n async function send(mode){const button=mode==='publish'?publish:mode==='hide'?hide:save;button.disabled=true;status.textContent='Saving\u2026';try{const result=await request({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:title.value,body:body.value,visible:mode==='hide'?false:visible.checked,publishNew:mode==='publish'})});visible.checked=!!result.visible;updateSummary();status.textContent=mode==='publish'?'New announcement published. Readers who have not seen it will be directed to Home.':mode==='hide'?'Announcement hidden. Welcome is at the top of Home.':'Changes saved. Existing readers will not be redirected again.';}catch(e){status.textContent='Save failed: '+e.message;}finally{button.disabled=false;}}\n (async()=>{try{const item=await request();title.value=item.title||\"What's New\";body.value=item.body||'';visible.checked=!!item.visible;updateSummary();status.textContent='Current saved announcement loaded.';}catch(e){status.textContent='Could not load announcement: '+e.message;}})();\n title.addEventListener('input',updateSummary);visible.addEventListener('change',updateSummary);\n form.addEventListener('submit',e=>{e.preventDefault();send('save')});\n publish.addEventListener('click',()=>{if(!form.reportValidity())return;if(!confirm('Publish this as a NEW announcement and direct readers to Home once?'))return;visible.checked=true;send('publish')});\n hide.addEventListener('click',()=>send('hide'));\n})();";
import {scriptureLookup} from './scripture.js';
import {handlePublicAudio,handleAdminAudio} from './audio/api.js';
const PREVIEW_HTML="<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Dashboard Preview | WHDC</title><link rel=\"stylesheet\" href=\"/shared/styles.css\"><link rel=\"stylesheet\" href=\"/admin/admin-mobile.css\"><style>\n.preview-wrap{max-width:1000px;margin:auto}.preview-banner{padding:13px 18px;border:1px solid #9aada2;border-radius:10px;background:#edf3ee;margin:16px 0 26px}.preview-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.preview-tabs button{border-radius:4px}.preview-row{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:14px 4px;border-bottom:1px solid #dce4df;flex-wrap:wrap}.preview-row p{margin:3px 0}.preview-block{margin-top:30px;padding-top:16px;border-top:1px solid #dce4df}.preview-outline{padding:12px 0;border-bottom:1px solid #e3e6e0}.preview-outline summary{cursor:pointer;font-weight:600}.preview-detail{padding:18px;border:1px solid #dce4df;border-radius:8px;margin-top:14px}.preview-detail[hidden]{display:none}.preview-top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}.preview-pill{color:#61766c;font-size:.9rem}\n</style></head><body><header><div class=\"wrap top\"><a class=\"brand\" href=\"/admin\"><img class=\"header-logo\" src=\"/images/header-logo.png\" alt=\"When Healing Doesn't Come\"></a></div></header><main class=\"wrap preview-wrap\"><section class=\"hero\"><div class=\"eyebrow\">Administrator preview</div><h1 id=\"pageTitle\">Dashboard Preview</h1><p id=\"pageSubtitle\"></p></section><div class=\"preview-banner\"><strong>Read-only example.</strong> This shows the layout and instructions using sample content. It does not show actual guest accounts, assignments, or submissions. No changes can be saved or published here.</div><p><a class=\"btn\" href=\"/admin\">← Back to Admin Dashboard</a></p><div id=\"previewBody\"></div></main><script>\nconst role=new URLSearchParams(location.search).get('role');\nconst mode=['writer','editor','combined'].includes(role)?role:'writer';\nconst combined=mode==='combined',writer=mode!=='editor',editor=mode!=='writer';\nconst title=combined?'Combined Writer & Editor Dashboard':writer?'Guest Writer Dashboard':'Editor Dashboard';\ndocument.title='Preview: '+title+' | WHDC';document.getElementById('pageTitle').textContent=title;\ndocument.getElementById('pageSubtitle').textContent='See how the '+title.toLowerCase()+' is organized.';\nconst writerHelp=`<details class='card' style='margin:18px 0;padding:18px' open><summary style='cursor:pointer;font-weight:700;font-size:1.1rem'>How to use your Writer Dashboard</summary><p>Start with <strong>View Master Outline</strong> (the master list of planned devotional topics). Topics are organized by category. Choose an available title to start a draft; titles marked <strong>Already written or in progress</strong> cannot be selected, which helps prevent duplicate devotionals.</p><p>The master list is a planning guide, not a list of assignments or a required writing order. You can also use <strong>+ New devotional</strong> to write on a different topic.</p><p>Write your devotional, Go Deeper study, and optional reflection questions. Main Scripture is the one or two key verses shown in italics above the devotional; do not repeat them in the devotional body. Scripture in Context is the surrounding passage and optional supporting passages, one reference per line, shown in Read Scripture. Use Retrieve WEBU Scripture to fill the text automatically. Save your draft to return later. When ready, submit it for review. Use <strong>Drafts</strong>, <strong>Need Revisions</strong>, <strong>Awaiting Approval</strong>, and <strong>Published</strong> to follow its progress. If revisions are requested, open the devotional, make changes, and submit again. Publication is handled after review and approval.</p><p class='small muted'>Tip: Click a devotional title or its action button to open it. If you also have editing access, your assigned editing work appears in My Editing below.</p></details>`;\nconst editorHelp=`<details class='card' style='margin:18px 0;padding:18px' open><summary style='cursor:pointer;font-weight:700;font-size:1.1rem'>How to use your Editor Dashboard</summary><p>Devotionals assigned to you appear below. Choose <strong>To Edit</strong> for work awaiting your suggestions, <strong>Completed</strong> for work you have already reviewed, or <strong>All</strong> to see every assignment.</p><p>Click <strong>Suggest Edits</strong> to open a devotional. Review the title, Scripture reference, short devotional, Go Deeper study, and reflection questions. Make your suggested changes in the fields, then click <strong>Submit Suggested Edits</strong>.</p><p>Your suggestions do <strong>not</strong> change the original devotional or publish it. They are sent to the administrator for review. You can revisit completed work using <strong>View / Update Suggestions</strong>. Refresh the page to check for newly assigned work.</p></details>`;\nconst writingRows={draft:[['Learning to Rest','Psalm 46:10','Draft']],revisions:[['Hope in the Waiting','Romans 5:3–5','Revisions Requested']],needs_approval:[['Strength for Today','Isaiah 40:29–31','Awaiting Approval']],published:[['Not Forgotten','Isaiah 49:15–16','Published']]};\nconst editingRows={to_edit:[['Hope in the Waiting','Romans 5:3–5','Guest Writer']],completed:[['Not Forgotten','Isaiah 49:15–16','Administrator']]};\nconst writerSection=`<section><div class=\"actions\"><button class=\"btn\" id=\"outlineButton\" type=\"button\">View Master Outline</button><button class=\"btn primary\" type=\"button\" id=\"newButton\">+ New devotional</button></div>${writerHelp}<h2>${combined?'My Writing':'My Devotionals'}</h2><div class=\"preview-tabs\" id=\"writerTabs\"></div><div class=\"admin-list\" id=\"writerRows\"></div><div id=\"writerDetail\" class=\"preview-detail\" hidden></div></section>`;\nconst editorSection=`<section class=\"${combined?'preview-block':''}\">${combined?'<h2>My Editing</h2>':editorHelp+'<h2>Assigned Devotionals</h2>'}${combined?editorHelp:''}<div class=\"preview-tabs\" id=\"editorTabs\"></div><div class=\"admin-list\" id=\"editorRows\"></div><div id=\"editorDetail\" class=\"preview-detail\" hidden></div></section>`;\ndocument.getElementById('previewBody').innerHTML=(writer?writerSection:'')+(editor?editorSection:'');\nfunction tabs(id,keys,active,fn){document.getElementById(id).innerHTML=keys.map(([key,label,count])=>`<button type=\"button\" class=\"btn ${key===active?'primary':''}\" data-key=\"${key}\">${label} (${count})</button>`).join('');document.querySelectorAll('#'+id+' button').forEach(b=>b.onclick=()=>fn(b.dataset.key))}\nfunction rows(id,entries,action){document.getElementById(id).innerHTML=entries.length?entries.map(([name,verse,status])=>`<div class=\"preview-row\"><div><strong>${name}</strong><p class=\"small muted\">${verse} · ${status}</p></div><button type=\"button\" class=\"btn\" data-title=\"${name}\">${action}</button></div>`).join(''):'<p>No example devotionals in this tab.</p>'}\nfunction details(id,name,editing){const el=document.getElementById(id);el.hidden=false;el.innerHTML=`<h3>${editing?'Suggest Edits':'Devotional'}: ${name}</h3><p class=\"small muted\">Sample content only. This preview cannot submit changes.</p><p><strong>Scripture reference:</strong> Romans 5:3–5</p><p><strong>Short devotional:</strong> [Example devotional text]</p><p><strong>Go Deeper:</strong> [Example study text]</p><p><strong>Questions for Reflection:</strong> [Example questions]</p><button class=\"btn\" type=\"button\" id=\"closePreviewDetail\">Close</button>`;el.querySelector('#closePreviewDetail').onclick=()=>el.hidden=true;el.scrollIntoView({block:'nearest',behavior:'smooth'})}\nif(writer){const names={draft:'Drafts',revisions:'Need Revisions',needs_approval:'Awaiting Approval',published:'Published',all:'All'};const draw=(key='draft')=>{tabs('writerTabs',Object.entries(names).map(([k,v])=>[k,v,k==='all'?4:writingRows[k].length]),key,draw);const entries=key==='all'?Object.values(writingRows).flat():writingRows[key];rows('writerRows',entries,'Read');document.querySelectorAll('#writerRows [data-title]').forEach(b=>b.onclick=()=>details('writerDetail',b.dataset.title,false))};draw();document.getElementById('newButton').onclick=()=>details('writerDetail','New devotional',false);document.getElementById('outlineButton').onclick=()=>{const el=document.getElementById('writerDetail');el.hidden=false;el.innerHTML=`<h2>Master Outline (Master List)</h2><p>Titles are organized by topic. Select an available title to begin a devotional. Titles already written or in progress cannot be selected.</p><details class=\"preview-outline\" open><summary>Rest</summary><p>What is Rest? <span class=\"preview-pill\">Available</span></p><p>Being a Mary <span class=\"preview-pill\">Already written or in progress</span></p><p>Sabbath <span class=\"preview-pill\">Available</span></p></details><details class=\"preview-outline\"><summary>Hope</summary><p>Living for Eternity <span class=\"preview-pill\">Available</span></p><p>Hope Does Not Disappoint <span class=\"preview-pill\">Available</span></p></details><p class=\"small muted\">These are examples. The real Master Outline reflects current availability.</p><button class=\"btn\" type=\"button\" id=\"closePreviewDetail\">Close</button>`;el.querySelector('#closePreviewDetail').onclick=()=>el.hidden=true;el.scrollIntoView({block:'nearest',behavior:'smooth'})}}\nif(editor){const draw=(key='to_edit')=>{tabs('editorTabs',[['to_edit','To Edit',1],['completed','Completed',1],['all','All',2]],key,draw);rows('editorRows',key==='all'?Object.values(editingRows).flat():editingRows[key],key==='completed'?'View / Update Suggestions':'Suggest Edits');document.querySelectorAll('#editorRows [data-title]').forEach(b=>b.onclick=()=>details('editorDetail',b.dataset.title,true))};draw()}\n</script></body></html>";
const EDITOR_HTML="<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Editor's Dashboard | When Healing Doesn't Come</title><link rel=\"stylesheet\" href=\"/shared/styles.css\"><link rel=\"stylesheet\" href=\"/admin/admin-mobile.css\"></head><body><header><div class=\"wrap top\"><a class=\"brand\" href=\"/\"><img class=\"header-logo\" src=\"/images/header-logo.png\" alt=\"When Healing Doesn't Come\"></a></div></header><main class=\"wrap\"><section class=\"hero\"><h1>Editor's Dashboard</h1><p>Review assigned devotionals and submit suggested edits.</p></section><div id=\"adminApp\">Loading\u2026</div></main><script src=\"/editor/client.js\" defer></script></body></html>";
const EDITOR_JS="const $=s=>document.querySelector(s);\nconst safe=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nconst api=async(path,opts={})=>{const r=await fetch(path,{credentials:'same-origin',cache:'no-store',...opts});const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');return d};\nconst post=(p,d)=>api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)});\nlet work=[],tab='to_edit',me={};\nconst app=$('#adminApp'),fields=[['title','Title'],['reference','Scripture Reference'],['short','Devotional'],['deeper','Go Deeper'],['reflection','Reflection Questions']];\nconst original=d=>({title:d.title,reference:d.scripture,short:d.short,deeper:d.deeper,reflection:d.reflection||''});\nasync function refresh(){work=await api('/api/admin/editors/work');render()}\nfunction render(){\nconst tabs=[['to_edit','To Edit'],['completed','Completed'],['all','All']];\nconst visible=work.filter(w=>tab==='all'||w.status===tab);\napp.innerHTML=`<p>Signed in as ${safe(me.displayName)} · <a href=\"/cdn-cgi/access/logout\">Log Out</a></p><details class='card' style='margin:18px 0;padding:18px' open><summary style='cursor:pointer;font-weight:700;font-size:1.1rem'>How to use your Editor Dashboard</summary><p>Devotionals assigned to you appear below. Choose <strong>To Edit</strong> for work awaiting your suggestions, <strong>Completed</strong> for work you have already reviewed, or <strong>All</strong> to see every assignment.</p><p>Click <strong>Suggest Edits</strong> to open a devotional. Review the title, Scripture reference, short devotional, Go Deeper study, and reflection questions. Make your suggested changes in the fields, then click <strong>Submit Suggested Edits</strong>.</p><p>Your suggestions do <strong>not</strong> change the original devotional or publish it. They are sent to the administrator for review. You can revisit completed work using <strong>View / Update Suggestions</strong>. Refresh the page to check for newly assigned work.</p></details><h2>Assigned Devotionals</h2><div style=\"display:flex;gap:8px;flex-wrap:wrap;margin:15px 0\">${tabs.map(([k,v])=>`<button class=\"btn ${tab===k?'primary':''}\" style=\"border-radius:4px\" data-tab=\"${k}\">${v} (${k==='all'?work.length:work.filter(w=>w.status===k).length})</button>`).join('')}</div><div class=\"admin-list\">${visible.map(w=>`<div style=\"display:flex;justify-content:space-between;gap:12px;align-items:center;padding:13px 5px;border-bottom:1px solid #ddd\"><div><strong>${safe(w.devotional.title)}</strong><p class=\"small muted\">${safe(w.devotional.scripture)} · ${safe(w.source_type==='admin'?'Administrator':'Guest Writer')} · ${safe(w.status)}</p></div><button class=\"btn\" data-open=\"${safe(w.source_type)}:${safe(w.devotional_id)}\">${w.status==='completed'?'View / Update Suggestions':'Suggest Edits'}</button></div>`).join('')||'<p>No assigned devotionals in this tab.</p>'}</div><p class=\"small muted\">Refresh to see the latest saved changes from the administrator.</p>`;\napp.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});\napp.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(work.find(w=>w.source_type+':'+w.devotional_id===b.dataset.open)));\n}\n\nfunction enablePopupFormatting(root){\n root.querySelectorAll('textarea[name=\"short\"],textarea[name=\"deeper\"],textarea[name=\"reflection\"]').forEach(el=>{\n  if(el.dataset.richReady)return;\n  el.dataset.richReady='1';\n  const toolbar=document.createElement('div');\n  toolbar.className='actions whdc-rich-toolbar';\n  toolbar.setAttribute('role','toolbar');\n  toolbar.setAttribute('aria-label','Text formatting');\n  toolbar.innerHTML='<button type=\"button\" class=\"btn\" data-rich-mark=\"**\" aria-label=\"Bold selected text\" title=\"Bold (Ctrl/Cmd+B)\"><strong>B</strong></button><button type=\"button\" class=\"btn\" data-rich-mark=\"*\" aria-label=\"Italicize selected text\" title=\"Italic (Ctrl/Cmd+I)\"><em>I</em></button>';\n  // If a toolbar already exists in the admin editor, do not duplicate it.\n  if(!el.previousElementSibling?.matches('.actions[role=\"toolbar\"]'))el.before(toolbar);\n  else toolbar.remove();\n  const apply=mark=>{\n   const start=el.selectionStart,end=el.selectionEnd;\n   const selected=el.value.slice(start,end),inside=selected||(mark==='**'?'bold text':'italic text');\n   el.setRangeText(mark+inside+mark,start,end,'select');\n   el.focus();el.setSelectionRange(start+mark.length,start+mark.length+inside.length);\n   el.dispatchEvent(new Event('input',{bubbles:true}));\n  };\n  toolbar.querySelectorAll('[data-rich-mark]').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.richMark)));\n  el.addEventListener('keydown',ev=>{\n   if((ev.ctrlKey||ev.metaKey)&&!ev.altKey&&['b','i'].includes(ev.key.toLowerCase())){\n    ev.preventDefault();apply(ev.key.toLowerCase()==='b'?'**':'*');\n   }\n  });\n });\n}\n\nfunction open(w){\nconst d=w.devotional,orig=original(d),dialog=document.createElement('dialog');\ndialog.style.cssText='width:min(850px,95vw);max-height:90vh;overflow:auto;border:0;border-radius:12px;padding:24px';\ndialog.innerHTML=`<h2>Suggest edits: ${safe(d.title)}</h2><p>Your changes are suggestions only. The original devotional is not modified.</p><form id=\"suggestForm\">${fields.map(([k,label])=>`<label style=\"display:block;margin:15px 0\"><strong>${label}</strong>${['title','reference'].includes(k)?`<input name=\"${k}\" value=\"${safe(orig[k])}\" required style=\"display:block;width:100%\">`:`<textarea name=\"${k}\" rows=\"${k==='short'||k==='deeper'?9:5}\" style=\"display:block;width:100%\" ${k==='short'||k==='deeper'?'required':''}>${safe(orig[k])}</textarea>`}</label>`).join('')}<div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Submit Suggested Edits</button><button class=\"btn\" type=\"button\" id=\"cancelSuggestion\">Close</button></div></form>`;\ndocument.body.appendChild(dialog);enablePopupFormatting(dialog);dialog.showModal();\nconst close=()=>{dialog.close();dialog.remove()};\ndialog.querySelector('#cancelSuggestion').onclick=close;\ndialog.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const suggested=Object.fromEntries(fields.map(([k])=>[k,String(f.get(k)||'')]));try{const result=await post('/api/admin/editors/suggest',{sourceType:w.source_type,id:w.devotional_id,original:orig,suggested});close();await refresh();alert(result.emailSent?'Suggested edits submitted. The administrator has been emailed.':'Suggested edits submitted, but the administrator email could not be confirmed.')}catch(err){alert(err.message)}};\n}\n(async()=>{try{me=await api('/api/admin/me');await refresh()}catch(e){app.textContent=e.message}})();";
import {ADMIN_HTML,ADMIN_JS,OUTLINE_HTML,OUTLINE_JS} from './private.js';
import {WRITER_HTML,WRITER_JS,WRITER_OUTLINE_JS} from './writer.js';
const json = (data, status = 200) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const fail = (message,status=400) => json({error:message},status);
const b64url = s => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')), c=>c.charCodeAt(0));
function teamDomain(env){let d=(env.ACCESS_TEAM_DOMAIN||'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'');return /^[a-zA-Z0-9.-]+\.cloudflareaccess\.com$/.test(d)?d:null}
async function accessIdentity(request,env){
  const domain=teamDomain(env),aud=(env.ACCESS_AUD||'').trim();
  if(!domain||!aud) return null; // Fail closed until all three settings are supplied
  const cookie=request.headers.get('cookie')||'';
  const token=request.headers.get('cf-access-jwt-assertion')||cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
  if(!token) return null;
  const parts=token.split('.');if(parts.length!==3)return null;
  try {
    const header=JSON.parse(new TextDecoder().decode(b64url(parts[0])));
    const claims=JSON.parse(new TextDecoder().decode(b64url(parts[1])));
    const now=Math.floor(Date.now()/1000);
    if(header.alg!=='RS256'||!header.kid||claims.iss!==`https://${domain}`||!(Array.isArray(claims.aud)?claims.aud.includes(aud):claims.aud===aud)||!claims.exp||claims.exp<=now||!claims.iat||claims.iat>now+60||!claims.email)return false;
    const response=await fetch(`https://${domain}/cdn-cgi/access/certs`,{cf:{cacheTtl:300,cacheEverything:true}});
    if(!response.ok)return false;
    const jwks=await response.json();const jwk=jwks.keys?.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)return false;
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,b64url(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1])) ? claims.email.toLowerCase() : null;
  }catch{return null}
}
function normalize(x,allowUnassignedDay=false){
  if(!x||typeof x!=='object')throw Error('Invalid devotional');
  const str=(k,max=50000)=>{if(typeof x[k]!=='string'||x[k].length>max)throw Error(`Invalid ${k}`);return x[k].trim()};
  const id=str('id',160);if(!/^[a-zA-Z0-9_-]+$/.test(id))throw Error('Invalid ID');
  const title=str('title',150),reference=str('reference',200),bibleUrl=str('bibleUrl',500),short=str('short'),deeper=str('deeper');
  const reflection=x.reflection==null?'':str('reflection');
  const author=x.author==null?'Heather Kusunoki':str('author',120);
  if(!author)throw Error('Author name is required');
  if(!title||!reference||!short||!deeper||!/^https:\/\//.test(bibleUrl))throw Error('Complete all fields and use an HTTPS Bible URL');
  if(!Array.isArray(x.topics)||x.topics.length>30||x.topics.some(t=>typeof t!=='string'||t.length>80))throw Error('Invalid topics');
  const day=Number(x.day);if(!Number.isInteger(day)||day<0||day>100000||(!allowUnassignedDay&&day===0))throw Error('Invalid day');
  const status=['published','draft'].includes(x.status)?x.status:null;if(!status)throw Error('Invalid status');
  return {id,title,day,topics:x.topics.map(t=>t.trim()).filter(Boolean),reference,bibleUrl,short,deeper,reflection,author,status};
}
async function ensureScriptureTable(env){await env.DB.prepare("CREATE TABLE IF NOT EXISTS devotional_scripture (devotional_id TEXT PRIMARY KEY, main_text TEXT NOT NULL, context_references TEXT NOT NULL, context_passages TEXT NOT NULL)").run()}
async function scriptureExtras(env,items){if(!items.length)return items;await ensureScriptureTable(env);return Promise.all(items.map(async d=>{const r=await env.DB.prepare('SELECT main_text,main_reference,context_references,context_passages,further_study_references FROM devotional_scripture WHERE devotional_id=?').bind(d.id).first();return r?{...d,mainScriptureText:r.main_text,mainScriptureReference:r.main_reference||null,furtherStudyReferences:r.further_study_references||'',contextReferences:r.context_references,contextPassages:JSON.parse(r.context_passages)}:d}))}
async function storeScripture(env,d,request){if(d.mainScriptureText===undefined&&d.contextReferences===undefined)return;const main=String(d.mainScriptureReference||d.reference||'').trim();const references=String(d.contextReferences||'').trim();const further=String(d.furtherStudyReferences||'').trim();if(further.length>1000)throw Error('Further Study references are too long');if(further)await scriptureLookup(further,env.ASSETS,request);if(references.length>1000)throw Error('Context references are too long');const mainResult=await scriptureLookup(main,env.ASSETS,request);if(mainResult.verses.length<1||mainResult.verses.length>2)throw Error('Main Scripture must contain one or two verses');const mainText=mainResult.verses.map(v=>v.text).join(' ');const context=references?await scriptureLookup(references,env.ASSETS,request):{passages:[]};await ensureScriptureTable(env);await env.DB.prepare('INSERT INTO devotional_scripture (devotional_id,main_text,main_reference,context_references,context_passages,further_study_references) VALUES (?,?,?,?,?,?) ON CONFLICT(devotional_id) DO UPDATE SET main_text=excluded.main_text,main_reference=excluded.main_reference,context_references=excluded.context_references,context_passages=excluded.context_passages,further_study_references=excluded.further_study_references').bind(d.id,mainText,main,references,JSON.stringify(context.passages),further).run()}
function row(r){return {id:r.id,title:r.title,day:r.day,topics:JSON.parse(r.topics||'[]'),reference:r.scripture,bibleUrl:r.bible_url,short:r.short,deeper:r.deeper,reflection:r.reflection||'',author:r.author||'Heather Kusunoki',status:r.status,ownerEmail:r.owner_email||null,reviewNote:r.review_note||''}}
const select='SELECT id, title, day, topics, scripture, bible_url, short, deeper, reflection, author, status FROM devotionals';
const writerSelect='SELECT id,owner_email,title,day,topics,scripture,bible_url,short,deeper,reflection,author,status,admin_feedback,published_id,publish_anonymously,submitted_once FROM writer_devotionals';
function writerRow(r){return {...row(r),ownerEmail:r.owner_email,reviewNote:r.admin_feedback||'',publishedId:r.published_id||null,publishAnonymously:Boolean(r.publish_anonymously),submittedOnce:Boolean(r.submitted_once)}}
async function reviewSuggestions(env,id){const r=await env.DB.prepare('SELECT original_json,suggested_json FROM writer_review_suggestions WHERE devotional_id=?').bind(id).first();return r?{original:JSON.parse(r.original_json),suggested:JSON.parse(r.suggested_json)}:null}
async function withSuggestions(env,d){return {...d,trackedChanges:await reviewSuggestions(env,d.id)}}
async function list(env,all){const q=await env.DB.prepare(`${select} ${all?'':'WHERE status = ?'} ORDER BY day ASC, created_at ASC`).bind(...(all?[]:['published'])).all();return scriptureExtras(env,(q.results||[]).map(row))}
async function save(env,d){await env.DB.prepare(`INSERT INTO devotionals (id,day,title,topics,scripture,bible_url,short,deeper,reflection,author,status) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET day=excluded.day,title=excluded.title,topics=excluded.topics,scripture=excluded.scripture,bible_url=excluded.bible_url,short=excluded.short,deeper=excluded.deeper,reflection=excluded.reflection,author=excluded.author,status=excluded.status,updated_at=CURRENT_TIMESTAMP`).bind(d.id,d.day,d.title,JSON.stringify(d.topics),d.reference,d.bibleUrl,d.short,d.deeper,d.reflection,d.author,d.status).run()}

const lower=x=>String(x||'').trim().toLowerCase();
async function identity(request,env){
  const email=await accessIdentity(request,env);
  if(!email)return null;
  if(email===lower(env.ADMIN_EMAIL))return {email,role:'admin',displayName:(env.ADMIN_DISPLAY_NAME||'Heather Kusunoki').trim()};
  const editor=await env.DB.prepare('SELECT email,display_name FROM devotional_editors WHERE email=? AND active=1').bind(email).first();
  const writer=await env.DB.prepare('SELECT email, display_name FROM writers WHERE email=? AND active=1').bind(email).first();
  if(writer)return {email,role:'writer',displayName:writer.display_name,canEdit:Boolean(editor)};
  return editor?{email,role:'editor',displayName:editor.display_name,canEdit:true}:null;
}
const isAdmin=user=>user.role==='admin';
const isEditor=user=>user.role==='editor'||user.canEdit===true;
async function notifyEmail(env,event,d,writer,request,feedback="",onFailure=()=>{},dashboardOverride=null){
  // Keep webhook credentials out of logs and browser responses.
  const scriptUrl=String(env.GOOGLE_SCRIPT_URL||'').trim();
  const secret=String(env.WHDC_WEBHOOK_SECRET||'').trim();
  if(!scriptUrl||!secret){
    console.error('WHDC email: missing GOOGLE_SCRIPT_URL or WHDC_WEBHOOK_SECRET binding');onFailure('missing_webhook_settings');
    return false;
  }
  let destination;
  try{destination=new URL(scriptUrl)}catch{
    console.error('WHDC email: GOOGLE_SCRIPT_URL is not a valid URL');onFailure('invalid_webhook_url');
    return false;
  }
  if(destination.protocol!=='https:'||destination.hostname!=='script.google.com'||!destination.pathname.endsWith('/exec')){
    console.error('WHDC email: GOOGLE_SCRIPT_URL must be the deployed Google Apps Script /exec URL');onFailure('invalid_webhook_url');
    return false;
  }
  const origin=new URL(request.url).origin;
  try{
    const response=await fetch(scriptUrl,{
      method:'POST',redirect:'follow',headers:{'content-type':'application/json'},
      body:JSON.stringify({
        secret,event,id:d.id,title:d.title,feedback,
        writer:writer.displayName,writerEmail:writer.email,
        submittedAt:new Date().toISOString(),
        dashboardUrl:dashboardOverride||env.DASHBOARD_URL||origin+'/admin',
        appUrl:origin+'/',bannerUrl:origin+'/images/email-banner.png'
      })
    });
    // Google Apps Script often redirects successful responses to googleusercontent.com.
    // Do not log the full redirect URL, which can contain opaque access parameters.
    const finalHost=(()=>{try{return new URL(response.url).hostname}catch{return 'unknown'}})();
    const type=(response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
    if(!response.ok){
      onFailure('google_http_'+response.status);console.error('WHDC email: Google returned HTTP '+response.status+'; response type='+type+'; final host='+finalHost+'; event='+event);
      return false;
    }
    if(type!=='application/json'&&type!=='text/plain'){
      onFailure('unexpected_google_response');console.error('WHDC email: unexpected Google response type='+type+'; final host='+finalHost+'; event='+event+'. Check web app access and deployment URL.');
      return false;
    }
    let result;
    try{result=JSON.parse(await response.text())}catch{
      onFailure('invalid_google_json');console.error('WHDC email: Google response was not valid JSON; final host='+finalHost+'; event='+event);
      return false;
    }
    if(result?.success===true)return true;
    // Only surface known, non-sensitive application error labels.
    const allowed=new Set(['Unauthorized','Missing request','Invalid writer email','Unknown event','Notification failed']);
    const reason=allowed.has(result?.error)?result.error:'Unsuccessful webhook response';
    onFailure('apps_script_rejected_'+reason.toLowerCase().replace(/[^a-z]+/g,'_'));console.error('WHDC email: Apps Script rejected '+event+' ('+reason+'); final host='+finalHost);
    return false;
  }catch(e){
    // Exception messages can include URLs; log only the exception category.
    onFailure('webhook_network_failure');console.error('WHDC email: request failed for '+event+' ('+(e instanceof TypeError?'network/fetch error':'unexpected exception')+')');
    return false;
  }
}


// Expose Cloudflare's error code and a short, redacted explanation only.
// Never return or log request headers, API tokens, or complete API responses.
function accessApiFailure(action,response,data){
  const entries=Array.isArray(data?.errors)?data.errors:[];
  const codes=entries.map(x=>String(x?.code??'')).filter(x=>/^\d{1,8}$/.test(x)).slice(0,3);
  const messages=entries.map(x=>String(x?.message||'')).filter(Boolean).slice(0,2);
  const scrub=value=>value
    .replace(/Bearer\s+[^\s,;]+/gi,'[redacted]')
    .replace(/(?:[a-zA-Z0-9_+.-]+)@(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,'[email redacted]')
    .replace(/https?:\/\/\S+/g,'[URL redacted]')
    .replace(/\b[a-f0-9]{32,64}\b/gi,'[identifier redacted]')
    .slice(0,220);
  const detail=messages.map(scrub).filter(Boolean).join('; ');
  return `Cloudflare ${action} failed (HTTP ${response.status}${codes.length?', code '+codes.join(', '):''})${detail?': '+detail:''}`;
}

// Manage only the dedicated WHDC Writers policy; never modify the administrator policy.
// Cloudflare Access policy updates are read-modify-write, so avoid simultaneous edits.
async function updateWriterAccess(env,email,add){
  const account=String(env.CLOUDFLARE_ACCOUNT_ID||'').trim();
  const app=String(env.CLOUDFLARE_ACCESS_APP_ID||'').trim();
  const policy=String(env.CLOUDFLARE_WRITERS_POLICY_ID||'').trim();
  const token=String(env.CLOUDFLARE_API_TOKEN||'').trim();
  if(!/^[a-f0-9]{32}$/i.test(account)||!/^[a-f0-9-]{32,36}$/i.test(app)||!/^[a-f0-9-]{32,36}$/i.test(policy)||!token)throw Error('Cloudflare Access automation is not configured');
  // WHDC Writers is a reusable Access policy, not an application-specific policy.
  const endpoint=`https://api.cloudflare.com/client/v4/accounts/${account}/access/policies/${policy}`;
  const headers={'authorization':`Bearer ${token}`,'content-type':'application/json'};
  const get=await fetch(endpoint,{headers:{authorization:`Bearer ${token}`}});
  const got=await get.json().catch(()=>null);
  if(!get.ok||!got?.success||!got.result)throw Error(accessApiFailure('policy read',get,got));
  const p=got.result;
  if(p.decision!=='allow'||p.name!=='WHDC Writers')throw Error('Access policy identity mismatch. No changes made');
  // This policy must be exclusively for individual writer email addresses.
  if(!Array.isArray(p.include)||p.include.some(rule=>!rule.email||typeof rule.email.email!=='string')||
     (p.exclude&&p.exclude.length)||(p.require&&p.require.length))throw Error('WHDC Writers policy has unexpected rules; no changes made');
  const emails=[...new Set(p.include.map(x=>lower(x.email.email)).filter(Boolean))];
  const next=add?[...new Set([...emails,email])]:emails.filter(x=>x!==email);
  if(next.length===emails.length&&next.every((x,i)=>x===emails[i]))return true;
  // Cloudflare Access policies require a nonempty Include list. Never broaden to Everyone.
  if(!next.length)throw Error('Cannot remove the last writer from the Access policy automatically. Remove that email manually after adding another writer, or use a dedicated empty-group design.');
  const body={name:p.name,decision:p.decision,include:next.map(x=>({email:{email:x}})),exclude:[],require:[]};
  if(p.precedence!=null)body.precedence=p.precedence;
  if(p.session_duration)body.session_duration=p.session_duration;
  const put=await fetch(endpoint,{method:'PUT',headers,body:JSON.stringify(body)});
  const updated=await put.json().catch(()=>null);
  if(!put.ok||!updated?.success)throw Error(accessApiFailure('policy update',put,updated));
  return true;
}

async function saveOwned(env,d,email){
  await env.DB.prepare(`INSERT INTO writer_devotionals (id,owner_email,title,day,topics,scripture,bible_url,short,deeper,reflection,author,status,admin_feedback,publish_anonymously)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,day=excluded.day,topics=excluded.topics,scripture=excluded.scripture,bible_url=excluded.bible_url,short=excluded.short,deeper=excluded.deeper,reflection=excluded.reflection,author=excluded.author,publish_anonymously=excluded.publish_anonymously,status='draft',admin_feedback='',updated_at=CURRENT_TIMESTAMP`)
  .bind(d.id,email,d.title,d.day,JSON.stringify(d.topics),d.reference,d.bibleUrl,d.short,d.deeper,d.reflection,d.author,'draft','',d.publishAnonymously?1:0).run();
}
function writerData(d){return {id:d.id,title:d.title,day:d.day,topics:d.topics,reference:d.reference,bibleUrl:d.bibleUrl,short:d.short,deeper:d.deeper,reflection:d.reflection,author:d.publishAnonymously?'Guest Writer':d.author,status:'published'}}

// Chirp 3 HD pilot: fixed, administrator-only samples. No public generation endpoint.
const AUDIO_SAMPLE = "When healing doesn't come in the way we hope, God's presence remains. He is near to the brokenhearted, and his faithfulness does not change.";
// Gemini 3.1 Flash TTS supports a separate direction prompt and MP3 output.
const AUDIO_MODEL='gemini-3.1-flash-tts-preview';
const AUDIO_STYLE="Read in a warm, gentle, compassionate voice, like a trusted friend sharing words of hope. Use a calm, unhurried pace, with natural pauses between thoughts and Scripture passages. Avoid theatrical emotion, excessive cheerfulness, or a formal announcer style. Convey sincerity, quiet reassurance, and reverence when reading Scripture. Speak only the supplied text, never formatting marks or instructions.";
const AUDIO_VOICES={sulafat:'Sulafat',sadachbia:'Sadachbia'};
const AUDIO_VERSION='gemini31-flash-v3-scripture-clean';
function geminiAudioRequest(text,voice){
  if(new TextEncoder().encode(text).length>4000)throw Error('Reading exceeds Gemini TTS 4,000-byte text limit. Split the reading into smaller parts.');
  return {input:{text,prompt:AUDIO_STYLE},voice:{languageCode:'en-US',name:AUDIO_VOICES[voice],modelName:AUDIO_MODEL},audioConfig:{audioEncoding:'MP3'}};
}
function b64u(bytes){let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function googleAccessToken(env){
  if(!env.GOOGLE_TTS_CREDENTIALS)throw Error('Missing GOOGLE_TTS_CREDENTIALS secret');
  const c=JSON.parse(env.GOOGLE_TTS_CREDENTIALS);
  if(c.type!=='service_account'||!c.client_email||!c.private_key||c.token_uri!=='https://oauth2.googleapis.com/token')throw Error('Invalid Google service account configuration');
  const now=Math.floor(Date.now()/1000);
  const header=b64u(new TextEncoder().encode(JSON.stringify({alg:'RS256',typ:'JWT'})));
  const claims=b64u(new TextEncoder().encode(JSON.stringify({iss:c.client_email,scope:'https://www.googleapis.com/auth/cloud-platform',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+300})));
  const pem=c.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,'');
  const keyBytes=Uint8Array.from(atob(pem),ch=>ch.charCodeAt(0));
  const key=await crypto.subtle.importKey('pkcs8',keyBytes,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
  const sig=b64u(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,new TextEncoder().encode(header+'.'+claims))));
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:header+'.'+claims+'.'+sig})});
  if(!response.ok)throw Error('Google OAuth token request failed (HTTP '+response.status+')');
  const result=await response.json();if(!result.access_token)throw Error('Google OAuth response missing token');return result.access_token;
}
async function generateAudioSample(env,voice){
  if(!env.AUDIO_BUCKET)throw Error('Missing AUDIO_BUCKET R2 binding');
  const token=await googleAccessToken(env);
  const response=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(geminiAudioRequest(narrationText(AUDIO_SAMPLE),voice))});
  if(!response.ok)throw Error('Google synthesis failed (HTTP '+response.status+')');
  const data=await response.json();if(typeof data.audioContent!=='string')throw Error('Google did not return audio');
  const binary=atob(data.audioContent),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  await env.AUDIO_BUCKET.put('pilot/gemini31-'+voice+'.mp3',bytes,{httpMetadata:{contentType:'audio/mpeg'},customMetadata:{voice:AUDIO_VOICES[voice]}});
  return {voice,bytes:bytes.length};
}
// Published devotional recordings are generated only by the administrator.
const AUDIO_PARTS=new Set(['devotional','deeper','scripture']);
function audioScriptureClean(value){
  return String(value||'')
    .replace(/\s*\((?:WEB|WEBU|World English Bible(?: Updated Edition)?)\)/gi,'')
    .replace(/\s*[\[【](?:WEB|WEBU)[\]】]/gi,'')
    .replace(/\s+[-–—:,]\s*(?:WEB|WEBU)\b/g,'')
    .replace(/\bWEBU?\b/g,match=>match===match.toUpperCase()?'':match)
    .replace(/ {2,}/g,' ')
    .trim();
}
function audioText(d,part){
  if(part==='devotional')return [d.title,audioScriptureClean(d.mainScriptureText||''),d.short].filter(Boolean).join('. ');
  if(part==='deeper')return String(d.deeper||'').replace(/^\s*(?:#{1,6}\s*)?(?:\*\*|__)?Go Deeper(?:\*\*|__)?\s*[:.\-–—]?\s*(?:\r?\n|$)/i,'').trim();
  const passages=Array.isArray(d.contextPassages)?d.contextPassages:[];
  return passages.map(p=>[audioScriptureClean(p.reference||d.contextReferences||d.reference||''),...(p.verses||[]).map(v=>audioScriptureClean(v.text||''))].filter(Boolean).join('. ')).join(' ');
}
// Prepare narration without changing the displayed devotional or Scripture.
// Chirp 3 HD does not accept natural-language style instructions through this API.
function narrationText(value){
  return String(value||'')
    .replace(/\r\n?/g,'\n')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1')
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]*\)/g,'$1')
    .replace(/(?:^|\n)\s{0,3}#{1,6}\s+/g,'\n')
    .replace(/(?:^|\n)\s*>\s?/g,'\n')
    .replace(/(?:^|\n)\s*[-*+]\s+/g,'\n')
    .replace(/(?:^|\n)\s*\d+[.)]\s+/g,'\n')
    .replace(/\*{1,3}|_{2,3}|`{1,3}|~~/g,'')
    .replace(/\bhttps?:\/\/\S+/g,'')
    .replace(/[•▪◦]/g,', ')
    .replace(/[—–]/g,', ')
    .replace(/&/g,' and ')
    .replace(/\.{3,}|…/g,'. ')
    .replace(/\n[ \t]*\n+/g,'\n\n')
    .replace(/[ \t]+/g,' ')
    .replace(/ *\n */g,'\n')
    .trim();
}
// Pronunciation replacements affect generated narration only, never the displayed devotional.
async function audioOverrides(env){
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS audio_pronunciations (written TEXT PRIMARY KEY, spoken TEXT NOT NULL)').run();
  const rows=await env.DB.prepare('SELECT written,spoken FROM audio_pronunciations ORDER BY written COLLATE NOCASE').all();
  return rows.results||[];
}
function pronunciationText(text,entries){
  for(const {written,spoken} of [...entries].sort((a,b)=>b.written.length-a.written.length)){
    const escaped=written.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    // Avoid replacing inside longer Latin words, but support Greek and Hebrew scripts.
    const pattern=new RegExp('(^|[^\\p{L}\\p{N}])('+escaped+')(?=$|[^\\p{L}\\p{N}])','giu');
    text=text.replace(pattern,(_,prefix)=>prefix+spoken);
  }
  return text;
}
async function publishedAudioSource(env,id,part,request){
  const r=await env.DB.prepare('SELECT id,title,scripture,short,deeper,status FROM devotionals WHERE id=? AND status=?').bind(id,'published').first();
  if(!r)return null;
  const extra=(await scriptureExtras(env,[{id:r.id}]))[0];
  // Older imported devotionals may have no saved context passages. Retrieve them
  // from the self-hosted Bible when the audio library needs Scripture narration.
  if(part==='scripture'&&!(Array.isArray(extra.contextPassages)&&extra.contextPassages.some(p=>Array.isArray(p.verses)&&p.verses.length))){
    const stored=String(extra.contextReferences||'').trim();
    const fallback=await env.DB.prepare('SELECT scripture FROM devotionals WHERE id=?').bind(id).first();
    const reference=stored||String(fallback?.scripture||'').trim();
    if(reference){
      try{
        const result=await scriptureLookup(reference,env.ASSETS,request);
        if(Array.isArray(result.passages)&&result.passages.some(p=>Array.isArray(p.verses)&&p.verses.length))extra.contextPassages=result.passages;
        else if(Array.isArray(result.verses)&&result.verses.length)extra.contextPassages=[{reference,verses:result.verses}];
      }catch(e){console.error('Scripture audio lookup failed:',e.message)}
    }
  }
  // The context reference is spoken before the Scripture passage, even for older stored passages without a reference field.
  if(part==='scripture'&&Array.isArray(extra.contextPassages)){
    const refs=String(extra.contextReferences||r.scripture||'').trim().split(/\n+/).map(x=>x.trim()).filter(Boolean);
    extra.contextPassages=extra.contextPassages.map((p,i)=>({...p,reference:String(p.reference||refs[i]||refs[0]||r.scripture||'').trim()}));
  }
  const original=audioText({...r,...extra,reference:r.scripture},part).trim();
  const text=audioScriptureClean(narrationText(pronunciationText(narrationText(original),await audioOverrides(env))));
  if(!text)return null;
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(AUDIO_VERSION+'\n'+AUDIO_STYLE+'\n'+text)));
  const version=Array.from(digest.slice(0,12),b=>b.toString(16).padStart(2,'0')).join('');
  return {text,version,key:voice=>`devotionals/${id}/${part}/${voice}-${version}.mp3`};
}
// Find older R2 recordings by their actual stored keys; text changes never erase audio.
// Prefer current-version recordings. Legacy recordings are marked as outdated in the admin UI.
async function storedAudioRecording(env,id,part,voice,source){
  if(source){const key=source.key(voice),current=await env.AUDIO_BUCKET.head(key);if(current)return {key,item:current,outdated:false};}
  const prefix=`devotionals/${id}/${part}/${voice}-`;
  let cursor,latest=null;
  do{
    const page=await env.AUDIO_BUCKET.list({prefix,limit:1000,...(cursor?{cursor}:{})});
    for(const obj of page.objects||[]){
      if(!obj.key.endsWith('.mp3'))continue;
      if(!latest||new Date(obj.uploaded)>new Date(latest.uploaded))latest=obj;
    }
    cursor=page.truncated?page.cursor:null;
  }while(cursor);
  return latest?{key:latest.key,item:latest,outdated:true}:null;
}
// Remove superseded recordings only AFTER the new MP3 has been saved and verified.
// Scope deletion to this devotional, section and voice; never touch other voices.
async function deleteSupersededAudio(env,id,part,voice,keepKey){
  const prefix=`devotionals/${id}/${part}/${voice}-`;
  let cursor,removed=0,failed=0;
  do{
    const page=await env.AUDIO_BUCKET.list({prefix,limit:1000,...(cursor?{cursor}:{})});
    // Capture the cursor before deleting keys from this page.
    cursor=page.truncated?page.cursor:null;
    for(const object of page.objects||[]){
      if(object.key===keepKey||!object.key.endsWith('.mp3'))continue;
      try{await env.AUDIO_BUCKET.delete(object.key);removed++}
      catch(error){failed++;console.error('Unable to remove superseded audio:',error?.message||'R2 deletion failed')}
    }
  }while(cursor);
  return {removed,failed};
}
// Split longer readings at paragraph/sentence/word boundaries to fit Google's input limit.
function audioChunks(text,maxBytes=3200){
  const encoder=new TextEncoder(),chunks=[];
  let remaining=text.trim();
  while(remaining){
    if(encoder.encode(remaining).length<=maxBytes){chunks.push(remaining);break;}
    let end=0;
    // Search for a natural break within the byte limit; never split a UTF-8 character.
    for(let i=0;i<remaining.length;i++){
      if(encoder.encode(remaining.slice(0,i+1)).length>maxBytes)break;
      if(/[\s.!?]/.test(remaining[i]))end=i+1;
    }
    if(!end)throw Error('A word is too long for audio synthesis.');
    const candidate=remaining.slice(0,end);
    const breaks=[...candidate.matchAll(/(?:\n\n|[.!?][\s\n]+|\n|\s+)/g)];
    const preferred=breaks.filter(m=>m.index+m[0].length>=Math.floor(candidate.length*.55));
    if(preferred.length)end=preferred[preferred.length-1].index+preferred[preferred.length-1][0].length;
    chunks.push(remaining.slice(0,end).trim());
    remaining=remaining.slice(end).trim();
  }
  return chunks;
}
async function synthesizeDevotionalAudio(env,text,voice,key){
  if(!env.AUDIO_BUCKET)throw Error('Audio storage unavailable');
  const chunks=audioChunks(text);
  if(chunks.length>24)throw Error('Reading is too long for audio generation (over 24 sections).');
  const token=await googleAccessToken(env);
  const parts=[];
  for(let i=0;i<chunks.length;i++){
    const response=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(geminiAudioRequest(chunks[i],voice))});
    if(!response.ok)throw Error('Google synthesis failed on section '+(i+1)+' of '+chunks.length+' (HTTP '+response.status+'). No recording was saved.');
    const result=await response.json();
    if(!result.audioContent)throw Error('Google returned no audio for section '+(i+1)+'. No recording was saved.');
    const raw=atob(result.audioContent),bytes=new Uint8Array(raw.length);
    for(let j=0;j<raw.length;j++)bytes[j]=raw.charCodeAt(j);
    parts.push(bytes);
  }
  // Each section is a complete MP3 stream; concatenation preserves playback in browsers.
  const size=parts.reduce((total,part)=>total+part.length,0);
  const audio=new Uint8Array(size);let offset=0;
  for(const part of parts){audio.set(part,offset);offset+=part.length;}
  await env.AUDIO_BUCKET.put(key,audio,{httpMetadata:{contentType:'audio/mpeg'}});
  return size;
}

const AUDIO_LIBRARY_HTML=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WHDC Audio Library</title><meta name="theme-color" content="#e3e9df"><style>html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}body{overflow-wrap:anywhere}button,input,select{min-height:44px;font-size:16px}input,select{max-width:100%}audio{max-width:100%}@media(max-width:720px){body{margin:0!important;padding:16px!important}button{margin:3px}pre{white-space:pre-wrap;overflow-wrap:anywhere}}</style><body style="font:16px system-ui;max-width:860px;margin:2rem auto;padding:1rem;line-height:1.5"><a href="/admin">← Admin Dashboard</a><h1>Devotional Audio Library</h1><p>Generate recordings for published devotionals. Only saved recordings are available to readers; recordings automatically become outdated when their source text changes.</p><p id="status" role="status">Loading devotionals…</p><section id="savedVoiceSamples" style="padding:16px;border:1px solid #ccc;border-radius:12px;margin:18px 0"><h2>One-time AI voice samples</h2><p>Generate each sample once and save it to R2. Readers can preview these recordings in Settings without generating audio again.</p><div id="savedSampleRows"></div><p id="savedSampleStatus" role="status"></p></section><div id="items"></div><script>
const status=document.getElementById('status'),items=document.getElementById('items');
const pronunciation=document.createElement('section');pronunciation.innerHTML='<h2>Pronunciation Overrides</h2><p>Replace words only in generated narration. Written devotionals stay unchanged. Save overrides before generating recordings. Previously generated recordings will need regeneration when an override changes.</p><form id="pronunciationForm"><label>Written word <input name="written" required maxlength="100" placeholder="hesed"></label> <label>Spoken pronunciation <input name="spoken" required maxlength="150" placeholder="HEH-sed"></label> <button>Save pronunciation</button></form><div id="pronunciationList"></div><h3>Preview pronunciation</h3><label>Test text <input id="pronunciationPreviewText" value="God’s hesed never fails." style="width:min(100%,420px)"></label> <select id="pronunciationVoice"><option value="sulafat">Sulafat</option><option value="sadachbia">Sadachbia</option></select> <button id="pronunciationPreviewButton">Generate test</button><p id="pronunciationPreviewStatus" role="status" aria-live="polite"></p><audio id="pronunciationPlayer" controls preload="none" style="display:block;margin-top:10px;max-width:100%"></audio><hr>';items.before(pronunciation);
const sampleRoot=document.getElementById('savedSampleRows'),sampleStatus=document.getElementById('savedSampleStatus');
for(const voice of ['sulafat','sadachbia']){
 const row=document.createElement('div');row.style.cssText='margin:12px 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap';
 const label=document.createElement('strong');label.textContent=voice==='sulafat'?'Sulafat (female)':'Sadachbia (male)';
 const button=document.createElement('button');button.textContent='Generate sample once';
 const player=document.createElement('audio');player.controls=true;player.preload='none';player.style.maxWidth='100%';
 const url='/api/audio/sample?voice='+voice;
 async function refresh(){try{const r=await fetch(url,{method:'HEAD',cache:'no-store'});if(r.ok){button.hidden=true;player.src=url;sampleStatus.textContent='Saved voice sample available.'}else{button.hidden=false;player.removeAttribute('src')}}catch{button.hidden=false}}
 button.onclick=async()=>{button.disabled=true;sampleStatus.textContent='Generating '+voice+' sample…';try{const r=await fetch('/api/admin/audio-test/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({voice})});const result=await r.json();if(!r.ok)throw Error(result.error||'Sample generation failed');await refresh();sampleStatus.textContent='Sample saved in R2. You will not need to generate it again.'}catch(e){sampleStatus.textContent=e.message}finally{button.disabled=false}};
 row.append(label,button,player);sampleRoot.append(row);refresh();
}
const pronunciationList=document.getElementById('pronunciationList');
async function loadPronunciations(){const entries=await api('/api/admin/audio/pronunciations');pronunciationList.replaceChildren();for(const entry of entries){const row=document.createElement('div');row.style.margin='7px 0';const name=document.createElement('span');name.textContent=entry.written+' → '+entry.spoken+' ';const edit=document.createElement('button');edit.textContent='Edit';edit.onclick=()=>{const form=document.getElementById('pronunciationForm');form.elements.written.value=entry.written;form.elements.spoken.value=entry.spoken;form.elements.written.readOnly=true;form.elements.spoken.focus()};const remove=document.createElement('button');remove.textContent='Delete';remove.onclick=async()=>{if(!confirm('Delete this pronunciation?'))return;await api('/api/admin/audio/pronunciations',{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({written:entry.written})});await loadPronunciations()};row.append(name,edit,remove);pronunciationList.append(row)}}
document.getElementById('pronunciationForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget;try{await api('/api/admin/audio/pronunciations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({written:f.elements.written.value.trim(),spoken:f.elements.spoken.value.trim()})});f.reset();f.elements.written.readOnly=false;await loadPronunciations();status.textContent='Pronunciation saved. New recordings will use it.'}catch(err){status.textContent=err.message}};
document.getElementById('pronunciationPreviewButton').onclick=async()=>{const b=document.getElementById('pronunciationPreviewButton'),player=document.getElementById('pronunciationPlayer'),message=document.getElementById('pronunciationPreviewStatus');b.disabled=true;b.textContent='Generating…';message.textContent='Generating pronunciation preview…';player.pause();player.removeAttribute('src');player.load();try{const out=await api('/api/admin/audio/pronunciation-preview',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:document.getElementById('pronunciationPreviewText').value,voice:document.getElementById('pronunciationVoice').value})});if(typeof out.audio!=='string'||!out.audio.length)throw Error('The voice service returned no playable audio.');player.src='data:audio/mpeg;base64,'+out.audio;player.load();message.textContent='Preview ready. Press Play to listen. No devotional recording was saved.'}catch(err){message.textContent='Preview failed: '+err.message}finally{b.disabled=false;b.textContent='Generate test'}};
loadPronunciations().catch(e=>status.textContent=e.message);
async function api(path,opts){const r=await fetch(path,{credentials:'same-origin',cache:'no-store',...opts});const j=await r.json();if(!r.ok)throw Error(j.error||'Request failed');return j}
async function audioAction(path,payload,method='POST'){return api(path,{method,headers:{'content-type':'application/json'},body:JSON.stringify(payload)})}
(async()=>{try{const ds=await api('/api/admin/devotionals');status.textContent=ds.filter(d=>d.status==='published').length+' published devotionals';for(const d of ds.filter(x=>x.status==='published')){const section=document.createElement('section');section.style.cssText='padding:16px 0;border-bottom:1px solid #ddd';const h=document.createElement('h2');h.textContent='Day '+d.day+': '+d.title;h.style.fontSize='1.1rem';section.append(h);for(const part of ['devotional','deeper','scripture']){const row=document.createElement('div');row.style.margin='9px 0';const label=document.createElement('strong');label.textContent=part;row.append(label);for(const voice of ['sulafat','sadachbia']){const box=document.createElement('div');box.style.cssText='padding:7px 0;border-bottom:1px dotted #ddd';const name=document.createElement('strong');name.textContent=voice.charAt(0).toUpperCase()+voice.slice(1)+' ';const generate=document.createElement('button');const remove=document.createElement('button');remove.textContent='Delete recording';remove.style.marginLeft='6px';remove.disabled=true;remove.hidden=true;const message=document.createElement('span');message.setAttribute('role','status');message.style.marginLeft='8px';const player=document.createElement('audio');player.controls=true;player.preload='none';player.onerror=()=>{if(player.getAttribute('src'))message.textContent=' Playback failed: saved recording could not be loaded.'};player.style.cssText='display:none;max-width:100%;width:350px;margin-top:5px';const payload={id:d.id,part,voice};const playback='/api/audio/'+encodeURIComponent(d.id)+'/'+part+'/'+voice;let busy=false;function update(present){generate.textContent=present?'Regenerate':'Generate';remove.disabled=!present;remove.hidden=!present;player.style.display=present?'block':'none';if(present){player.src=playback+'?v='+Date.now();player.load()}else{player.pause();player.removeAttribute('src');player.load()}}async function refresh(){try{const result=await audioAction('/api/admin/audio/status',payload);update(result.exists);message.textContent=result.exists?(result.outdated?' Previous recording (outdated, regenerate to update)':' Saved')+' ('+Math.max(1,Math.round((result.bytes||0)/1024))+' KB)':' Not generated'}catch(e){update(false);if(part==='scripture'&&/Published reading unavailable/i.test(e.message)){message.textContent=' Scripture text unavailable. Check Scripture in Context in the devotional editor.'}else{message.textContent=' Status unavailable: '+e.message}}}generate.onclick=async()=>{if(busy)return;const replacing=!remove.disabled;if(replacing&&!confirm('Replace the saved '+voice+' '+part+' recording for '+d.title+'? This will generate new audio and may incur a Google voice charge.'))return;busy=true;generate.disabled=true;remove.disabled=true;message.textContent=' Generating…';status.textContent='Generating '+d.title+' / '+part+' / '+voice+'…';try{const generation=await audioAction('/api/admin/audio/generate',{...payload,regenerate:replacing});await refresh();if(remove.disabled)throw Error('Recording could not be verified in R2 after generation.');message.textContent=generation.cleanupFailed?' Recording saved. Some older recordings could not be deleted.':' Recording saved. Press Play below.';status.textContent=generation.cleanupFailed?'New recording saved; some older recordings remain in R2.':'Recording saved. Player is ready.'}catch(e){await refresh();message.textContent=' Generation failed: '+e.message;status.textContent='Generation failed: '+e.message}finally{busy=false;generate.disabled=false}};remove.onclick=async()=>{if(busy||!confirm('Permanently delete the '+voice+' '+part+' recording for '+d.title+'?'))return;busy=true;generate.disabled=true;remove.disabled=true;message.textContent=' Deleting…';try{await audioAction('/api/admin/audio/recording',payload,'DELETE');update(false);message.textContent=' Recording deleted';status.textContent='Recording deleted.'}catch(e){message.textContent=' Delete failed: '+e.message;await refresh()}finally{busy=false;generate.disabled=false}};box.append(name,generate,remove,message,player);row.append(box);refresh()}section.append(row)}items.append(section)}}catch(e){status.textContent=e.message}})();
</script></body></html>`;
const AUDIO_TEST_HTML=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WHDC Voice Test</title><body style="font:16px system-ui;max-width:720px;margin:3rem auto;padding:1rem;line-height:1.6"><a href="/admin">← Admin</a><h1>WHDC Gemini 3.1 Flash Voice Test</h1><p>Admin-only preview. Generate each sample once, then listen to its stored R2 recording. This does not change reader audio.</p><p>Sample: ${AUDIO_SAMPLE}</p><div id="voices"></div><p id="status" role="status"></p><script>const status=document.getElementById('status'),root=document.getElementById('voices');for(const voice of ['sulafat','sadachbia']){const box=document.createElement('section');const title=document.createElement('h2');title.textContent=voice==='sadachbia'?'Sadachbia (male)':voice.charAt(0).toUpperCase()+voice.slice(1)+' (female)';const btn=document.createElement('button');btn.textContent='Generate sample';const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src='/api/admin/audio-test/file?voice='+voice;btn.onclick=async()=>{btn.disabled=true;status.textContent='Generating '+voice+'…';try{const r=await fetch('/api/admin/audio-test/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({voice})});const data=await r.json();if(!r.ok)throw Error(data.error||'Generation failed');audio.src='/api/admin/audio-test/file?voice='+voice+'&v='+Date.now();status.textContent='Saved '+voice+' recording to R2.'}catch(e){status.textContent=e.message}finally{btn.disabled=false}};box.append(title,btn,document.createElement('br'),audio);root.append(box)}</script></body></html>`;



const pushSameOrigin=(request)=>{const origin=request.headers.get('Origin');return !!origin&&origin===new URL(request.url).origin};
const pushDigest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join('');
const pushValidate=body=>{
 const sub=body?.subscription,endpoint=sub?.endpoint,keys=sub?.keys,p=body?.preferences;
 if(typeof endpoint!=='string'||endpoint.length>2048||!/^https:\/\//.test(endpoint)||!/^https:\/\/(?:[^/]+\.)?(?:push\.apple\.com|push\.services\.mozilla\.com|fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|android\.googleapis\.com)(?:\/|$)/.test(endpoint))throw Error('Unsupported push endpoint');
 if(typeof keys?.p256dh!=='string'||!/^[-_A-Za-z0-9]{60,200}$/.test(keys.p256dh)||typeof keys?.auth!=='string'||!/^[-_A-Za-z0-9]{10,100}$/.test(keys.auth))throw Error('Invalid subscription keys');
 if(!p||typeof p!=='object'||typeof p.announcements_enabled!=='boolean'||typeof p.reminders_enabled!=='boolean'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.reminder_local_time)||!Array.isArray(p.reminder_days)||p.reminder_days.length>7||p.reminder_days.some(d=>!Number.isInteger(d)||d<0||d>6)||new Set(p.reminder_days).size!==p.reminder_days.length||typeof p.timezone!=='string'||p.timezone.length>80)throw Error('Invalid notification preferences');
 try{new Intl.DateTimeFormat('en-US',{timeZone:p.timezone})}catch{throw Error('Invalid time zone')}
 if(p.memory_reminders_enabled!==undefined&&typeof p.memory_reminders_enabled!=='boolean')throw Error('Invalid scripture memory reminder preference');
 if(p.memory_reminder_local_time!==undefined&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.memory_reminder_local_time))throw Error('Invalid scripture memory time');
 if(p.memory_reminder_days!==undefined&&(!Array.isArray(p.memory_reminder_days)||p.memory_reminder_days.length>7||p.memory_reminder_days.some(d=>!Number.isInteger(d)||d<0||d>6)||new Set(p.memory_reminder_days).size!==p.memory_reminder_days.length))throw Error('Invalid scripture memory days');
 if(p.plan_reminders_enabled!==undefined&&typeof p.plan_reminders_enabled!=='boolean')throw Error('Invalid reading plan reminder preference');
 if(p.plan_reminder_local_time!==undefined&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.plan_reminder_local_time))throw Error('Invalid reading plan time');
 if(p.plan_reminder_days!==undefined&&(!Array.isArray(p.plan_reminder_days)||p.plan_reminder_days.length>7||p.plan_reminder_days.some(d=>!Number.isInteger(d)||d<0||d>6)||new Set(p.plan_reminder_days).size!==p.plan_reminder_days.length))throw Error('Invalid reading plan days');
 return {sub,p};
};


// Web Push: RFC 8291 aes128gcm content encoding and RFC 8292 VAPID.
const pushB64=(bytes)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const pushUnb64=(str)=>Uint8Array.from(atob(str.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(str.length/4)*4,'=')),c=>c.charCodeAt(0));
const pushConcat=(...parts)=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let i=0;for(const p of parts){out.set(p,i);i+=p.length}return out};
const pushUtf8=(str)=>new TextEncoder().encode(str);
async function pushHKDF(ikm,salt,info,len){
 const base=await crypto.subtle.importKey('raw',ikm,'HKDF',false,['deriveBits']);
 return new Uint8Array(await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info},base,len*8));
}
async function pushEncryptedPayload(subscription,payload){
 const clientKey=pushUnb64(subscription.p256dh),auth=pushUnb64(subscription.auth);
 if(clientKey.length!==65||clientKey[0]!==4||auth.length!==16)throw Error('Invalid client push key');
 const serverKeys=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
 const serverPublic=new Uint8Array(await crypto.subtle.exportKey('raw',serverKeys.publicKey));
 const clientPublic=await crypto.subtle.importKey('raw',clientKey,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const shared=new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:clientPublic},serverKeys.privateKey,256));
 const info=pushConcat(pushUtf8('WebPush: info\0'),clientKey,serverPublic);
 const ikm=await pushHKDF(shared,auth,info,32);
 const salt=crypto.getRandomValues(new Uint8Array(16));
 const cek=await pushHKDF(ikm,salt,pushUtf8('Content-Encoding: aes128gcm\0'),16);
 const nonce=await pushHKDF(ikm,salt,pushUtf8('Content-Encoding: nonce\0'),12);
 const key=await crypto.subtle.importKey('raw',cek,'AES-GCM',false,['encrypt']);
 const plaintext=pushConcat(pushUtf8(JSON.stringify(payload)),new Uint8Array([2]));
 if(plaintext.length>3990)throw Error('Push payload too long');
 const ciphertext=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce},key,plaintext));
 const rs=new Uint8Array([0,0,16,0]); // 4096 bytes
 return pushConcat(salt,rs,new Uint8Array([serverPublic.length]),serverPublic,ciphertext);
}
async function pushVapidToken(endpoint,env){
 const publicBytes=pushUnb64(env.VAPID_PUBLIC_KEY||'');
 const privateBytes=pushUnb64(env.VAPID_PRIVATE_KEY||'');
 if(publicBytes.length!==65||publicBytes[0]!==4||privateBytes.length!==32)throw Error('VAPID keys missing or invalid');
 const jwk={kty:'EC',crv:'P-256',x:pushB64(publicBytes.slice(1,33)),y:pushB64(publicBytes.slice(33)),d:pushB64(privateBytes),ext:false};
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const subject=env.VAPID_SUBJECT||'';
 if(!/^mailto:\S+@\S+$/.test(subject)&&!/^https:\/\//.test(subject))throw Error('VAPID subject is invalid');
 const jwtHeader=pushB64(pushUtf8(JSON.stringify({typ:'JWT',alg:'ES256'})));
 const jwtBody=pushB64(pushUtf8(JSON.stringify({aud:new URL(endpoint).origin,exp:Math.floor(Date.now()/1000)+43200,sub:subject})));
 const input=jwtHeader+'.'+jwtBody;
 const signature=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,pushUtf8(input)));
 return {token:input+'.'+pushB64(signature),publicKey:env.VAPID_PUBLIC_KEY};
}
async function pushSend(row,env,payload){
 const endpoint=new URL(row.endpoint);
 if(endpoint.protocol!=='https:'||!/^https:\/\/(?:[^/]+\.)?(?:push\.apple\.com|push\.services\.mozilla\.com|fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|android\.googleapis\.com)(?:\/|$)/.test(row.endpoint))throw Error('Untrusted push endpoint');
 const vapid=await pushVapidToken(row.endpoint,env);
 const body=await pushEncryptedPayload(row,payload);
 const response=await fetch(row.endpoint,{method:'POST',headers:{'TTL':'86400','Content-Encoding':'aes128gcm','Content-Type':'application/octet-stream','Authorization':'vapid t='+vapid.token+', k='+vapid.publicKey},body,redirect:'manual'});
 if(response.status===404||response.status===410){
  await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint_hash=? AND endpoint=?').bind(row.endpoint_hash,row.endpoint).run();
  return false;
 }
 if(!response.ok)throw Error('Push provider rejected request ('+response.status+')');
 return true;
}
function pushLocalHour(timezone,now=new Date()){
 try{return Number(new Intl.DateTimeFormat('en-US',{timeZone:timezone||'UTC',hour:'2-digit',hourCycle:'h23'}).format(now))}catch{return -1}
}
async function pushPublishAnnouncement(env,revision,title,body,onlyMorning=false){
 const {results=[]}=await env.DB.prepare('SELECT endpoint_hash,endpoint,p256dh,auth,timezone,last_announcement_revision FROM push_subscriptions WHERE announcements_enabled=1 AND last_announcement_revision<? LIMIT 10000').bind(revision).all();
 const summary=body.replace(/[*_`#]/g,'').slice(0,180);
 for(let i=0;i<results.length;i+=10)await Promise.all(results.slice(i,i+10).map(async row=>{
  try{
   const hour=pushLocalHour(row.timezone);
   if(onlyMorning?hour!==8:hour<8||hour>=21)return;
   const claim=await env.DB.prepare('UPDATE push_subscriptions SET last_announcement_revision=? WHERE endpoint_hash=? AND announcements_enabled=1 AND last_announcement_revision<?').bind(revision,row.endpoint_hash,revision).run();
   if(!claim.meta?.changes)return;
   try{await pushSend(row,env,{title:"What's New",body:summary,url:'/#home',tag:'whdc-news-'+revision,badgeType:'announcement'})}
   catch(e){await env.DB.prepare('UPDATE push_subscriptions SET last_announcement_revision=? WHERE endpoint_hash=? AND last_announcement_revision=?').bind(revision-1,row.endpoint_hash,revision).run();throw e}
  }catch(e){console.error('Announcement push failed',e)}
 }));
}
async function pushDeferredAnnouncements(env){
 const row=await env.DB.prepare('SELECT title,body,revision,visible FROM site_announcement WHERE id=1').first();
 if(row?.visible&&row.revision>0)await pushPublishAnnouncement(env,row.revision,row.title,row.body,true);
}
async function ensurePlanReminderColumns(env){
 const cols=(await env.DB.prepare('PRAGMA table_info(push_subscriptions)').all()).results||[];
 if(!cols.some(c=>c.name==='plan_reminders_enabled'))await env.DB.prepare('ALTER TABLE push_subscriptions ADD COLUMN plan_reminders_enabled INTEGER NOT NULL DEFAULT 0').run();
 if(!cols.some(c=>c.name==='plan_reminder_local_time'))await env.DB.prepare("ALTER TABLE push_subscriptions ADD COLUMN plan_reminder_local_time TEXT NOT NULL DEFAULT '08:00'").run();
 if(!cols.some(c=>c.name==='plan_reminder_days'))await env.DB.prepare("ALTER TABLE push_subscriptions ADD COLUMN plan_reminder_days TEXT NOT NULL DEFAULT '[0,1,2,3,4,5,6]'").run();
 if(!cols.some(c=>c.name==='memory_reminders_enabled'))await env.DB.prepare('ALTER TABLE push_subscriptions ADD COLUMN memory_reminders_enabled INTEGER NOT NULL DEFAULT 0').run();
 if(!cols.some(c=>c.name==='memory_reminder_local_time'))await env.DB.prepare("ALTER TABLE push_subscriptions ADD COLUMN memory_reminder_local_time TEXT NOT NULL DEFAULT '08:00'").run();
 if(!cols.some(c=>c.name==='memory_reminder_days'))await env.DB.prepare("ALTER TABLE push_subscriptions ADD COLUMN memory_reminder_days TEXT NOT NULL DEFAULT '[0,1,2,3,4,5,6]'").run();
 if(!cols.some(c=>c.name==='last_memory_local_date'))await env.DB.prepare('ALTER TABLE push_subscriptions ADD COLUMN last_memory_local_date TEXT').run();
 if(!cols.some(c=>c.name==='last_plan_local_date'))await env.DB.prepare('ALTER TABLE push_subscriptions ADD COLUMN last_plan_local_date TEXT').run();
}
async function pushReadingPlanReminders(env){
 await ensurePlanReminderColumns(env);
 const now=new Date();const {results=[]}=await env.DB.prepare('SELECT endpoint_hash,endpoint,p256dh,auth,plan_reminder_local_time,plan_reminder_days,timezone,last_plan_local_date FROM push_subscriptions WHERE plan_reminders_enabled=1 LIMIT 10000').all();
 for(let i=0;i<results.length;i+=10)await Promise.all(results.slice(i,i+10).map(async row=>{
  try{const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:row.timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(now).map(p=>[p.type,p.value]));
   const date=parts.year+'-'+parts.month+'-'+parts.day;
   if(parts.hour+':'+parts.minute!==row.plan_reminder_local_time||!JSON.parse(row.plan_reminder_days||'[]').includes(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday))||row.last_plan_local_date===date)return;
   const claim=await env.DB.prepare("UPDATE push_subscriptions SET last_plan_local_date=? WHERE endpoint_hash=? AND plan_reminders_enabled=1 AND (last_plan_local_date IS NULL OR last_plan_local_date<>?)").bind(date,row.endpoint_hash,date).run();if(!claim.meta?.changes)return;
   try{await pushSend(row,env,{title:'Reading Reminder',body:'Continue your reading plan when you are ready.',url:'/#plans',tag:'whdc-plan-'+date,badgeType:'plan'})}
   catch(e){console.error('Plan reminder push failed',e);await env.DB.prepare('UPDATE push_subscriptions SET last_plan_local_date=NULL WHERE endpoint_hash=? AND last_plan_local_date=?').bind(row.endpoint_hash,date).run()}
  }catch(e){console.error('Plan reminder processing failed',e)}
 }));
}
async function pushScriptureMemoryReminders(env){
 await ensurePlanReminderColumns(env);
 const now=new Date();const {results=[]}=await env.DB.prepare('SELECT endpoint_hash,endpoint,p256dh,auth,memory_reminder_local_time,memory_reminder_days,timezone,last_memory_local_date FROM push_subscriptions WHERE memory_reminders_enabled=1 LIMIT 10000').all();
 for(let i=0;i<results.length;i+=10)await Promise.all(results.slice(i,i+10).map(async row=>{
  try{const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:row.timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(now).map(p=>[p.type,p.value]));
   const date=parts.year+'-'+parts.month+'-'+parts.day;
   if(parts.hour+':'+parts.minute!==row.memory_reminder_local_time||!JSON.parse(row.memory_reminder_days||'[]').includes(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday))||row.last_memory_local_date===date)return;
   const claim=await env.DB.prepare("UPDATE push_subscriptions SET last_memory_local_date=? WHERE endpoint_hash=? AND memory_reminders_enabled=1 AND (last_memory_local_date IS NULL OR last_memory_local_date<>?)").bind(date,row.endpoint_hash,date).run();if(!claim.meta?.changes)return;
   try{await pushSend(row,env,{title:'Scripture Memory',body:'Take a moment to practice a favorite verse.',url:'/#favorite-verses',tag:'whdc-memory-'+date})}
   catch(e){console.error('Scripture memory push failed',e);await env.DB.prepare('UPDATE push_subscriptions SET last_memory_local_date=NULL WHERE endpoint_hash=? AND last_memory_local_date=?').bind(row.endpoint_hash,date).run()}
  }catch(e){console.error('Scripture memory reminder processing failed',e)}
 }));
}
async function pushDailyReminders(env){
 const now=new Date();
 const {results=[]}=await env.DB.prepare('SELECT endpoint_hash,endpoint,p256dh,auth,reminder_local_time,reminder_days,timezone,last_reminder_local_date FROM push_subscriptions WHERE reminders_enabled=1 LIMIT 10000').all();
 for(let i=0;i<results.length;i+=10)await Promise.all(results.slice(i,i+10).map(async row=>{
  try{
   if(!row.timezone||!row.reminder_local_time)return;
   const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:row.timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(now).map(p=>[p.type,p.value]));
   const date=parts.year+'-'+parts.month+'-'+parts.day;
   const minute=parts.hour+':'+parts.minute;
   const weekday=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday);
   if(minute!==row.reminder_local_time||!JSON.parse(row.reminder_days||'[]').includes(weekday)||row.last_reminder_local_date===date)return;
   // Atomic claim prevents overlapping cron invocations from sending duplicates.
   const claim=await env.DB.prepare("UPDATE push_subscriptions SET last_reminder_local_date=? WHERE endpoint_hash=? AND reminders_enabled=1 AND (last_reminder_local_date IS NULL OR last_reminder_local_date<>?)").bind(date,row.endpoint_hash,date).run();
   if(!claim.meta?.changes)return;
   try{await pushSend(row,env,{title:"Today's Devotional",body:"Take a moment with today's devotional.",url:'/#today',tag:'whdc-daily-'+date})}
   catch(e){console.error('Daily reminder push failed',e);await env.DB.prepare('UPDATE push_subscriptions SET last_reminder_local_date=NULL WHERE endpoint_hash=? AND last_reminder_local_date=?').bind(row.endpoint_hash,date).run()}
  }catch(e){console.error('Daily reminder processing failed',e)}
 }));
}


const READING_PLANS_ADMIN_HTML=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reading Plans | WHDC Admin</title><style>body{font:16px system-ui;color:#303b3c;background:#f3f5f2;max-width:900px;margin:auto;padding:24px;line-height:1.5}input,textarea,select,button{font:inherit}input,textarea,select{width:100%;box-sizing:border-box;padding:10px;margin:4px 0 12px}button{padding:10px 16px;margin:4px;cursor:pointer}section{background:white;border:1px solid #ddd;border-radius:12px;padding:20px;margin:16px 0}label{display:block;font-weight:600}.muted{color:#58636a}#items button{font-size:14px}#devotions{height:240px}a{color:#315b5c}</style><a href="/admin">← Admin dashboard</a><h1>Reading Plans</h1><p>Create guided plans from published devotionals. Existing devotional series are generated automatically in the reader app. This dashboard manages additional custom plans.</p><section><h2 id="editorTitle">Create a plan</h2><form id="form"><label>Plan ID (lowercase letters, numbers, hyphens)<input id="id" required pattern="[a-z0-9][a-z0-9-]*" maxlength="80" placeholder="finding-hope"></label><label>Title<input id="title" required maxlength="120"></label><label>Description<textarea id="description" maxlength="600" rows="3"></textarea></label><label>Choose devotionals in reading order (Ctrl/Command-click to select multiple)<select id="devotions" multiple required></select></label><label>Sort order<input id="sort" type="number" value="0"></label><label><input type="checkbox" id="published" style="width:auto" checked> Published (visible to readers)</label><p id="status" role="status"></p><button type="submit">Save plan</button><button type="button" id="reset">New plan</button></form></section><section><h2>Custom plans</h2><div id="items">Loading…</div></section><script>
const $=id=>document.getElementById(id);let plans=[];
async function api(url,opts){const r=await fetch(url,{credentials:'same-origin',cache:'no-store',...opts});const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');return d}
const payload=(method,body)=>({method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
function clear(){for(const id of ['id','title','description'])$(id).value='';$('sort').value='0';$('published').checked=true;for(const o of $('devotions').options)o.selected=false;$('id').readOnly=false;$('editorTitle').textContent='Create a plan'}
function edit(id){const p=plans.find(x=>x.id===id);if(!p)return;$('id').value=p.id;$('id').readOnly=true;$('title').value=p.title;$('description').value=p.description;$('sort').value=p.sort_order;$('published').checked=!!p.published;for(const o of $('devotions').options)o.selected=p.devotional_ids.includes(o.value);$('editorTitle').textContent='Edit plan';scrollTo(0,0)}
async function refresh(){plans=await api('/api/admin/reading-plans');$('items').replaceChildren();for(const p of plans){const row=document.createElement('p');row.append(document.createTextNode(p.title+' ('+p.devotional_ids.length+' readings, '+(p.published?'published':'draft')+') '));const b=document.createElement('button');b.textContent='Edit';b.onclick=()=>edit(p.id);const del=document.createElement('button');del.textContent='Delete';del.onclick=async()=>{if(!confirm('Delete '+p.title+'?'))return;try{await api('/api/admin/reading-plans',payload('DELETE',{id:p.id}));await refresh()}catch(e){$('status').textContent=e.message}};row.append(b,del);$('items').append(row)}if(!plans.length)$('items').textContent='No custom plans yet.'}
$('reset').onclick=clear;
$('form').onsubmit=async e=>{e.preventDefault();const ids=Array.from($('devotions').selectedOptions,x=>x.value);if(!ids.length){$('status').textContent='Choose at least one devotional.';return}try{await api('/api/admin/reading-plans',payload('POST',{id:$('id').value,title:$('title').value,description:$('description').value,devotional_ids:ids,published:$('published').checked,sort_order:Number($('sort').value)||0}));$('status').textContent='Plan saved.';clear();await refresh()}catch(e){$('status').textContent=e.message}};
(async()=>{try{const ds=await api('/api/admin/devotionals');for(const d of ds.filter(x=>x.status==='published').sort((a,b)=>Number(a.day)-Number(b.day))){const o=document.createElement('option');o.value=d.id;o.textContent='Day '+d.day+': '+d.title;$('devotions').append(o)}await refresh()}catch(e){$('status').textContent=e.message}})();
</script></html>`;

export default {async fetch(request,env,ctx){
  const url=new URL(request.url),path=url.pathname;

  if(path==='/api/push/public-key'&&request.method==='GET')return json({publicKey:env.VAPID_PUBLIC_KEY||''});
  if(path==='/api/push/preferences'&&request.method==='GET'){
    const endpoint=url.searchParams.get('endpoint')||'';
    if(endpoint.length<10||endpoint.length>2048)return fail('Invalid endpoint');
    const hash=await pushDigest(endpoint);
    try{await ensurePlanReminderColumns(env);const row=await env.DB.prepare('SELECT announcements_enabled,reminders_enabled,reminder_local_time,reminder_days,timezone,plan_reminders_enabled,plan_reminder_local_time,plan_reminder_days,memory_reminders_enabled,memory_reminder_local_time,memory_reminder_days FROM push_subscriptions WHERE endpoint_hash=? AND endpoint=?').bind(hash,endpoint).first();
      return json({preferences:row?{announcements_enabled:!!row.announcements_enabled,reminders_enabled:!!row.reminders_enabled,reminder_local_time:row.reminder_local_time,reminder_days:JSON.parse(row.reminder_days),timezone:row.timezone,plan_reminders_enabled:!!row.plan_reminders_enabled,plan_reminder_local_time:row.plan_reminder_local_time,plan_reminder_days:JSON.parse(row.plan_reminder_days),memory_reminders_enabled:!!row.memory_reminders_enabled,memory_reminder_local_time:row.memory_reminder_local_time,memory_reminder_days:JSON.parse(row.memory_reminder_days)}:null});
    }catch{return fail('Notification database unavailable',503)}
  }
  if((path==='/api/push/subscribe'||path==='/api/push/unsubscribe')&&request.method==='POST'){
    if(!pushSameOrigin(request))return fail('Invalid origin',403);
    if(Number(request.headers.get('content-length')||0)>12000)return fail('Request too large',413);
    let body;try{body=await request.json()}catch{return fail('Invalid JSON')}
    if(path==='/api/push/unsubscribe'){
      const endpoint=body?.endpoint;if(typeof endpoint!=='string'||endpoint.length>2048)return fail('Invalid endpoint');
      try{await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint_hash=? AND endpoint=?').bind(await pushDigest(endpoint),endpoint).run();return json({ok:true})}catch{return fail('Notification database unavailable',503)}
    }
    let validated;try{validated=pushValidate(body)}catch(e){return fail(e.message)}
    const {sub,p}=validated;
    try{
      await ensurePlanReminderColumns(env);
      await env.DB.prepare(`INSERT INTO push_subscriptions(endpoint_hash,endpoint,p256dh,auth,announcements_enabled,reminders_enabled,reminder_local_time,reminder_days,timezone,plan_reminders_enabled,plan_reminder_local_time,plan_reminder_days,memory_reminders_enabled,memory_reminder_local_time,memory_reminder_days)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(endpoint_hash) DO UPDATE SET endpoint=excluded.endpoint,p256dh=excluded.p256dh,auth=excluded.auth,announcements_enabled=excluded.announcements_enabled,reminders_enabled=excluded.reminders_enabled,reminder_local_time=excluded.reminder_local_time,reminder_days=excluded.reminder_days,timezone=excluded.timezone,plan_reminders_enabled=excluded.plan_reminders_enabled,plan_reminder_local_time=excluded.plan_reminder_local_time,plan_reminder_days=excluded.plan_reminder_days,memory_reminders_enabled=excluded.memory_reminders_enabled,memory_reminder_local_time=excluded.memory_reminder_local_time,memory_reminder_days=excluded.memory_reminder_days,updated_at=CURRENT_TIMESTAMP`)
      .bind(await pushDigest(sub.endpoint),sub.endpoint,sub.keys.p256dh,sub.keys.auth,Number(p.announcements_enabled),Number(p.reminders_enabled),p.reminder_local_time,JSON.stringify(p.reminder_days),p.timezone,Number(!!p.plan_reminders_enabled),p.plan_reminder_local_time||p.reminder_local_time,JSON.stringify(p.plan_reminder_days||p.reminder_days),Number(!!p.memory_reminders_enabled),p.memory_reminder_local_time||'08:00',JSON.stringify(p.memory_reminder_days||[0,1,2,3,4,5,6])).run();
      return json({ok:true,preferences:p});
    }catch{return fail('Notification database unavailable',503)}
  }

  if((path==='/api/audio/manifest'||path==='/api/audio/file')&&request.method==='GET')return handlePublicAudio(request,env,url);
  if(path==='/api/audio/sample'&&['GET','HEAD'].includes(request.method)){
    const voice=url.searchParams.get('voice');if(!Object.hasOwn(AUDIO_VOICES,voice))return fail('Invalid voice',400);
    const item=await env.AUDIO_BUCKET.get('pilot/gemini31-'+voice+'.mp3');if(!item)return fail('Sample has not been generated',404);
    return new Response(request.method==='HEAD'?null:item.body,{headers:{'content-type':'audio/mpeg','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'}});
  }

  if(path==='/api/reading-plans'&&request.method==='GET'){
    try{
      const {results=[]}=await env.DB.prepare('SELECT id,title,description,devotional_ids FROM reading_plans WHERE published=1 ORDER BY sort_order ASC,title ASC').all();
      return json(results.map(p=>({...p,devotional_ids:JSON.parse(p.devotional_ids)})));
    }catch(e){console.error('Reading plans lookup failed',e);return json([])}
  }
  if(path==='/api/scripture'&&request.method==='GET'){
    try{
      const reference=url.searchParams.get('reference')||'';
      if(reference.length>1000)return fail('Scripture reference is too long.',400);
      return json(await scriptureLookup(reference,env.ASSETS,request));
    }catch(error){return fail(error.message||'Scripture lookup failed.',400)}
  }
  if(path==='/api/contact'){
    const respond=(payload,status=200)=>new Response(JSON.stringify(payload),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
    if(request.method!=='POST')return respond({ok:false,error:'Method not allowed.'},405);
    const origin=request.headers.get('Origin');
    if(origin){try{if(new URL(origin).origin!==url.origin)return respond({ok:false,error:'Request origin not allowed.'},403)}catch{return respond({ok:false,error:'Invalid origin.'},403)}}
    const scriptUrl=env.CONTACT_SCRIPT_URL||env.GAS_WEB_APP_URL;
    if(!scriptUrl||!env.CONTACT_SHARED_SECRET)return respond({ok:false,error:'Contact form is not configured yet.'},503);
    if(Number(request.headers.get('content-length')||0)>16000)return respond({ok:false,error:'Message is too long.'},413);
    let input;try{input=await request.json()}catch{return respond({ok:false,error:'Invalid request.'},400)}
    if(!input||typeof input!=='object')return respond({ok:false,error:'Invalid request.'},400);
    if(input.website)return respond({ok:true}); // Hidden anti-spam field.
    const name=String(input.name||'').trim(),email=String(input.email||'').trim(),message=String(input.message||'').trim();
    if(!name||name.length>120||!email||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!message||message.length>10000)return respond({ok:false,error:'Please complete all fields with valid information.'},400);
    try{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
      let response;
      try{response=await fetch(scriptUrl,{method:'POST',headers:{'content-type':'text/plain;charset=utf-8'},body:JSON.stringify({name,email,message,secret:env.CONTACT_SHARED_SECRET}),redirect:'follow',signal:controller.signal})}finally{clearTimeout(timer)}
      if(!response.ok)return respond({ok:false,error:'Email service unavailable. Please try again.'},502);
      let result;try{result=JSON.parse(await response.text())}catch{return respond({ok:false,error:'Email service returned an unexpected response. Check your Apps Script deployment.'},502)}
      if(result.ok!==true)return respond({ok:false,error:'Email service could not confirm submission.'},502);
      return respond({ok:true});
    }catch(err){console.error('Contact form request failed:',err);return respond({ok:false,error:'Unable to send right now. Please try again later.'},502)}
  }
  // Announcements retain a monotonically increasing revision for one-time reader notices.
  // Public read-only announcement. Stored in D1, independent of deployment.
  if(path==='/api/announcement'&&request.method==='GET'){
    try{
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS site_announcement (id INTEGER PRIMARY KEY CHECK(id = 1), title TEXT NOT NULL, body TEXT NOT NULL, visible INTEGER NOT NULL DEFAULT 0)').run();
      const columns=await env.DB.prepare('PRAGMA table_info(site_announcement)').all();
      if(!(columns.results||[]).some(c=>c.name==='revision'))await env.DB.prepare('ALTER TABLE site_announcement ADD COLUMN revision INTEGER NOT NULL DEFAULT 0').run();
      const row=await env.DB.prepare('SELECT title, body, visible, revision FROM site_announcement WHERE id = 1').first();
      return new Response(JSON.stringify(row&&row.visible&&row.body.trim()?{visible:true,title:row.title,body:row.body,revision:row.revision}:{visible:false}),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
    }catch(e){console.error('Announcement read failed',e);return fail('Announcement unavailable',503)}
  }
  // Public, read-only six-recording gate. No synthesis and no publishing step.
  if(path==='/api/audio/availability'&&request.method==='GET'){
    const id=url.searchParams.get('id')||'';
    if(!/^[a-zA-Z0-9_-]{1,160}$/.test(id))return fail('Invalid devotional ID',400);
    try{
      if(!env.AUDIO_BUCKET)return json({ready:false});
      const published=await env.DB.prepare('SELECT id FROM devotionals WHERE id=? AND status=?').bind(id,'published').first();
      if(!published)return json({ready:false});
      // A full set must be present before offering recorded narration.
      // Only current-version recordings qualify; older recordings remain visible in admin.
      for(const part of ['devotional','deeper','scripture']){
        const source=await publishedAudioSource(env,id,part,request);
        if(!source)return json({ready:false});
        for(const voice of ['sulafat','sadachbia']){
          const recording=await storedAudioRecording(env,id,part,voice,source);
          if(!recording||recording.outdated||!recording.item?.size)return json({ready:false});
        }
      }
      return json({ready:true});
    }catch(error){console.error('Audio availability check failed:',error?.message||'unknown');return json({ready:false});}
  }
  // Public playback never triggers paid synthesis or exposes Google credentials.
  if(path.startsWith('/api/audio/')&&['GET','HEAD'].includes(request.method)){
    const match=/^\/api\/audio\/([a-zA-Z0-9_-]{1,160})\/(devotional|deeper|scripture)\/(aoede|sulafat|achernar|vindemiatrix|sadachbia)$/.exec(path);
    if(!match)return fail('Invalid audio request',400);
    try{
      if(!env.AUDIO_BUCKET)return fail('Audio unavailable',503);
      const source=await publishedAudioSource(env,match[1],match[2],request);
      if(!source)return fail('Recording not yet available',404);
      const recording=await storedAudioRecording(env,match[1],match[2],match[3],source);
      if(!recording||recording.outdated)return fail('Recording not yet available',404);
      const item=await env.AUDIO_BUCKET.get(recording.key);if(!item)return fail('Recording not yet available',404);
      return new Response(request.method==='HEAD'?null:item.body,{headers:{'content-type':'audio/mpeg','cache-control':'public, max-age=300','x-content-type-options':'nosniff','accept-ranges':'none'}});
    }catch{return fail('Audio unavailable',503)}
  }
  if(path==='/api/devotionals'&&request.method==='GET'){
    try{return json(await list(env,false))}catch{return fail('Database unavailable',503)}
  }
  if(path==='/admin'||path.startsWith('/admin/')||path==='/editor'||path==='/editor/client.js'||path.startsWith('/api/admin/')){
    let user;
    try{user=await identity(request,env)}catch{return fail('Writer database migration required. See MULTI-WRITER-SETUP.md.',503)}
    if(!user)return fail('Admin access denied. Check Cloudflare Access and Worker configuration.',403);
    if(path==='/editor'&&request.method==='GET'){
      if(!isEditor(user))return fail('Editor access required',403);
      return new Response(EDITOR_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    }
    if(path==='/editor/client.js'&&request.method==='GET'){
      if(!isEditor(user))return fail('Editor access required',403);
      return new Response(EDITOR_JS,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    }

    if(path==='/admin/reading-plans'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      return new Response(READING_PLANS_ADMIN_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    }
    if(path==='/api/admin/reading-plans'&&['GET','POST','DELETE'].includes(request.method)){
      if(!isAdmin(user))return fail('Administrator only',403);
      try{
        if(request.method==='GET'){
          const {results=[]}=await env.DB.prepare('SELECT * FROM reading_plans ORDER BY sort_order ASC,title ASC').all();
          return json(results.map(p=>({...p,devotional_ids:JSON.parse(p.devotional_ids)})));
        }
        const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return fail('Invalid origin',403);
        if(Number(request.headers.get('content-length')||0)>16000)return fail('Request too large',413);
        const body=await request.json();
        const id=String(body?.id||'').trim();
        if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id))return fail('Invalid plan ID',400);
        if(request.method==='DELETE'){await env.DB.prepare('DELETE FROM reading_plans WHERE id=?').bind(id).run();return json({ok:true})}
        const title=String(body.title||'').trim(),description=String(body.description||'').trim();
        const ids=body.devotional_ids;
        if(!title||title.length>120||description.length>600||!Array.isArray(ids)||!ids.length||ids.length>150||ids.some(x=>typeof x!=='string'||x.length>100)||new Set(ids).size!==ids.length)return fail('Invalid plan details',400);
        const published=body.published===true?1:0,order=Number.isInteger(body.sort_order)?body.sort_order:0;
        await env.DB.prepare(`INSERT INTO reading_plans(id,title,description,devotional_ids,published,sort_order,updated_at) VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,devotional_ids=excluded.devotional_ids,published=excluded.published,sort_order=excluded.sort_order,updated_at=CURRENT_TIMESTAMP`)
        .bind(id,title,description,JSON.stringify(ids),published,order).run();
        return json({ok:true});
      }catch(e){console.error('Reading plan admin failed',e);return fail('Reading plans database unavailable; apply migration 0003',503)}
    }
    if(path==='/admin/preview'&&request.method==='GET'){if(!isAdmin(user))return fail('Administrator only',403);return new Response(PREVIEW_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"frame-ancestors 'none'"}});}
    if(path==='/admin'&&request.method==='GET')return new Response(user.role==='editor'?EDITOR_HTML:isAdmin(user)?ADMIN_HTML.replace('</body>','<p style="text-align:center;padding:18px"><a href="/admin/reading-plans">Manage Reading Plans</a></p></body>'):WRITER_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    if(path==='/admin/outline'&&request.method==='GET'&&user.role==='editor')return fail('Not available to editors',403);
    if(path==='/admin/outline'&&request.method==='GET')return new Response(OUTLINE_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    if(path==='/admin/outline.js'&&request.method==='GET')return new Response(isAdmin(user)?OUTLINE_JS:WRITER_OUTLINE_JS,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store'}});
    if(path==='/admin/announcement.js'&&request.method==='GET'){if(!isAdmin(user))return fail('Administrator only',403);return new Response(ANNOUNCEMENT_ADMIN_JS,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store'}});}
    if(path==='/admin/client.js'&&request.method==='GET')return new Response(user.role==='editor'?EDITOR_JS:isAdmin(user)?ADMIN_JS:WRITER_JS,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    if((path==='/admin/audio-library'||path==='/admin/audio')&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      return new Response(AUDIO_LIBRARY_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'unsafe-inline' 'self'; media-src 'self' data:; style-src 'unsafe-inline' 'self'; frame-ancestors 'none'"}});
    }
    if(path==='/api/admin/audio/pronunciations'&&['GET','POST','DELETE'].includes(request.method)){
      if(!isAdmin(user))return fail('Administrator only',403);
      if(request.method==='GET')return json(await audioOverrides(env));
      const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return fail('Invalid origin',403);
      if(Number(request.headers.get('content-length')||0)>2048)return fail('Request too large',413);
      let body;try{body=await request.json()}catch{return fail('Invalid JSON',400)}
      const written=String(body?.written||'').trim(),spoken=String(body?.spoken||'').trim();
      if(!written||written.length>100||/\s{2,}/.test(written)||written.includes('\n'))return fail('Invalid written word',400);
      await audioOverrides(env);
      if(request.method==='DELETE')await env.DB.prepare('DELETE FROM audio_pronunciations WHERE written=?').bind(written).run();
      else{
        if(!spoken||spoken.length>150||spoken.includes('\n'))return fail('Invalid spoken pronunciation',400);
        await env.DB.prepare('INSERT INTO audio_pronunciations(written,spoken) VALUES(?,?) ON CONFLICT(written) DO UPDATE SET spoken=excluded.spoken').bind(written,spoken).run();
      }
      return json({ok:true});
    }
    if(path==='/api/admin/audio/pronunciation-preview'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return fail('Invalid origin',403);
      if(Number(request.headers.get('content-length')||0)>2048)return fail('Request too large',413);
      let body;try{body=await request.json()}catch{return fail('Invalid JSON',400)}
      if(typeof body?.text!=='string'||!body.text.trim()||body.text.length>400||!Object.hasOwn(AUDIO_VOICES,body.voice))return fail('Invalid preview',400);
      try{
        const text=narrationText(pronunciationText(narrationText(body.text),await audioOverrides(env)));
        const token=await googleAccessToken(env);
        const r=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(geminiAudioRequest(text,body.voice))});
        if(!r.ok)throw Error('Voice preview failed (HTTP '+r.status+')');
        const result=await r.json();return json({ok:true,audio:result.audioContent});
      }catch(e){return fail(e.message,502)}
    }
    if(path==='/api/admin/audio/status'&&request.method==='POST'||path==='/api/admin/audio/recording'&&request.method==='DELETE'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return fail('Invalid origin',403);
      if(Number(request.headers.get('content-length')||0)>1024)return fail('Request too large',413);
      let body;try{body=await request.json()}catch{return fail('Invalid JSON',400)}
      const {id,part,voice}=body||{};
      if(typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,160}$/.test(id)||!AUDIO_PARTS.has(part)||!Object.hasOwn(AUDIO_VOICES,voice))return fail('Invalid audio request',400);
      try{
        if(!env.AUDIO_BUCKET)return fail('Audio storage unavailable',503);
        const source=await publishedAudioSource(env,id,part,request);
        const recording=await storedAudioRecording(env,id,part,voice,source);
        if(path==='/api/admin/audio/status')return json({ok:true,exists:!!recording,bytes:recording?.item?.size||0,outdated:!!recording?.outdated});
        if(!recording)return fail('Recording not found',404);
        await env.AUDIO_BUCKET.delete(recording.key);
        return json({ok:true,deleted:true});
      }catch(e){return fail(e.message,502)}
    }
    if(path==='/api/admin/audio/generate'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return fail('Invalid origin',403);
      if(Number(request.headers.get('content-length')||0)>1024)return fail('Request too large',413);
      let body;try{body=await request.json()}catch{return fail('Invalid JSON',400)}
      const id=body?.id,part=body?.part,voice=body?.voice;
      if(typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,160}$/.test(id)||!AUDIO_PARTS.has(part)||!Object.hasOwn(AUDIO_VOICES,voice))return fail('Invalid audio request',400);
      try{
        const source=await publishedAudioSource(env,id,part,request);if(!source)return fail('Published reading or Scripture content unavailable',404);
        const key=source.key(voice);
        if(!body.regenerate&&await env.AUDIO_BUCKET.head(key))return json({ok:true,existing:true});
        const bytes=await synthesizeDevotionalAudio(env,source.text,voice,key);
        const saved=await env.AUDIO_BUCKET.head(key);
        if(!saved||!saved.size)throw Error('Generation completed but the audio file was not found in R2 storage.');
        // Only remove old versions after a verified replacement exists.
        let cleanup={removed:0,failed:0};
        try{cleanup=await deleteSupersededAudio(env,id,part,voice,key)}
        catch(error){cleanup.failed++;console.error('Audio cleanup could not complete:',error?.message||'R2 list failed')}
        return json({ok:true,bytes:saved.size,oldRecordingsDeleted:cleanup.removed,cleanupFailed:cleanup.failed});
      }catch(e){console.error('Devotional audio generation:',e.message);return fail(e.message,502)}
    }
    if(path==='/admin/audio-test'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      return new Response(AUDIO_TEST_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'unsafe-inline' 'self'; media-src 'self'; style-src 'unsafe-inline' 'self'; frame-ancestors 'none'"}});
    }
    if(path==='/api/admin/audio-test/generate'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return fail('Invalid request origin',403);
      if(Number(request.headers.get('content-length')||0)>512)return fail('Request too large',413);
      let body;try{body=await request.json()}catch{return fail('Invalid JSON',400)}
      if(!body||!Object.hasOwn(AUDIO_VOICES,body.voice))return fail('Invalid voice',400);
      try{return json(await generateAudioSample(env,body.voice))}catch(e){console.error('Audio pilot failed:',e.message);return fail('Audio generation failed: '+e.message,502)}
    }
    if(path==='/api/admin/audio-test/file'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const voice=url.searchParams.get('voice');if(!Object.hasOwn(AUDIO_VOICES,voice))return fail('Invalid voice',400);
      if(!env.AUDIO_BUCKET)return fail('Audio storage unavailable',503);
      const item=await env.AUDIO_BUCKET.get('pilot/gemini31-'+voice+'.mp3');if(!item)return fail('Generate this voice first',404);
      return new Response(request.method==='HEAD'?null:item.body,{headers:{'content-type':'audio/mpeg','cache-control':'private, no-store','x-content-type-options':'nosniff'}});
    }
    if(path==='/api/admin/audio/library'&&request.method==='GET'){if(!isAdmin(user))return fail('Administrator only',403);return handleAdminAudio(request,env,url)}
    if(path==='/api/admin/me'&&request.method==='GET')return json(user);
    // Only the administrator can view drafts or publish/hide announcements.
    if(path==='/api/admin/announcement'&&(request.method==='GET'||request.method==='POST')){
      if(!isAdmin(user))return fail('Administrator only',403);
      try{
        await env.DB.prepare('CREATE TABLE IF NOT EXISTS site_announcement (id INTEGER PRIMARY KEY CHECK(id = 1), title TEXT NOT NULL, body TEXT NOT NULL, visible INTEGER NOT NULL DEFAULT 0)').run();
        const columns=await env.DB.prepare('PRAGMA table_info(site_announcement)').all();
        if(!(columns.results||[]).some(c=>c.name==='revision'))await env.DB.prepare('ALTER TABLE site_announcement ADD COLUMN revision INTEGER NOT NULL DEFAULT 0').run();
        if(request.method==='GET'){
          const row=await env.DB.prepare('SELECT title, body, visible, revision FROM site_announcement WHERE id = 1').first();
          return json(row||{title:"What's New",body:'',visible:0});
        }
        const payload=await request.json();
        const title=String(payload.title??'').trim(),body=String(payload.body??'').trim();
        if(!title||title.length>100||body.length>4000||(payload.visible===true&&!body))return fail('Enter a title (up to 100 characters) and announcement text before showing it (up to 4,000 characters).',400);
        const visible=payload.visible===true?1:0;
        const publishNew=payload.publishNew===true;
        if(publishNew&&!visible)return fail('New announcements must be visible.',400);
        await env.DB.prepare('INSERT INTO site_announcement (id,title,body,visible,revision) VALUES (1,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,body=excluded.body,visible=excluded.visible,revision=site_announcement.revision + ?').bind(title,body,visible,publishNew?1:0,publishNew?1:0).run();
        const updated=await env.DB.prepare('SELECT revision FROM site_announcement WHERE id=1').first();
        if(publishNew&&visible&&ctx?.waitUntil)ctx.waitUntil(pushPublishAnnouncement(env,updated.revision,title,body).catch(e=>console.error('Announcement notification dispatch failed',e)));
        return json({ok:true,title,body,visible,revision:updated.revision});
      }catch(e){console.error('Announcement save failed',e);return fail('Unable to save announcement',500)}
    }


    // Editor accounts are invited through the existing dedicated Cloudflare Access
    // writers policy, but their database role is separate and strictly read-limited.
    if(path==='/api/admin/editors'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const rows=await env.DB.prepare('SELECT email,display_name,active FROM devotional_editors ORDER BY display_name').all();
      return json(rows.results||[]);
    }
    if(path==='/api/admin/editors'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const data=await request.json(),email=lower(data.email),name=String(data.displayName||'').trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!name||name.length>120||email===lower(env.ADMIN_EMAIL))return fail('Invalid editor',400);
      // An active writer may also be an editor with the same email address.
      const previous=await env.DB.prepare('SELECT active FROM devotional_editors WHERE email=?').bind(email).first();
      try{await updateWriterAccess(env,email,true)}catch(e){return fail('Editor access could not be granted: '+e.message,502)}
      await env.DB.prepare('INSERT INTO devotional_editors(email,display_name,active) VALUES(?,?,1) ON CONFLICT(email) DO UPDATE SET display_name=excluded.display_name,active=1').bind(email,name).run();
      if(previous&&Number(previous.active)===1)return json({ok:true,alreadyActive:true,invitationSent:null});
      const hasWriterRole=await env.DB.prepare('SELECT email FROM writers WHERE email=? AND active=1').bind(email).first();
      const editorDashboard=new URL(request.url).origin+(hasWriterRole?'/admin':'/editor');
      const invitationSent=await notifyEmail(env,'editor_invited',{id:'editor-invitation',title:'Editor Invitation'},{email,displayName:name},request,'',()=>{},editorDashboard);
      return json({ok:true,invitationSent});
    }
    if(path==='/api/admin/editors/resend-invitation'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const email=lower((await request.json()).email);
      const editor=await env.DB.prepare('SELECT email,display_name FROM devotional_editors WHERE email=? AND active=1').bind(email).first();
      if(!editor)return fail('Only active editors can receive invitations',404);
      const hasWriterRole=await env.DB.prepare('SELECT email FROM writers WHERE email=? AND active=1').bind(email).first();
      const editorDashboard=new URL(request.url).origin+(hasWriterRole?'/admin':'/editor');
      const invitationSent=await notifyEmail(env,'editor_invited',{id:'editor-invitation',title:'Editor Invitation'},{email,displayName:editor.display_name},request,'',()=>{},editorDashboard);
      return json({ok:true,invitationSent});
    }
    if(path==='/api/admin/editors/deactivate'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const email=lower((await request.json()).email);
      if(!await env.DB.prepare('SELECT email FROM devotional_editors WHERE email=?').bind(email).first())return fail('Editor not found',404);
      // Do not revoke Cloudflare Access for a guest writer who still needs their writer dashboard.
      const stillWriter=await env.DB.prepare('SELECT email FROM writers WHERE email=? AND active=1').bind(email).first();
      if(!stillWriter){
        try{await updateWriterAccess(env,email,false)}catch(e){return fail('Could not revoke Access: '+e.message,502)}
      }
      await env.DB.prepare('UPDATE devotional_editors SET active=0 WHERE email=?').bind(email).run();
      return json({ok:true});
    }
    if(path==='/api/admin/editors/assignments'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const r=await env.DB.prepare('SELECT a.source_type,a.devotional_id,a.editor_email,a.status,a.updated_at,e.display_name FROM devotional_editor_assignments a LEFT JOIN devotional_editors e ON e.email=a.editor_email ORDER BY a.updated_at DESC').all();
      return json(r.results||[]);
    }
    if(path==='/api/admin/editors/assign'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const d=await request.json(),source=String(d.sourceType||''),id=String(d.id||''),email=lower(d.email);
      if(!['admin','writer'].includes(source)||!/^[a-zA-Z0-9_-]{1,160}$/.test(id))return fail('Invalid devotional',400);
      const table=source==='admin'?'devotionals':'writer_devotionals';
      const devotional=await env.DB.prepare('SELECT id,title FROM '+table+' WHERE id=?').bind(id).first();
      if(!devotional)return fail('Devotional not found',404);
      const previous=await env.DB.prepare('SELECT editor_email FROM devotional_editor_assignments WHERE source_type=? AND devotional_id=?').bind(source,id).first();
      let assignedEditor=null;
      if(email){
        assignedEditor=await env.DB.prepare('SELECT email,display_name FROM devotional_editors WHERE email=? AND active=1').bind(email).first();
        if(!assignedEditor)return fail('Editor is not active',400);
        await env.DB.prepare("INSERT INTO devotional_editor_assignments(source_type,devotional_id,editor_email,status) VALUES(?,?,?,'to_edit') ON CONFLICT(source_type,devotional_id) DO UPDATE SET editor_email=excluded.editor_email,status='to_edit',updated_at=CURRENT_TIMESTAMP").bind(source,id,email).run();
      }else{
        await env.DB.prepare('DELETE FROM devotional_editor_assignments WHERE source_type=? AND devotional_id=?').bind(source,id).run();
      }
      await env.DB.prepare('DELETE FROM devotional_editor_suggestions WHERE source_type=? AND devotional_id=?').bind(source,id).run();
      // Only email on a new assignment or a change of editor, not a repeated save.
      const emailSent=email&&previous?.editor_email!==email
        ?await notifyEmail(env,'editor_assigned',devotional,{email,displayName:assignedEditor.display_name},request)
        :null;
      return json({ok:true,emailSent});
    }
    if(path==='/api/admin/editors/work'&&request.method==='GET'){
      if(!isEditor(user))return fail('Editors only',403);
      const r=await env.DB.prepare("SELECT a.source_type,a.devotional_id,a.status,a.updated_at FROM devotional_editor_assignments a JOIN devotional_editors e ON e.email=a.editor_email AND e.active=1 WHERE a.editor_email=? ORDER BY a.updated_at DESC").bind(user.email).all();
      const result=[];
      for(const a of r.results||[]){
        const t=a.source_type==='admin'?'devotionals':'writer_devotionals';
        const d=await env.DB.prepare('SELECT id,title,scripture,short,deeper,reflection,updated_at FROM '+t+' WHERE id=?').bind(a.devotional_id).first();
        if(d)result.push({...a,devotional:d});
      }
      return json(result);
    }
    if(path==='/api/admin/editors/suggest'&&request.method==='POST'){
      if(!isEditor(user))return fail('Editors only',403);
      const data=await request.json(),source=String(data.sourceType||''),id=String(data.id||'');
      const a=await env.DB.prepare('SELECT status FROM devotional_editor_assignments WHERE source_type=? AND devotional_id=? AND editor_email=?').bind(source,id,user.email).first();
      if(!a)return fail('Not assigned to you',403);
      const table=source==='admin'?'devotionals':source==='writer'?'writer_devotionals':null;
      if(!table)return fail('Invalid source',400);
      const original=await env.DB.prepare('SELECT title,scripture,short,deeper,reflection,updated_at FROM '+table+' WHERE id=?').bind(id).first();
      if(!original)return fail('Devotional not found',404);
      const fields=['title','reference','short','deeper','reflection'],suggested={};
      for(const f of fields){
        if(typeof data.suggested?.[f]!=='string'||data.suggested[f].length>(f==='title'?150:f==='reference'?200:50000))return fail('Invalid suggested edits',400);
        suggested[f]=data.suggested[f];
      }
      if(!suggested.title.trim()||!suggested.reference.trim()||!suggested.short.trim()||!suggested.deeper.trim())return fail('Required fields cannot be empty',400);
      const before={title:original.title,reference:original.scripture,short:original.short,deeper:original.deeper,reflection:original.reflection||''};
      // Reject stale editor submissions instead of overwriting newer admin changes.
      if(JSON.stringify(before)!==JSON.stringify(data.original))return fail('The devotional changed since you opened it. Refresh and review the latest version before suggesting edits.',409);
      await env.DB.prepare("INSERT INTO devotional_editor_suggestions(source_type,devotional_id,editor_email,original_json,suggested_json,status) VALUES(?,?,?,?,?,'pending') ON CONFLICT(source_type,devotional_id) DO UPDATE SET editor_email=excluded.editor_email,original_json=excluded.original_json,suggested_json=excluded.suggested_json,status='pending',updated_at=CURRENT_TIMESTAMP").bind(source,id,user.email,JSON.stringify(before),JSON.stringify(suggested)).run();
      await env.DB.prepare("UPDATE devotional_editor_assignments SET status='completed',updated_at=CURRENT_TIMESTAMP WHERE source_type=? AND devotional_id=? AND editor_email=?").bind(source,id,user.email).run();
      const emailSent=await notifyEmail(env,'editor_completed',{id,title:original.title},{email:user.email,displayName:user.displayName},request);
      return json({ok:true,emailSent});
    }
    if(path==='/api/admin/editors/suggestions'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const r=await env.DB.prepare("SELECT source_type,devotional_id,editor_email,original_json,suggested_json,status FROM devotional_editor_suggestions WHERE status='pending' ORDER BY updated_at DESC").all();
      return json(r.results||[]);
    }
    if(path==='/api/admin/editors/review'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const data=await request.json(),source=String(data.sourceType||''),id=String(data.id||'');
      const s=await env.DB.prepare("SELECT * FROM devotional_editor_suggestions WHERE source_type=? AND devotional_id=? AND status='pending'").bind(source,id).first();
      if(!s)return fail('Suggestions not found',404);
      const table=source==='admin'?'devotionals':source==='writer'?'writer_devotionals':null;
      if(!table)return fail('Invalid source',400);
      const d=await env.DB.prepare('SELECT title,scripture,short,deeper,reflection FROM '+table+' WHERE id=?').bind(id).first();
      if(!d)return fail('Devotional not found',404);
      const original=JSON.parse(s.original_json),suggested=JSON.parse(s.suggested_json);
      const current={title:d.title,reference:d.scripture,short:d.short,deeper:d.deeper,reflection:d.reflection||''};
      const accepted=Array.isArray(data.accepted)?data.accepted:[];
      if(accepted.some(f=>!['title','reference','short','deeper','reflection'].includes(f)))return fail('Invalid field selection',400);
      for(const f of accepted)if(current[f]!==original[f])return fail('Your copy changed in '+f+'. Refresh and compare before accepting that suggestion.',409);
      if(accepted.length){
        const next={...current};
        for(const f of accepted)next[f]=suggested[f];
        const bible='https://www.biblegateway.com/passage/?search='+encodeURIComponent(next.reference)+'&version=WEB';
        await env.DB.prepare('UPDATE '+table+' SET title=?,scripture=?,bible_url=?,short=?,deeper=?,reflection=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(next.title,next.reference,bible,next.short,next.deeper,next.reflection,id).run();
      }
      await env.DB.prepare("UPDATE devotional_editor_suggestions SET status='reviewed',updated_at=CURRENT_TIMESTAMP WHERE source_type=? AND devotional_id=?").bind(source,id).run();
      return json({ok:true});
    }
    if(user.role==='editor')return fail('Editor access is limited to assigned devotionals',403);

    if(path==='/api/admin/outline'&&(request.method==='GET'||request.method==='POST')&&user.role!=='editor'){
      try{
        await env.DB.prepare('CREATE TABLE IF NOT EXISTS master_outline (id INTEGER PRIMARY KEY CHECK (id = 1), content TEXT NOT NULL)').run();
        if(request.method==='GET'){
          const existing=await env.DB.prepare('SELECT content FROM master_outline WHERE id = 1').first();
          if(existing)return json(JSON.parse(existing.content));
          const seed=OUTLINE_JS.match(/^const OUTLINE=(\[[^;]+\]);/)?.[1];
          if(!seed)return fail('Outline seed unavailable',500);
          await env.DB.prepare('INSERT OR IGNORE INTO master_outline (id,content) VALUES (1,?)').bind(seed).run();
          const row=await env.DB.prepare('SELECT content FROM master_outline WHERE id = 1').first();
          return json(JSON.parse(row.content));
        }
        if(!isAdmin(user))return fail('Master Outline is read-only for writers',403);
        const data=await request.json();
        if(!Array.isArray(data)||data.length>100||JSON.stringify(data).length>250000)return fail('Invalid outline');
        let entries=0;
        for(const section of data){
          if(!section||typeof section.name!=='string'||!section.name.trim()||section.name.length>100||!Array.isArray(section.entries))return fail('Invalid category');
          for(const e of section.entries){entries++;
            if(!e||typeof e.title!=='string'||!e.title.trim()||e.title.length>150||!Number.isInteger(e.number)||e.number<1||(e.day!==null&&(!Number.isInteger(e.day)||e.day<1)))return fail('Invalid outline entry');
          }
        }
        if(entries>600)return fail('Too many outline entries');
        await env.DB.prepare('INSERT INTO master_outline (id,content) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET content=excluded.content').bind(JSON.stringify(data)).run();
        return json({ok:true});
      }catch(e){return fail('Could not access master outline: '+e.message,503)}
    }
    if(path==='/api/admin/outline-availability'&&request.method==='GET'&&user.role!=='editor'){
      try{
        const published=await env.DB.prepare('SELECT title FROM devotionals').all();
        const underway=await env.DB.prepare("SELECT title FROM writer_devotionals WHERE status IN ('draft','revisions','needs_approval','published')").all();
        return json({titles:[...(published.results||[]),...(underway.results||[])].map(x=>x.title)});
      }catch{return fail('Unable to load outline availability',503)}
    }
    if(path==='/api/admin/devotionals'&&request.method==='GET'&&user.role!=='editor')try{return json(isAdmin(user)?await list(env,true):await scriptureExtras(env,await Promise.all((await env.DB.prepare(`${writerSelect} WHERE owner_email=? ORDER BY day ASC`).bind(user.email).all()).results.map(r=>withSuggestions(env,writerRow(r))))))}catch{return fail('Database unavailable',503)}
    if(path==='/api/admin/devotionals'&&request.method==='POST'&&user.role!=='editor'){
      try{const payload=await request.json();const d=normalize(payload,true);
        if(!isAdmin(user)){
          if(d.status!=='draft')return fail('Writers can only save drafts. Use Submit for Approval.',403);
          const old=await env.DB.prepare('SELECT owner_email,status FROM writer_devotionals WHERE id=?').bind(d.id).first();
          if(old&&(old.owner_email!==user.email||!['draft','revisions'].includes(old.status)))return fail('This devotional is not editable',403);
          d.author=user.displayName;
          d.publishAnonymously=payload.publishAnonymously===true;
          // Writer drafts have no assigned publication day. Ignore any client-supplied number.
          d.day=0;
          if(await env.DB.prepare('SELECT id FROM devotionals WHERE id=?').bind(d.id).first())return fail('ID conflicts with an existing devotional',409);
          await saveOwned(env,d,user.email);
          await storeScripture(env,payload,request);
        }else {
          // Keep previously assigned days for existing admin devotionals.
          // New drafts are unnumbered until they are published.
          const existing=await env.DB.prepare('SELECT day FROM devotionals WHERE id=?').bind(d.id).first();
          if(existing){
            d.day=Number(existing.day)||0;
          }else if(d.status==='draft'){
            d.day=0;
          }
          if(d.status==='published'&&d.day===0){
            const last=await env.DB.prepare('SELECT COALESCE(MAX(day),0) AS last_day FROM devotionals').first();
            d.day=Number(last?.last_day||0)+1;
            if(!Number.isSafeInteger(d.day)||d.day>100000)return fail('No available day numbers',409);
          }
          // Older migrated devotionals store their broader reading in devotionals.scripture.
          // Keep that original context citation while editing the independent key verse.
          if(existing&&payload.mainScriptureReference){
            const prior=await env.DB.prepare('SELECT main_reference FROM devotional_scripture WHERE devotional_id=?').bind(d.id).first();
            if(prior?.main_reference){
              const oldReference=await env.DB.prepare('SELECT scripture FROM devotionals WHERE id=?').bind(d.id).first();
              if(oldReference?.scripture)d.reference=oldReference.scripture;
            }
          }
          await save(env,d);
          await storeScripture(env,payload,request);
        }
        return json({ok:true,id:d.id,day:d.day})}catch(e){return fail(e.message,400)}
    }
    if(path==='/api/admin/writer-draft/delete'&&request.method==='POST'){
      if(isAdmin(user))return fail('Only guest writers can delete their own drafts',403);
      try{
        const payload=await request.json();
        const id=payload?.id;
        if(typeof id!=='string'||!id||id.length>160)return fail('Invalid devotional ID',400);
        const result=await env.DB.prepare("DELETE FROM writer_devotionals WHERE id=? AND owner_email=? AND status='draft' AND submitted_once=0 AND published_id IS NULL").bind(id,user.email).run();
        if(!result.meta?.changes)return fail('Only your own drafts that have never been submitted can be deleted',403);
        return json({ok:true});
      }catch(e){return fail('Could not delete draft',500)}
    }
    if(path==='/api/admin/seed'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      try{const items=await request.json();if(!Array.isArray(items)||items.length>50)return fail('Invalid import',400);const clean=items.map(x=>normalize({...x,status:'published'}));for(const d of clean){await env.DB.prepare(`INSERT OR IGNORE INTO devotionals (id,day,title,topics,scripture,bible_url,short,deeper,reflection,author,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(d.id,d.day,d.title,JSON.stringify(d.topics),d.reference,d.bibleUrl,d.short,d.deeper,d.reflection,d.author,d.status).run()}return json({ok:true,imported:clean.length})}catch(e){return fail(e.message,400)}
    }
    if(path==='/api/admin/delete'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      try{const {id}=await request.json();if(typeof id!=='string')return fail('Invalid ID');await env.DB.prepare('DELETE FROM devotionals WHERE id = ?').bind(id).run();return json({ok:true})}catch{return fail('Unable to delete',400)}
    }
    if(path==='/api/admin/writers'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const result=await env.DB.prepare('SELECT email,display_name,active FROM writers WHERE hidden_from_management=0 ORDER BY display_name').all();return json(result.results||[]);
    }
    if(path==='/api/admin/writers'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const d=await request.json();const email=lower(d.email),name=String(d.displayName||'').trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!name||name.length>120||email===lower(env.ADMIN_EMAIL))return fail('Invalid writer');
      const previous=await env.DB.prepare('SELECT active FROM writers WHERE email=?').bind(email).first();
      // Existing active writers may still need Access synced; safe to retry.
      try{await updateWriterAccess(env,email,true)}catch(e){return fail('Writer was not invited: '+e.message,502)}
      try{
        await env.DB.prepare('INSERT INTO writers(email,display_name,active,hidden_from_management) VALUES(?,?,1,0) ON CONFLICT(email) DO UPDATE SET display_name=excluded.display_name,active=1,hidden_from_management=0').bind(email,name).run();
      }catch(e){
        if(!previous&&!await env.DB.prepare('SELECT email FROM devotional_editors WHERE email=? AND active=1').bind(email).first())try{await updateWriterAccess(env,email,false)}catch(err){console.error('Writer access rollback failed',err)}
        return fail('Writer database update failed; check Cloudflare Access before retrying',503);
      }
      if(previous&&Number(previous.active)===1)return json({ok:true,accessGranted:true,invitationSent:null,alreadyActive:true});
      const invitationSent=await notifyEmail(env,'writer_invited',{id:'invitation',title:'Writers Community Invitation'},{email,displayName:name},request);
      return json({ok:true,accessGranted:true,invitationSent});
    }
    if(path==='/api/admin/writers/resend-invitation'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      let email;
      try{const body=await request.json();email=lower(body?.email)}catch{return fail('Invalid request',400)}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email===lower(env.ADMIN_EMAIL))return fail('Invalid writer email',400);
      const writer=await env.DB.prepare('SELECT email,display_name,active FROM writers WHERE email=?').bind(email).first();
      if(!writer||Number(writer.active)!==1)return fail('Only active writers can receive invitations',404);
      const invitationSent=await notifyEmail(env,'writer_invited',{id:'invitation',title:'Writers Community Invitation'},{email:writer.email,displayName:writer.display_name},request);
      return json({ok:true,invitationSent});
    }
    if(path==='/api/admin/writers/deactivate'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const {email:rawEmail}=await request.json();const email=lower(rawEmail);
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email===lower(env.ADMIN_EMAIL))return fail('Invalid writer email',400);
      const existing=await env.DB.prepare('SELECT email FROM writers WHERE email=?').bind(email).first();
      if(!existing)return fail('Writer not found',404);
      const otherRole=await env.DB.prepare('SELECT email FROM devotional_editors WHERE email=? AND active=1').bind(email).first();

      if(!otherRole){const editorActive=await env.DB.prepare('SELECT email FROM devotional_editors WHERE email=? AND active=1').bind(email).first();
      if(!editorActive)try{await updateWriterAccess(env,email,false)}catch(e){return fail('Writer was not deactivated: '+e.message,502)}}
      await env.DB.prepare('UPDATE writers SET active=0 WHERE email=?').bind(email).run();
      return json({ok:true,accessRevoked:true});
    }
    // Restore access for an inactive writer without sending a new invitation.
    if(path==='/api/admin/writers/reactivate'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      let email;
      try{email=lower((await request.json())?.email)}catch{return fail('Invalid request',400)}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email===lower(env.ADMIN_EMAIL))return fail('Invalid writer email',400);
      const existing=await env.DB.prepare('SELECT email,active FROM writers WHERE email=?').bind(email).first();
      if(!existing)return fail('Writer not found',404);
      if(Number(existing.active)===1)return json({ok:true,alreadyActive:true});
      try{await updateWriterAccess(env,email,true)}catch(e){return fail('Writer was not reactivated: '+e.message,502)}
      try{await env.DB.prepare('UPDATE writers SET active=1 WHERE email=?').bind(email).run()}
      catch(e){if(!await env.DB.prepare('SELECT email FROM devotional_editors WHERE email=? AND active=1').bind(email).first())try{await updateWriterAccess(env,email,false)}catch(err){console.error('Writer reactivation rollback failed',err)}return fail('Could not reactivate writer in database. Check Access policy before retrying.',503)}
      return json({ok:true,accessGranted:true});
    }
    // Remove the account, never the writer's devotional records or author credits.
    if(path==='/api/admin/writers/delete'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      let email;
      try{email=lower((await request.json())?.email)}catch{return fail('Invalid request',400)}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email===lower(env.ADMIN_EMAIL))return fail('Invalid writer email',400);
      const existing=await env.DB.prepare('SELECT email,active FROM writers WHERE email=?').bind(email).first();
      if(!existing)return fail('Writer not found',404);
      // Keep the writer row for foreign-key integrity; hide it from both management tabs.
      const editorActive=await env.DB.prepare('SELECT email FROM devotional_editors WHERE email=? AND active=1').bind(email).first();
      if(!editorActive){
        try{await updateWriterAccess(env,email,false)}catch(e){return fail('Writer access could not be revoked: '+e.message,502)}
      }
      try{
        await env.DB.prepare('UPDATE writers SET active=0,hidden_from_management=1 WHERE email=?').bind(email).run();
      }catch(e){console.error('Writer removal failed',e);return fail('Could not remove writer from management. No devotionals were deleted.',503)}
      return json({ok:true,removedFromManagement:true,editorRolePreserved:!!editorActive,devotionalsPreserved:true});
    }
    if(path==='/api/admin/resolve-edits'&&request.method==='POST'){
      if(isAdmin(user))return fail('Only the writer can resolve suggested edits',403);
      try{
        const {id,decision}=await request.json();
        if(typeof id!=='string'||!['accept','reject'].includes(decision))return fail('Invalid decision',400);
        const r=await env.DB.prepare(`${writerSelect} WHERE id=? AND owner_email=? AND status='revisions'`).bind(id,user.email).first();
        if(!r)return fail('Revision is not available',409);
        const tracked=await reviewSuggestions(env,id);
        if(!tracked)return fail('No suggested edits to resolve',409);
        const source=decision==='accept'?tracked.suggested:tracked.original;
        const reference=String(source.reference||'').trim();
        if(!reference||!String(source.title||'').trim()||!String(source.short||'').trim()||!String(source.deeper||'').trim())return fail('Suggested text is incomplete',400);
        await env.DB.batch([
          env.DB.prepare(`UPDATE writer_devotionals SET title=?,scripture=?,bible_url=?,short=?,deeper=?,reflection=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND owner_email=? AND status='revisions'`).bind(source.title,reference,'https://www.biblegateway.com/passage/?search='+encodeURIComponent(reference)+'&version=WEB',source.short,source.deeper,source.reflection||'',id,user.email),
          env.DB.prepare('DELETE FROM writer_review_suggestions WHERE devotional_id=?').bind(id)
        ]);
        return json({ok:true,decision});
      }catch(e){console.error('WHDC resolve edits failed',e);return fail('Could not resolve suggested edits',503)}
    }
    if(path==='/api/admin/submit'&&request.method==='POST'){
      if(isAdmin(user))return fail('Only writers submit for approval',403);
      const {id}=await request.json();const existing=await env.DB.prepare(`${writerSelect} WHERE id=? AND owner_email=?`).bind(id,user.email).first();
      if(existing?.status==='revisions' && await reviewSuggestions(env,id))return fail('Please accept or reject the suggested edits before submitting.',409);
      if(!existing||!['draft','revisions'].includes(existing.status))return fail('Draft not available for submission',403);
      const result=await env.DB.prepare("UPDATE writer_devotionals SET status='needs_approval',submitted_once=1,admin_feedback='',updated_at=CURRENT_TIMESTAMP WHERE id=? AND owner_email=? AND status IN ('draft','revisions')").bind(id,user.email).run();
      if(!result.meta?.changes)return fail('Submission was not saved',409);
      const sent=await notifyEmail(env,'devotional_submitted',writerRow(existing),user,request);
      return json({ok:true,emailSent:sent});
    }
    if(path==='/api/admin/guest-published'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      try{const result=await env.DB.prepare(`${writerSelect} WHERE status='published' AND published_id IS NOT NULL ORDER BY updated_at DESC`).all();return json((result.results||[]).map(writerRow))}
      catch{return fail('Unable to load published guest submissions',503)}
    }
    if(path==='/api/admin/guest-published/delete'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      try{
        const {id}=await request.json();if(typeof id!=='string'||!id)return fail('Invalid submission ID',400);
        const d=await env.DB.prepare("SELECT published_id FROM writer_devotionals WHERE id=? AND status='published'").bind(id).first();
        if(!d?.published_id)return fail('Published submission not found',404);
        await env.DB.batch([
          env.DB.prepare('DELETE FROM writer_review_suggestions WHERE devotional_id=?').bind(id),
          env.DB.prepare('DELETE FROM devotionals WHERE id=?').bind(d.published_id),
          env.DB.prepare('DELETE FROM writer_devotionals WHERE id=? AND published_id=?').bind(id,d.published_id)
        ]);
        return json({ok:true});
      }catch(e){return fail('Unable to delete published guest submission: '+e.message,400)}
    }
    if(path==='/api/admin/submissions'&&request.method==='GET'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const result=await env.DB.prepare(`${writerSelect} WHERE status='needs_approval' ORDER BY updated_at ASC`).all();
      return json(await Promise.all((result.results||[]).map(r=>withSuggestions(env,writerRow(r)))));
    }
    if(path==='/api/admin/review'&&request.method==='POST'){
      if(!isAdmin(user))return fail('Administrator only',403);
      const {id,action,note,suggested}=await request.json();
      if(!['publish','revisions'].includes(action)||typeof id!=='string'||typeof note!=='string'||note.length>5000)return fail('Invalid review');
      const existing=await env.DB.prepare(`${writerSelect} WHERE id=? AND status='needs_approval'`).bind(id).first();
      if(!existing)return fail('Submission not pending review',409);
      if(action==='revisions'){
        if(!note.trim())return fail('Revision feedback is required',400);
        const original=writerRow(existing);
        const fields=['title','reference','short','deeper','reflection'];
        let changes=null;
        if(suggested!=null){
          if(!suggested||typeof suggested!=='object'||Array.isArray(suggested))return fail('Invalid suggested edits',400);
          changes={};
          for(const key of fields){
            if(typeof suggested[key]!=='string'||suggested[key].length>(key==='title'?150:key==='reference'?200:50000))return fail('Invalid suggested '+key,400);
            changes[key]=suggested[key];
          }
          if(!changes.title.trim()||!changes.reference.trim()||!changes.short.trim()||!changes.deeper.trim())return fail('Suggested title, reference, and devotional text are required',400);
        }
        // Save review markup without changing the writer's actual submission.
        // This table is installed by migrations/0002_review_suggestions.sql.
        if(changes){
          const before=Object.fromEntries(fields.map(k=>[k,original[k]||'']));
          await env.DB.prepare('INSERT INTO writer_review_suggestions (devotional_id,original_json,suggested_json,updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(devotional_id) DO UPDATE SET original_json=excluded.original_json,suggested_json=excluded.suggested_json,updated_at=CURRENT_TIMESTAMP').bind(id,JSON.stringify(before),JSON.stringify(changes)).run();
        }else{
          await env.DB.prepare('DELETE FROM writer_review_suggestions WHERE devotional_id=?').bind(id).run();
        }
        const result=await env.DB.prepare("UPDATE writer_devotionals SET status='revisions',admin_feedback=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='needs_approval'").bind(note.trim(),id).run();
        if(!result.meta?.changes)return fail('Submission changed',409);
        const revised=writerRow(existing);
        // Use the submission's stored owner address. The writer account may have
        // changed since submission, but the revision request still needs delivery.
        const recipientEmail=lower(revised.ownerEmail);
        let emailSent=false;
        let emailDiagnostic='invalid_writer_email';
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)){
          emailDiagnostic='webhook_failed';
          emailSent=await notifyEmail(env,'devotional_revisions',revised,{
            email:recipientEmail,
            displayName:revised.author||'Writer'
          },request,note.trim(),reason=>{emailDiagnostic=reason});
          if(emailSent)emailDiagnostic='sent';
        }else{
          console.error('WHDC revision email: submission has no valid owner email; event=devotional_revisions');
        }
        return json({ok:true,emailSent,emailDiagnostic});
      }
      const d=writerRow(existing);
      const publishedId='approved-'+d.id;
      // Assign a day only when the administrator approves publication.
      // Include existing drafts in the maximum so an already-reserved day is never reused.
      const lastDay=await env.DB.prepare('SELECT COALESCE(MAX(day),0) AS last_day FROM devotionals').first();
      const nextDay=Number(lastDay?.last_day||0)+1;
      if(!Number.isSafeInteger(nextDay)||nextDay>100000)return fail('No available day numbers',409);
      const published=writerData({...d,id:publishedId,day:nextDay});
      // Publishing is idempotent, and existing admin devotionals cannot be overwritten by writer IDs.
      const prior=await env.DB.prepare('SELECT id FROM devotionals WHERE id=?').bind(publishedId).first();
      if(prior)return fail('Published ID already exists; review manually',409);
      await save(env,published);
      await ensureScriptureTable(env);
      await env.DB.prepare("INSERT OR REPLACE INTO devotional_scripture (devotional_id,main_text,main_reference,context_references,context_passages,further_study_references) SELECT ?,main_text,main_reference,context_references,context_passages,further_study_references FROM devotional_scripture WHERE devotional_id=?").bind(publishedId,d.id).run();
      const updated=await env.DB.prepare("UPDATE writer_devotionals SET status='published',day=?,published_id=?,admin_feedback=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='needs_approval'").bind(nextDay,publishedId,note.trim(),id).run();
      if(!updated.meta?.changes)return fail('Publication record could not be updated. Contact support before retrying.',503);
      const writer=await env.DB.prepare('SELECT email,display_name FROM writers WHERE email=?').bind(d.ownerEmail).first();
      const emailSent=writer?await notifyEmail(env,'devotional_published',d,{email:writer.email,displayName:writer.display_name},request):false;
      return json({ok:true,emailSent});
    }
    return fail('Not found',404);
  }
  if(path==='/admin.html'||path==='/admin.js')return fail('Not found',404); // never serve dashboard assets without Access
  return env.ASSETS.fetch(request);
},
 async scheduled(event,env,ctx){ctx.waitUntil(Promise.all([pushDailyReminders(env),pushReadingPlanReminders(env),pushScriptureMemoryReminders(env),pushDeferredAnnouncements(env)]).catch(e=>console.error('Scheduled notifications failed',e)))}
};
