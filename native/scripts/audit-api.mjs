import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root=resolve(process.argv[2] || 'www');
let count=0;
function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const path=join(dir,item.name);if(item.isDirectory())walk(path);else if(/\.(js|html)$/.test(item.name)){const content=readFileSync(path,'utf8');const matches=[...content.matchAll(/(?:fetch\s*\(\s*|['"`])\/?api\/[a-zA-Z0-9/_-]+/g)];if(matches.length){console.log(`${path}: ${matches.length} potential API references`);count+=matches.length;}}}}
walk(root);console.log(`Found ${count} potential API references. This is a heuristic, not a full dependency/security audit.`);
