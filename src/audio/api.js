// WHDC audio API: isolated from editorial and public-app code.
const PARTS=['devotional','scripture','deeper'];
const VOICES=['sulafat','sadachbia'];
const idOk=id=>/^[a-z0-9][a-z0-9-]{0,120}$/.test(id);
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const fail=(message,status=400)=>json({error:message},status);
function parseObject(key,base){const rest=key.slice(base.length),m=/^(devotional|scripture|deeper)\/(sulafat|sadachbia)-([a-f0-9]{8,128})\.(wav|mp3)$/i.exec(rest);return m?{part:m[1].toLowerCase(),voice:m[2].toLowerCase(),hash:m[3].toLowerCase(),extension:m[4].toLowerCase(),key}:null}
async function listFiles(bucket,id){const base=`devotionals/${id}/`;let cursor,objects=[],pages=0;do{const result=await bucket.list({prefix:base,cursor,limit:1000});objects.push(...result.objects);cursor=result.truncated?result.cursor:null;pages++;}while(cursor&&pages<20);return objects.map(o=>parseObject(o.key,base)).filter(Boolean)}
async function catalog(bucket,id){const files=await listFiles(bucket,id);const sections={};for(const part of PARTS){sections[part]={};for(const voice of VOICES){const options=files.filter(f=>f.part===part&&f.voice===voice).sort((a,b)=>(a.extension==='wav'?0:1)-(b.extension==='wav'?0:1));if(options.length)sections[part][voice]={url:`/api/audio/file?devotional=${encodeURIComponent(id)}&part=${part}&voice=${voice}&hash=${options[0].hash}&format=${options[0].extension}`,count:options.length};}}const complete=PARTS.every(p=>VOICES.every(v=>!!sections[p][v]));return {devotionalId:id,sections:complete?sections:Object.fromEntries(PARTS.map(p=>[p,{}])),hasAudio:complete};}
// One virtual PCM WAV, assembled from the three existing R2 recordings on demand.
// Nothing is synthesized, uploaded, or stored. Byte ranges support iOS background playback.
async function continuousWav(request,bucket,id,voice){
 const order=['devotional','deeper','scripture'];const files=await listFiles(bucket,id);
 const chunks=[];
 for(const part of order){
  const file=files.filter(f=>f.part===part&&f.voice===voice&&f.extension==='wav')[0];
  if(!file)return fail('Continuous playback requires all three WAV recordings',409);
  const head=await bucket.head(file.key);if(!head||head.size<44)return fail('Invalid WAV recording',409);
  const prefix=await bucket.get(file.key,{range:{offset:0,length:Math.min(head.size,4096)}});
  if(!prefix)return fail('Recording unavailable',404);
  const buf=await prefix.arrayBuffer(),v=new DataView(buf),tag=(offset)=>String.fromCharCode(...new Uint8Array(buf,offset,4));
  if(tag(0)!=='RIFF'||tag(8)!=='WAVE')return fail('Unsupported audio container',409);
  let fmt=null,data=null,pos=12;
  while(pos+8<=buf.byteLength){const name=tag(pos),length=v.getUint32(pos+4,true);if(name==='fmt '&&length>=16&&pos+24<=buf.byteLength)fmt={format:v.getUint16(pos+8,true),channels:v.getUint16(pos+10,true),rate:v.getUint32(pos+12,true),byteRate:v.getUint32(pos+16,true),align:v.getUint16(pos+20,true),bits:v.getUint16(pos+22,true)};
   if(name==='data'){data={offset:pos+8,length:Math.min(length,head.size-pos-8)};break}pos+=8+length+(length%2)}
  if(!fmt||fmt.format!==1||!data||data.length<=0)return fail('Continuous playback requires uncompressed PCM WAV files',409);
  if(chunks.length&&JSON.stringify(fmt)!==JSON.stringify(chunks[0].fmt))return fail('Recording WAV formats do not match',409);
  chunks.push({key:file.key,fmt,...data});
 }
 const fmt=chunks[0].fmt,bytes=chunks.reduce((n,c)=>n+c.length,0);
 if(bytes>0xffffffff-44)return fail('Audio exceeds WAV size limit',409);
 const header=new ArrayBuffer(44),h=new DataView(header),put=(i,str)=>{for(let j=0;j<str.length;j++)h.setUint8(i+j,str.charCodeAt(j))};
 put(0,'RIFF');h.setUint32(4,36+bytes,true);put(8,'WAVE');put(12,'fmt ');h.setUint32(16,16,true);h.setUint16(20,1,true);h.setUint16(22,fmt.channels,true);h.setUint32(24,fmt.rate,true);h.setUint32(28,fmt.byteRate,true);h.setUint16(32,fmt.align,true);h.setUint16(34,fmt.bits,true);put(36,'data');h.setUint32(40,bytes,true);
 const size=44+bytes,range=request.headers.get('range');let start=0,end=size-1,status=200;
 if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range.trim());if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'content-range':`bytes */${size}`}});
  if(!m[1]){const suffix=Number(m[2]);start=Math.max(0,size-suffix)}else start=Number(m[1]);
  if(m[1]&&m[2])end=Math.min(size-1,Number(m[2]));
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return new Response(null,{status:416,headers:{'content-range':`bytes */${size}`}});status=206}
 const stream=new ReadableStream({async start(controller){try{
  let cursor=0;const blocks=[{header:new Uint8Array(header),length:44},...chunks.map(c=>({...c,length:c.length}))];
  for(const block of blocks){const blockStart=cursor,blockEnd=cursor+block.length-1;cursor+=block.length;if(end<blockStart||start>blockEnd)continue;
   const a=Math.max(start,blockStart)-blockStart,b=Math.min(end,blockEnd)-blockStart;
   if(block.header){controller.enqueue(block.header.subarray(a,b+1));continue}
   const object=await bucket.get(block.key,{range:{offset:block.offset+a,length:b-a+1}});if(!object)throw Error('Missing audio part');
   const reader=object.body.getReader();while(true){const {done,value}=await reader.read();if(done)break;controller.enqueue(value)}
  }controller.close()}catch(error){controller.error(error)}}});
 const headers={'content-type':'audio/wav','cache-control':'private, max-age=300','accept-ranges':'bytes','content-length':String(end-start+1),'x-content-type-options':'nosniff'};
 if(status===206)headers['content-range']=`bytes ${start}-${end}/${size}`;
 return new Response(stream,{status,headers});
}
export async function handlePublicAudio(request,env,url){if(!env.AUDIO_BUCKET)return fail('Audio storage is not configured',503);const id=url.searchParams.get('devotional')||'';if(!idOk(id))return fail('Invalid devotional ID');try{const row=await env.DB.prepare("SELECT id FROM devotionals WHERE id=? AND status='published'").bind(id).first();if(!row)return fail('Devotional not found',404);if(url.pathname==='/api/audio/manifest')return json(await catalog(env.AUDIO_BUCKET,id));if(url.pathname==='/api/audio/continuous'){const voice=url.searchParams.get('voice');if(!VOICES.includes(voice))return fail('Invalid voice');return continuousWav(request,env.AUDIO_BUCKET,id,voice)}if(url.pathname==='/api/audio/file'){
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
