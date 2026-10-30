// Run ONLY against the staged native copy, never the production PWA source.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const file=resolve(process.argv[2]||'native/www/devotionals/app.js');
let source=readFileSync(file,'utf8');
const old="+whdcReaderAccountPanel()+whdcTransferPanel()";
const replacement="+whdcNativeAccountPlaceholder()+whdcTransferPanel()";
if(!source.includes(old)) throw Error('Settings template changed. No files modified.');
if(source.includes('function whdcNativeAccountPlaceholder()')) {console.log('Already patched');process.exit(0);}
const anchor='function whdcReaderAccountPanel(){';
if(!source.includes(anchor))throw Error('Reader account anchor not found');
source=source.replace(anchor,`function whdcNativeAccountPlaceholder(){
 return '<section class="card" style="max-width:760px;margin:14px auto 20px" id="whdcNativeSettingsMount" aria-label="My Account"><p role="status">Loading account…</p></section>';
}
`+anchor).replace(old,replacement);
// Only the staged native copy dispatches this event after Settings has rendered.
const renderAnchor="if(view==='settings'){whdcWireTransfer();";
if(!source.includes(renderAnchor))throw Error('Settings render anchor not found');
source=source.replace(renderAnchor,"if(view==='settings'){window.dispatchEvent(new Event('whdc:native-settings-rendered'));whdcWireTransfer();");
writeFileSync(file,source);
console.log('Native staged Settings patched:',file);
