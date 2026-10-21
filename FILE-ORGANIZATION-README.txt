WHDC FILE ORGANIZATION UPDATE — OCTOBER 21, 2026

This ZIP is the complete project, reorganized from the user-provided
when-healing-doesnt-come-main(20261021-135339).zip.

Public-facing routes preserved:
  / and /index.html, /bible-reader.html, /get-app.html
  /sw.js, /manifest.webmanifest, /content.json

New feature folders:
  public/devotionals/   Main devotional app and devotional study
  public/bible/         Bible JSON, reader scripts/styles, markings, notes, favorites
  public/audio/         Recorded audio player
  public/shared/        Shared navigation and app-wide styles
  public/assets/        Non-platform artwork, banners, and QR graphic
  public/admin/         Admin-specific browser assets

Root files retained intentionally: index.html, bible-reader.html, get-app.html,
manifest.webmanifest, sw.js, content.json, and platform app icons.

The Cloudflare Worker source and its imports are unchanged. Existing URL routes
and localStorage keys are unchanged, preserving links and on-device data.

Deployment: Replace the project with this complete reorganized project, then
redeploy. Do not upload only the new folders: the old file paths must stop being
referenced. The service worker cache version was bumped to v5. Verify on desktop
and mobile, including offline reading, before removing any deployment backups.

Validation: All public JavaScript files passed node --check; service-worker
precache paths and HTML asset references were checked against ZIP contents.
No live browser, Cloudflare deployment, or end-to-end tests were performed.
