/* WHDC Bible Reader: select any Scripture text, save complete verses with paragraph boundaries. */
(()=>{'use strict';
const KEY='whdc-favorite-verses-v1';
const root=document.getElementById('reading');
if(!root)return;
const style=document.createElement('style');
style.textContent=`
#whdcVerseSave{position:fixed;bottom:max(18px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:120;display:none;align-items:center;justify-content:center;gap:.45rem;max-width:calc(100vw - 30px);padding:9px 15px;border:1px solid #a59b89;border-radius:999px;background:#f7f5f0;color:#393f4a;box-shadow:0 3px 15px #0002;font:inherit;font-size:.9rem;font-weight:500;cursor:pointer;white-space:nowrap}
#whdcVerseSave.visible{display:inline-flex}#whdcVerseSave:focus-visible{outline:2px solid #393f4a;outline-offset:3px}
#reading .scripture{user-select:text;-webkit-user-select:text;-webkit-touch-callout:default}
#reading .scripture sup.verse{cursor:pointer;user-select:none;-webkit-user-select:none}
#reading .whdc-verse-highlight{background:#f8e9ad;border-radius:2px}
::highlight(whdc-favorite-selection){background:#f8e9ad;color:inherit}
#whdcVerseNotice{position:fixed;left:50%;transform:translateX(-50%);bottom:max(68px,calc(env(safe-area-inset-bottom) + 60px));z-index:119;padding:4px 10px;border-radius:7px;background:#f7f5f0;color:#393f4a;font-size:.8rem;pointer-events:none}
#whdcVerseNotice:empty{display:none}`;
document.head.append(style);
const button=document.createElement('button');button.id='whdcVerseSave';button.type='button';button.innerHTML='<span aria-hidden="true">♡</span><span>Save to Favorites</span>';button.setAttribute('aria-label','Save selected Scripture passage to My Favorite Verses');document.body.append(button);
const notice=document.createElement('div');notice.id='whdcVerseNotice';notice.setAttribute('role','status');document.body.append(notice);
let selected=null,selectionTimer=0,ignoreClickUntil=0,initialReferenceHandled=false;
const markers=()=>[...root.querySelectorAll('.scripture p sup.verse')].filter(x=>x.title&&/\d+:\d+/.test(x.title));
function nextMarker(m){let n=m.nextElementSibling;while(n&&!n.matches('sup.verse'))n=n.nextElementSibling;return n}
function verseRange(m){
 const p=m.closest('p');if(!p)return null;
 const r=document.createRange();r.setStartAfter(m);
 const next=nextMarker(m);
 if(next)r.setEndBefore(next);else r.setEnd(p,p.childNodes.length);
 return r;
}
function textOfVerse(m){const r=verseRange(m);if(!r)return '';const fragment=r.cloneContents();fragment.querySelectorAll?.('.chapter,sup.verse').forEach(x=>x.remove());return (fragment.textContent||'').trim()}
function clearHighlight(){
 if(window.CSS&&CSS.highlights)CSS.highlights.delete('whdc-favorite-selection');
 root.querySelectorAll('sup.whdc-verse-highlight').forEach(x=>x.classList.remove('whdc-verse-highlight'));
}
function capture(first,last){
 const all=markers(),i=all.indexOf(first),j=all.indexOf(last);if(i<0||j<0)return;
 const subset=all.slice(Math.min(i,j),Math.max(i,j)+1);if(!subset.length)return;
 const paragraphs=[];let currentP=null,parts=[];
 for(const m of subset){
  const p=m.closest('p');if(p!==currentP){if(parts.length)paragraphs.push(parts.join(' '));parts=[];currentP=p}
  const text=textOfVerse(m);if(text)parts.push(text);
 }
 if(parts.length)paragraphs.push(parts.join(' '));if(!paragraphs.length)return;
 clearHighlight();
 subset.forEach(m=>m.classList.add('whdc-verse-highlight'));
 if(window.CSS&&CSS.highlights&&window.Highlight){
  const ranges=subset.map(verseRange).filter(Boolean);
  if(ranges.length)CSS.highlights.set('whdc-favorite-selection',new Highlight(...ranges));
 }
 const a=subset[0].title,b=subset[subset.length-1].title;
 const aParts=a.match(/^(.*?)\s+(\d+):(\d+)$/),bParts=b.match(/^(.*?)\s+(\d+):(\d+)$/);
 let ref=a;
 if(a!==b&&aParts&&bParts){
  ref=aParts[1]===bParts[1]?(aParts[2]===bParts[2]?a+'–'+bParts[3]:a+'–'+bParts[2]+':'+bParts[3]):a+'–'+b;
 }
 selected={reference:ref,paragraphs,text:paragraphs.join('\n\n')};
 button.classList.add('visible');
 button.innerHTML='<span aria-hidden="true">♡</span><span>Save to Favorites</span>';
 notice.textContent='';
}
function selectionVerses(){
 const sel=window.getSelection();if(!sel||sel.isCollapsed||!sel.rangeCount)return false;
 const range=sel.getRangeAt(0),scripture=root.querySelector('.scripture');if(!scripture)return false;
 if(!scripture.contains(range.commonAncestorContainer)&&range.commonAncestorContainer!==scripture)return false;
 const selectedMarkers=markers().filter(m=>{
  const vr=verseRange(m);if(!vr)return false;
  try{
   return range.compareBoundaryPoints(Range.END_TO_START,vr)>0&&range.compareBoundaryPoints(Range.START_TO_END,vr)<0;
  }catch{return false}
 });
 if(!selectedMarkers.length)return false;
 capture(selectedMarkers[0],selectedMarkers[selectedMarkers.length-1]);
 return true;
}
function handleSelection(){
 clearTimeout(selectionTimer);
 selectionTimer=setTimeout(()=>{if(selectionVerses())ignoreClickUntil=Date.now()+600},180);
}
root.addEventListener('mouseup',handleSelection);
root.addEventListener('keyup',handleSelection);
root.addEventListener('touchend',()=>{setTimeout(handleSelection,100)});
document.addEventListener('selectionchange',()=>{
 const sel=window.getSelection();if(!sel||sel.isCollapsed||!root.contains(sel.anchorNode))return;
 handleSelection();
});
root.addEventListener('click',e=>{
 const m=e.target.closest('sup.verse');if(!m||!root.contains(m)||Date.now()<ignoreClickUntil)return;
 const sel=window.getSelection();if(sel&&!sel.isCollapsed)return;
 capture(m,m);
});
button.addEventListener('click',()=>{
 if(!selected)return;
 try{
  const value=JSON.parse(localStorage.getItem(KEY)||'[]'),entries=Array.isArray(value)?value:[];
  const id=selected.reference.trim().replace(/\s+/g,' ').toLowerCase(),old=entries.find(x=>x.id===id);
  if(old)Object.assign(old,selected);else entries.push({id,...selected,source:'bible',createdAt:new Date().toISOString()});
  localStorage.setItem(KEY,JSON.stringify(entries));
  button.innerHTML='<span aria-hidden="true">♥</span><span>Saved to Favorites</span>';
  notice.textContent='Saved complete verses with paragraph breaks.';
 }catch{notice.textContent='Unable to save on this device.'}
});
const observer=new MutationObserver(()=>{
 if(!root.querySelector('.scripture')){
  clearHighlight();selected=null;button.classList.remove('visible');notice.textContent='';
 }
});observer.observe(root,{childList:true});
const params=new URLSearchParams(location.search);
const ref=params.get('references');
function highlightLinkedReference(){
 if(initialReferenceHandled||!ref)return;
 const match=ref.match(/^(.+?)\s+(\d+):(\d+)/);if(!match)return;
 const all=markers();if(!all.length)return;
 const name=match[1].trim(),startChapter=match[2],startVerse=match[3];
 const start=all.find(m=>m.title.toLowerCase()===(name+' '+startChapter+':'+startVerse).toLowerCase());
 if(!start)return;
 let last=start;
 const rangeMatch=ref.match(/[-–]\s*(?:(\d+):)?(\d+)\s*$/);
 if(rangeMatch){
  const chapter=rangeMatch[1]||startChapter;
  last=all.find(m=>m.title.toLowerCase()===(name+' '+chapter+':'+rangeMatch[2]).toLowerCase())||start;
 }
 initialReferenceHandled=true;
 capture(start,last);
 start.scrollIntoView({block:'center',behavior:'smooth'});
}
if(ref){
 const watch=new MutationObserver(highlightLinkedReference);watch.observe(root,{childList:true,subtree:true});
 highlightLinkedReference();
 setTimeout(()=>watch.disconnect(),15000);
}
})();
