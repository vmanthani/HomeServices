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

  /* ---------- lowest starting price: <span data-price-min></span> ---------- */
  $$("[data-price-min]").forEach((el) => {
    const prices = Object.values(C.services).map((s) => s.priceFrom).filter((n) => n != null);
    if (prices.length) el.textContent = money(Math.min(...prices));
  });

  /* ---------- link injection: data-config-href="tel|whatsapp|mailto" ---------- */
  $$("[data-config-href]").forEach((el) => {
    const kind = el.dataset.configHref;
    if (kind === "tel") el.href = "tel:" + C.phone;
    if (kind === "mailto") el.href = "mailto:" + C.email;
    if (kind === "whatsapp")
      el.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(C.whatsappMessage);
    if (kind === "map" && C.mapLink) {
      el.href = C.mapLink;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  /* ---------- pricing tiles: <div data-pricing="general"></div> ---------- */
  $$("[data-pricing]").forEach((el) => {
    const svc = C.services[el.dataset.pricing];
    if (!svc) return;
    const tiles = svc.tiers
      .map((t) => {
        const msg = encodeURIComponent(`Hi! I'd like to book ${svc.name} for my ${t.label}.`);
        const off =
          t.oldPrice && t.oldPrice > t.price
            ? Math.round((1 - t.price / t.oldPrice) * 100)
            : 0;
        return (
          `<div class="price-tile">` +
          (off ? `<span class="price-tile-off">${off}% OFF</span>` : "") +
          `<span class="price-tile-label">${t.label}</span>` +
          (off ? `<span class="price-tile-old">${money(t.oldPrice)}</span>` : "") +
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

  /* ---------- Google Maps embed: <div data-map-embed></div> ---------- */
  $$("[data-map-embed]").forEach((el) => {
    if (!C.mapEmbedUrl) return;
    const f = document.createElement("iframe");
    f.src = C.mapEmbedUrl;
    f.title = C.brandName + " office location on Google Maps";
    f.loading = "lazy";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.setAttribute("allowfullscreen", "");
    el.appendChild(f);
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
  /* page slug — folder URLs (/pest-control/) or legacy /pest-control.html both work */
  const slug = (location.pathname.split("/").filter(Boolean).pop() || "index").replace(/\.html$/, "");
  const isHome = slug === "index";
  const canonPath = isHome ? "/" : "/" + slug + "/";
  const pageSvc = {
    "pest-control": "general",
    "termite-treatment": "termite",
    "bed-bug-treatment": "bedbug",
    "rodent-control": "rodent",
  }[slug];
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
  $$(".main-nav a, .bottom-nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("#")[0];
    const linkSlug = (href.split("/").filter(Boolean).pop() || "index").replace(/\.html$/, "");
    if (linkSlug === slug) a.setAttribute("aria-current", "page");
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
    const canon = siteUrl + canonPath;
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
    address: C.postalAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: C.postalAddress.street,
          addressLocality: C.postalAddress.locality,
          addressRegion: C.postalAddress.region,
          postalCode: C.postalAddress.postalCode,
          addressCountry: C.postalAddress.country || "IN",
        }
      : { "@type": "PostalAddress", addressLocality: C.city, addressCountry: "IN" },
    geo: C.geo
      ? { "@type": "GeoCoordinates", latitude: C.geo.lat, longitude: C.geo.lng }
      : undefined,
    hasMap: C.mapLink || undefined,
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
        { "@type": "ListItem", position: 2, name: current, item: siteUrl + canonPath },
      ],
    });
  }

  /* ---------- website credit link (footer) ---------- */
  $$("[data-designer]").forEach((el) => {
    if (C.designerUrl) {
      el.href = C.designerUrl;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.removeAttribute("href");   // plain text credit, not a link
    }
  });

  /* ---------- PWA + consent (share safe localStorage helpers) ---------- */
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  /* Register the service worker (only over http/https — not file://). */
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  const consent = document.getElementById("cookie-consent");
  const installEl = document.getElementById("install-prompt");
  let deferredPrompt = null;

  const maybeShowInstall = () => {
    if (!installEl || !deferredPrompt) return;
    if (consent && !consent.hidden) return;            // don't stack over the cookie notice
    const s = lsGet("pn_install");
    if (s === "dismissed" || s === "installed") return;
    installEl.hidden = false;
  };

  /* Cookie / data-use consent banner */
  if (consent) {
    if (!lsGet("pn_consent")) consent.hidden = false;
    consent.addEventListener("click", (e) => {
      const choice = e.target.closest("[data-cookie]");
      if (!choice) return;
      lsSet("pn_consent", choice.dataset.cookie);
      consent.hidden = true;
      maybeShowInstall();                              // offer install once the notice is cleared
    });
  }

  /* Install prompt (Chrome/Edge/Android fire beforeinstallprompt) */
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    maybeShowInstall();
  });
  if (installEl) {
    installEl.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-install]");
      if (!btn) return;
      if (btn.dataset.install === "go" && deferredPrompt) {
        installEl.hidden = true;
        deferredPrompt.prompt();
        try { await deferredPrompt.userChoice; } catch (err) {}
        lsSet("pn_install", "prompted");
        deferredPrompt = null;
      } else {
        installEl.hidden = true;
        lsSet("pn_install", "dismissed");
      }
    });
  }
  window.addEventListener("appinstalled", () => {
    if (installEl) installEl.hidden = true;
    lsSet("pn_install", "installed");
  });

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
