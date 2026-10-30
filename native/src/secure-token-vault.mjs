/** iOS Keychain / Android Keystore storage via a native Capacitor plugin.
 * Do not call from a browser/PWA. Never fall back to localStorage.
 * Install @capacitor-community/secure-storage-plugin and sync native projects.
 */
export async function createSecureTokenVault() {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) throw new Error('Secure token vault requires iOS or Android');
  const { SecureStoragePlugin } = await import('@capacitor-community/secure-storage-plugin');
  const key = 'whdc.reader.native.access-token.v1';
  return {
    async get() {
      try { const result = await SecureStoragePlugin.get({ key }); return result?.value || null; }
      catch (error) { if (/not found|does not exist|no value/i.test(String(error))) return null; throw error; }
    },
    async set(token) {
      if (!/^[0-9a-f]{64}$/.test(token)) throw new Error('Invalid token format');
      await SecureStoragePlugin.set({ key, value: token });
    },
    async clear() {
      try { await SecureStoragePlugin.remove({ key }); }
      catch (error) { if (!/not found|does not exist|no value/i.test(String(error))) throw error; }
    }
  };
}
