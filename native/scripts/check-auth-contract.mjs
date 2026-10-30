import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const file = resolve(process.argv[2] || '../src/worker.js');
const source = readFileSync(file, 'utf8');
const endpoints = ['/api/reader/request-code','/api/reader/complete-signin','/api/reader/me','/api/reader/sync','/api/reader/saved-data','/api/reader/logout','/api/reader/delete-account'];
for (const path of endpoints) console.log(`${source.includes(path) ? 'FOUND' : 'MISSING'} ${path}`);
console.log(`Cookie-based auth: ${source.includes('readerSessionCookie') && source.includes('readerCookie(req)') ? 'DETECTED' : 'NOT DETECTED'}`);
console.log('Native bundled origin differs from the HTTPS domain. Do not rely on same-origin cookie sessions or wildcard credentialed CORS.');
if (endpoints.some(p=>!source.includes(p))) process.exitCode=1;
