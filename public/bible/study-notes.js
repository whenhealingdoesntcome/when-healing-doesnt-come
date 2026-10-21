/* WHDC inductive paragraph notes, private to this browser. */
(()=>{'use strict';
const KEY='whdc-inductive-paragraph-notes-v1';
const css=document.createElement('style');
css.textContent=`
.whdc-note-paragraph{position:relative}
.whdc-note-icon{float:right;position:relative;z-index:2;margin:0 0 5px 8px;padding:3px 6px;border:1px solid #b9aa91;border-radius:7px;background:#f7f5f0;color:#685743;cursor:pointer;font:inherit;font-size:.88rem;line-height:1.3}
.whdc-note-icon[data-has-note="true"]{background:#f4e7c6;border-color:#b59c6c}
#whdcNoteDialog{border:1px solid #b9aa91;border-radius:13px;background:#f7f5f0;color:#393f4a;max-width:min(480px,calc(100vw - 24px));width:100%;padding:20px;box-shadow:0 8px 40px #0004}
#whdcNoteDialog::backdrop{background:#0007}
#whdcNoteDialog textarea{display:block;width:100%;min-height:130px;box-sizing:border-box;margin:12px 0;padding:10px;border:1px solid #b9aa91;border-radius:8px;background:#fff;color:#292929;font:inherit;resize:vertical}
#whdcNoteDialog .whdc-note-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
#whdcNoteDialog button{font:inherit;border:1px solid #b9aa91;border-radius:8px;padding:7px 12px;background:#fff;color:#393f4a;cursor:pointer}
#whdcNoteDialog #whdcNoteSave{background:#393f4a;color:white}
`;
document.head.append(css);
const dialog=document.createElement('dialog');dialog.id='whdcNoteDialog';
dialog.innerHTML='<form method="dialog"><strong id="whdcNoteTitle">Paragraph note</strong><p style="font-size:.85rem;margin:8px 0">Write a private study note about this paragraph.</p><label for="whdcNoteText">My note</label><textarea id="whdcNoteText" maxlength="12000" placeholder="What do you observe? What does this passage teach? How can you apply it?"></textarea><div class="whdc-note-actions"><button type="button" id="whdcNoteDelete">Delete note</button><button value="cancel">Cancel</button><button type="button" id="whdcNoteSave">Save Note</button></div></form>';
document.body.append(dialog);
const input=dialog.querySelector('textarea'),del=dialog.querySelector('#whdcNoteDelete'),save=dialog.querySelector('#whdcNoteSave');
let editing=null;
const read=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');return d&&typeof d==='object'?d:{}}catch{return {}}};
const write=d=>localStorage.setItem(KEY,JSON.stringify(d));
const isBible=()=>!!document.getElementById('reading')?.querySelector('.scripture');
function context(){
 if(isBible()){
  const book=document.getElementById('book')?.value||'unknown',chapter=document.getElementById('chapter')?.value||'1';
  return {key:'bible:'+book+':'+chapter,paragraphs:[...document.querySelectorAll('#reading .scripture p')],title:'Bible Reader · '+book+' '+chapter};
 }
 const container=document.getElementById('quoteSelectableDevotional');
 if(!container)return null;
 const title=document.querySelector('h1')?.textContent?.trim()||'Devotional';
 const id=location.hash||title;
 return {key:'devotional:'+id,paragraphs:[...container.querySelectorAll('.whdc-quote-text p')],title};
}
function openNote(key,index,title){
 const data=read();editing={key,index};const value=data[key]?.[index]||'';
 dialog.querySelector('#whdcNoteTitle').textContent=title+' · Study Note';
 input.value=value;del.hidden=!value;
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 input.focus();
}
function close(){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open')}
function refresh(){
 const ctx=context();if(!ctx)return;
 const data=read()[ctx.key]||{};
 ctx.paragraphs.forEach((p,index)=>{
  p.classList.add('whdc-note-paragraph');
  let btn=[...p.children].find(el=>el.classList?.contains('whdc-note-icon'));
  if(!btn&&data[index]){
   btn=document.createElement('button');btn.type='button';btn.className='whdc-note-icon';btn.textContent='▤';
   p.insertBefore(btn,p.firstChild);
  }
  if(!btn) return;
  const has=!!data[index];if(!has){btn.remove();return;}btn.dataset.hasNote=String(has);
  btn.title=has?'View or edit study note':'Add a study note';
  btn.setAttribute('aria-label','View or edit study note');
  btn.onclick=e=>{e.preventDefault();e.stopPropagation();openNote(ctx.key,index,ctx.title)};
 });
}
save.onclick=()=>{
 if(!editing)return;
 const value=input.value.trim(),data=read(),group={...(data[editing.key]||{})};
 if(value)group[editing.index]=value;else delete group[editing.index];
 if(Object.keys(group).length)data[editing.key]=group;else delete data[editing.key];
 try{write(data);close();refresh()}catch{alert('Unable to save your note on this device.')}
};
del.onclick=()=>{
 if(!editing||!confirm('Delete this paragraph note?'))return;
 input.value='';save.click();
};
document.addEventListener('whdc-open-study-note',e=>{const ctx=context();if(!ctx||!ctx.paragraphs.length)return;const index=e.detail?.paragraphIndex;openNote(ctx.key,Number.isInteger(index)&&index>=0&&index<ctx.paragraphs.length?index:0,ctx.title)});
let scheduled=false;
const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;refresh()},100)});
observer.observe(document.body,{childList:true,subtree:true});
refresh();
})();
