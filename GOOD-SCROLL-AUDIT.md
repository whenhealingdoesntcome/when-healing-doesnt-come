# Good Scroll audit — supplied source snapshot

Reviewed src/admin/good-scroll-{client,html}.js, src/good-scroll-feed.js,
src/worker.js, public/devotionals/app.js, shared navigation, Wrangler configuration,
and the three phase installation notes. No production services were queried.

Existing: admin identity gate and shared dashboard navigation; D1 post CRUD;
publish/unpublish; category/text/reference/caption fields; color pickers; optional
R2 uploads with size/type/signature checks; published-only cursor feed; 1080×1350
canvas export; file-share/download fallbacks; device-local ID bookmarks.

Defects/gaps: drafts require title/text in both HTML and API; stale phase-1 messages;
Good Scroll stylesheet discarded by the shared dashboard wrapper (causing full-width color inputs and loss of layout); no search or duplicate; no HEX inputs, font/vertical positioning, crop controls,
image removal or unsaved-change protection. Preview, feed and export use different
layouts. The Explore link is already present and will be preserved. Bookmarks are absent from Saved, cloud
sync and backups. Feed ignores the explicit WHDC theme. Link hashes cannot reliably
open older posts. Incremental loading can stall if the sentinel stays visible.
No package manifest or browser/feature test suite is supplied.

Plan: reuse existing routes, table, account sync API, shared navigation and R2
binding. Share one canvas renderer across admin/feed/export; add finished-artwork
mode for the 56 supplied PNGs. Add search, duplicate, blank drafts, HEX controls,
font/position/crop controls, busy/error/dirty states. Preserve Explore and add Saved links and
include Good Scroll bookmarks in the existing account sync and backup keys.

Migration: add one NOT NULL design JSON text column with '{}' default; existing
rows retain defaults. No content deletion or replacement. Base CREATE TABLE/INDEX
migration is repeatable; the additive ALTER must run once through a migration
ledger or after inspecting PRAGMA table_info. No new bucket or account system.

Cards: all 56 input files are PNG, 1080×1350, under 5 MB each. Existing editor would
overlay text/branding over these completed designs. Preserve originals with artwork
mode; import as drafts and review accessible text/category/reference before publish.
