import { createNativeReaderApi } from './reader-auth.mjs';
import { createSecureTokenVault } from './secure-token-vault.mjs';

/** Native-only account controller for a future WHDC account screen.
 * Never display or log bearer tokens. The UI should show only public state.
 */
export async function createNativeAccountController({baseUrl='https://whdcdevotions.com'}={}) {
  const vault = await createSecureTokenVault();
  const api = createNativeReaderApi({vault,baseUrl});
  return {
    async status() {
      if (!await vault.get()) return {signedIn:false};
      try { return await api.me(); }
      catch (error) { if (/sign in|unauthorized|401/i.test(String(error))) return {signedIn:false}; throw error; }
    },
    requestCode(email) { return api.requestCode(email.trim().toLowerCase()); },
    verifyCode(email,code) { return api.verifyCode(email.trim().toLowerCase(),code.trim()); },
    sync() { return api.sync(); },
    syncItem(key,value,baseRevision) { return api.syncItem(key,value,baseRevision); },
    savedData() { return api.savedData(); },
    saveData(data) { return api.saveData(data); },
    logout() { return api.logout(); },
    async deleteAccount(email,confirmed) {
      if (confirmed !== true) throw new Error('Account deletion must be explicitly confirmed');
      return api.deleteAccount(email.trim().toLowerCase());
    }
  };
}
