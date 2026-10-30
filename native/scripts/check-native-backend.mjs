// Read-only checks. Does not sign in, mutate data, or send credentials.
const base = process.env.WHDC_API_ORIGIN || 'https://whdcdevotions.com';
const origin = new URL(base);
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw Error('WHDC_API_ORIGIN must be an HTTPS origin, e.g. https://whdcdevotions.com');
}
const checks = [
  ['/api/reader/me', 'Expected 401 when signed out; 200 indicates a public/session-dependent result'],
  ['/api/reader/session-check', 'Inspect HTTP status only; do not print response contents']
];
for (const [path, note] of checks) {
  try {
    const r = await fetch(new URL(path, origin), {redirect:'manual', headers:{accept:'application/json'}, signal:AbortSignal.timeout(10000)});
    console.log(`${path}: HTTP ${r.status}; content-type=${r.headers.get('content-type') || 'none'}`);
    console.log(`  ${note}`);
    if (r.status >= 300 && r.status < 400) console.log('  Redirect detected; inspect routing / Cloudflare Access before native integration.');
  } catch (e) { console.error(`${path}: ${e.message}`); process.exitCode = 1; }
}
console.log('This checks public reachability only, not native cookies, sign-in, sync, or deletion.');
