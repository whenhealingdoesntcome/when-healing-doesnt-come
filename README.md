# When Healing Doesn't Come — free web app prototype

A responsive, no-framework devotional web app with a browser-based writing dashboard.

## Try it locally

Do **not** double-click `index.html` directly: browsers restrict local JSON requests. From this folder, run:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 in a browser. On a Mac, Python 3 may need to be installed. Alternatively use VS Code's Live Server extension.

## Publishing free with GitHub + Cloudflare Pages

1. Create a free GitHub account and a new repository, for example `when-healing-doesnt-come`.
2. Upload **the contents** of this folder to the repository root (`index.html`, `app.js`, `styles.css`, `content.json`, `manifest.webmanifest`, and `icon.svg`). Do not upload only the ZIP.
3. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and authorize your repository.
4. Choose the repository. Use **no framework**, leave the build command blank, and set output directory to `/` (repository root) if prompted.
5. Deploy. Cloudflare gives you a free `*.pages.dev` URL. Open it on your phone and test.
6. To add to an iPhone home screen, open the deployed URL in Safari, tap Share, then **Add to Home Screen**. On Android, use the browser's Install/Add to Home Screen option where available.

Cloudflare's UI and free limits can change. A custom domain is optional and generally costs money.

## Writing and publishing

- Open the **Write** tab. Create or edit a devotional and click **Save draft**.
- These edits are saved only in **this browser's localStorage**. They are **not** automatically published to other readers and are **not** synced between devices.
- Click **Export JSON** to download your complete devotional library as `content.json`. Keep backups.
- In your GitHub repository, replace `content.json` with the downloaded file and commit. Cloudflare Pages will automatically redeploy the public site.
- **Important:** The same browser may still show your local drafts after redeploying. To see the public published version, test in a private browser window or on another device. A future version can use a secure cloud CMS for direct publishing.
- The Write tab is **not password protected**. It is a local editor, not a secure admin login. Public visitors can open it and create their own local drafts, but cannot change the live site without access to your GitHub account. Do not put private material into this prototype.

## Bible copyright

The app links to chapters of the World English Bible (WEB) on eBible.org. The WEB is public domain; see https://ebible.org/web/ for edition and reuse details. This starter does **not** copy any copyrighted modern Bible translation. For a future embedded reader, download and package verified WEB text with appropriate edition attribution. Verify every `bibleUrl` before publishing.

## Accessibility and scope

- Keyboard-friendly controls, semantic headings, reduced-motion support, text size toggle, dark mode, no streaks.
- Favorites and settings live only on the reader's device and can be lost if browser storage is cleared.
- The PWA manifest enables home-screen installation on supported browsers. This prototype does not include offline caching, push notifications, reader accounts, cloud sync, audio, or app-store distribution.
- Sample devotional text is original starter copy for demonstration; review and revise before public ministry launch.

## Next development phase

Replace the local-only writing dashboard with a secure authenticated CMS (for example Decap CMS with supported authentication, or Supabase Auth + database). Never embed private admin API keys in browser JavaScript. Add a service worker and PNG app icons for robust cross-platform PWA installation and offline reading.
