#!/usr/bin/env node
// Validates an externally measured word-alignment JSON and uploads it to the exact R2 recording sidecar.
import {readFile, mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2);
const opt=(name)=>{const i=args.indexOf(name);return i>=0?args[i+1]:undefined};
const usage='Usage: node scripts/upload-word-timing.mjs --file aligned.json --devotional ID --part devotional|deeper|scripture --voice sulafat|sadachbia --hash HEX --bucket R2_BUCKET [--expected-words NUMBER] [--remote] [--upload]';
if(args.includes('--help')){console.log(usage);process.exit(0)}
const file=opt('--file'),id=opt('--devotional'),part=opt('--part'),voice=opt('--voice'),hash=opt('--hash'),bucket=opt('--bucket');
const valid=/^[a-z0-9][a-z0-9-]{0,120}$/;
if(!file||!valid.test(id||'')||!['devotional','deeper','scripture'].includes(part)||!['sulafat','sadachbia'].includes(voice)||!/^[a-f0-9]{8,128}$/.test(hash||'')||!bucket||!/^[a-zA-Z0-9_-]+$/.test(bucket)){console.error(usage);process.exit(2)}
let data;
try{data=JSON.parse(await readFile(file,'utf8'))}catch(e){console.error('Cannot read timing JSON:',e.message);process.exit(2)}
if(data?.version!==1||!Array.isArray(data.words)||!data.words.length||data.words.length>20000){console.error('Expected {version:1,words:[...]} with 1–20000 words');process.exit(2)}
let previousStart=-1;
for(let i=0;i<data.words.length;i++){
 const w=data.words[i];
 if(!w||typeof w.start!=='number'||typeof w.end!=='number'||!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.start<0||w.end<=w.start||w.start<previousStart){console.error(`Invalid timestamps at word ${i+1}`);process.exit(2)}
 previousStart=w.start;
}
const expected=opt('--expected-words');
if(expected!==undefined&&(!/^\d+$/.test(expected)||Number(expected)!==data.words.length)){console.error(`Word count mismatch: expected ${expected}, got ${data.words.length}`);process.exit(2)}
const key=`devotionals/${id}/${part}/${voice}-${hash}.words.json`;
console.log(`Validated ${data.words.length} word timings (${data.words.at(-1).end.toFixed(2)}s end)\nR2 object: ${key}`);
if(!args.includes('--upload')){console.log('Dry run only. Add --upload to publish verified alignment.');process.exit(0)}
const dir=await mkdtemp(join(tmpdir(),'whdc-timing-'));
try{
 const path=join(dir,'timing.json');await writeFile(path,JSON.stringify({version:1,words:data.words}));
 const cmd=['wrangler','r2','object','put',`${bucket}/${key}`,'--file',path,'--content-type','application/json'];
 if(args.includes('--remote'))cmd.push('--remote');else cmd.push('--local');
 const result=spawnSync('npx',cmd,{stdio:'inherit',shell:false});if(result.status!==0)process.exitCode=result.status||1;
}finally{await rm(dir,{recursive:true,force:true})}
