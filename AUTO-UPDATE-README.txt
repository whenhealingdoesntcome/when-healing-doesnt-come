Automatic refresh:
- Checks for changed app files and content every 90 seconds while open, and when the app regains focus or connectivity.
- Checks service worker updates and reloads on activation.
- Defers automatic reload while someone is actively typing and offers a Refresh now button.
- Works on the main app and Bible Reader. Offline errors are silently retried.
- Uses HTTP validators (ETag / Last-Modified), with content-hash fallback where validators are absent.
- This is a complete project ZIP. Replace old project files while preserving .git.
- Browser-based testing on real devices is still recommended.
