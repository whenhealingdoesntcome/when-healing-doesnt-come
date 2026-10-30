/** Native-only transport for public WHDC endpoints. No credentials are attached.
 * The Cloudflare Worker must explicitly allow the Capacitor origins for CORS.
 */
export const DEFAULT_ORIGIN = 'https://whdcdevotions.com';
export const PUBLIC_API_PATHS = Object.freeze([
  '/api/devotionals', '/api/scripture', '/api/reading-plans',
  '/api/resources', '/api/announcement', '/api/audio/'
]);
export function resolvePublicApiUrl(input, origin=DEFAULT_ORIGIN) {
  if (typeof input !== 'string' || !input.startsWith('/api/')) return null;
  const path = input.split('?')[0];
  if (!PUBLIC_API_PATHS.some(p=>path===p || (p.endsWith('/') && path.startsWith(p)))) return null;
  const target = new URL(origin);
  if (target.protocol !== 'https:' || target.username || target.password || target.search || target.hash || target.pathname !== '/') throw Error('Invalid HTTPS API origin');
  return new URL(input, target).href;
}
export function installNativePublicApiBridge({origin=DEFAULT_ORIGIN, target=globalThis}={}) {
  const original = target.fetch.bind(target);
  target.fetch = (resource, options) => {
    const url = typeof resource==='string' ? resolvePublicApiUrl(resource,origin) : null;
    if (!url) return original(resource,options);
    // Public reads only. Authenticated account calls must use native bearer-token API.
    const method = String(options?.method||'GET').toUpperCase();
    if (method!=='GET' && method!=='HEAD') return original(resource,options);
    return original(url,{...options,credentials:'omit'});
  };
  return ()=>{target.fetch=original};
}
