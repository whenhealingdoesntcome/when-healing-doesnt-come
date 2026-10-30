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
    result.conflicts.push({key,reason:'Both device and cloud have different saved values',localValue:local,cloudValue:value,cloudRevision:revision});
  }
  return result;
}

/** Resolve one explicitly selected conflict. Never auto-resolve. */
export async function resolveNativeSyncConflict({controller,storage,conflict,choice}) {
  if (!conflict || typeof conflict.key !== 'string' || !['local','cloud'].includes(choice)) throw Error('Explicit conflict choice required');
  const {key,localValue,cloudValue,cloudRevision}=conflict;
  if (storage.getItem(key)!==localValue) throw Error('Local data changed. Sync again before resolving.');
  // Recheck server because the original conflict may now be stale.
  const latest=(await controller.sync()).items?.[key];
  if ((latest?.revision||0)!==cloudRevision || (latest?.value??null)!==cloudValue) throw Error('Cloud data changed. Sync again before resolving.');
  if(choice==='local') {
    const saved=await controller.syncItem(key,localValue,cloudRevision);
    if (!saved?.revision) throw Error('Cloud did not confirm the update');
    return {key,choice,revision:saved.revision};
  }
  // Preserve a recoverable copy of the local version before replacing it.
  const backupKey=`whdc-native-conflict-backup:${encodeURIComponent(key)}:${Date.now()}`;
  storage.setItem(backupKey,localValue);
  try { storage.setItem(key,cloudValue); }
  catch(error) { throw new Error(`Backup saved at ${backupKey}, but local replacement failed: ${error.message}`); }
  return {key,choice,backupKey};
}
