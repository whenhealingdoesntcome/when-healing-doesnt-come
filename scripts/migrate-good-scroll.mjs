// Default is local. --remote is an explicit production mutation; use only after approval.
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const args=process.argv.slice(2);
if(args.some(x=>!['--local','--remote'].includes(x))||args.includes('--local')&&args.includes('--remote'))throw Error('Usage: node scripts/migrate-good-scroll.mjs [--local|--remote]');
const target=args.includes('--remote')?'--remote':'--local';
const run=(...options)=>execFileSync(process.platform==='win32'?'npx.cmd':'npx',['--yes','wrangler','d1','execute','whdc-devotionals',target,'--json',...options],{encoding:'utf8'});
const columns=()=>JSON.parse(run('--command','PRAGMA table_info(good_scroll_posts)')).flatMap(result=>result.results||[]);
if(!columns().length)run('--file',resolve('GOOD-SCROLL-MIGRATION.sql'));
if(!columns().some(column=>column.name==='design'))run('--file',resolve('GOOD-SCROLL-DESIGN-MIGRATION.sql'));
console.log('Good Scroll schema ready ('+target+'). Existing rows preserved.');
