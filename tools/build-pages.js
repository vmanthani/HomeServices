/* Generates all pages except index.html, reusing the header/footer
   from index.html so navigation stays identical site-wide.
   Run:  node tools/build-pages.js
   Edit page content in this file, edit shared header/footer/bottom-nav
   in index.html, then re-run. */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const header = index.slice(
  index.indexOf('<header class="site-header">'),
  index.indexOf("</header>") + "</header>".length
);
const tail = index.slice(index.indexOf("  <!-- ================= FOOTER ================= -->"));

const head = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#0e9f6e">
  <meta name="geo.region" content="IN-DL">
  <meta name="geo.placename" content="Delhi NCR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="PestShield">
  <meta property="og:locale" content="en_IN">
  <meta property="og:title" content="${title.split(" | ")[0]}">
  <meta property="og:description" content="${desc}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%230e9f6e' d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/></svg>">
  <link rel="preload" href="fonts/poppins-800.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

`;

const waSvg = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.9 9.88m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L.07 24l6.31-1.65a11.88 11.88 0 0 0 5.67 1.44h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.48-8.4"/></svg>`;
const check = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
const shieldSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;

const heroActions = `      <div class="hero-actions">
        <a class="btn btn-wa" data-config-href="whatsapp">${waSvg} Book on WhatsApp</a>
        <a class="btn btn-ghost-light" data-config-href="tel">Call <span data-config="phoneDisplay"></span></a>
      </div>`;

const li = (t) => `        <li>${check}<span>${t}</span></li>`;

const ctaBand = (h, p) => `  <section>
    <div class="container">
      <div class="cta-band reveal">
        <h2>${h}</h2>
        <p>${p}</p>
        <div class="hero-actions">
          <a class="btn btn-wa" data-config-href="whatsapp">${waSvg} WhatsApp Us</a>
          <a class="btn btn-ghost-light" data-config-href="tel">Call <span data-config="phoneDisplay"></span></a>
        </div>
      </div>
    </div>
  </section>

`;

const pageHero = (crumb, h1, lead, badge, imgKey) => `  <section class="page-hero">
    <div class="container">
      <div class="page-hero-content">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / ${crumb}</nav>
      <h1>${h1}</h1>
      <span class="title-strip"></span>
      <p class="lead">${lead}</p>
${heroActions}
      ${badge ? `<p style="margin-top:1.2rem;margin-bottom:0"><span class="badge-warranty">${shieldSvg} ${badge}</span></p>` : ""}
      </div>
      ${imgKey ? `<div class="page-hero-media" data-image="${imgKey}" data-image-alt="${h1} — professional service"></div>` : ""}
    </div>
    <div class="wave"><svg viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40c220 34 440 34 720 6s500-30 720-2v20H0z" fill="#fff"/></svg></div>
  </section>

`;

const faqSection = (items) => `  <section class="alt-bg">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">FAQs</span>
        <h2>Frequently Asked Questions</h2>
      </div>
      <div class="faq-list">
${items.map(([q, a]) => `        <details class="reveal">
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join("\n")}
      </div>
    </div>
  </section>

`;

const splitSection = (eyebrow, h2, signsTitle, signs, inclTitle, incl) => `  <section>
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">${eyebrow}</span>
        <h2>${h2}</h2>
      </div>
      <div class="split">
        <div class="card reveal">
          <h3>${signsTitle}</h3>
          <ul class="checklist" style="margin-top:1rem">
${signs.map(li).join("\n")}
          </ul>
        </div>
        <div class="card reveal">
          <h3>${inclTitle}</h3>
          <ul class="checklist" style="margin-top:1rem">
${incl.map(li).join("\n")}
          </ul>
        </div>
      </div>
    </div>
  </section>

`;

const processSection = (steps) => `  <section class="alt-bg">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Our Process</span>
        <h2>How the Treatment Works</h2>
      </div>
      <div class="grid grid-4 steps">
${steps.map((s, i) => `        <div class="step reveal">
          <div class="step-num">${i + 1}</div>
          <h3>${s[0]}</h3>
          <p>${s[1]}</p>
        </div>`).join("\n")}
      </div>
    </div>
  </section>

`;

const pricingSection = (key, note) => `  <section id="pricing">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Transparent Pricing</span>
        <h2>Fixed Prices by Home Size</h2>
        <p>${note}</p>
      </div>
      <div class="reveal" data-pricing="${key}"></div>
    </div>
  </section>

`;

/* ============================================================ PAGES */
const pages = {};

/* ---------- General Pest Control ---------- */
pages["pest-control.html"] = {
  title: "Cockroach & General Pest Control in Delhi NCR | PestShield",
  desc: "General pest control in Delhi NCR for cockroaches, ants & spiders. Safe, odour-free treatment with 3-month warranty. Fixed prices by home size — book on WhatsApp.",
  body:
    pageHero(
      "General Pest Control",
      "General Pest Control",
      "Complete protection against cockroaches, ants, spiders and other common household pests. Low-odour gel and spray treatment that is safe for children and pets — backed by a 3-month warranty.",
      "3-Month Service Warranty",
      "general"
    ) +
    splitSection(
      "Know the Problem",
      "Signs You Need Pest Control",
      "Watch out for these signs",
      [
        "Cockroaches in the kitchen or bathroom, especially at night",
        "Ant trails along walls, counters or near food",
        "Frequent spider webs in corners and behind furniture",
        "Droppings, egg casings or shed skins in cabinets",
        "A musty, oily odour in closed spaces"
      ],
      "What's included in the service",
      [
        "Detailed inspection of kitchen, bathrooms and hotspots",
        "Herbal-based gel applied inside cabinets and appliances",
        "Targeted spray along skirtings, drains and wet areas",
        "Government-approved, low-odour, child &amp; pet-safe chemicals",
        "Aftercare guidance + 3-month warranty with free re-service"
      ]
    ) +
    processSection([
      ["Inspection", "The technician maps pest activity across your home, from kitchen cabinets to drains."],
      ["Gel Application", "Odourless gel bait is placed in cabinets, appliances and corners — no need to empty the kitchen."],
      ["Targeted Spray", "Skirtings, wet areas and entry points get a residual spray that keeps working for weeks."],
      ["Warranty Card", "You receive aftercare instructions and a 3-month warranty — free re-service if pests return."]
    ]) +
    pricingSection("general", "One flat price for your home size. No inspection fees, no hidden charges.") +
    faqSection([
      ["How long does the treatment take?", "A standard home takes 60–120 minutes depending on size. You can stay at home during the service."],
      ["Do we need to leave the house?", "No. The chemicals are low-odour and safe once dry. We only recommend keeping children and pets away from treated surfaces for 2–3 hours."],
      ["How soon will I see results?", "Cockroach and ant activity drops sharply within 24–48 hours and clears fully within about a week as the gel works through the colony."],
      ["How often should I get pest control done?", "For lasting protection we recommend a treatment every 3 months — which is why the service carries a 3-month warranty."],
      ["Is same-day service available?", "Yes, in most areas we can schedule a same-day or next-day visit. Call or WhatsApp us to check slots."],
      ["Are the chemicals safe?", "We use only government-approved, low-toxicity formulations applied by trained technicians. They are safe for homes with children, pets and elderly members."]
    ]) +
    ctaBand("Book Your General Pest Control Today", "Get an instant quote for your home size on WhatsApp — same-day slots available."),
};

/* ---------- Termite Treatment ---------- */
pages["termite-treatment.html"] = {
  title: "Termite Treatment in Delhi NCR — 1-Year Warranty | PestShield",
  desc: "Drill-fill-seal termite control in Delhi NCR for homes & offices. Protects walls, furniture & woodwork. Government-approved chemicals, 1-year warranty.",
  body:
    pageHero(
      "Termite Treatment",
      "Termite Treatment",
      "Termites silently destroy furniture, doors and woodwork from the inside. Our drill-fill-seal treatment creates a chemical barrier in your walls that stops them at the source — with a full 1-year warranty.",
      "1-Year Service Warranty",
      "termite"
    ) +
    splitSection(
      "Know the Problem",
      "Signs of a Termite Infestation",
      "Watch out for these signs",
      [
        "Mud tubes running along walls, skirtings or ceilings",
        "Wood that sounds hollow when tapped",
        "Powder-like dust near furniture, door frames or windows",
        "Discarded insect wings near windows and lights",
        "Doors and drawers that suddenly jam or sag"
      ],
      "What's included in the service",
      [
        "Full inspection and mapping of termite activity",
        "Drilling at 45° angles along walls at ~1 ft intervals",
        "Injection of termiticide to form a protective barrier",
        "Sealing of all drill holes with white cement",
        "Protective spray on woodwork + 1-year warranty"
      ]
    ) +
    processSection([
      ["Inspect &amp; Map", "We trace mud tubes and probe woodwork to map the full extent of the colony's activity."],
      ["Drill", "Small, discreet holes are drilled along the wall-floor junction at regular intervals."],
      ["Fill", "Termiticide is injected into each hole, forming a continuous chemical barrier termites cannot cross."],
      ["Seal &amp; Protect", "Holes are sealed neatly with white cement and exposed woodwork gets a protective spray."]
    ]) +
    pricingSection("termite", "Pricing covers the complete drill-fill-seal treatment for your home size, including the 1-year warranty.") +
    faqSection([
      ["How does the drill-fill-seal method work?", "Small holes are drilled at the wall-floor junction, termiticide is injected to create an unbroken chemical barrier in the masonry, and the holes are sealed. Termites crossing the barrier carry the chemical back to the colony, eliminating it."],
      ["How long does the protection last?", "The treatment typically protects for 3–5 years. We back it with a written 1-year warranty that includes free re-treatment if activity returns."],
      ["Is the drilling noisy or messy?", "Drilling causes brief, moderate noise and minimal dust. Our technicians seal every hole with white cement and clean the work area before leaving."],
      ["Should I treat just one room or the whole house?", "Termites travel through walls, so treating only the visible area often shifts the problem. We recommend whole-home treatment; our technician will advise honestly after inspection."],
      ["Do you offer pre-construction termite treatment?", "Yes — for new construction or renovation we treat the soil and foundation before flooring is laid. Contact us for a site-specific quote."],
      ["Will termites come back after treatment?", "The chemical barrier prevents re-entry for years. If any activity reappears within the warranty period, we re-treat the affected areas free of cost."]
    ]) +
    ctaBand("Stop Termites Before They Spread", "Every week of delay means more damage to your furniture and woodwork. Get a free consultation now."),
};

/* ---------- Bed Bug Treatment ---------- */
pages["bed-bug-treatment.html"] = {
  title: "Bed Bug Treatment in Delhi NCR — 2-Visit Removal | PestShield",
  desc: "End bed bug bites with our two-visit intensive treatment across Delhi NCR. Covers beds, mattresses, curtains & furniture. 3-month warranty, same-day slots.",
  body:
    pageHero(
      "Bed Bug Treatment",
      "Bed Bug Treatment",
      "Sleepless nights and itchy bites end here. Our two-visit intensive treatment targets bed bugs and their eggs across beds, mattresses, curtains and furniture — with a 3-month warranty.",
      "2 Visits Included · 3-Month Warranty",
      "bedbug"
    ) +
    splitSection(
      "Know the Problem",
      "Signs of a Bed Bug Infestation",
      "Watch out for these signs",
      [
        "Itchy bites in lines or clusters, usually on arms and legs",
        "Small blood stains on sheets and pillow covers",
        "Dark spots along mattress seams and bed joints",
        "Shed skins or tiny white eggs in crevices",
        "A sweet, musty odour in the bedroom"
      ],
      "What's included in the service",
      [
        "Inspection of beds, mattresses, sofas, curtains and furniture",
        "Deep treatment of seams, joints, crevices and headboards",
        "Second visit after ~15 days to eliminate newly hatched eggs",
        "Safe, bedroom-appropriate chemicals and application",
        "Laundry &amp; aftercare guidance + 3-month warranty"
      ]
    ) +
    processSection([
      ["Inspection", "We locate all harbourage points — mattress seams, bed joints, sofa folds, curtain hems and wall cracks."],
      ["First Treatment", "Every hiding spot is treated with a residual formulation that kills adults and nymphs."],
      ["Second Visit", "Around day 15, we re-treat to eliminate bugs hatched from eggs the first round couldn't reach."],
      ["Aftercare", "You get simple washing and prevention guidance, plus a 3-month warranty for peace of mind."]
    ]) +
    pricingSection("bedbug", "Price includes both visits — the initial treatment and the follow-up after ~15 days.") +
    faqSection([
      ["Why does bed bug treatment need two visits?", "Bed bug eggs are resistant to most treatments. The second visit, about 15 days later, eliminates newly hatched bugs before they can breed — breaking the life cycle completely."],
      ["How should I prepare before the treatment?", "Wash bedding, curtains and clothes in hot water, declutter around the bed, and give the technician access to all sides of the bed and sofa. We'll share a simple checklist when you book."],
      ["Do I need to throw away my mattress?", "Almost never. Our treatment penetrates seams and crevices where bugs hide, so mattresses and furniture can nearly always be saved."],
      ["When can we use the bedroom again?", "The room should be ventilated for 3–4 hours after treatment. After that it is safe to sleep in — most families use the room the same night."],
      ["How long until the bed bugs are completely gone?", "You'll notice a sharp drop in bites within days of the first visit; after the second visit the infestation is fully eliminated."],
      ["Is the treatment safe for children's bedrooms?", "Yes. We use bedroom-appropriate, government-approved formulations and give you clear guidance on ventilation and bedding."]
    ]) +
    ctaBand("Sleep Peacefully Again", "Book the two-visit bed bug treatment today — fixed prices, no hidden charges, 3-month warranty."),
};

/* ---------- Rodent Control ---------- */
pages["rodent-control.html"] = {
  title: "Rat & Rodent Control in Delhi NCR | PestShield",
  desc: "Professional rat & mice control in Delhi NCR — secured bait stations, traps and entry-point sealing. Safe for kids & pets. 3-month warranty. Book on WhatsApp.",
  body:
    pageHero(
      "Rodent Control",
      "Rodent Control",
      "Rats and mice chew wiring, contaminate food and multiply fast. Our rodent control programme combines secured baiting, trapping and entry-point management to clear them out — and keep them out.",
      "3-Month Service Warranty",
      "rodent"
    ) +
    splitSection(
      "Know the Problem",
      "Signs of a Rodent Problem",
      "Watch out for these signs",
      [
        "Droppings in the kitchen, storerooms or behind appliances",
        "Gnaw marks on wires, furniture or food packaging",
        "Scratching or scurrying sounds at night",
        "Greasy rub marks along walls and skirtings",
        "Nesting material — shredded paper or fabric — in hidden corners"
      ],
      "What's included in the service",
      [
        "Inspection to locate runways, nests and entry points",
        "Tamper-resistant bait stations placed out of reach of kids &amp; pets",
        "Glue boards and traps at high-activity points",
        "Entry-point report with sealing recommendations",
        "Follow-up guidance + 3-month warranty"
      ]
    ) +
    processSection([
      ["Inspection", "We identify rodent runways, droppings, nests and the entry points they use to get inside."],
      ["Secured Baiting", "Tamper-resistant bait stations are installed safely away from children, pets and food."],
      ["Trapping", "Glue boards and traps are placed along active runways for immediate population reduction."],
      ["Proofing Advice", "You receive a clear report of entry points to seal, so rodents can't return."]
    ]) +
    pricingSection("rodent", "One flat price for your home or office size, including bait stations and follow-up guidance.") +
    faqSection([
      ["Is rodent bait safe with pets at home?", "Yes — we use tamper-resistant, locked bait stations placed where pets and children cannot reach, and we walk you through every placement."],
      ["How long does it take to clear the rodents?", "Most homes see activity stop within 7–14 days. Heavier infestations may need a follow-up visit, which we schedule as part of the service."],
      ["Do you also seal the entry points?", "We identify and document every entry point and guide you on sealing. Minor gaps can often be handled during the visit; larger civil work is best done by your contractor using our report."],
      ["What about dead rodents inside the house?", "Our placement strategy draws rodents towards accessible areas. If a carcass is found within the warranty period, we guide you on safe removal or assist during a follow-up."],
      ["Do you handle offices, shops and warehouses?", "Yes. We run scheduled rodent-management programmes for offices, restaurants, shops and warehouses. Contact us for a site visit."],
      ["Will the rodents come back?", "Not if entry points are sealed. Combined with the 3-month warranty, our proofing report is your long-term protection."]
    ]) +
    ctaBand("Evict the Rodents for Good", "Book a rodent control visit today — safe for families, effective within days."),
};

/* ---------- About ---------- */
pages["about.html"] = {
  title: "About Us — Pest Control Experts in Delhi NCR | PestShield",
  desc: "We're on a mission to make professional, safe and transparent pest control accessible to every home. Verified technicians, fixed prices, written warranties.",
  body:
    pageHero(
      "About Us",
      "Pest Control, Done Right",
      "We started with a simple frustration: pest control services that overpromise, overcharge and disappear after payment. So we built the company we wished existed — verified professionals, fixed prices and warranties in writing.",
      "",
      "about"
    ) +
    `  <section>
    <div class="container">
      <div class="split">
        <div class="reveal">
          <span class="eyebrow">Our Story</span>
          <h2>From One Van to <span data-config="customersServed"></span> Happy Homes</h2>
          <p>What began as a small team serving a handful of neighbourhoods has grown into a trusted pest control service across <span data-config="city"></span>. The growth came from one thing: doing exactly what we promise, at exactly the price we quote.</p>
          <p>Every technician on our team is background-verified, professionally trained and equipped with government-approved chemicals. Every service ends with a written warranty — because we believe you shouldn't have to take a service provider's word on faith.</p>
          <p style="margin-bottom:0">Today, families and businesses across the region trust us for everything from a routine cockroach treatment to whole-home termite protection.</p>
        </div>
        <div class="grid grid-2 reveal">
          <div class="card"><h3 style="font-size:2rem;color:var(--brand-dark)" data-config="customersServed"></h3><p>Happy customers served</p></div>
          <div class="card"><h3 style="font-size:2rem;color:var(--brand-dark)">★ <span data-config="rating"></span></h3><p><span data-config="reviewCount"></span> Google reviews</p></div>
          <div class="card"><h3 style="font-size:2rem;color:var(--brand-dark)" data-config="yearsExperience"></h3><p>Years of experience</p></div>
          <div class="card"><h3 style="font-size:2rem;color:var(--brand-dark)">100%</h3><p>Services with written warranty</p></div>
        </div>
      </div>
    </div>
  </section>

  <section class="alt-bg">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Our Values</span>
        <h2>What We Stand For</h2>
      </div>
      <div class="grid grid-4">
        <div class="card reveal"><h3>Safety First</h3><p>Only government-approved, low-toxicity chemicals — applied by trained hands, safe for kids and pets.</p></div>
        <div class="card reveal"><h3>Radical Transparency</h3><p>Published price lists, written warranties and honest advice — even when it means a smaller job for us.</p></div>
        <div class="card reveal"><h3>Reliability</h3><p>We arrive when we say we will. Same-day slots, punctual teams and follow-ups that actually happen.</p></div>
        <div class="card reveal"><h3>Customer Obsession</h3><p>A service isn't done when we leave — it's done when the pests are gone. Warranty claims are honoured, fast.</p></div>
      </div>
    </div>
  </section>

` +
    ctaBand("Experience the Difference Yourself", "Talk to our team about your pest problem — honest advice, fixed prices, no pressure."),
};

/* ---------- Contact ---------- */
pages["contact.html"] = {
  title: "Contact Us — Book Pest Control in Delhi NCR | PestShield",
  desc: "Book a pest control service or get a free quote. Call, WhatsApp or send an enquiry — we respond within minutes during working hours.",
  body:
    pageHero(
      "Contact Us",
      "Let's Solve Your Pest Problem",
      "Call or WhatsApp for an instant quote, or send an enquiry below. We respond within minutes during working hours — and same-day service slots are usually available.",
      ""
    ) +
    `  <section>
    <div class="container">
      <div class="split" style="align-items:start">
        <div class="grid" style="gap:1rem">
          <div class="card contact-card reveal">
            <div class="icon-badge"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg></div>
            <div><h3>Call Us</h3><p><a data-config-href="tel"><span data-config="phoneDisplay"></span></a><br><span style="color:var(--muted);font-size:.85rem" data-config="hours"></span></p></div>
          </div>
          <div class="card contact-card reveal">
            <div class="icon-badge">${waSvg}</div>
            <div><h3>WhatsApp</h3><p><a data-config-href="whatsapp">Chat with us instantly</a><br><span style="color:var(--muted);font-size:.85rem">Fastest way to get a quote</span></p></div>
          </div>
          <div class="card contact-card reveal">
            <div class="icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></div>
            <div><h3>Email</h3><p><a data-config-href="mailto"><span data-config="email"></span></a><br><span style="color:var(--muted);font-size:.85rem">We reply within one business day</span></p></div>
          </div>
          <div class="card contact-card reveal">
            <div class="icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div><h3>Service Area</h3><p><span data-config="address"></span><br><span style="color:var(--muted);font-size:.85rem">Doorstep service across the region</span></p></div>
          </div>
        </div>
        <div class="card reveal">
          <h3>Send an Enquiry</h3>
          <p style="color:var(--muted);font-size:.9rem">Fill this in and it opens WhatsApp with your details ready to send — no waiting, no forms lost in inboxes.</p>
          <form class="contact-form" id="enquiry-form">
            <div class="form-row">
              <label>Your Name
                <input type="text" name="name" required placeholder="Full name">
              </label>
              <label>Phone Number
                <input type="tel" name="phone" required placeholder="Mobile number">
              </label>
            </div>
            <label>Service Needed
              <select name="service" required>
                <option value="" disabled selected>Select a service</option>
                <option>General Pest Control</option>
                <option>Termite Treatment</option>
                <option>Bed Bug Treatment</option>
                <option>Rodent Control</option>
                <option>Other / Not sure</option>
              </select>
            </label>
            <label>Message
              <textarea name="message" rows="4" placeholder="Tell us about the pest problem, your home size and preferred time…"></textarea>
            </label>
            <button type="submit" class="btn btn-wa">${waSvg} Send via WhatsApp</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <section class="alt-bg">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Service Coverage</span>
        <h2>Areas We Serve</h2>
      </div>
      <div class="area-chips reveal" data-areas></div>
    </div>
  </section>

`,
};

/* ---------- Privacy Policy ---------- */
pages["privacy-policy.html"] = {
  title: "Privacy Policy | PestShield",
  desc: "How we collect, use and protect your personal information when you use our website and pest control services.",
  body:
    `  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / Privacy Policy</nav>
      <h1>Privacy Policy</h1>
      <p class="lead" style="margin-bottom:0">Last updated: <span data-year></span></p>
    </div>
  </section>

  <section>
    <div class="container legal-content">
      <p><span data-config="brandName"></span> ("we", "us") respects your privacy. This policy explains what information we collect and how we use it.</p>

      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Contact details</strong> — your name, phone number and address, shared when you book a service or send an enquiry.</li>
        <li><strong>Service details</strong> — the type of pest problem, home size and service history, used to deliver and warranty our work.</li>
        <li><strong>Usage data</strong> — basic, anonymous website analytics if enabled by our hosting provider.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To schedule, deliver and follow up on pest control services.</li>
        <li>To honour service warranties and handle re-service requests.</li>
        <li>To respond to enquiries made by phone, WhatsApp, email or the website form.</li>
      </ul>

      <h2>What We Don't Do</h2>
      <ul>
        <li>We do not sell, rent or trade your personal information to third parties.</li>
        <li>We do not process payments through this website — no card or banking data is ever collected here.</li>
        <li>We do not send marketing messages without your consent.</li>
      </ul>

      <h2>Data Retention &amp; Security</h2>
      <p>Service records are retained only as long as needed to honour warranties and legal obligations. Access to customer information is limited to staff who need it to serve you.</p>

      <h2>Third-Party Services</h2>
      <p>Our enquiry form opens WhatsApp with your message pre-filled; sending it is subject to WhatsApp's own privacy policy. Links to external sites are governed by those sites' policies.</p>

      <h2>Your Rights</h2>
      <p>You may request a copy, correction or deletion of your personal information at any time by contacting us at <a data-config-href="mailto"><span data-config="email"></span></a> or <a data-config-href="tel"><span data-config="phoneDisplay"></span></a>.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this policy from time to time. Material changes will be reflected on this page with a revised date.</p>
    </div>
  </section>

`,
};

/* ---------- Terms & Conditions ---------- */
pages["terms-conditions.html"] = {
  title: "Terms & Conditions | PestShield",
  desc: "Terms of service for bookings, pricing, warranties and re-service for our pest control services.",
  body:
    `  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / Terms &amp; Conditions</nav>
      <h1>Terms &amp; Conditions</h1>
      <p class="lead" style="margin-bottom:0">Last updated: <span data-year></span></p>
    </div>
  </section>

  <section>
    <div class="container legal-content">
      <p>These terms govern the pest control services provided by <span data-config="brandName"></span>. By booking a service, you agree to the terms below.</p>

      <h2>1. Bookings &amp; Scheduling</h2>
      <ul>
        <li>Bookings are made by phone, WhatsApp or the website enquiry form and confirmed by our team.</li>
        <li>Please provide accurate details of home size and pest problem — pricing is based on this information.</li>
        <li>Rescheduling is free with at least 4 hours' notice before the appointment.</li>
      </ul>

      <h2>2. Pricing &amp; Payment</h2>
      <ul>
        <li>Prices displayed on this website are indicative and based on standard home sizes; the final quote is confirmed before work begins.</li>
        <li>Payment is collected only after the service is completed, directly to our team — this website does not process payments.</li>
        <li>There are no hidden charges. Any additional work is quoted and approved by you before it is done.</li>
      </ul>

      <h2>3. Service Warranty</h2>
      <ul>
        <li>Each service carries the warranty period stated on its service page (e.g. 3 months for general pest control, 1 year for termite treatment).</li>
        <li>If the treated pest reappears within the warranty period, we provide re-service free of charge.</li>
        <li>The warranty applies to the treated premises only and requires reasonable adherence to the aftercare guidance provided.</li>
      </ul>

      <h2>4. Customer Responsibilities</h2>
      <ul>
        <li>Provide access to the areas requiring treatment at the scheduled time.</li>
        <li>Follow pre-service preparation and aftercare instructions shared by our team.</li>
        <li>Inform us in advance of any allergies, medical conditions, infants or pets in the household.</li>
      </ul>

      <h2>5. Safety</h2>
      <p>We use government-approved chemicals applied by trained technicians. Specific ventilation or re-entry guidance shared by the technician must be followed for your safety.</p>

      <h2>6. Liability</h2>
      <p>Our liability is limited to re-performing the service under warranty. We are not liable for pre-existing structural damage (for example, damage already caused by termites before treatment).</p>

      <h2>7. Contact</h2>
      <p>Questions about these terms? Reach us at <a data-config-href="mailto"><span data-config="email"></span></a> or <a data-config-href="tel"><span data-config="phoneDisplay"></span></a>.</p>
    </div>
  </section>

`,
};

/* ============================================================ WRITE */
for (const [file, p] of Object.entries(pages)) {
  const html = head(p.title, p.desc) + header + "\n\n" + p.body + tail;
  fs.writeFileSync(path.join(ROOT, file), html, "utf8");
  console.log("wrote", file, "(" + html.length + " bytes)");
}
