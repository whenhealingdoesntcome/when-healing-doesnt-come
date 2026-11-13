import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const paths=['index.html','devotionals/app.js','shared/styles.css','shared/shared-nav.js','shared/auto-update.js','shared/pull-to-refresh.js','audio/audio-player.js','bible/component.js','bible/component.css','bible/reader.js','bible/reader.css'];
const files={};
for(const path of paths){const bytes=await readFile(resolve(root,'public',path));files['/'+path]=createHash('sha256').update(bytes).digest('hex')}
const version=createHash('sha256').update(JSON.stringify(files)).digest('hex');
await writeFile(resolve(root,'public/update-manifest.json'),JSON.stringify({schema:1,version,files})+'\n');
console.log('WHDC manifest '+version.slice(0,16));
