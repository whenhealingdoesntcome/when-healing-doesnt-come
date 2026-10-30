import { mountNativeAccountScreen } from './native-account-screen.mjs';
import { syncNativeReaderSections, resolveNativeSyncConflict } from './native-safe-sync.mjs';
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
  const conflictsPanel=document.createElement('section');
  conflictsPanel.setAttribute('aria-label','Sync conflicts');
  host.append(conflictsPanel);
  const button=host.querySelector('[data-action="sync"]');
  // Replace prototype read-only Sync Now behavior with conservative section sync.
  const replacement=button.cloneNode(true);
  button.replaceWith(replacement);
  replacement.addEventListener('click',async()=>{
    replacement.disabled=true;
    const status=host.querySelector('[data-role="status"]');
    try {
      const report=await syncNativeReaderSections({controller:mounted.controller,storage,keys:savedKeys});
      status.textContent=`Synced ${report.downloaded.length+report.uploaded.length} sections. ${report.conflicts.length} need review.`;
      conflictsPanel.replaceChildren();
      for (const conflict of report.conflicts) {
        const section=document.createElement('div');
        const label=document.createElement('p');
        label.textContent=`Conflict in ${conflict.key}. Choose which copy to keep. The other may be overwritten.`;
        section.append(label);
        if (!Object.hasOwn(conflict,'cloudRevision')) { conflictsPanel.append(section); continue; }
        for (const [choice,title] of [['local','Keep device copy'],['cloud','Keep cloud copy (back up device copy)']]) {
          const action=document.createElement('button');
          action.type='button';action.textContent=title;
          action.addEventListener('click',async()=>{
            action.disabled=true;
            try {
              const outcome=await resolveNativeSyncConflict({controller:mounted.controller,storage,conflict,choice});
              section.replaceChildren();
              const message=document.createElement('p');
              message.textContent=`Resolved ${conflict.key} using ${choice} copy.${outcome.backupKey?' Device backup: '+outcome.backupKey:''}`;
              section.append(message);
              host.dispatchEvent(new CustomEvent('whdc:native-sync-resolved',{detail:{key:conflict.key,choice},bubbles:true}));
            } catch(e) {status.textContent=e?.message||'Resolution failed. Sync again.';action.disabled=false;}
          });
          section.append(action);
        }
        conflictsPanel.append(section);
      }
      host.dispatchEvent(new CustomEvent('whdc:native-sync',{detail:report,bubbles:true}));
    } catch(e) {status.textContent=e?.message||'Sync could not complete';}
    finally {replacement.disabled=false;}
  });
  return {host,refresh:mounted.refresh,unmount:()=>host.remove()};
}
