# PestShield — Static Pest Control Website

A fast, fully static, mobile-first website for a pest control business.
No frameworks, no build step, no backend — just HTML, CSS and vanilla JavaScript.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `pest-control.html` | General Pest Control |
| `termite-treatment.html` | Termite Treatment |
| `bed-bug-treatment.html` | Bed Bug Treatment |
| `rodent-control.html` | Rodent Control |
| `about.html` | About Us |
| `contact.html` | Contact (enquiry form opens WhatsApp — no backend needed) |
| `privacy-policy.html` / `terms-conditions.html` | Legal |

## ✏️ Editing business details — one file only

**Everything editable lives in [`js/config.js`](js/config.js):**

- Business name, tagline, city
- Phone number (call + display format) and WhatsApp number
- Email, working hours, address
- Rating, review count, customers served
- Service areas list (footer + area chips rebuild automatically)
- **All prices** — each service has price tiers by home size (1 BHK, 2 BHK, …).
  Add or remove tiers freely; the pricing tiles rebuild automatically, each with
  its own "Book Now" WhatsApp link mentioning the service and home size.

No HTML editing is required for any of the above. The brand name inside
page `<title>` tags is also replaced automatically from config.

### Colour theme

Set `colorTheme` in `js/config.js` to one of the presets: `emerald` (green),
`ocean` (blue), `royal` (purple), `sunset` (orange) or `slate` (dark grey).
The whole site — gradients, buttons, tiles, footer, favicon — recolours
automatically. To create your own palette, add a new entry under `themes`
with four colours and set `colorTheme` to its name.

### Service accent colours

Each service also has its own accent (`color` under each service in
config.js): green for general pest control, amber for termite, rose for bed
bugs, indigo for rodent. It colours that service's title strip, icons and
pricing tiles — while buttons, header and footer always stay on the main
brand theme, so the site never looks fragmented.

### Pictures

The hero and each service page have a picture slot, configured under `images`
in `js/config.js`. The site ships with full-colour illustrated scenes
(`images/*.svg` — technician, termite barrier, bed bug inspection, rodent
proofing, team). Two ways to switch to realistic photos:

- **AI-generated:** run `powershell tools\generate-photos.ps1` — it generates
  a matching realistic photo set via the free Pollinations.ai API into
  `images/photos/`, then point the `images` paths in config at those files.
  (If it reports HTTP 530 the free service is down; try again later.)
- **Stock photos:** search **"pest control technician"** on
  [pexels.com](https://www.pexels.com/search/pest%20control/) or
  [unsplash.com](https://unsplash.com/s/photos/pest-control) (free for
  commercial use, no attribution). Landscape ~1200×800px works best.

Set any path to `""` to hide that picture slot — the page falls back to the
clean gradient look automatically.

### Fonts

Poppins (headings) and Inter (body) are **self-hosted** in `fonts/` (~72 KB
total) — no Google Fonts request at page load. To change fonts, replace the
`.woff2` files and the `@font-face` + `--font`/`--font-head` rules at the top
of `css/style.css`.

## 🛠 Editing page content (not just config)

All pages except `index.html` are **generated** by `tools/build-pages.js`:

- To change shared parts (header, nav, footer, bottom nav): edit them in
  `index.html`, then run `node tools/build-pages.js` — every other page is
  rebuilt with the same header/footer.
- To change inner-page content (service descriptions, FAQs, About text):
  edit the page definitions inside `tools/build-pages.js` and re-run it.
  Don't edit the generated `.html` files directly — the next build
  overwrites them.
- `node tools/check-links.js` verifies no internal link is broken.

## 🚀 Deploying to Hostinger

1. Log in to Hostinger → **hPanel → File Manager** (or connect via FTP).
2. Open the `public_html` folder of your (free) website.
3. Upload **everything in this folder**: all `.html` files plus the `css/` and `js/` folders.
4. Done — the site is live at your domain. `index.html` is served automatically.

To update phone numbers or prices later, edit `js/config.js` and re-upload just that one file.

## 🔍 SEO — what's built in and what to do at launch

**Built in:**
- Location-optimised titles, meta descriptions and H1/H2s ("pest control in Delhi NCR" and per-service variants)
- Structured data (JSON-LD), generated from config so it never drifts from the visible content: `LocalBusiness` with services, prices, areas and rating; `Service` with price offers on each service page; `FAQPage` from the on-page FAQs; `BreadcrumbList`
- Open Graph + Twitter card tags and a social share image (`images/og-image.png`)
- `robots.txt` + `sitemap.xml`
- Font preloading, zero third-party requests, tiny pages → excellent Core Web Vitals (a direct ranking factor)
- A local-SEO content section and a Delhi-NCR FAQ on the home page (long-tail queries like "pest control cost in Delhi")

**At launch (10 minutes, do these in order):**
1. Set `siteUrl` in `js/config.js` to the live domain — this activates canonical URLs, og:url/og:image and full structured-data linking.
2. Search-replace `https://www.yourdomain.com` in `sitemap.xml` and `robots.txt` with the live domain.
3. Add the site to [Google Search Console](https://search.google.com/search-console), verify, and submit `sitemap.xml`. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters).
4. Create a **Google Business Profile** (business.google.com) with the exact same name, phone and area — for "pest control near me" searches this is the single biggest ranking lever, bigger than anything on the site itself.
5. Keep NAP (name, address, phone) identical everywhere: site, GBP, Justdial, Sulekha, IndiaMART listings. Consistency is a local-ranking signal.
6. Ask every happy customer for a Google review — the 4.9★ rating in config must reflect the real rating (fake numbers can trigger a structured-data penalty).
7. Replace the placeholder testimonials with real ones, and regenerate `images/og-image.png` if the brand name changes.

**Ongoing:** the fastest way to grow rankings is adding genuinely useful content — e.g. one page per locality ("Pest Control in Noida") or seasonal guides ("Monsoon termite checklist"). Copy any service page as a template.

## Notes

- **Responsive:** mobile-first layout with tablet (≥720px) and desktop (≥1024px) breakpoints; hamburger menu below 900px.
- **Performance:** zero external requests — no CDNs, fonts or images; all icons are inline SVG. Each page is a single ~15 KB HTML file + shared CSS/JS.
- **No transactions:** the site takes no payments. The contact form and all CTAs route to phone/WhatsApp.
- **Floating WhatsApp button** appears on every page, prefilled with the message set in config.
