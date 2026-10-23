/* Keep the devotional document (and its HTMLAudioElement) alive while browsing Scripture.
   The Bible remains its own reader, rendered in a full-screen same-origin frame. */
(()=>{
 'use strict';
 let frame=null, previousFocus=null;
 const isBible=url=>url.origin===location.origin&&url.pathname.replace(/\/$/,'')==='/bible-reader.html';
 function close(target){
  if(!frame)return;
  frame.remove();frame=null;
  document.documentElement.classList.remove('whdc-bible-overlay-open');
  document.body.classList.remove('whdc-bible-overlay-open');
  document.getElementById('app')?.removeAttribute('inert');
  if(target){
   if(target.pathname==='/'||target.pathname==='/index.html'){
    if(target.hash&&location.hash!==target.hash)location.hash=target.hash;
    else if(target.hash)window.dispatchEvent(new HashChangeEvent('hashchange'));
   }else location.assign(target.href);
  }else previousFocus?.focus?.();
 }
 function wireInner(){
  if(!frame)return;
  try{
   const doc=frame.contentDocument;
   if(!doc||doc.documentElement.dataset.whdcAudioBridge)return;
   doc.documentElement.dataset.whdcAudioBridge='1';
   doc.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');
    if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank')return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||isBible(url))return;
    event.preventDefault();close(url);
   },true);
   // The Bible's own navigation is not a separate audio session.
   doc.querySelectorAll('a[target="_top"]').forEach(a=>a.removeAttribute('target'));
  }catch(e){console.warn('Bible audio bridge unavailable',e)}
 }
 function open(url){
  if(frame){if(frame.src!==url.href)frame.src=url.href;return}
  previousFocus=document.activeElement;
  frame=document.createElement('iframe');
  frame.id='whdcBibleAudioFrame';
  frame.title='Bible Reader';
  frame.setAttribute('aria-label','Bible Reader');
  frame.src=url.href;
  frame.addEventListener('load',wireInner);
  document.body.append(frame);
  document.getElementById('app')?.setAttribute('inert','');
  document.documentElement.classList.add('whdc-bible-overlay-open');
  document.body.classList.add('whdc-bible-overlay-open');
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');
  if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);
  if(!isBible(url))return;
  event.preventDefault();open(url);
 },true);
 const css=document.createElement('style');
 css.textContent='#whdcBibleAudioFrame{position:fixed;inset:0;width:100%;height:100%;height:100dvh;border:0;background:var(--bg,#fff);z-index:9000}.whdc-bible-overlay-open{overflow:hidden!important}';
 document.head.append(css);
 window.WHDCBibleAudioBridge={open:url=>open(new URL(url||'/bible-reader.html',location.href)),close};
})();
