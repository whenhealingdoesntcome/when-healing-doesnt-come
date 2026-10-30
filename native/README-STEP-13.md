# WHDC Step 13: Native development workspace

This package combines the latest uploaded WHDC `public/` assets and Step 12 account modules into a Capacitor workspace. **Not a compiled or functional native app yet.** No production files are modified.

## Setup
1. Unzip, then `cd native`.
2. Run `npm install` (internet and Node.js required).
3. Run `npx cap add ios` on macOS with Xcode, and `npx cap add android` with Android Studio. Use `npx cap sync` after changing assets.
4. Open the platform project using `npx cap open ios` or `npx cap open android`.
5. Test using a **staging** Cloudflare Worker. Do not deploy the Step 7 authentication code directly to production.

## Important blockers before device testing
- The account screen source uses bare `@capacitor/*` module imports. It must be bundled into a browser entrypoint (for example, Vite/esbuild) and explicitly bootstrapped. It is staged but **not activated** to avoid a broken screen.
- Step 12 Settings replaces the PWA account panel with a native mount placeholder. Until bundling/bootstrap is completed, the placeholder will remain in the native copy.
- The app uses relative `/api` requests and browser-based service workers/push; a locally bundled Capacitor app needs a tested cross-origin API adapter and native notification integration.
- Authentication and data sync require staging API contract tests, secure storage plugin installation, and real device testing.
- Store readiness also requires offline tests, external-link handling, accessibility, privacy policy, and reviewer-ready functionality.

## Rebuilding from a newer WHDC ZIP
Unzip the new source next to `native` as `when-healing-doesnt-come-main`, then run `npm run prepare` inside `native`.

## Validation completed
The staged Settings patch was applied and the source JavaScript syntax and package structure were checked. No iOS/Android binaries were compiled.
