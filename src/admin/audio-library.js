import { SHARED_ADMIN_HEADER } from './shared-header.js';
import { SHARED_ADMIN_STYLES } from './shared-styles.js';
// Server-rendered Audio Library. No browser-side fetch or JavaScript required.
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const PARTS = ['devotional','scripture','deeper'];
const VOICES = ['sulafat','sadachbia'];
const AUDIO_RE = /^devotionals\/([a-z0-9][a-z0-9-]{0,120})\/(devotional|scripture|deeper)\/(sulafat|sadachbia)-([a-f0-9]{8,128})\.(wav|mp3)$/i;
const TIMING_RE = /^devotionals\/([a-z0-9][a-z0-9-]{0,120})\/(devotional|scripture|deeper)\/(sulafat|sadachbia)-([a-f0-9]{8,128})\.words\.json$/i;
const name = {devotional:'Devotional',scripture:'Scripture Reading',deeper:'Go Deeper',sulafat:'Sulafat · Female',sadachbia:'Sadachbia · Male'};
function page(body) {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Audio Library | WHDC</title><link rel="stylesheet" href="/shared/styles.css"><style>${SHARED_ADMIN_STYLES}
.whdc-audio-main{max-width:960px;margin:2rem auto;padding:0 1rem}.whdc-audio-entry{margin:1rem 0;padding:1.25rem;border:1px solid #bbc5c4;border-radius:12px}.whdc-audio-entry h2{margin-top:0}.whdc-audio-entry ul{line-height:2}.whdc-audio-entry a{overflow-wrap:anywhere}.whdc-audio-entry small{opacity:.7}.whdc-audio-summary{padding:1rem;border:1px solid #bbc5c4;border-radius:12px;margin:1rem 0}.whdc-audio-progress{height:9px;background:#d9e2dd;border-radius:99px;overflow:hidden}.whdc-audio-progress>span{display:block;height:100%;background:#698f7d}.whdc-audio-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.5rem 1rem}.whdc-audio-status{font-size:.92rem}.whdc-audio-ready{color:#26714e}.whdc-audio-wait{color:#936328}.whdc-audio-missing{opacity:.65}.whdc-audio-filters{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}.whdc-audio-filters button{padding:.45rem .8rem;border:1px solid #9eaaa4;border-radius:8px;background:transparent;color:inherit;cursor:pointer}.whdc-audio-filters button[aria-pressed="true"]{background:#476e5b;color:white}.whdc-audio-entry[hidden]{display:none}</style></head><body>${SHARED_ADMIN_HEADER}<main class="whdc-audio-main"><h1>Audio Library</h1><p>Existing recordings stored in Cloudflare R2. This is a read-only library; no recordings are changed.</p>${body}</main></body></html>`;
}
export async function renderAudioLibrary(env) {
 if (!env.AUDIO_BUCKET) return page('<p role="alert">Audio storage is not configured. Check the AUDIO_BUCKET Worker binding.</p>');
 try {
  // R2 is the source of truth: show recordings even when a devotional is absent from D1.
  const objects=[];let cursor, pages=0;
  do {
   const batch=await env.AUDIO_BUCKET.list({prefix:'devotionals/',cursor,limit:1000});
   objects.push(...batch.objects);
   cursor=batch.truncated?batch.cursor:null;
   pages++;
  } while(cursor&&pages<100);
  if(cursor) return page('<p role="alert">Too many audio objects to list safely. Please contact the administrator.</p>');
  const timingKeys=new Set(objects.filter(o=>TIMING_RE.test(o.key)).map(o=>o.key.toLowerCase()));
  const grouped=new Map();
  for(const obj of objects){
   const match=AUDIO_RE.exec(obj.key);
   if(!match)continue;
   const [,id,part,voice,hash,extension]=match;
   if(!grouped.has(id))grouped.set(id,[]);
   grouped.get(id).push({part:part.toLowerCase(),voice:voice.toLowerCase(),hash:hash.toLowerCase(),extension:extension.toLowerCase(),size:obj.size});
  }
  let titles=new Map();
  try{
   const r=await env.DB.prepare('SELECT id,title FROM devotionals').all();
   titles=new Map((r.results||[]).map(d=>[d.id,d.title]));
  }catch{/* The R2 library remains usable if devotional metadata is unavailable. */}
  if(!grouped.size)return page('<p>No recordings found in the devotionals folder. Recordings in pilot/ are not included.</p>');
  let totalReady=0,totalRecorded=0,fullyAligned=0,partiallyAligned=0;
  const cards=[...grouped.entries()].sort((a,b)=>(titles.get(a[0])||a[0]).localeCompare(titles.get(b[0])||b[0])).map(([id,files])=>{
   let ready=0,recorded=0;
   const statuses=PARTS.flatMap(part=>VOICES.map(voice=>{
    const matches=files.filter(f=>f.part===part&&f.voice===voice).sort((a,b)=>(a.extension==='wav'?0:1)-(b.extension==='wav'?0:1));
    if(!matches.length)return `<div class="whdc-audio-status whdc-audio-missing">${esc(name[part])} · ${esc(name[voice])}: No recording</div>`;
    recorded++;
    const f=matches[0];
    const timingKey=`devotionals/${id}/${part}/${voice}-${f.hash}.words.json`.toLowerCase();
    const aligned=timingKeys.has(timingKey);
    if(aligned)ready++;
    const url='/api/audio/file?devotional='+encodeURIComponent(id)+'&part='+part+'&voice='+voice+'&hash='+f.hash+'&format='+f.extension;
    return `<div class="whdc-audio-status ${aligned?'whdc-audio-ready':'whdc-audio-wait'}">${aligned?'✓ Timing file found':'◷ Awaiting alignment'} · ${esc(name[part])} · <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name[voice])}</a></div>`;
   }));
   totalReady+=ready;totalRecorded+=recorded;
   const state=ready===6?'full':ready>0?'partial':'none';
   if(state==='full')fullyAligned++;else if(state==='partial')partiallyAligned++;
   const pct=Math.round(ready/6*100);
   return `<section class="whdc-audio-entry" data-alignment="${state}"><h2>${esc(titles.get(id)||id)}</h2><p><small>${esc(id)} · ${recorded} of 6 voice/section recordings available · ${files.length} stored audio files</small></p><p><strong>${ready} of 6 timing files found</strong></p><div class="whdc-audio-progress" role="progressbar" aria-label="Alignment timing files" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${ready}"><span style="width:${pct}%"></span></div><div class="whdc-audio-grid">${statuses.join('')}</div></section>`;
  }).join('');
  const totalSlots=grouped.size*6;
  const pct=Math.round(totalReady/Math.max(1,totalSlots)*100);
  const summary=`<section class="whdc-audio-summary"><h2>Audio Alignment Status</h2><p><strong>${totalReady} of ${totalSlots}</strong> possible voice/section timing files found across ${grouped.size} devotionals (${pct}%).</p><div class="whdc-audio-progress" role="progressbar" aria-label="Overall alignment progress" aria-valuemin="0" aria-valuemax="${totalSlots}" aria-valuenow="${totalReady}"><span style="width:${pct}%"></span></div><p>${fullyAligned} fully aligned · ${partiallyAligned} partially aligned · ${grouped.size-fullyAligned-partiallyAligned} not aligned · ${totalRecorded} recordings available</p><small>Read-only R2 inventory. “Timing file found” confirms a matching file exists, not that its contents or displayed-text matching have been validated. Missing audio is counted as not ready. Refresh to see new GitHub Actions uploads.</small></section>`;
  const filters=`<div class="whdc-audio-filters" role="group" aria-label="Filter by alignment status"><button type="button" aria-pressed="true" data-filter="all">All</button><button type="button" aria-pressed="false" data-filter="full">Fully aligned</button><button type="button" aria-pressed="false" data-filter="partial">Partially aligned</button><button type="button" aria-pressed="false" data-filter="none">Not aligned</button></div>`;
  const filterScript=`<script>document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('[data-alignment]').forEach(card=>{card.hidden=selected!=='all'&&card.dataset.alignment!==selected;});}));</script>`;
  return page(summary+filters+cards+filterScript);
 } catch(error) {
  console.error('WHDC Audio Library listing failed',error);
  return page('<p role="alert">Unable to list recordings from R2. Check the Worker logs for the Audio Library error.</p>');
 }
}
