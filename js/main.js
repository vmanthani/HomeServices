/* ============================================================
   main.js — injects SITE_CONFIG into the page + UI behaviour.
   No frameworks, no dependencies.
   ============================================================ */

(function () {
  "use strict";
  const C = window.SITE_CONFIG || SITE_CONFIG;

  /* ---------- helpers ---------- */
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
  const money = (n) => C.currency + Number(n).toLocaleString("en-IN");

  /* ---------- colour theme from config ---------- */
  const theme = (C.themes || {})[C.colorTheme];
  if (theme) {
    const root = document.documentElement.style;
    root.setProperty("--brand", theme.brand);
    root.setProperty("--brand-dark", theme.brandDark);
    root.setProperty("--brand-deep", theme.brandDeep);
    root.setProperty("--accent", theme.accent);
    const fav = document.querySelector('link[rel="icon"]');
    if (fav)
      fav.href =
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='" +
        encodeURIComponent(theme.brand) +
        "' d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/></svg>";
  }

  /* ---------- brand name + city in <title> (defaults get replaced) ---------- */
  if (C.brandName) document.title = document.title.replace(/PestShield/g, C.brandName);
  if (C.city) document.title = document.title.replace(/Delhi NCR/g, C.city);

  /* ---------- text injection: <span data-config="brandName"></span> ---------- */
  $$("[data-config]").forEach((el) => {
    const v = get(el.dataset.config);
    if (v != null) el.textContent = v;
  });

  /* ---------- price injection: <span data-price="services.general.priceFrom"></span> ---------- */
  $$("[data-price]").forEach((el) => {
    const v = get(el.dataset.price);
    if (v != null) el.textContent = money(v);
  });

  /* ---------- link injection: data-config-href="tel|whatsapp|mailto" ---------- */
  $$("[data-config-href]").forEach((el) => {
    const kind = el.dataset.configHref;
    if (kind === "tel") el.href = "tel:" + C.phone;
    if (kind === "mailto") el.href = "mailto:" + C.email;
    if (kind === "whatsapp")
      el.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(C.whatsappMessage);
  });

  /* ---------- pricing tiles: <div data-pricing="general"></div> ---------- */
  $$("[data-pricing]").forEach((el) => {
    const svc = C.services[el.dataset.pricing];
    if (!svc) return;
    const tiles = svc.tiers
      .map((t) => {
        const msg = encodeURIComponent(`Hi! I'd like to book ${svc.name} for my ${t.label}.`);
        return (
          `<div class="price-tile">` +
          `<span class="price-tile-label">${t.label}</span>` +
          `<span class="price-tile-amount">${money(t.price)}</span>` +
          `<span class="price-tile-meta">${svc.warranty}</span>` +
          `<a class="btn btn-outline price-tile-btn" href="https://wa.me/${C.whatsapp}?text=${msg}" target="_blank" rel="noopener">Book Now</a>` +
          `</div>`
        );
      })
      .join("");
    el.innerHTML =
      `<div class="price-grid">${tiles}</div>` +
      `<p class="pricing-note">Final quote confirmed after inspection · No hidden charges.</p>`;
  });

  /* ---------- service areas: <div data-areas></div> ---------- */
  $$("[data-areas]").forEach((el) => {
    el.innerHTML = C.areas.map((a) => `<span>${a}</span>`).join("");
  });
  $$("[data-areas-list]").forEach((el) => {
    el.innerHTML = C.areas.map((a) => `<li>${a}</li>`).join("");
  });

  /* ---------- optional pictures: <div class="hero-media" data-image="hero"></div> ----------
     Shows the slot only if a path is configured AND the file loads,
     so a missing image can never leave a broken layout. */
  $$("[data-image]").forEach((el) => {
    const src = (C.images || {})[el.dataset.image];
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      img.alt = el.dataset.imageAlt || C.brandName + " team at work";
      el.appendChild(img);
      const hero = el.closest(".container");
      if (hero) hero.classList.add("has-media");
    };
    img.src = src;
  });

  /* ---------- per-service accent colours ----------
     Elements with data-service="general|termite|bedbug|rodent" get that
     service's accent as --svc; service pages set it page-wide. Chrome
     (buttons, header, footer) always stays on the brand theme. */
  const svcColor = (key) => (C.services[key] || {}).color;
  $$("[data-service]").forEach((el) => {
    const c = svcColor(el.dataset.service);
    if (c) el.style.setProperty("--svc", c);
  });
  const pageFile = location.pathname.split("/").pop() || "index.html";
  const pageSvc = {
    "pest-control.html": "general",
    "termite-treatment.html": "termite",
    "bed-bug-treatment.html": "bedbug",
    "rodent-control.html": "rodent",
  }[pageFile];
  if (pageSvc && svcColor(pageSvc))
    document.documentElement.style.setProperty("--svc", svcColor(pageSvc));

  /* ---------- current year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* ---------- highlight current page in nav ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".main-nav a, .bottom-nav a").forEach((a) => {
    if ((a.getAttribute("href") || "") === here) a.setAttribute("aria-current", "page");
  });

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- SEO: canonical, social URLs, structured data ----------
     Everything is generated from SITE_CONFIG so it can never drift
     from the visible content. */
  const addLd = (obj) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  };
  const siteUrl = (C.siteUrl || "").replace(/\/$/, "");
  const abs = (p) => (siteUrl ? siteUrl + "/" + p.replace(/^\//, "") : undefined);
  const addMeta = (prop, content) => {
    const m = document.createElement("meta");
    m.setAttribute("property", prop);
    m.content = content;
    document.head.appendChild(m);
  };
  if (siteUrl) {
    const canon = pageFile === "index.html" ? siteUrl + "/" : abs(pageFile);
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = canon;
    document.head.appendChild(link);
    addMeta("og:url", canon);
    addMeta("og:image", abs("images/og-image.png"));
  }

  /* LocalBusiness — the core local-SEO entity (every page) */
  const businessId = (siteUrl || "https://example.invalid") + "/#business";
  addLd({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": businessId,
    name: C.brandName,
    slogan: C.tagline,
    description:
      "Professional pest control services in " + C.city +
      " — general pest control, termite treatment, bed bug treatment and rodent control with service warranty.",
    url: siteUrl || undefined,
    image: abs("images/og-image.png"),
    telephone: C.phone,
    email: C.email,
    priceRange: "₹₹",
    address: { "@type": "PostalAddress", addressLocality: C.city, addressCountry: "IN" },
    areaServed: C.areas.map((a) => ({ "@type": "City", name: a })),
    openingHours: C.hoursSchema || undefined,
    aggregateRating: C.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: C.rating,
          reviewCount: parseInt((C.reviewCount || "0").replace(/\D/g, ""), 10) || undefined,
          bestRating: "5",
        }
      : undefined,
    makesOffer: Object.values(C.services).map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, areaServed: C.city },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: s.priceFrom,
        priceCurrency: "INR",
      },
    })),
  });

  /* Service schema with real price tiers (service pages) */
  if (pageSvc) {
    const s = C.services[pageSvc];
    addLd({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name + " in " + C.city,
      serviceType: s.name,
      provider: { "@id": businessId },
      areaServed: C.areas.map((a) => ({ "@type": "City", name: a })),
      offers: s.tiers.map((t) => ({
        "@type": "Offer",
        name: s.name + " — " + t.label,
        price: t.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      })),
    });
  }

  /* FAQPage schema, built from the FAQs actually rendered on the page */
  const faqEntities = $$(".faq-list details").map((d) => ({
    "@type": "Question",
    name: d.querySelector("summary").textContent.trim(),
    acceptedAnswer: { "@type": "Answer", text: d.querySelector("p").textContent.trim() },
  }));
  if (faqEntities.length)
    addLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqEntities });

  /* BreadcrumbList (inner pages) */
  const crumbEl = document.querySelector(".breadcrumb");
  if (crumbEl && siteUrl) {
    const current = crumbEl.textContent.split("/").pop().trim();
    addLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
        { "@type": "ListItem", position: 2, name: current, item: abs(pageFile) },
      ],
    });
  }

  /* ---------- contact form → opens WhatsApp with a prefilled message ---------- */
  const form = document.querySelector("#enquiry-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const msg =
        "New enquiry from website:%0A" +
        "Name: " + encodeURIComponent(d.get("name") || "-") + "%0A" +
        "Phone: " + encodeURIComponent(d.get("phone") || "-") + "%0A" +
        "Service: " + encodeURIComponent(d.get("service") || "-") + "%0A" +
        "Message: " + encodeURIComponent(d.get("message") || "-");
      window.open("https://wa.me/" + C.whatsapp + "?text=" + msg, "_blank");
    });
  }
})();
