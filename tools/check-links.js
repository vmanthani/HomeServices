/* Verifies every internal href/src in the site resolves to an existing file.
   Run:  node tools/check-links.js */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
let bad = 0;
for (const f of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  const refs = [...html.matchAll(/(?<![-\w])(?:href|src)="([^"#]+)"/g)].map((m) => m[1]);
  for (const r of refs) {
    if (/^(https?:|tel:|mailto:|data:)/.test(r) || r === "") continue;
    if (!fs.existsSync(path.join(ROOT, r))) { console.log(`MISSING in ${f}: ${r}`); bad++; }
  }
  // every page must load both scripts and the stylesheet
  for (const need of ["js/config.js", "js/main.js", "css/style.css"])
    if (!html.includes(need)) { console.log(`${f} missing include: ${need}`); bad++; }
}
console.log(bad ? `${bad} problems` : "All internal links OK");
