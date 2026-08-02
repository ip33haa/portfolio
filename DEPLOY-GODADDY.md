# Deploy to GoDaddy (shared hosting / cPanel)

This app is a **static site** after `npm run build`. Upload the contents of the `dist/` folder to your GoDaddy web root (usually `public_html`).

## 1. Build locally

```bash
npm install
npm run build
```

Output folder: **`dist/`** (includes `.htaccess` for Apache).

> First upload is large (~150–200 MB) because of Steam Deck 3D textures. Use **FTP** (FileZilla) or cPanel **File Manager** — not the small “Website Builder” uploader.

## 2. Upload to GoDaddy

### Option A — cPanel File Manager

1. Log in at [https://sso.godaddy.com](https://sso.godaddy.com) → **My Products** → your hosting → **Manage** → **cPanel**.
2. Open **File Manager** → `public_html`.
3. Delete old site files if replacing an existing site (keep `cgi-bin` if present).
4. Upload **everything inside** `dist/` (not the `dist` folder itself):
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `favicon.svg`
   - `models/`
   - `videos/`

### Option B — FTP (recommended for large uploads)

1. In cPanel → **FTP Accounts** (or use main FTP credentials from GoDaddy hosting settings).
2. Connect with FileZilla:
   - Host: `ftp.yourdomain.com` (or IP from GoDaddy)
   - User / password: your FTP login
   - Port: `21` (or SFTP `22` if enabled)
3. Remote folder: `public_html`
4. Upload all files from local `dist/` into `public_html`.

## 3. Domain

- **Primary domain on this hosting:** visit `https://yourdomain.com`
- **Subfolder:** set Vite `base` in `vite.config.ts` to `'/subfolder/'`, rebuild, upload to `public_html/subfolder/`

## 4. HTTPS

In GoDaddy hosting / cPanel, enable **SSL** (Let’s Encrypt) for your domain so the site loads over `https://`.

## 5. Verify after deploy

- Homepage loads the 3D Steam Deck
- Power on → About Me shows embedded JZL site
- If models don’t load, check browser DevTools → Network for 404 on `/models/SteamDeck/*`

## Troubleshooting

| Issue | Fix |
|--------|-----|
| Blank page | Ensure `index.html` is directly in `public_html`, not `public_html/dist/` |
| 404 on refresh | Confirm `.htaccess` uploaded (show hidden files in File Manager) |
| `.gltf` / video won’t load | `.htaccess` MIME rules; or ask GoDaddy to enable `mod_mime` |
| Upload timeout | Use FTP; upload `models/` in smaller batches |

## Easier alternative (custom domain only)

If GoDaddy is only your **domain registrar**, you can host on [Vercel](https://vercel.com) (GitHub repo `ip33haa/new-portfolio`) and point GoDaddy DNS **A/CNAME** to Vercel — faster deploys, no manual FTP.
