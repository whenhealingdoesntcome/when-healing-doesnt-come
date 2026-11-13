# The Good Scroll — review and local testing

This is a website/PWA update based on the supplied source ZIP. No deployment,
remote migration, production content import, native iOS, Capacitor, Xcode, or
Wrangler configuration changes were made.

## Implemented

- Existing admin navigation retained. Fixed its wrapper dropping Good Scroll CSS.
- Compact color rows: a persistent 44px color square beside an editable HEX value.
- Search/status filter, duplicate, blank drafts, publish validation, unsaved-change
  protection, busy states, and actionable errors.
- Fonts, alignment, vertical position, background photo crop/zoom, image removal,
  and a shared 1080×1350 renderer for image preview/feed/PNG export.
- Finished-card mode preserves supplied artwork rather than drawing text over it.
- Batch import creates drafts; SHA-256-derived IDs skip identical files on repeat
  imports. Review transcripts, attribution, categories and captions before publishing.
- MP4/WebM video upload (50 MB); 4:5 frame, fit/fill, crop position and optional text.
  Frame width is at least 12 pixels in the 1080px design. Frame uses Background color;
  optional text uses Text color, Font, Alignment and Text position.
- Video publication prepares and uploads a framed 1080×1350 rendition, including
  audio and enabled text. Only that rendition is public/playable/downloadable.
  Source video remains admin-only. No original-video download action or fallback.
  Browser-native playback downloads also receive the prepared version.
- Published-only direct post links; existing Explore tile preserved; Saved section
  links to saved cards. Existing local bookmark IDs migrate without changing keys.
- Good Scroll bookmarks use the existing reader-session and revision-based sync API.
  Device saves survive sign-out; initial sign-in merges local and cloud IDs; removals
  reconcile with the last common copy. Existing devotional saves are untouched.
- Explicit WHDC appearance choice respected. Pagination has a Load more/retry control.
- PWA feed navigation cannot replace the cached devotional application shell. Feed
  remains online-only; bookmarks remain local offline. Admin/account media is not
  cached by the service worker.

## Verification

- 47 automated checks pass: assembled browser JS, admin gate, blank drafts,
  validation, CRUD, published-only access, timestamp-tied pagination, uploads,
  prepared-video requirement, original-video privacy, video ranges, frame validation,
  account sync API/revision conflicts and bookmark merge behavior.
- All 52 JavaScript files pass `node --check`.
- Cloudflare Wrangler 4.159.0 Worker dry-run build passes. No deploy was performed.
- The local schema runner was run twice successfully; the second run skipped the
  existing schema/column. Existing rows are preserved.
- Browser QA used an isolated SQLite/R2 adapter and a generated test Access identity.
  Blank draft save, finished-card import, publishing, image download, saves, mobile
  feed layout, video upload, text/frame settings, video preparation/publication and
  export playback were exercised. The video download had a 1080×1350 video track
  and an audio track; replay showed the frame and enabled text.
- All 56 supplied cards are PNG, 1080×1350, under 5 MB. Full batch imported 54 new
  drafts and skipped the 2 already imported. Repeating it skipped all 56, preserving
  existing edits and published status. These were local test records only.
- Color row browser checks: swatches stay 44px wide and adjacent to HEX inputs at
  desktop and 390px mobile widths, with no horizontal overflow.
- Existing `check-admin-integrity.mjs` passes structural checks but fails its hardcoded
  dashboard fingerprint in BOTH the untouched ZIP and this update. The dashboard
  modules are byte-for-byte unchanged. This pre-existing check was not rewritten.

## Local testing — no Cloudflare account needed

Requires Node 22+ (tested with Node 26). From your existing repository root, copy
these update files into their matching paths, preserving other files, then run:

```sh
node scripts/test-good-scroll.mjs
node scripts/preview-good-scroll.mjs
```

Open `http://127.0.0.1:4173/admin/good-scroll` and
`http://127.0.0.1:4173/good-scroll`. The adapter listens only on 127.0.0.1 and uses
in-memory test storage. Restarting it discards test records. It never reads your
Cloudflare credentials. Never deploy/expose the preview adapter. Ctrl+C stops it.

Unzip your original WHDC_Instagram_Cards_56.zip. In the editor choose
**Import finished cards as drafts**, select all 56 PNGs, and wait for completion.
Open a draft, keep Finished 4:5 card selected, enter its visible words as accessible
Graphic text, check the category/reference, then publish locally. Repeat import
and confirm it reports all files skipped. GOOD-SCROLL-CARDS.json lists original
file hashes and the IDs used by the importer; originals were not altered.

For videos, upload MP4 or WebM, open Media sizing and crop, choose the frame/fit,
and optionally enable graphic text. Publish while keeping this tab visible. The
button prepares the public rendition before saving. Test Download video: it must
contain the frame/text, and public requests for the source upload must return 404.
A two-second synthetic video generator is available at `/__video-fixture` on the
local adapter only. Use it to test video/audio without uploading personal media.

## D1 and Cloudflare steps — only after approval

Existing binding names stay `DB`, `AUDIO_BUCKET`, and `ASSETS`. No new bucket,
account provider, environment variable, or native setting is required.

One new D1 column is needed: `good_scroll_posts.design TEXT NOT NULL DEFAULT '{}'`.
The base migration uses CREATE TABLE/INDEX IF NOT EXISTS. The new ALTER TABLE file
must run only once; the runner below inspects PRAGMA table_info before applying it.
For ordinary local Wrangler testing:

```sh
node scripts/migrate-good-scroll.mjs --local
npx wrangler dev
```

The schema runner defaults to local and can safely be rerun serially. Do not run
migration processes concurrently. It preserves existing rows and skips the new
column if already present. Do not run the ALTER SQL directly a second time.

When deployment and a production migration are approved, first take a normal D1
backup, then run `node scripts/migrate-good-scroll.mjs --remote` before deploying
this Worker. This command changes the configured production D1 database. No remote
migration or deployment has been run here. Existing Cloudflare Access protections
must remain in place. R2 must retain the existing same-origin media proxy routing.

## Remaining manual acceptance checks

Real email sign-in, two-device sync and sign-out must be checked on your actual
WHDC domain, since the existing reader account API is restricted to that domain.
Verify local saves merge on sign-in, unsaves propagate, sign-out retains device data,
and saved devotionals/quotes/resources remain intact. Manual backups include the
Good Scroll key. Each account's bookmark sync baseline is tracked separately.

Check OS share sheets on an actual iPhone/iPad and Android device. Video preparation
requires MediaRecorder, canvas capture and Web Audio in the admin browser, takes
about the video's duration, and should run with the tab visible. Uploads and prepared
outputs are capped at 50 MB. Unsupported recording/decoding fails before publication;
there is no unframed public fallback. Other viewers only play/download the prepared
file and do not need recording support. Confirm audio and captions for your own clips.
Real-time transcoding may alter codec/bitrate; it preserves the composition, not
source-file bytes. Cross-browser codec playback remains a device acceptance test.

Also check cancel/failed upload/export, dirty-form navigation, crop with landscape
and portrait photographs, long text/reference wrapping, reduced motion, light/dark
appearance, retry after network loss, and all existing Bible/audio/Resources/index
flows in a staging/local environment before approving deployment.

## Exact files

Changed existing files:

- `public/devotionals/app.js`
- `public/index.html`
- `public/sw.js`
- `src/admin/good-scroll-client.js`
- `src/admin/good-scroll-html.js`
- `src/good-scroll-feed.js`
- `src/worker.js`

Added files:

- `GOOD-SCROLL-AUDIT.md`
- `GOOD-SCROLL-REVIEW.md`
- `GOOD-SCROLL-CARDS.json`
- `GOOD-SCROLL-DESIGN-MIGRATION.sql`
- `src/good-scroll-design.js`
- `src/good-scroll-video.js`
- `public/shared/good-scroll-saved.js`
- `scripts/good-scroll-test-env.mjs`
- `scripts/test-good-scroll.mjs`
- `scripts/preview-good-scroll.mjs`
- `scripts/good-scroll-video-fixture.html`
- `scripts/migrate-good-scroll.mjs`

The update ZIP also includes the unchanged base GOOD-SCROLL-MIGRATION.sql as a dependency. The original 56-card ZIP is not duplicated in this code update.
