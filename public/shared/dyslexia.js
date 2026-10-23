/* WHDC optional dyslexia-friendly reading preferences, stored only on this device. */
(function(){
'use strict';
const prefix='whdc-dyslexia-';
const defaults={mode:'0',font:'verdana',letter:'0.04',line:'1.85',word:'0.12'};
function get(name){try{return localStorage.getItem(prefix+name)??defaults[name]}catch{return defaults[name]}}
function put(name,value){try{localStorage.setItem(prefix+name,String(value))}catch{}}
function apply(){
 const root=document.documentElement,enabled=get('mode')==='1';
 root.classList.toggle('whdc-dyslexia-on',enabled);
 const fonts={verdana:'Verdana,Arial,sans-serif',arial:'Arial,Helvetica,sans-serif',trebuchet:'"Trebuchet MS",Arial,sans-serif',system:'system-ui,-apple-system,sans-serif'};
 root.style.setProperty('--whdc-dyslexia-font',fonts[get('font')]||fonts.verdana);
 const clamp=(value,min,max,fallback)=>{const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
 root.style.setProperty('--whdc-dyslexia-letters',clamp(get('letter'),0,.12,.04)+'em');
 root.style.setProperty('--whdc-dyslexia-lines',String(clamp(get('line'),1.5,2.2,1.85)));
 root.style.setProperty('--whdc-dyslexia-words',clamp(get('word'),0,.3,.12)+'em');
}
function wire(){
 const fields={mode:'dyslexiaEnabled',font:'dyslexiaFont',letter:'dyslexiaLetters',line:'dyslexiaLines',word:'dyslexiaWords'};
 for(const [name,id] of Object.entries(fields)){
   const element=document.getElementById(id);if(!element)continue;
   if(name==='mode')element.checked=get(name)==='1';else element.value=get(name);
   element.addEventListener(name==='mode'?'change':'input',()=>{
      put(name,name==='mode'?(element.checked?'1':'0'):element.value);apply();refresh();
   });
 }
 function refresh(){
   for(const name of ['letter','line','word']){
     const output=document.getElementById('dyslexia'+({letter:'Letters',line:'Lines',word:'Words'}[name])+'Value');
     if(output)output.textContent=name==='line'?Number(get(name)).toFixed(1)+'×':get(name)+'em';
   }
   const options=document.querySelector('.whdc-dyslexia-options');
   if(options){const enabled=get('mode')==='1';options.querySelectorAll('select,input').forEach(el=>el.disabled=!enabled)}
 }
 refresh();apply();
}
window.WHDCDyslexia={apply,wire};
apply();
})();
