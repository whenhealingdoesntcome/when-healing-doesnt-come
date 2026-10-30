/** Conservative first-pass sync for native builds.
 * No overwrites or auto-merges. Divergent data is reported for later review.
 * Uses the same revisioned /sync API as WHDC web, without importing web cookies.
 */
export async function syncNativeReaderSections({controller, storage, keys}) {
  if (!controller?.sync || !controller?.syncItem) throw new TypeError('Native account controller required');
  if (!storage?.getItem || !storage?.setItem) throw new TypeError('Storage adapter required');
  if (!Array.isArray(keys) || keys.some(k => typeof k !== 'string')) throw new TypeError('Explicit allowlist of keys required');
  const remote = (await controller.sync()).items || {};
  const result = {downloaded:[],uploaded:[],unchanged:[],conflicts:[]};
  for (const key of [...new Set(keys)]) {
    const local = storage.getItem(key);
    const cloud = remote[key];
    const value = cloud?.value ?? null;
    const revision = cloud?.revision || 0;
    if (local === value) { result.unchanged.push(key); continue; }
    if (local === null && value !== null) {
      storage.setItem(key,value);
      result.downloaded.push(key);
      continue;
    }
    if (local !== null && value === null) {
      try {
        const saved = await controller.syncItem(key,local,revision);
        if (!saved?.revision) throw new Error('Upload not confirmed');
        result.uploaded.push(key);
      } catch (error) { result.conflicts.push({key,reason:'Upload failed or changed on server'}); }
      continue;
    }
    result.conflicts.push({key,reason:'Both device and cloud have different saved values'});
  }
  return result;
}
