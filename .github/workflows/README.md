# Hoorin Money — Capacitor Android Source

This source project packages the current Liquid Glass Hoorin Money HTML into a Capacitor Android app and includes a GitHub Actions workflow that builds a **debug APK** without a local computer.

## Included
- `www/index.html`: current Hoorin Money Liquid Glass UI and local finance tracker
- `capacitor.config.ts`: Android app ID/name
- `.github/workflows/android-apk.yml`: GitHub Actions build workflow
- `cloudflare-worker/`: a deliberately non-production starter for the future secure backup API

## Important status (please read)
This is a **buildable starting source project**, not a completed production-ready cloud-sync system.
- The HTML currently stores finance data in browser localStorage inside the app WebView.
- Its current Google Drive flow uses a short-lived browser access token, so it is not persistent background sync.
- `cloudflare-worker/src.js` is intentionally a placeholder returning HTTP 501. It is not safe or capable of storing backups yet.
- Background Google Drive backup requires a proper OAuth authorization-code flow, secure per-user refresh-token storage, user authentication, a native Android scheduled worker (WorkManager), and retry/last-backup status. These pieces must be implemented and tested before trusting it with financial records.
- Never place a Google Client Secret, refresh token, or encryption key in HTML, GitHub source, or the APK.
- Do not clear app storage or uninstall the old app until you export and verify a backup. A new APK has its own app storage and will not automatically inherit browser data.

## Build APK from your phone using GitHub Actions
1. Download and unzip this project on your phone.
2. Open your GitHub repo `zubayermuhit-oss/hoorin-money`.
3. Upload the contents of this folder into the repository root. Keep the `.github/workflows/android-apk.yml` path exactly as shown. On GitHub mobile, uploading folders can be awkward; if the upload UI cannot preserve folders, use GitHub's web editor to create the workflow file or use GitHub's mobile app/browser desktop mode.
4. Commit all files to branch `main`.
5. Open the repo's **Actions** tab.
6. Select **Build Hoorin Money Android APK** and tap **Run workflow** (or wait for a push-triggered build).
7. Open the completed green workflow run, scroll to **Artifacts**, and download `Hoorin-Money-debug-APK`.
8. Extract the artifact ZIP and install `app-debug.apk`. Android may ask to allow installs from that browser/file manager.

If the repository already contains a different `package-lock.json`, run `npm install` on a development environment to regenerate it. The workflow uses `npm install` to avoid requiring a lockfile.

## What this workflow does and does not do
It creates a debug APK from the Capacitor web app. It does not publish to Play Store, sign a release APK, configure Google OAuth, or enable automatic backup by itself.

## Free-tier architecture plan
- Android APK: Capacitor, built with GitHub Actions.
- Backend: Cloudflare Workers free plan, subject to current limits and terms.
- Scheduled backup: Android WorkManager, best-effort timing due to Android battery controls.
- Storage: user's Google Drive, using least-privilege Drive scope.
- OAuth: server-side authorization-code exchange; keep secrets in Cloudflare Worker secrets, not in the app.
- Token storage: encrypted refresh tokens, per-user identity and authorization checks.
- Backup: upload a versioned JSON snapshot; restore requires explicit confirmation.
- Safety: manual export and local backup before enabling restore.

## Before production
Implement and security-review OAuth callback/state/PKCE, session authentication, encrypted token storage, Google refresh-token rotation/error handling, Drive file listing/upload/download, Android WorkManager plugin/service, backup retention, and restore validation. Test on a disposable account/data set first.
