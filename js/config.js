/* ============================================================
   SITE CONFIGURATION
   ------------------------------------------------------------
   Edit everything about the business here — no need to touch
   any HTML file. Phone numbers, WhatsApp, prices, areas, brand
   name, timings: change once, updates across the whole site.
   ============================================================ */

const SITE_CONFIG = {

  /* ---------- Brand ---------- */
  brandName: "PestShield",
  tagline: "Pest Control Simplified",
  city: "Delhi NCR",

  /* ---------- SEO ----------
     Set siteUrl to the live domain (no trailing slash) once known,
     e.g. "https://www.pestshield.in". This enables canonical URLs,
     social-share URLs and richer structured data. Also replace the
     placeholder domain inside sitemap.xml before going live. */
  siteUrl: "",
  hoursSchema: "Mo-Su 08:00-21:00",   // machine-readable version of `hours`

  /* ---------- Colour theme ----------
     Pick one of the presets below (or add your own).
     The four colours recolour the ENTIRE site automatically. */
  colorTheme: "emerald",
  themes: {
    emerald: { brand: "#0e9f6e", brandDark: "#057a55", brandDeep: "#03543f", accent: "#14b8a6" },
    ocean:   { brand: "#0284c7", brandDark: "#0369a1", brandDeep: "#075985", accent: "#06b6d4" },
    royal:   { brand: "#6d28d9", brandDark: "#5b21b6", brandDeep: "#4c1d95", accent: "#a855f7" },
    sunset:  { brand: "#ea580c", brandDark: "#c2410c", brandDeep: "#7c2d12", accent: "#f59e0b" },
    slate:   { brand: "#334155", brandDark: "#1e293b", brandDeep: "#0f172a", accent: "#0ea5e9" }
  },

  /* ---------- Pictures ----------
     Paths are relative to the site root (put files in images/).
     Leave a path empty ("") to hide that picture slot — the page
     falls back to the clean gradient look automatically. */
  images: {
    hero: "images/hero.svg",          // home page, right of the headline
    general: "images/general.svg",    // General Pest Control page banner
    termite: "images/termite.svg",    // Termite Treatment page banner
    bedbug: "images/bedbug.svg",      // Bed Bug Treatment page banner
    rodent: "images/rodent.svg",      // Rodent Control page banner
    about: "images/about.svg"         // About Us page banner
  },

  /* ---------- Contact (digits only for phone/whatsapp links) ---------- */
  phone: "+918595000000",            // used in tel: links
  phoneDisplay: "+91 85950 00000",   // shown to visitors
  whatsapp: "918595000000",          // used in wa.me links (country code, no +)
  whatsappMessage: "Hi! I'd like to book a pest control service.",
  email: "info@pestshield.in",
  hours: "Mon–Sun · 8:00 AM – 9:00 PM",
  address: "Delhi NCR, India",

  /* ---------- Trust signals ---------- */
  rating: "4.9",
  reviewCount: "1,200+",
  customersServed: "10,000+",
  yearsExperience: "10+",

  /* ---------- Currency ---------- */
  currency: "₹",

  /* ---------- Service areas (shown on home + footer) ---------- */
  areas: [
    "Delhi", "Gurgaon", "Noida",
    "Greater Noida", "Ghaziabad", "Faridabad"
  ],

  /* ---------- Services & pricing ----------
     Each tier renders one row in the pricing tables.
     Add / remove tiers freely — tables rebuild automatically. */
  /* Each service has its own accent colour ("color") used for its
     title strip, icons and pricing — chrome (buttons, header, footer)
     always stays on the main brand theme. */
  services: {
    general: {
      name: "General Pest Control",
      color: "#10b981",
      warranty: "3-Month Warranty",
      priceFrom: 1495,
      tiers: [
        { label: "1 BHK", price: 1495 },
        { label: "2 BHK", price: 1595 },
        { label: "3 BHK", price: 1795 },
        { label: "4 BHK / Villa", price: 1995 }
      ]
    },
    termite: {
      name: "Termite Treatment",
      color: "#d97706",
      warranty: "1-Year Warranty",
      priceFrom: 2495,
      tiers: [
        { label: "1 BHK", price: 2495 },
        { label: "2 BHK", price: 3495 },
        { label: "3 BHK", price: 4995 },
        { label: "4 BHK", price: 5995 },
        { label: "Villa / Bungalow", price: 7495 }
      ]
    },
    bedbug: {
      name: "Bed Bug Treatment",
      color: "#e11d48",
      warranty: "3-Month Warranty",
      priceFrom: 2495,
      tiers: [
        { label: "1 BHK", price: 2495 },
        { label: "2 BHK", price: 2995 },
        { label: "3 BHK", price: 3995 },
        { label: "4 BHK / Villa", price: 4995 }
      ]
    },
    rodent: {
      name: "Rodent Control",
      color: "#6366f1",
      warranty: "3-Month Warranty",
      priceFrom: 1295,
      tiers: [
        { label: "1 BHK", price: 1295 },
        { label: "2 BHK", price: 1595 },
        { label: "3 BHK", price: 1895 },
        { label: "4 BHK / Office", price: 2295 }
      ]
    }
  }
};
