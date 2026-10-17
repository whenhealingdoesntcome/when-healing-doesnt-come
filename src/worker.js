import {ADMIN_HTML,ADMIN_JS,OUTLINE_HTML,OUTLINE_JS} from './private.js';
const json = (data, status = 200) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const fail = (message,status=400) => json({error:message},status);
const b64url = s => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')), c=>c.charCodeAt(0));
function teamDomain(env){let d=(env.ACCESS_TEAM_DOMAIN||'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'');return /^[a-zA-Z0-9.-]+\.cloudflareaccess\.com$/.test(d)?d:null}
async function verifyAccess(request,env){
  const domain=teamDomain(env),aud=(env.ACCESS_AUD||'').trim(),email=(env.ADMIN_EMAIL||'').trim().toLowerCase();
  if(!domain||!aud||!email) return false; // Fail closed until all three settings are supplied
  const cookie=request.headers.get('cookie')||'';
  const token=request.headers.get('cf-access-jwt-assertion')||cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
  if(!token) return false;
  const parts=token.split('.');if(parts.length!==3)return false;
  try {
    const header=JSON.parse(new TextDecoder().decode(b64url(parts[0])));
    const claims=JSON.parse(new TextDecoder().decode(b64url(parts[1])));
    const now=Math.floor(Date.now()/1000);
    if(header.alg!=='RS256'||!header.kid||claims.iss!==`https://${domain}`||!(Array.isArray(claims.aud)?claims.aud.includes(aud):claims.aud===aud)||!claims.exp||claims.exp<=now||!claims.iat||claims.iat>now+60||claims.email?.toLowerCase()!==email)return false;
    const response=await fetch(`https://${domain}/cdn-cgi/access/certs`,{cf:{cacheTtl:300,cacheEverything:true}});
    if(!response.ok)return false;
    const jwks=await response.json();const jwk=jwks.keys?.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)return false;
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,b64url(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
  }catch{return false}
}
function normalize(x){
  if(!x||typeof x!=='object')throw Error('Invalid devotional');
  const str=(k,max=50000)=>{if(typeof x[k]!=='string'||x[k].length>max)throw Error(`Invalid ${k}`);return x[k].trim()};
  const id=str('id',160);if(!/^[a-zA-Z0-9_-]+$/.test(id))throw Error('Invalid ID');
  const title=str('title',150),reference=str('reference',200),bibleUrl=str('bibleUrl',500),short=str('short'),deeper=str('deeper');
  const reflection=x.reflection==null?'':str('reflection');
  const author=x.author==null?'Heather Kusunoki':str('author',120);
  if(!author)throw Error('Author name is required');
  if(!title||!reference||!short||!deeper||!/^https:\/\//.test(bibleUrl))throw Error('Complete all fields and use an HTTPS Bible URL');
  if(!Array.isArray(x.topics)||x.topics.length>30||x.topics.some(t=>typeof t!=='string'||t.length>80))throw Error('Invalid topics');
  const day=Number(x.day);if(!Number.isInteger(day)||day<1||day>100000)throw Error('Invalid day');
  const status=x.status==='published'?'published':x.status==='draft'?'draft':null;if(!status)throw Error('Invalid status');
  return {id,title,day,topics:x.topics.map(t=>t.trim()).filter(Boolean),reference,bibleUrl,short,deeper,reflection,author,status};
}
function row(r){return {id:r.id,title:r.title,day:r.day,topics:JSON.parse(r.topics||'[]'),reference:r.scripture,bibleUrl:r.bible_url,short:r.short,deeper:r.deeper,reflection:r.reflection||'',author:r.author||'Heather Kusunoki',status:r.status}}
const select='SELECT id, title, day, topics, scripture, bible_url, short, deeper, reflection, author, status FROM devotionals';
async function list(env,all){const q=await env.DB.prepare(`${select} ${all?'':'WHERE status = ?'} ORDER BY day ASC, created_at ASC`).bind(...(all?[]:['published'])).all();return (q.results||[]).map(row)}
async function save(env,d){await env.DB.prepare(`INSERT INTO devotionals (id,day,title,topics,scripture,bible_url,short,deeper,reflection,author,status) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET day=excluded.day,title=excluded.title,topics=excluded.topics,scripture=excluded.scripture,bible_url=excluded.bible_url,short=excluded.short,deeper=excluded.deeper,reflection=excluded.reflection,author=excluded.author,status=excluded.status,updated_at=CURRENT_TIMESTAMP`).bind(d.id,d.day,d.title,JSON.stringify(d.topics),d.reference,d.bibleUrl,d.short,d.deeper,d.reflection,d.author,d.status).run()}
export default {async fetch(request,env){
  const url=new URL(request.url),path=url.pathname;
  if(path==='/api/devotionals'&&request.method==='GET'){
    try{return json(await list(env,false))}catch{return fail('Database unavailable',503)}
  }
  if(path==='/admin'||path.startsWith('/admin/')||path.startsWith('/api/admin/')){
    const authorized=await verifyAccess(request,env);
    if(!authorized)return fail('Admin access denied. Check Cloudflare Access and Worker configuration.',403);
    if(path==='/admin'&&request.method==='GET')return new Response(ADMIN_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    if(path==='/admin/outline'&&request.method==='GET')return new Response(OUTLINE_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    if(path==='/admin/outline.js'&&request.method==='GET')return new Response(OUTLINE_JS,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store'}});
    if(path==='/admin/client.js'&&request.method==='GET')return new Response(ADMIN_JS,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
    if(path==='/api/admin/me'&&request.method==='GET')return json({email:(env.ADMIN_EMAIL||'').trim().toLowerCase(),displayName:(env.ADMIN_DISPLAY_NAME||'Heather Kusunoki').trim()||'Heather Kusunoki'});
    if(path==='/api/admin/devotionals'&&request.method==='GET')try{return json(await list(env,true))}catch{return fail('Database unavailable',503)}
    if(path==='/api/admin/devotionals'&&request.method==='POST'){
      try{const d=normalize(await request.json());await save(env,d);return json({ok:true,id:d.id})}catch(e){return fail(e.message,400)}
    }
    if(path==='/api/admin/seed'&&request.method==='POST'){
      try{const items=await request.json();if(!Array.isArray(items)||items.length>50)return fail('Invalid import',400);const clean=items.map(x=>normalize({...x,status:'published'}));for(const d of clean){await env.DB.prepare(`INSERT OR IGNORE INTO devotionals (id,day,title,topics,scripture,bible_url,short,deeper,reflection,author,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(d.id,d.day,d.title,JSON.stringify(d.topics),d.reference,d.bibleUrl,d.short,d.deeper,d.reflection,d.author,d.status).run()}return json({ok:true,imported:clean.length})}catch(e){return fail(e.message,400)}
    }
    if(path==='/api/admin/delete'&&request.method==='POST'){
      try{const {id}=await request.json();if(typeof id!=='string')return fail('Invalid ID');await env.DB.prepare('DELETE FROM devotionals WHERE id = ?').bind(id).run();return json({ok:true})}catch{return fail('Unable to delete',400)}
    }
    return fail('Not found',404);
  }
  if(path==='/admin.html'||path==='/admin.js')return fail('Not found',404); // never serve dashboard assets without Access
  return env.ASSETS.fetch(request);
}};
