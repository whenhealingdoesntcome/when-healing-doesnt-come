import { cpSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
const source=resolve(process.argv[2]||'../when-healing-doesnt-come-main/public');
const root=resolve(import.meta.dirname,'..');
if(!existsSync(join(source,'index.html'))||!existsSync(join(source,'devotionals/app.js')))throw Error('Supply the WHDC public directory');
const dest=join(root,'www');
mkdirSync(dest,{recursive:true});
cpSync(source,dest,{recursive:true,force:true});
// Standalone Bible Reader was retired; native uses the integrated Bible component.
rmSync(join(dest,'bible-reader.html'),{force:true});
// Install public API transport before app scripts. This never modifies the PWA.
const htmlPath=join(dest,'index.html');
let html=readFileSync(htmlPath,'utf8');
if(!html.includes('/native/native-public-entry.js')) html=html.replace('<script src="/shared/shared-nav.js','<script src="/native/native-public-entry.js"></script><script src="/shared/shared-nav.js');
writeFileSync(htmlPath,html);
execFileSync(process.execPath,[join(root,'scripts/integrate-settings.mjs'),join(dest,'devotionals/app.js')],{stdio:'inherit'});
// Native entry is bundled separately by npm run build:native; do not copy raw modules into web assets.
console.log('Native assets staged. The native account module still requires bundling and endpoint tests.');
