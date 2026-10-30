import { mountNativeAccountScreen } from './native-account-screen.mjs';
import { syncNativeReaderSections } from './native-safe-sync.mjs';
/** Mount only in a Capacitor native app, in the existing Settings screen.
 * The caller supplies the actual Settings root and WHDC saved-key allowlist.
 * Never call from the public PWA. No global fetch or localStorage monkey-patching.
 */
export async function mountNativeSettingsAccount(settingsRoot, {
  baseUrl, savedKeys=[], storage=window.localStorage
}={}) {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) throw new Error('Native account integration is not for the PWA');
  if (!(settingsRoot instanceof HTMLElement)) throw new TypeError('Settings root element required');
  const host = document.createElement('div');
  host.id='whdcNativeSettingsAccount';
  settingsRoot.append(host);
  const mounted=await mountNativeAccountScreen(host,{baseUrl});
  const button=host.querySelector('[data-action="sync"]');
  // Replace prototype read-only Sync Now behavior with conservative section sync.
  const replacement=button.cloneNode(true);
  button.replaceWith(replacement);
  replacement.addEventListener('click',async()=>{
    replacement.disabled=true;
    const status=host.querySelector('[data-role="status"]');
    try {
      const report=await syncNativeReaderSections({controller:mounted.controller,storage,keys:savedKeys});
      status.textContent=`Synced ${report.downloaded.length+report.uploaded.length} sections. ${report.conflicts.length} need review; none were overwritten.`;
      host.dispatchEvent(new CustomEvent('whdc:native-sync',{detail:report,bubbles:true}));
    } catch(e) {status.textContent=e?.message||'Sync could not complete';}
    finally {replacement.disabled=false;}
  });
  return {host,refresh:mounted.refresh,unmount:()=>host.remove()};
}
