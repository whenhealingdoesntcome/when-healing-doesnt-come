# When Healing Doesn't Come — Version 4

This package preserves the supplied Version 3.5 reader and adds a database-backed private writing dashboard.

## What is included

- `wrangler.jsonc`: Worker script, `public/` asset directory, D1 binding `DB`.
- `src/worker.js`: public published-content API and Access-JWT-verified private editing API.
- `src/private.js`: private dashboard HTML and JS (intentionally **outside** public assets).
- `public/`: reader, styles, 3 starter devotionals, manifest, icon.
- `.gitignore`: excludes local development files and secrets.

## Before installing

1. Download a backup of your GitHub repository and save a copy of `content.json`.
2. Confirm Cloudflare Access protects `/admin*` for your exact email. The Worker **also verifies** the Access JWT and your email for every admin route and write request.
3. Find your **Cloudflare Access team domain**, such as `my-team.cloudflareaccess.com`, in Zero Trust settings.
4. Find the **Application Audience (AUD) tag** in Zero Trust → Access → Applications → WHDC Writing Dashboard → application details/overview. It is an identifier, **not** the application name.
5. In Workers & Pages → when-healing-doesnt-come → Settings → Variables and Secrets, add:
   - `ACCESS_TEAM_DOMAIN` = your exact `<team>.cloudflareaccess.com` domain (no `https://`)
   - `ACCESS_AUD` = the Access application Audience (AUD) tag
   - `ADMIN_EMAIL` = the exact email address allowed in your Access policy
   Use encrypted secrets if offered. **Do not put these in GitHub or in `wrangler.jsonc`.**

## Install through GitHub

The ZIP contains a project folder. Copy the *contents* of that folder to the **root** of your existing GitHub repository (not inside a nested folder). Replace root `app.js`, `index.html`, `styles.css`, `content.json`, `icon.svg`, `manifest.webmanifest` with the copies in `public/` and remove the old root copies after confirming the new `public/` directory is committed. Upload `src/worker.js`, `src/private.js`, `wrangler.jsonc`, `.gitignore`.

Do **not** commit API tokens, Access codes, `.env` or `.dev.vars` files. Keep Build command blank and Deploy command `npx wrangler deploy`. Cloudflare should detect the committed `wrangler.jsonc` and serve only `public/` as assets.

**Safer approach:** Make these changes on a GitHub branch first and review the file layout before merging to `main`. Do not remove the original files from the live branch until ready to deploy.

## First login and content import

1. Confirm the public homepage still opens without login.
2. Visit `https://when-healing-doesnt-come.whenhealingdoesntcome.workers.dev/admin` and sign in with your Cloudflare Access email.
3. If you get a `403` response, check `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_EMAIL`, and that your Access app covers `/admin*`. The API intentionally refuses access until verification succeeds.
4. Click **Import 3 starter devotionals**. Existing IDs are left untouched; the import does not overwrite entries.
5. Create a new devotional, click **Save Draft**, confirm it is not on the public site, then click **Publish** and confirm it appears on the public site.
6. Test Read Scripture, Go Deeper, Close Section links, Listen, favorites, and topic browsing on mobile.

The public site loads published entries from D1 when available; if D1 is empty or temporarily unreachable, it falls back to `public/content.json` to avoid blanking the website. This means previously imported starter entries remain visible in the fallback file even if you later unpublish them; remove or replace that fallback after migration if you need strict unpublishing behavior. Drafts are never returned by the public D1 API.

## Important limitations and security notes

- This is an initial working Version 4 package, **not yet tested on your live Cloudflare account**.
- The old local-browser writing drafts are **not automatically migrated**. If you have any, export them from the old site before installing. The three provided starter devotionals are available for import.
- Access JWTs are checked for RSA signature, issuer, AUD, expiry and approved email on every private request. No write endpoints are publicly accessible without valid authentication.
- The API and dashboard have no built-in rate limiting, editorial revision history or automatic backup. Keep periodic D1 exports/backups.
- You should configure Cloudflare Access on the `/admin*` path and avoid adding any public wildcard Allow policies.
- Your public repo and static `content.json` contain the three **published starter devotionals only**, not private drafts.
- Because a Worker configuration is now committed, any existing bindings and variables not declared in the file should be reviewed after deployment. D1 `DB` is explicitly declared.

## Troubleshooting

- Build fails saying `wrangler.jsonc` is invalid: confirm it is in repository root and the Deploy command is `npx wrangler deploy`.
- `403` on `/admin`: check three Access variables and sign in again.
- Public site shows only three starter devotionals: import them, then publish a new one. If D1 has no published entries, the fallback file is used.
- Missing CSS/icon: check files are inside `public/`, not only at repository root.
- Rollback: restore the previous GitHub commit and redeploy. Your D1 database remains intact.
