import { startNativeSettingsAccount } from './native-settings-bootstrap.mjs';

// Native-only entry. The PWA does not load this bundle.
const apiOrigin = 'https://whdcdevotions.com';
startNativeSettingsAccount({ baseUrl: apiOrigin, savedKeys: [] }).catch(error => {
  console.error('Native account initialization failed', error);
});
