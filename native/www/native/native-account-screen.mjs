import { createNativeAccountController } from './native-account-controller.mjs';

/** Mounts a native-only account screen. Does not alter the PWA's account UI. */
export async function mountNativeAccountScreen(root, { baseUrl = 'https://whdcdevotions.com' } = {}) {
  if (!(root instanceof HTMLElement)) throw new TypeError('A root element is required');
  const controller = await createNativeAccountController({ baseUrl });
  let email = '';
  root.innerHTML = `<section class="whdc-native-account" aria-label="My Account">
    <h1>My Account</h1><p data-role="status" aria-live="polite">Checking account…</p>
    <div data-role="signed-out" hidden>
      <form data-role="request"><label>Email address<input name="email" type="email" autocomplete="email" required></label><button>Send sign-in code</button></form>
      <form data-role="verify" hidden><label>Six-digit code<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label><button>Sign in</button></form>
    </div>
    <div data-role="signed-in" hidden><p data-role="identity"></p><button data-action="sync">Sync Now</button><button data-action="signout">Sign Out</button><hr><button data-action="delete" class="danger">Delete My Account</button></div>
  </section>`;
  const el = selector => root.querySelector(selector);
  const status = message => { el('[data-role="status"]').textContent = message; };
  const setBusy = busy => { root.querySelectorAll('button,input').forEach(node => node.disabled = busy); };
  const show = (signedIn, identity = '') => {
    el('[data-role="signed-in"]').hidden = !signedIn;
    el('[data-role="signed-out"]').hidden = signedIn;
    el('[data-role="identity"]').textContent = identity;
    status(signedIn ? 'Signed in' : 'Not signed in');
  };
  async function run(operation) { setBusy(true); try { await operation(); } catch (error) { status(error?.message || 'Something went wrong. Please try again.'); } finally { setBusy(false); } }
  async function refresh() {
    const result = await controller.status();
    show(Boolean(result?.signedIn || result?.ok && result?.email), result?.email || '');
  }
  el('[data-role="request"]').addEventListener('submit', event => {
    event.preventDefault();
    run(async () => { email = new FormData(event.currentTarget).get('email').trim().toLowerCase(); await controller.requestCode(email); el('[data-role="verify"]').hidden = false; status('Check your email for a six-digit code.'); });
  });
  el('[data-role="verify"]').addEventListener('submit', event => {
    event.preventDefault();
    run(async () => { await controller.verifyCode(email, String(new FormData(event.currentTarget).get('code'))); await refresh(); });
  });
  el('[data-action="sync"]').addEventListener('click', () => run(async () => { await controller.sync(); status('Cloud data retrieved. Local data merging is not connected yet.'); }));
  el('[data-action="signout"]').addEventListener('click', () => run(async () => { await controller.logout(); await refresh(); }));
  el('[data-action="delete"]').addEventListener('click', () => run(async () => {
    const account = await controller.status();
    const accountEmail = account?.email;
    if (!accountEmail) throw Error('Unable to verify account email.');
    if (!window.confirm('Permanently delete your WHDC account and its cloud data? This cannot be undone.')) return;
    const typed = window.prompt(`Type DELETE to confirm deletion of ${accountEmail}:`);
    if (typed !== 'DELETE') return;
    await controller.deleteAccount(accountEmail, true);
    await refresh();
    status('Your account has been deleted.');
  }));
  await run(refresh);
  return { refresh, controller };
}
