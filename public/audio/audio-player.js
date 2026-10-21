// Recorded narration controller. Settings are shared with the devotional reader.
window.WHDCAudio=(()=>{let audio=null,manifest=null,currentId=null;const parts=['devotional','scripture','deeper'];
function stop(){if(audio){audio.pause();audio.removeAttribute('src');audio=null;}document.querySelectorAll('[data-whdc-recorded]').forEach(b=>b.textContent=b.dataset.originalLabel||'▶ Listen')}
async function load(id){stop();currentId=id;manifest=null;try{const r=await fetch('/api/audio/manifest?devotional='+encodeURIComponent(id),{cache:'no-store'});if(!r.ok)return null;const d=await r.json();if(currentId!==id)return null;manifest=d;return d}catch{return null}}
function available(part){return manifest?.sections?.[part]||{}}
function selectedVoice(){const setting=localStorage.getItem('whdc-voice');return setting?.startsWith('recorded:')?setting.slice(9):(localStorage.getItem('whdc-recorded-voice')||'sulafat')}
function decorate(){for(const part of parts){const button=document.getElementById(part==='devotional'?'listen':part==='scripture'?'scriptureListen':'deeperListen');if(!button)continue;if(!Object.keys(available(part)).length)continue;button.dataset.whdcRecorded=part;button.dataset.originalLabel=button.textContent;button.title='Recorded AI narration available'}}
function setSpeed(rate){if(audio)audio.playbackRate=Number.isFinite(rate)&&rate>0?rate:1}
function play(part,button){const voice=selectedVoice();if(!voice)return false;const file=available(part)[voice];if(!file?.url)return false;if(audio&&!audio.paused){stop();return true}if('speechSynthesis' in window)speechSynthesis.cancel();audio=new Audio(file.url);setSpeed(Number(localStorage.getItem('whdc-voice-rate')||'1'));button.dataset.whdcRecorded=part;button.dataset.originalLabel=button.dataset.originalLabel||button.textContent;button.textContent='■ Stop audio';audio.onended=audio.onerror=()=>stop();audio.play().catch(()=>stop());return true}
return {load,decorate,play,stop,available,setSpeed};})();
