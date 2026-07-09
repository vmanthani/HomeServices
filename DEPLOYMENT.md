# Deployment Guide — Step by Step

This site is 100% static (HTML + CSS + JS, no database, no backend), so it
can be hosted anywhere, including every free static host. Total upload size
is under 1 MB.

---

## 0. Before you deploy (5 minutes, do once)

1. Open `js/config.js` and set the real values:
   - `brandName`, `tagline`, `city`
   - `phone`, `phoneDisplay`, `whatsapp` (country code + number, no `+`)
   - `email`, `address`, `hours`
   - prices under `services` if they changed
   - `siteUrl` — the final address, e.g. `"https://www.pestshield.in"` or
     `"https://pestshield.netlify.app"` (no trailing slash)
2. In `sitemap.xml` and `robots.txt`, replace every
   `https://www.yourdomain.com` with the same final address.
3. Quick local check: run `node tools/dev-server.js`, open
   http://localhost:5500 and click through every page.

**What to upload:** all `.html` files + the `css/`, `js/`, `fonts/`,
`images/` folders + `robots.txt` + `sitemap.xml`.
**Not needed on the server:** `tools/`, `README.md`, `DEPLOYMENT.md`, `.git`.

---

## Option A — Hostinger (hPanel)

> Hostinger's old free plan (000webhost) was discontinued; current Hostinger
> plans are paid but cheap. If you have any Hostinger plan, follow this. If
> you want genuinely free hosting, use Option B/C/D below.

1. Log in at https://hpanel.hostinger.com.
2. If asked, complete the "Set up website" wizard: choose **Skip, I'll
   create a website manually** (or "Empty site"). Attach your domain, or use
   the free temporary subdomain Hostinger offers.
3. In hPanel go to **Websites → Manage → Files → File Manager**.
4. Open the **`public_html`** folder. Delete any placeholder file inside
   (e.g. `default.php`).
5. Click the **Upload** icon (top right):
   - Easiest: on your PC, select all site files/folders listed in step 0,
     right-click → *Compress to ZIP*. Upload the ZIP, then right-click it in
     File Manager → **Extract** into `public_html`, and delete the ZIP.
   - Make sure `index.html` ends up directly inside `public_html`, **not**
     inside a subfolder like `public_html/HomeServices/`.
6. Enable HTTPS: hPanel → **Security → SSL** → install the free SSL for
   your domain (usually automatic). Then turn on **Force HTTPS**.
7. Visit your domain. The site should load; test on your phone too.

**FTP alternative (for updates):** hPanel → **Files → FTP Accounts** gives
you host/username/password. Connect with FileZilla (free) and drag files
into `public_html`. Later price/phone changes = re-upload only `js/config.js`.

---

## Option B — Netlify (free, easiest of all)

1. Go to https://app.netlify.com/drop (create the free account when asked).
2. Drag the whole site folder (the one containing `index.html`) onto the
   page. Done — the site is live in ~10 seconds on a URL like
   `https://random-name.netlify.app`.
3. Rename it: **Site settings → Change site name** → e.g.
   `pestshield` → `https://pestshield.netlify.app`.
4. Custom domain (optional): **Domain management → Add custom domain**, then
   set the DNS records it shows you at your domain registrar. Free SSL is
   automatic.
5. To update the site later, open your site in Netlify → **Deploys** → drag
   the folder again.

## Option C — Cloudflare Pages (free, fastest CDN)

1. Sign up at https://dash.cloudflare.com → **Workers & Pages → Create →
   Pages → Upload assets** (direct upload, no git needed).
2. Name the project, drag the site folder, click **Deploy**.
3. Live at `https://<name>.pages.dev`. Custom domains: **Custom domains**
   tab → add domain → follow the DNS instructions. SSL automatic.

## Option D — GitHub Pages (free, git-based)

Since this project is already a git repository:

```
# create an empty PUBLIC repo on github.com first (e.g. pestshield-site)
git remote add origin https://github.com/<your-user>/pestshield-site.git
git push -u origin main
```

1. On GitHub: repo → **Settings → Pages** → Source: *Deploy from a branch*
   → Branch: `main`, folder `/ (root)` → Save.
2. Live in ~1 minute at `https://<your-user>.github.io/pestshield-site/`.
   Note: because the site lives under a subpath, prefer Netlify/Cloudflare
   if you're not attaching a custom domain.

---

## After going live (any host)

1. Open every page once on the live URL — check phone/WhatsApp buttons
   actually dial/chat with the right number.
2. Test WhatsApp share: send yourself the URL in WhatsApp — the preview
   should show the branded share image.
3. Google Search Console (https://search.google.com/search-console):
   add the property, verify (DNS or HTML-file method), then **Sitemaps →
   submit `sitemap.xml`**.
4. Bing Webmaster Tools: same, it can import from Search Console.
5. Create the **Google Business Profile** — see the SEO checklist in
   README.md; for "pest control near me" searches this matters more than
   the website itself.
6. Structured-data check: paste the live URL into
   https://search.google.com/test/rich-results — LocalBusiness, Service
   and FAQPage should be detected.

## Updating the site later

| Change | What to re-upload |
|---|---|
| Phone, prices, areas, colours, images, rating | `js/config.js` only (plus any new image files) |
| Text on inner pages | edit `tools/build-pages.js`, run `node tools/build-pages.js`, upload the changed `.html` files |
| Header/footer/nav | edit `index.html`, run `node tools/build-pages.js`, upload all `.html` files |
