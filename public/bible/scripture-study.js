/* WHDC inductive study: precise persistent annotations, favorite passages, selection tools. */
(()=>{'use strict';
const root=document.getElementById('reading');if(!root)return;
const incomingReference=new URLSearchParams(location.search).get('references')||new URLSearchParams(location.search).get('refs');
const STORE='whdc-bible-annotations-v1',FAV='whdc-favorite-verses-v1';
const THEMES=[
 ['god','#ffe06b','God','God’s character, attributes and actions'],
 ['love','#f38bb7','Love','Love, grace, mercy and kindness'],
 ['promises','#65c9f5','Promises','What God says He will do'],
 ['instruction','#9ed88d','Instruction','Wisdom, teaching and guidance'],
 ['commands','#ffb16a','Commands','Obedience and what God asks'],
 ['prayer','#a67ae6','Prayer','Prayer, worship and praise'],
 ['jesus','#ff7381','Jesus','Jesus, salvation and the Gospel'],
 ['warnings','#b7855e','Warnings','Sin, consequences and judgment'],
 ['people','#66d3d2','People','People, places and events'],
 ['other','#cdd4db','Other','Anything meaningful'],
 ['spirit','#f2d86f','Holy Spirit','The Spirit’s character, attributes and actions']
];
const css=document.createElement('style');css.textContent=`
#whdcStudyToggle{position:fixed;right:15px;bottom:max(18px,env(safe-area-inset-bottom));z-index:150;border:1px solid #b8ae9f;border-radius:99px;background:#f7f5f0;color:#393f4a;padding:9px 13px;font:inherit;box-shadow:0 3px 14px #0002;cursor:pointer}
#whdcStudyBar{position:fixed;bottom:max(65px,calc(env(safe-area-inset-bottom) + 65px));right:12px;z-index:151;max-width:min(430px,calc(100vw - 24px));padding:12px;border:1px solid #c5bcac;border-radius:14px;background:#f7f5f0;color:#393f4a;box-shadow:0 4px 22px #0003;font:inherit}
#whdcStudyBar[hidden],#whdcStudyPalette[hidden]{display:none!important}
#whdcStudyHeader{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
#whdcStudyHeader #whdcStudyHint{margin:0}
#whdcStudyClose{flex:none;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0!important;border-radius:50%!important;font-size:21px!important;line-height:1!important}
#whdcStudyActions button[aria-expanded="true"]{background:#e7e2d8;border-color:#827974}
#whdcStudyBar button{font:inherit;font-size:.85rem;border:1px solid #c7c1b8;border-radius:8px;background:transparent;color:inherit;padding:7px 9px;cursor:pointer}
#whdcStudyBar button:focus-visible,#whdcStudyToggle:focus-visible{outline:2px solid #393f4a}
#whdcStudyActions{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}
#whdcStudyMarkActions,#whdcStudySaveActions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
#whdcStudySaveActions{margin-left:auto;padding-left:10px;border-left:1px solid #c7c1b8;justify-content:flex-end}
@media(max-width:440px){#whdcStudyActions{gap:8px}#whdcStudySaveActions{width:100%;border-left:0;border-top:1px solid #c7c1b8;padding:8px 0 0;margin-left:0}}
#whdcStudyPalette{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:10px;max-height:38vh;overflow:auto}
#whdcStudyPalette button{text-align:left;display:flex;align-items:center;gap:7px}
.whdcStudyDot{display:inline-block;width:15px;height:15px;border-radius:50%;flex:none}
#whdcStudyHint{font-size:.78rem;margin:0 0 8px;color:#686257}
::highlight(whdc-linked-scripture){background:#f9e8a6;color:inherit}#reading .scripture{user-select:text;-webkit-user-select:text;-webkit-touch-callout:default}
.whdc-study-mark{box-decoration-break:clone;-webkit-box-decoration-break:clone}
.whdc-study-circle{border:1.6px solid currentColor;border-radius:50%;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.whdc-study-underline{text-decoration:underline;text-decoration-color:currentColor;text-decoration-thickness:2px;text-underline-offset:3px}
#whdcStudyNotice{font-size:.78rem;margin-top:7px}

::highlight(whdc-linked-scripture){background:#ffe58c;color:inherit}
#reading .whdc-linked-verse-fallback{background:#ffe58c;border-radius:3px}
`;document.head.append(css);
const toggle=document.createElement('button');toggle.id='whdcStudyToggle';toggle.type='button';toggle.textContent='✎ Study';toggle.setAttribute('aria-expanded','false');
const bar=document.createElement('div');bar.id='whdcStudyBar';bar.hidden=true;bar.innerHTML='<div id="whdcStudyHeader"><p id="whdcStudyHint">Touch and hold or drag to select words. Only selected text is marked.</p><button type="button" id="whdcStudyClose" aria-label="Close Study menu" title="Close Study menu">×</button></div><div id="whdcStudyActions"><div id="whdcStudyMarkActions"><button type="button" data-action="highlight">Highlight ▾</button><button type="button" data-action="circle">◯ Circle</button><button type="button" data-action="underline">U̲ Underline</button><button type="button" data-action="erase">Remove All Marks</button><button type="button" data-action="undo" disabled aria-label="Undo last study mark">↶ Undo</button></div><div id="whdcStudySaveActions"><button type="button" data-action="favorite">♡ Save Verse</button><button type="button" data-action="note">▤ Add Note</button></div></div><div id="whdcStudyPalette" hidden></div><div id="whdcStudyNotice" role="status"></div>';
document.body.append(toggle,bar);
const palette=bar.querySelector('#whdcStudyPalette');
THEMES.forEach(([key,color,name,description])=>{const b=document.createElement('button');b.type='button';b.dataset.theme=key;b.title=description;b.innerHTML='<span class="whdcStudyDot" style="background:'+color+'"></span><span>'+name+'</span>';palette.append(b)});
let active=null,restoring=false,loadedKey='',linkedDone=false,selectionTimer,markKind='highlight';
const undoHistory=[];const undoButton=bar.querySelector('[data-action="undo"]');
function updateUndo(){undoButton.disabled=!undoHistory.length;undoButton.title=undoHistory.length?'Undo last study marking':'No study markings to undo'}
function repaint(){loadedKey='';root.querySelectorAll('.whdc-study-mark').forEach(el=>el.replaceWith(...el.childNodes));root.normalize();restore()}
function undoLast(){const action=undoHistory[undoHistory.length-1];if(!action)return;const all=read(),current=all[action.key]||[];if(action.type==='add'){const ids=new Set(action.ids);all[action.key]=current.filter(item=>!ids.has(item.id))}else if(action.type==='erase'){all[action.key]=[...current,...action.removed]}if(!write(all)){bar.querySelector('#whdcStudyNotice').textContent='Unable to undo on this device.';return}undoHistory.pop();updateUndo();active=null;getSelection()?.removeAllRanges();repaint();bar.querySelector('#whdcStudyNotice').textContent='Last study mark undone.'}

function key(){const p=new URLSearchParams(location.search);return p.get('book')||document.getElementById('book')?.value||'unknown'}
function read(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}}
function write(all){try{localStorage.setItem(STORE,JSON.stringify(all));return true}catch{return false}}
function paragraphs(){return [...root.querySelectorAll('.scripture p')]}
function textNodes(p){const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement?.closest('sup.verse,.chapter,.whdc-note-icon,#whdcStudyBar')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});const a=[];while(walker.nextNode())a.push(walker.currentNode);return a}
function offsetAt(p,node,offset){let total=0;const point=document.createRange();point.setStart(node,offset);point.collapse(true);for(const t of textNodes(p)){const end=document.createRange();end.selectNodeContents(t);if(point.compareBoundaryPoints(Range.START_TO_END,end)>=0){total+=t.length;continue}const start=document.createRange();start.setStart(t,0);start.collapse(true);if(point.compareBoundaryPoints(Range.START_TO_START,start)<=0)break;if(node===t){total+=offset;break}try{const r=document.createRange();r.setStart(t,0);r.setEnd(node,offset);total+=r.toString().length}catch{}break}return total}
function textLength(p){return textNodes(p).reduce((n,t)=>n+t.length,0)}
function selectedSegments(range){
 const result=[];
 for(const [i,p] of paragraphs().entries()){
  if(!range.intersectsNode(p))continue;
  let offset=0,first=null,last=null;
  for(const t of textNodes(p)){
   const start=offset;offset+=t.length;
   if(!range.intersectsNode(t))continue;
   let a=0,b=t.length;
   const nodeRange=document.createRange();nodeRange.selectNodeContents(t);
   if(nodeRange.comparePoint(range.startContainer,range.startOffset)===0){
    const part=document.createRange();part.setStart(t,0);part.setEnd(range.startContainer,range.startOffset);a=part.toString().length;
   }
   if(nodeRange.comparePoint(range.endContainer,range.endOffset)===0){
    const part=document.createRange();part.setStart(t,0);part.setEnd(range.endContainer,range.endOffset);b=part.toString().length;
   }
   if(b>a){if(first===null)first=start+a;last=start+b}
  }
  if(first!==null&&last>first)result.push({p:i,start:first,end:last});
 }
 return result;
}
function selection(){const s=getSelection();if(!s||s.isCollapsed||!s.rangeCount)return null;const r=s.getRangeAt(0);if(!root.querySelector('.scripture')?.contains(r.commonAncestorContainer))return null;const segments=selectedSegments(r);return segments.length?segments:null}
function closePalette(){palette.hidden=true;bar.querySelectorAll('[data-action="highlight"],[data-action="circle"],[data-action="underline"]').forEach(b=>b.setAttribute('aria-expanded','false'))}
function show(open=true){bar.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(!open)closePalette()}
bar.querySelector('#whdcStudyClose').addEventListener('click',()=>show(false));
toggle.onclick=()=>show(bar.hidden);
function selectedUpdate(){clearTimeout(selectionTimer);selectionTimer=setTimeout(()=>{const found=selection();if(found){active=found;show(true);bar.querySelector('#whdcStudyHint').textContent='Selected text: choose a study mark or save the complete verse(s).';bar.querySelector('#whdcStudyNotice').textContent=''}},180)}
root.addEventListener('mouseup',selectedUpdate);root.addEventListener('keyup',selectedUpdate);root.addEventListener('touchend',()=>setTimeout(selectedUpdate,110));
document.addEventListener('selectionchange',()=>{const s=getSelection();if(s&&!s.isCollapsed&&root.contains(s.anchorNode))selectedUpdate()});
function decorate(p,start,end,kind,color){let pos=0;const nodes=textNodes(p);for(const n of nodes){const a=pos,b=pos+n.length;pos=b;if(end<=a||start>=b)continue;const from=Math.max(0,start-a),to=Math.min(n.length,end-a);if(to<=from)continue;const r=document.createRange();r.setStart(n,from);r.setEnd(n,to);const span=document.createElement('span');span.className='whdc-study-mark '+(kind==='circle'?'whdc-study-circle':kind==='underline'?'whdc-study-underline':'');if(kind==='highlight')span.style.backgroundColor=color;else if(color){span.style.borderColor=color;span.style.textDecorationColor=color;}try{r.surroundContents(span)}catch{}}}
function restore(){if(restoring)return;const ps=paragraphs();if(!ps.length)return;const k=key(),saved=read()[k]||[];if(loadedKey===k&&root.querySelector('.whdc-study-mark'))return;restoring=true;loadedKey=k;for(const a of saved){const p=ps[a.p];if(p)decorate(p,a.start,a.end,a.kind,a.color)}restoring=false}
function add(kind,color){if(!active){bar.querySelector('#whdcStudyNotice').textContent='Select text first.';return}const all=read(),k=key(),items=all[k]||[];const ids=[];for(const seg of active){const id=Date.now()+'-'+Math.random();ids.push(id);items.push({...seg,kind,color,id})}all[k]=items;if(!write(all)){bar.querySelector('#whdcStudyNotice').textContent='Unable to save markings on this device.';return}undoHistory.push({type:'add',key:k,ids});updateUndo();getSelection()?.removeAllRanges();active=null;repaint();bar.querySelector('#whdcStudyNotice').textContent='Study marking saved on this device.'}
function erase(){if(!active)return;const all=read(),k=key();const removed=(all[k]||[]).filter(a=>active.some(s=>s.p===a.p&&s.start<a.end&&s.end>a.start));if(!removed.length)return;all[k]=(all[k]||[]).filter(a=>!removed.includes(a));if(!write(all))return;undoHistory.push({type:'erase',key:k,removed});updateUndo();repaint();active=null;getSelection()?.removeAllRanges();bar.querySelector('#whdcStudyNotice').textContent='Marking removed.'}
function saveFavorite(){if(!active)return;const ps=paragraphs(),chosen=[];for(const seg of active){const p=ps[seg.p];if(!p)continue;const marks=[...p.querySelectorAll('sup.verse')];const r=document.createRange();const nodes=textNodes(p);let pos=0;for(const t of nodes){const a=pos,b=pos+t.length;pos=b;if(seg.end<=a||seg.start>=b)continue;try{r.setStart(t,Math.max(0,seg.start-a));r.setEnd(t,Math.min(t.length,seg.end-a))}catch{}}for(const m of marks){const verse=document.createRange();verse.setStartAfter(m);const next=m.nextElementSibling?.matches('sup.verse')?m.nextElementSibling:null;if(next)verse.setEndBefore(next);else verse.setEnd(p,p.childNodes.length);if(r.intersectsNode(m)||r.compareBoundaryPoints(Range.END_TO_START,verse)<0&&r.compareBoundaryPoints(Range.START_TO_END,verse)>0)chosen.push(m)}}if(!chosen.length){bar.querySelector('#whdcStudyNotice').textContent='Select text within a verse.';return}
const unique=[...new Set(chosen)],allMarkers=[...root.querySelectorAll('.scripture sup.verse')];const start=allMarkers.indexOf(unique[0]),end=allMarkers.indexOf(unique[unique.length-1]);const included=allMarkers.slice(start,end+1);const paras=[];let currentP=null,parts=[];
for(const m of included){const p=m.closest('p');if(p!==currentP){if(parts.length)paras.push(parts.join(' '));parts=[];currentP=p}const next=allMarkers[allMarkers.indexOf(m)+1];const range=document.createRange();range.setStartAfter(m);if(next&&next.closest('p')===p)range.setEndBefore(next);else range.setEnd(p,p.childNodes.length);const clone=range.cloneContents();clone.querySelectorAll?.('.chapter,sup.verse').forEach(x=>x.remove());const t=(clone.textContent||'').trim();if(t)parts.push(t)}
if(parts.length)paras.push(parts.join(' '));const name=document.querySelector('#reading .book-title')?.textContent||key();const first=unique[0].title||name+' '+unique[0].textContent,last=unique[unique.length-1].title||name+' '+unique[unique.length-1].textContent;const reference=first===last?first:first+'–'+last.replace(/^.*?\s(?=\d+:)/,'');
const item={id:reference.toLowerCase(),reference,text:paras.join('\n\n'),paragraphs:paras,source:'bible',createdAt:new Date().toISOString()};
try{const arr=JSON.parse(localStorage.getItem(FAV)||'[]');const old=arr.findIndex(x=>x.id===item.id);if(old>=0)arr[old]=item;else arr.push(item);localStorage.setItem(FAV,JSON.stringify(arr));bar.querySelector('#whdcStudyNotice').textContent='♡ Complete verses saved with paragraph breaks.'}catch{bar.querySelector('#whdcStudyNotice').textContent='Unable to save favorites.'}}

function updateStudyPalette(){
 const other=palette.querySelector('[data-theme="other"]');
 if(!other)return;
 const color=markKind==='highlight'?'#cdd4db':'#000000';
 other.querySelector('.whdcStudyDot').style.backgroundColor=color;
 other.title=markKind==='highlight'?'Other: cool gray highlight':'Other: black '+markKind;
}
bar.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.dataset.theme){const x=THEMES.find(a=>a[0]===t.dataset.theme);if(x)add(markKind,x[0]==='other'&&markKind!=='highlight'?'#000000':x[1]);closePalette();return}switch(t.dataset.action){case'highlight':case'circle':case'underline':{const kind=t.dataset.action;const closing=!palette.hidden&&markKind===kind;if(closing){closePalette();}else{markKind=kind;updateStudyPalette();palette.hidden=false;bar.querySelectorAll('[data-action="highlight"],[data-action="circle"],[data-action="underline"]').forEach(b=>b.setAttribute('aria-expanded',String(b===t)));bar.querySelector('#whdcStudyHint').textContent='Choose a theme color for '+markKind+'.';}break;}case'note':{const idx=active?.[0]?.p;document.dispatchEvent(new CustomEvent('whdc-open-study-note',{detail:{paragraphIndex:Number.isInteger(idx)?idx:null}}));break;}case'favorite':saveFavorite();break;case'erase':erase();break}});
const observer=new MutationObserver(()=>{if(restoring)return;const ps=paragraphs();if(!ps.length){loadedKey='';return}if(!root.querySelector('.whdc-study-mark')){loadedKey='';restore()}});
observer.observe(root,{childList:true,subtree:false});
function linked(){
 if(linkedDone)return;
 const ref=incomingReference;
 if(!ref)return;
 const match=ref.match(/(?:^|[;\s])(?:[1-3]\s*)?[A-Za-z][A-Za-z\s.]*?\s+(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(?:(\d{1,3}):)?(\d{1,3}))?/);
 if(!match)return;
 const ch=Number(match[1]),firstVerse=Number(match[2]),lastChapter=Number(match[3]||match[1]),lastVerse=Number(match[4]||match[2]);
 const all=[...root.querySelectorAll('.scripture sup.verse[title]')];
 const info=m=>{const x=(m.title||'').match(/(\d+):(\d+)$/);return x?[Number(x[1]),Number(x[2])]:null};
 const first=all.find(m=>{const x=info(m);return x&&x[0]===ch&&x[1]===firstVerse});
 if(!first)return;
 linkedDone=true;
 // Navigation is intentionally unmarked. Readers can choose their own study annotations.
 if(window.CSS?.highlights)CSS.highlights.delete('whdc-linked-scripture');
 setTimeout(()=>{first.style.scrollMarginTop='110px';first.scrollIntoView({block:'start',behavior:'auto'});},150);

}
const linkedObserver=new MutationObserver(linked);linkedObserver.observe(root,{childList:true});setTimeout(()=>linkedObserver.disconnect(),12000);restore();linked();
})();