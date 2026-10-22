// WHDC audio API: isolated from editorial and public-app code.
const PARTS=['devotional','scripture','deeper'];
const VOICES=['sulafat','sadachbia'];
const idOk=id=>/^[a-z0-9][a-z0-9-]{0,120}$/.test(id);
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const fail=(message,status=400)=>json({error:message},status);
function parseObject(key,base){const rest=key.slice(base.length),m=/^(devotional|scripture|deeper)\/(sulafat|sadachbia)-([a-f0-9]{8,128})\.(wav|mp3)$/i.exec(rest);return m?{part:m[1].toLowerCase(),voice:m[2].toLowerCase(),hash:m[3].toLowerCase(),extension:m[4].toLowerCase(),key}:null}
async function listFiles(bucket,id){const base=`devotionals/${id}/`;let cursor,objects=[],pages=0;do{const result=await bucket.list({prefix:base,cursor,limit:1000});objects.push(...result.objects);cursor=result.truncated?result.cursor:null;pages++;}while(cursor&&pages<20);return objects.map(o=>parseObject(o.key,base)).filter(Boolean)}
async function catalog(bucket,id){const files=await listFiles(bucket,id);const sections={};for(const part of PARTS){sections[part]={};for(const voice of VOICES){const options=files.filter(f=>f.part===part&&f.voice===voice).sort((a,b)=>(a.extension==='wav'?0:1)-(b.extension==='wav'?0:1));if(options.length)sections[part][voice]={url:`/api/audio/file?devotional=${encodeURIComponent(id)}&part=${part}&voice=${voice}&hash=${options[0].hash}&format=${options[0].extension}`,count:options.length};}}const complete=PARTS.every(p=>VOICES.every(v=>!!sections[p][v]));return {devotionalId:id,sections:complete?sections:Object.fromEntries(PARTS.map(p=>[p,{}])),hasAudio:complete};}
export async function handlePublicAudio(request,env,url){if(!env.AUDIO_BUCKET)return fail('Audio storage is not configured',503);const id=url.searchParams.get('devotional')||'';if(!idOk(id))return fail('Invalid devotional ID');try{const row=await env.DB.prepare("SELECT id FROM devotionals WHERE id=? AND status='published'").bind(id).first();if(!row)return fail('Devotional not found',404);if(url.pathname==='/api/audio/manifest')return json(await catalog(env.AUDIO_BUCKET,id));if(url.pathname==='/api/audio/file'){
  const part=url.searchParams.get('part'),voice=url.searchParams.get('voice'),hash=url.searchParams.get('hash'),format=url.searchParams.get('format')||'wav';
  if(!PARTS.includes(part)||!VOICES.includes(voice)||!/^[a-f0-9]{8,128}$/.test(hash||'')||!['wav','mp3'].includes(format))return fail('Invalid audio request');
  const key=`devotionals/${id}/${part}/${voice}-${hash}.${format}`;
  const head=await env.AUDIO_BUCKET.head(key);if(!head)return fail('Recording not found',404);
  const size=head.size,mime=format==='wav'?'audio/wav':'audio/mpeg';
  const headers={'content-type':mime,'cache-control':'public, max-age=3600','accept-ranges':'bytes'};
  const range=request.headers.get('range');
  if(range){
    const m=/^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{...headers,'content-range':`bytes */${size}`}});
    let start,end;
    if(!m[1]){const suffix=Number(m[2]);if(!suffix)return new Response(null,{status:416,headers:{...headers,'content-range':`bytes */${size}`}});start=Math.max(0,size-suffix);end=size-1;}
    else{start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1;}
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return new Response(null,{status:416,headers:{...headers,'content-range':`bytes */${size}`}});
    const length=end-start+1;
    const object=await env.AUDIO_BUCKET.get(key,{range:{offset:start,length}});if(!object)return fail('Recording not found',404);
    return new Response(object.body,{status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${size}`,'content-length':String(length)}});
  }
  const object=await env.AUDIO_BUCKET.get(key);if(!object)return fail('Recording not found',404);
  return new Response(object.body,{headers:{...headers,'content-length':String(size)}});
}return fail('Not found',404);}catch{return fail('Audio service temporarily unavailable',503)}}
export async function handleAdminAudio(request,env,url){if(!env.AUDIO_BUCKET)return fail('Audio storage is not configured',503);try{if(url.pathname==='/api/admin/audio/library'){const id=url.searchParams.get('devotional');if(id){if(!idOk(id))return fail('Invalid devotional ID');return json(await catalog(env.AUDIO_BUCKET,id));}const r=await env.DB.prepare('SELECT id,title,status FROM devotionals ORDER BY day ASC,title ASC').all();return json({devotionals:await Promise.all(r.results.map(async d=>({...d,...await catalog(env.AUDIO_BUCKET,d.id)})))});}return fail('Not found',404)}catch{return fail('Audio library temporarily unavailable',503)}}
