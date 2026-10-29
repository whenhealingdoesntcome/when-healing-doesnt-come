// Recorded narration controller. Uses the existing R2 manifest and reader preferences.
window.WHDCAudio=(()=>{
 let audio=null,manifest=null,currentId=null,activePart=null,activeButton=null,player=null,sequence=null,sleepHandle=null,sleepDeadline=0;
 const FOLLOW_KEY='whdc-follow-along';
 let activeWord=null,wordSpans=[],wordTimings=[];
 const followEnabled=()=>localStorage.getItem(FOLLOW_KEY)!=='0';
 function clearHighlight(){if(activeWord)activeWord.classList.remove('whdc-word-active');activeWord=null;for(const span of wordSpans){if(span.isConnected)span.replaceWith(document.createTextNode(span.textContent));}wordSpans=[];wordTimings=[];}
 function normalizeWord(s){return String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9']/g,'').replace(/'/g,'');}
 function setupHighlight(part,file){
  clearHighlight();if(!followEnabled()||!Array.isArray(file?.words)||!file.words.length)return;
  const root=part==='devotional'?document.querySelector('#quoteSelectableDevotional > .whdc-quote-text'):part==='deeper'?document.querySelector('#deepText > .whdc-quote-text'):null;
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  const displayed=[];for(const node of nodes){for(const m of node.textContent.matchAll(/\S+/g))displayed.push(normalizeWord(m[0]));}
  const spoken=file.words.map(w=>normalizeWord(w.word));
  // Use ordered word matching instead of requiring an identical complete passage.
  // The recording may include an introduction, and published punctuation/text can differ.
  const n=displayed.length,m=spoken.length;
  if(!n||!m)return;
  const dp=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)
   dp[i][j]=displayed[i]&&displayed[i]===spoken[j]?1+dp[i+1][j+1]:Math.max(dp[i+1][j],dp[i][j+1]);
  const pairs=[];let i=0,j=0;
  while(i<n&&j<m){
   if(displayed[i]&&displayed[i]===spoken[j]){pairs.push([i,j]);i++;j++;}
   else if(dp[i+1][j]>=dp[i][j+1])i++;else j++;
  }
  // Avoid highlighting a different version of a devotional by accident.
  // Unmatched displayed words are left unhighlighted, rather than given incorrect times.
  if(pairs.length<Math.min(8,n)||pairs.length/n<0.75)return;
  const mapped=new Array(n).fill(null);
  for(const [di,sj] of pairs)mapped[di]=file.words[sj];
  for(const node of nodes){const matches=[...node.textContent.matchAll(/\S+/g)];if(!matches.length)continue;const frag=document.createDocumentFragment();let pos=0;for(const match of matches){frag.append(document.createTextNode(node.textContent.slice(pos,match.index)));const span=document.createElement('span');span.className='whdc-sync-word';span.textContent=match[0];frag.append(span);wordSpans.push(span);pos=match.index+match[0].length;}frag.append(document.createTextNode(node.textContent.slice(pos)));node.replaceWith(frag)}
  wordTimings=mapped;

 }
 function highlightAt(time){
  if(!followEnabled()||!wordTimings.length)return;
  let next=null;
  // Word timings can contain gaps for text that differs from the narration.
  for(let i=0;i<wordTimings.length;i++){
   const w=wordTimings[i];if(!w)continue;
   if(Number(w.start)>time)break;
   if(time<Number(w.end)){next=wordSpans[i];break;}
  }
  if(activeWord!==next){activeWord?.classList.remove('whdc-word-active');activeWord=next;activeWord?.classList.add('whdc-word-active')}
 }
 const RESUME_KEY='whdc-recorded-audio-resume-v1';
 const saved=()=>{try{return JSON.parse(localStorage.getItem(RESUME_KEY)||'null')}catch{return null}};
 function remember(){if(!audio||!currentId||!activePart)return;try{localStorage.setItem(RESUME_KEY,JSON.stringify({id:currentId,part:activePart,voice:voice(),url:audio.currentSrc||audio.src,seconds:audio.currentTime||0,at:Date.now()}))}catch{}}
 function clearRemembered(){try{localStorage.removeItem(RESUME_KEY)}catch{}}
 function state(){const last=saved();return audio?{id:currentId,part:activePart,paused:audio.paused,seconds:audio.currentTime}:last?{...last,paused:true}:null}
 const parts=['devotional','scripture','deeper'];
 const labels={devotional:'Short Devotional',scripture:'Scripture Reading',deeper:'Go Deeper'};
 const fmt=n=>{if(!Number.isFinite(n))return '0:00';n=Math.floor(n);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`};
 function voice(){const v=localStorage.getItem('whdc-voice');return v?.startsWith('recorded:')?v.slice(9):(localStorage.getItem('whdc-recorded-voice')||'sulafat')}
 function available(part){return manifest?.sections?.[part]||{}}
 function setSpeed(rate){if(audio)audio.playbackRate=Number.isFinite(rate)&&rate>0?rate:1}
 function stop(){clearHighlight();clearRemembered();sequence=null;if('speechSynthesis' in window)speechSynthesis.cancel();if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null}if(player){player.remove();player=null}document.querySelectorAll('[data-whdc-recorded]').forEach(b=>b.textContent=b.dataset.originalLabel||'▶ Listen');activePart=null;activeButton=null}
 async function load(id){if(currentId===id&&manifest)return manifest;if(audio||sequence)return manifest;const previous=saved();stop();if(previous?.id===id){try{localStorage.setItem(RESUME_KEY,JSON.stringify(previous))}catch{}}currentId=id;manifest=null;try{const r=await fetch('/api/audio/manifest?devotional='+encodeURIComponent(id),{cache:'no-store'});if(!r.ok)return null;const d=await r.json();if(currentId!==id)return null;manifest=d;return d}catch{return null}}
 function decorate(){for(const part of parts){const button=document.getElementById(part==='devotional'?'listen':part==='scripture'?'scriptureListen':'deeperListen');if(!button||!Object.keys(available(part)).length)continue;button.dataset.whdcRecorded=part;button.dataset.originalLabel=button.textContent;button.title='Recorded AI narration available'}}
 function mount(button,part){
  player=document.createElement('section');player.className='whdc-recorded-controls';player.setAttribute('aria-label',labels[part]+' audio player');
  player.innerHTML=`<div class="whdc-recorded-transport"><button type="button" data-action="back" aria-label="Rewind 10 seconds" title="Rewind 10 seconds">↶</button><button type="button" data-action="toggle" aria-label="Pause" title="Play or pause">Ⅱ</button><button type="button" data-action="forward" aria-label="Skip forward 10 seconds" title="Forward 10 seconds">↷</button><span data-elapsed>0:00</span><input type="range" data-seek min="0" max="1000" value="0" step="1" aria-label="Audio position"><span data-duration>0:00</span><button type="button" data-action="close" aria-label="Close audio player" title="Close">×</button></div><label class="whdc-follow-toggle"><input type="checkbox" data-follow> Highlight words as read</label><div class="whdc-follow-status" data-follow-status role="status"></div>`;
  const follow=player.querySelector('[data-follow]');
  const status=player.querySelector('[data-follow-status]');
  const hasTimings=Array.isArray(available(part)[voice()]?.words)&&available(part)[voice()].words.length>0;
  follow.checked=followEnabled();
  follow.disabled=!hasTimings;
  if(!hasTimings)follow.checked=false;
  function refreshFollowStatus(){status.textContent=!hasTimings?'Word highlighting is waiting for audio timing data for this recording.':(!wordTimings.length&&follow.checked?'Timing data is available, but could not be matched to the displayed text.':'');}
  follow.addEventListener('change',()=>{localStorage.setItem(FOLLOW_KEY,follow.checked?'1':'0');if(!follow.checked)clearHighlight();else setupHighlight(activePart,available(activePart)[voice()]);highlightAt(audio?.currentTime||0);refreshFollowStatus()});
  refreshFollowStatus();
  const styleId='whdc-recorded-controls-style';if(!document.getElementById(styleId)){const style=document.createElement('style');style.id=styleId;style.textContent=`.whdc-follow-toggle{display:flex!important;align-items:center;gap:8px;font-size:.85rem;margin:10px 2px 2px;min-height:30px;flex-wrap:wrap}.whdc-follow-toggle input{width:18px;height:18px;flex:0 0 auto;accent-color:#789875}.whdc-follow-status{font-size:.72rem;line-height:1.4;opacity:.8;margin:2px 2px 6px;overflow-wrap:anywhere}.whdc-follow-status:empty{display:none}.whdc-sync-word.whdc-word-active{background:#bed5bc;color:#172719;border-radius:3px;box-decoration-break:clone}.whdc-recorded-controls{width:100%;max-width:100%;margin:6px 0 12px;padding:5px 7px;border:1px solid var(--border,#c8c8c8);border-radius:9px;background:var(--card,#fff);color:inherit;box-sizing:border-box}.whdc-recorded-transport{display:flex;align-items:center;gap:5px;min-width:0;width:100%}.whdc-recorded-controls button{flex:0 0 auto;border:1px solid currentColor;border-radius:6px;padding:0;width:27px;height:28px;display:grid;place-items:center;background:transparent;color:inherit;cursor:pointer;font-size:17px;line-height:1}.whdc-recorded-controls [data-action=close]{border:0;font-size:19px}.whdc-recorded-controls [data-seek]{flex:1 1 auto;min-width:18px;width:100%;cursor:pointer;accent-color:var(--accent,#607e8b);touch-action:auto;margin:0}.whdc-recorded-controls span{font-variant-numeric:tabular-nums;font-size:.68rem;white-space:nowrap}.whdc-recorded-controls button:focus-visible,.whdc-recorded-controls input:focus-visible{outline:2px solid currentColor;outline-offset:2px}@media(max-width:380px){.whdc-recorded-transport{gap:3px}.whdc-recorded-controls{padding:4px}.whdc-recorded-controls button{width:24px;height:27px;font-size:15px}.whdc-recorded-controls span{font-size:.62rem}}`;document.head.appendChild(style)}
  (button.closest('.actions')||button).insertAdjacentElement('afterend',player);
  player.addEventListener('click',e=>{const action=e.target.closest('button')?.dataset.action;if(!action||!audio)return;if(action==='close'){stop();return}if(action==='back')audio.currentTime=Math.max(0,audio.currentTime-10);if(action==='forward'&&Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,audio.currentTime+10);if(action==='toggle'){if(audio.paused)audio.play().catch(()=>{audio.pause();update()});else audio.pause()}});
  const seek=player.querySelector('[data-seek]');seek.addEventListener('input',()=>{if(audio&&Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=audio.duration*Number(seek.value)/1000});
 }
 function update(){document.querySelectorAll('.whdc-icon-listen').forEach(b=>b.dispatchEvent(new Event('whdc-audio-state')));if(!audio||!player)return;const duration=Number.isFinite(audio.duration)?audio.duration:0;player.querySelector('[data-elapsed]').textContent=fmt(audio.currentTime);player.querySelector('[data-duration]').textContent=fmt(duration);const seek=player.querySelector('[data-seek]');seek.value=duration?String(Math.round(audio.currentTime/duration*1000)):'0';seek.disabled=!duration;const toggle=player.querySelector('[data-action=toggle]');toggle.textContent=audio.paused?'▶':'Ⅱ';toggle.setAttribute('aria-label',audio.paused?'Play':'Pause');if(activeButton?.isConnected)activeButton.textContent=audio.paused?'▶ Resume audio':'Ⅱ Pause audio';if('mediaSession' in navigator)navigator.mediaSession.playbackState=audio.paused?'paused':'playing'}
 function play(part,button,fromSequence=false){const file=available(part)[voice()];if(!file?.url)return false;if(audio&&activePart===part){if(audio.paused)audio.play().catch(()=>{audio.pause();update()});else audio.pause();return true}if(fromSequence){if(audio){audio.pause();audio.removeAttribute('src');audio=null}if(player){player.remove();player=null}}else {const previous=saved();stop();if(previous?.id===currentId&&previous?.part===part){try{localStorage.setItem(RESUME_KEY,JSON.stringify(previous))}catch{}}}if('speechSynthesis' in window)speechSynthesis.cancel();activePart=part;activeButton=button;button.dataset.whdcRecorded=part;button.dataset.originalLabel=button.dataset.originalLabel||button.textContent;audio=new Audio(file.url);audio.preload='metadata';const resume=saved();const resumeAt=resume?.id===currentId&&resume?.part===part&&resume?.voice===voice()&&resume?.seconds>0?resume.seconds:0;if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:labels[part],artist:'When Healing Doesn’t Come',album:'Devotional Narration'});navigator.mediaSession.setActionHandler('play',()=>audio?.play());navigator.mediaSession.setActionHandler('pause',()=>audio?.pause());navigator.mediaSession.setActionHandler('seekbackward',details=>{if(audio)audio.currentTime=Math.max(0,audio.currentTime-(details.seekOffset||10))});navigator.mediaSession.setActionHandler('seekforward',details=>{if(audio)audio.currentTime=Math.min(Number.isFinite(audio.duration)?audio.duration:Infinity,audio.currentTime+(details.seekOffset||10))});navigator.mediaSession.setActionHandler('stop',()=>stopAll())}catch(e){}}setSpeed(Number(localStorage.getItem('whdc-voice-rate')||'1'));mount(button,part);setupHighlight(part,file);const syncStatus=player?.querySelector('[data-follow-status]');if(syncStatus&&Array.isArray(file.words)&&file.words.length&&!wordTimings.length)syncStatus.textContent='Timing data could not be matched to the displayed text.';audio.addEventListener('loadedmetadata',()=>{if(resumeAt&&Number.isFinite(audio.duration))audio.currentTime=Math.min(resumeAt,Math.max(0,audio.duration-0.5));update()});audio.addEventListener('durationchange',update);audio.addEventListener('timeupdate',()=>{remember();highlightAt(audio.currentTime);update()});audio.addEventListener('play',update);audio.addEventListener('pause',()=>{remember();update()});audio.addEventListener('ended',()=>{clearRemembered();if(sequence){nextSequence();return}if(audio){audio.currentTime=0;update()}});audio.addEventListener('error',()=>{remember();if(audio)audio.pause();update()});audio.play().catch(()=>{if(audio)audio.pause();update()});update();return true}

 function setSleep(minutes){clearTimeout(sleepHandle);sleepHandle=null;sleepDeadline=0;if(minutes>0){sleepDeadline=Date.now()+minutes*60000;sleepHandle=setTimeout(()=>{stop();const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Sleep timer finished. Audio stopped.'},minutes*60000)}}
 function stopAll(){clearTimeout(sleepHandle);sleepHandle=null;sleepDeadline=0;stop();const b=document.getElementById('whdcPlayAll');if(b)b.textContent='▷ Play All'}
 async function nextSequence(){if(!sequence)return;const seq=sequence;const part=seq.parts.shift();if(!part){stopAll();const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Finished all three sections.';return}
  const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Playing '+labels[part]+'.';
  const button=document.getElementById(part==='devotional'?'listen':part==='deeper'?'deeperListen':'scriptureListen')||document.getElementById('whdcPlayAll')||document.createElement('button');
  if(available(part)[voice()]?.url&&play(part,button,true))return;
  let content='';try{content=await seq.getText(part)}catch{}if(sequence!==seq)return;
  if(!content){nextSequence();return}if(!('speechSynthesis' in window)){nextSequence();return}
  const u=new SpeechSynthesisUtterance(content);u.rate=Number(localStorage.getItem('whdc-voice-rate')||'1');u.onend=()=>{if(sequence===seq)nextSequence()};u.onerror=()=>{if(sequence===seq)nextSequence()};speechSynthesis.speak(u)
 }
 function playContinuous(){
  if(!currentId||!['devotional','deeper','scripture'].every(part=>available(part)[voice()]?.url?.includes('format=wav')))return false;
  const chosenVoice=voice(),button=document.getElementById('whdcPlayAll');if(!button)return false;
  activePart='devotional';activeButton=button;audio=new Audio('/api/audio/continuous?devotional='+encodeURIComponent(currentId)+'&voice='+encodeURIComponent(chosenVoice));
  audio.preload='auto';audio.playsInline=true;audio.playbackRate=Number(localStorage.getItem('whdc-voice-rate')||'1');
  mount(button,'devotional');const followControl=player?.querySelector('[data-follow]');if(followControl){followControl.disabled=true;followControl.checked=false;followControl.title='Follow Along is available when playing individual sections.';const status=player.querySelector('[data-follow-status]');if(status)status.textContent='To follow the words, play an individual section instead of Play All.';}
  if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:'Play All · Devotional, Go Deeper, Scripture',artist:'When Healing Doesn’t Come'});navigator.mediaSession.setActionHandler('play',()=>audio?.play());navigator.mediaSession.setActionHandler('pause',()=>audio?.pause());navigator.mediaSession.setActionHandler('stop',stopAll)}catch{}}
  audio.addEventListener('timeupdate',()=>{remember();highlightAt(audio.currentTime);update()});audio.addEventListener('durationchange',update);
  audio.addEventListener('play',update);audio.addEventListener('pause',()=>{remember();update()});
  audio.addEventListener('ended',()=>{stopAll();const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Finished all three sections.'});
  audio.addEventListener('error',()=>{if(!sequence)return;const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Continuous playback unavailable. Switching to section playback.';if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null}if(player){player.remove();player=null}activePart=null;activeButton=null;nextSequence()});
  audio.play().catch(()=>{const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Tap Play to start continuous audio.';update()});
  update();return true;
 }
 function playAll(getText){if(sequence){stopAll();return}stop();sequence={parts:['devotional','deeper','scripture'],getText};if(playContinuous()){const b=document.getElementById('whdcPlayAll');if(b)b.textContent='■ Stop All';const status=document.getElementById('whdcAudioStatus');if(status)status.textContent='Audio playing.';return}const b=document.getElementById('whdcPlayAll');if(b)b.textContent='■ Stop All';nextSequence()}
 window.addEventListener('pagehide',remember);document.addEventListener('visibilitychange',()=>{if(document.hidden)remember()});
 return {load,decorate,play,playAll,stopAll,setSleep,stop,available,setSpeed,state,isSequencing:()=>!!sequence};
})();
