IMAGE ORGANIZATION
All website image assets now live in public/images/.
App icons and favicon are in public/images/icons/.
Future photographs, illustrations, banners and QR graphics: public/images/.
Future app icons: public/images/icons/.

Home Screen label: When Healing
Full name: When Healing Doesn't Come

Deploy the whole project as a replacement, removing old image files from public/assets/
and public root. All source references and service-worker precache entries have been updated.
Note: legacy direct URLs to /icon-192.png, /icon-512.png, /favicon.png and
/apple-touch-icon.png are no longer present. Already installed devices may retain
old icons until reinstalled; browser cache and service-worker update timing can vary.
