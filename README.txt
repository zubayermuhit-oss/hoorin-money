HOORIN MONEY — PWA FILES

Upload these files/folders into the ROOT of the existing GitHub repository:
  manifest.webmanifest
  sw.js
  icons/icon-192.png
  icons/icon-512.png
  icons/icon-512-maskable.png

The current HTML already uses:
  <link rel="manifest" href="manifest.webmanifest">
and registers:
  navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'});

Keep those lines. Ensure they remain in index.html.

Important:
- This is configured for the GitHub Pages subpath /hoorin-money/ using relative URLs.
- Do not place these files inside a second nested folder; `manifest.webmanifest` and `sw.js` should sit beside `index.html`.
- After publishing, open the manifest URL and service worker URL directly in your browser.
- The service worker caches app shell files for offline fallback and does not cache Google OAuth/Drive API requests.
- When you make major changes to cached files, change CACHE_VERSION in sw.js (for example, hoorin-money-v2) and commit.
- LocalStorage is still browser/device storage. Uninstalling the app or clearing site/app data may delete local records. Export a JSON backup before testing.
- A service worker cannot guarantee Google Drive backup while the app is closed. Test offline mode and Drive backup separately.
