// Isolated local QA only. Mock Cloudflare storage and generated test identity.
// Never deploy this script or expose its HTTP port beyond 127.0.0.1.
import http from 'node:http';
import {readFileSync} from 'node:fs';
import {createTestEnv} from './good-scroll-test-env.mjs';
const t=await createTestEnv();
const seed={type:'encouragement',background:'#e6ece3',color:'#405b49',align:'center',status:'published'};
for(let i=1;i<=14;i++)await t.request('/api/admin/good-scroll',{admin:true,method:'POST',body:{...seed,title:'Local preview '+i,text:i===1?'Even when we are capable of carrying our burdens alone, being part of the body of Christ means we don’t have to.':'Hope for the journey.\nOne day at a time.',reference:'WHDC · Local test post',caption:'Local preview content — not connected to Cloudflare.',design:{font:i%2?'serif':'sans',position:i%3===0?'top':'center'}}});
try{const bytes=readFileSync(new URL('../../good-scroll-cards/01_whdc_dont_have_to.png',import.meta.url));const uploaded=await t.request('/api/admin/good-scroll/image',{admin:true,method:'POST',headers:{'content-type':'image/png'},body:new Uint8Array(bytes)});const key=(await uploaded.json()).key;await t.request('/api/admin/good-scroll',{admin:true,method:'POST',body:{...seed,title:'Supplied artwork preview',text:'Even when we are capable of carrying our burdens alone, being part of the body of Christ means we don’t have to.',reference:'Heather Kusunoki — Better Together',image_key:key,design:{mode:'artwork'}}});}catch{}
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/__video-fixture'){res.writeHead(200,{'content-type':'text/html'});res.end(readFileSync(new URL('./good-scroll-video-fixture.html',import.meta.url)));return;}
  const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
  // Signing is confined to this loopback-only test adapter. Production still verifies Access JWTs.
  const result=await t.request(req.url,{admin:true,method:req.method,headers:{...req.headers},body:body.length?new Uint8Array(body):undefined});
  res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }catch(e){console.error(e);res.writeHead(500);res.end('Local preview error');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local test preview: http://127.0.0.1:4173/admin/good-scroll'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{t.close();process.exit();}));
