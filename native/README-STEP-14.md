# WHDC Step 14: Native workspace integration pass

This is a **development workspace**, not a compiled iOS or Android app. The live PWA is unchanged.

## Changes
- Removes the retired standalone `bible-reader.html` from the native assets and removes it on subsequent asset preparation. The integrated Bible component remains.
- Adds a real browser bundling step for the native account modules using esbuild, with a native-only entry point loaded by `www/index.html`.
- Keeps existing native account UI isolated from the PWA.

## Run
1. `cd native`
2. `npm install`
3. `npm run build:native` (the bundle must exist before device testing)
4. To refresh assets from a newer WHDC source, place the extracted `when-healing-doesnt-come-main` beside `native`, then run `npm run prepare`.
5. `npx cap add ios` on a Mac with Xcode, and/or `npx cap add android` with Android Studio, then `npx cap sync`.

## Important blockers
- **Do not deploy as production yet.** The existing devotional, Scripture, audio and reader account code uses relative `/api` URLs. Those will not reach the Cloudflare backend when bundled under a Capacitor origin. A tested, scoped API transport and native authorization flow are still required.
- The native Settings account entry is now bundled, but synchronization keys are intentionally an empty allowlist until we verify the real key mappings. This prevents accidental data overwrite.
- The Step 7 Worker authentication endpoints have not been deployed or end-to-end tested. Native account functions require a staging backend and secure storage validation.
- Push notifications and offline caching need native implementations/testing.
- Native builds and device tests have **not** been run.

## Validation
JavaScript syntax and archive integrity can be checked locally; the esbuild compilation requires npm dependencies and has not been assumed successful without running it.
