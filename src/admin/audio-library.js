// Server-rendered Audio Library. No browser-side fetch or JavaScript required.
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const PARTS = ['devotional','scripture','deeper'];
const VOICES = ['sulafat','sadachbia'];
const name = {devotional:'Devotional',scripture:'Scripture Reading',deeper:'Go Deeper',sulafat:'Sulafat · Female',sadachbia:'Sadachbia · Male'};
function page(body) {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Audio Library | WHDC</title><link rel="stylesheet" href="/styles.css"><style>main{max-width:960px;margin:2rem auto;padding:0 1rem}.whdc-audio-entry{margin:1rem 0;padding:1.25rem;border:1px solid #bbc5c4;border-radius:12px}.whdc-audio-entry h2{margin-top:0}.whdc-audio-entry ul{line-height:2}.whdc-audio-entry a{overflow-wrap:anywhere}.whdc-audio-entry small{opacity:.7}</style></head><body><main><p><a href="/admin">← Back to Admin Dashboard</a></p><h1>Audio Library</h1><p>Existing recordings stored in Cloudflare R2. This is a read-only library; no recordings are changed.</p>${body}</main></body></html>`;
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
  const grouped=new Map();
  for(const obj of objects){
   const match=/^devotionals\/([a-z0-9][a-z0-9-]{0,120})\/(devotional|scripture|deeper)\/(sulafat|sadachbia)-([a-f0-9]{8,128})\.mp3$/i.exec(obj.key);
   if(!match)continue;
   const [,id,part,voice,hash]=match;
   if(!grouped.has(id))grouped.set(id,[]);
   grouped.get(id).push({part:part.toLowerCase(),voice:voice.toLowerCase(),hash,size:obj.size});
  }
  let titles=new Map();
  try{
   const r=await env.DB.prepare('SELECT id,title FROM devotionals').all();
   titles=new Map((r.results||[]).map(d=>[d.id,d.title]));
  }catch{/* The R2 library remains usable if devotional metadata is unavailable. */}
  if(!grouped.size)return page('<p>No recordings found in the devotionals folder. Recordings in pilot/ are not included.</p>');
  const cards=[...grouped.entries()].sort((a,b)=>(titles.get(a[0])||a[0]).localeCompare(titles.get(b[0])||b[0])).map(([id,files])=>{
   const rows=PARTS.map(part=>{
    const links=VOICES.map(voice=>{
     const matches=files.filter(f=>f.part===part&&f.voice===voice);
     if(!matches.length)return '';
     const f=matches[0];
     const url='/api/audio/file?devotional='+encodeURIComponent(id)+'&part='+part+'&voice='+voice+'&hash='+f.hash;
     return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name[voice])}</a>${matches.length>1?` <small>(${matches.length} versions)</small>`:''}`;
    }).filter(Boolean);
    return links.length?`<li><strong>${esc(name[part])}:</strong> ${links.join(' · ')}</li>`:'';
   }).filter(Boolean).join('');
   return `<section class="whdc-audio-entry"><h2>${esc(titles.get(id)||id)}</h2><p><small>${esc(id)} · ${files.length} recording${files.length===1?'':'s'}</small></p><ul>${rows}</ul></section>`;
  }).join('');
  return page(`<p>${grouped.size} devotional${grouped.size===1?'':'s'} with recorded audio.</p>${cards}`);
 } catch(error) {
  console.error('WHDC Audio Library listing failed',error);
  return page('<p role="alert">Unable to list recordings from R2. Check the Worker logs for the Audio Library error.</p>');
 }
}
