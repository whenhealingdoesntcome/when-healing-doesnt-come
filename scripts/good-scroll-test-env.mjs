// Local-only test adapter: real Worker routes, SQLite, memory R2 and a test RSA key.
// Never uses Cloudflare credentials or remote data. Requires Node 22+.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/worker.js';
export async function createTestEnv(){
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec(readFileSync(new URL('../GOOD-SCROLL-MIGRATION.sql',import.meta.url),'utf8'));
 sqlite.exec(readFileSync(new URL('../GOOD-SCROLL-DESIGN-MIGRATION.sql',import.meta.url),'utf8'));
 sqlite.exec('CREATE TABLE reader_accounts(id TEXT PRIMARY KEY,email TEXT); CREATE TABLE reader_sessions(account_id TEXT,token_hash TEXT,expires_at INTEGER); CREATE TABLE reader_sync_items(account_id TEXT,item_key TEXT,payload TEXT,revision INTEGER,updated_at INTEGER,PRIMARY KEY(account_id,item_key));');
 const DB={prepare(sql){let values=[];const q={bind(...v){values=v;return q;},async first(){return sqlite.prepare(sql).get(...values)||null;},async all(){return {results:sqlite.prepare(sql).all(...values)};},async run(){const r=sqlite.prepare(sql).run(...values);return {meta:{changes:r.changes}};}};return q;}};
 const objects=new Map();
 const AUDIO_BUCKET={async put(key,body,options){objects.set(key,{bytes:new Uint8Array(body),httpMetadata:options?.httpMetadata});},async get(key,options){const item=objects.get(key);return item?{body:options?.range?item.bytes.slice(options.range.offset,options.range.offset+options.range.length):item.bytes,httpMetadata:item.httpMetadata}:null;},async head(key){return objects.has(key)?{size:objects.get(key).bytes.length}:null;}};
 const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'local-test'};
 const originalFetch=globalThis.fetch;
 globalThis.fetch=(input,options)=>String(input)==='https://local-test.cloudflareaccess.com/cdn-cgi/access/certs'?Promise.resolve(Response.json({keys:[jwk]})):originalFetch(input,options);
 const now=Math.floor(Date.now()/1000),b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
 const unsigned=b64({alg:'RS256',kid:'local-test'})+'.'+b64({iss:'https://local-test.cloudflareaccess.com',aud:'test-audience',email:'test@example.invalid',iat:now,exp:now+3600});
 const signature=Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(unsigned))).toString('base64url');
 const jwt=unsigned+'.'+signature;
 const env={DB,AUDIO_BUCKET,ACCESS_TEAM_DOMAIN:'local-test.cloudflareaccess.com',ACCESS_AUD:'test-audience',ADMIN_ACCESS_AUD:'test-audience',ADMIN_EMAIL:'test@example.invalid',ASSETS:{async fetch(request){const path=new URL(request.url).pathname;try{const file=new URL('../public'+(path==='/'?'/index.html':path),import.meta.url);if(!file.pathname.startsWith(new URL('../public/',import.meta.url).pathname))return new Response('Not found',{status:404});const ext=file.pathname.split('.').pop(),types={js:'text/javascript',css:'text/css',html:'text/html',json:'application/json',png:'image/png',webp:'image/webp'};return new Response(readFileSync(file),{headers:{'content-type':types[ext]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}}}};
 async function request(path,{admin=false,method='GET',body,headers={},cookie}={}){
  const h=new Headers(headers);if(admin)h.set('cf-access-jwt-assertion',jwt);if(cookie)h.set('cookie',cookie);
  const host=path.startsWith('/admin')||path.startsWith('/api/admin')?'admin.whdcdevotions.com':'whdcdevotions.com';
  if(method!=='GET'&&method!=='HEAD')h.set('origin','https://'+host);
  if(body&&typeof body==='object'&&!(body instanceof Uint8Array)){h.set('content-type','application/json');body=JSON.stringify(body);}
  return worker.fetch(new Request('https://'+host+path,{method,headers:h,body}),env,{waitUntil(){}});
 }
 return {request,env,sqlite,objects,jwt,close(){sqlite.close();globalThis.fetch=originalFetch;}};
}
