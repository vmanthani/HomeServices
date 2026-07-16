/* Verifies every internal href/src in the site resolves to an existing file.
   Understands folder URLs (/pest-control/) and root-absolute asset paths.
   Run:  node tools/check-links.js */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
let bad = 0;

const SKIP_DIRS = new Set([".git", "node_modules", "tools", "fonts", "images", "css", "js"]);
function htmlFiles(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      out = out.concat(htmlFiles(path.join(dir, e.name)));
    } else if (e.name.endsWith(".html")) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

function resolveRef(ref, fileDir) {
  const clean = ref.split("#")[0].split("?")[0];
  if (clean === "") return null;
  let target = clean.startsWith("/") ? path.join(ROOT, clean) : path.join(fileDir, clean);
  if (clean.endsWith("/")) target = path.join(target, "index.html");
  else if (!path.extname(target)) target = path.join(target, "index.html");
  return target;
}

for (const f of htmlFiles(ROOT)) {
  const rel = path.relative(ROOT, f);
  const html = fs.readFileSync(f, "utf8");
  const dir = path.dirname(f);
  const refs = [...html.matchAll(/(?<![-\w])(?:href|src)="([^"#]+)"/g)].map((m) => m[1]);
  for (const r of refs) {
    if (/^(https?:|tel:|mailto:|data:)/.test(r) || r === "") continue;
    const target = resolveRef(r, dir);
    if (target && !fs.existsSync(target)) {
      console.log(`MISSING in ${rel}: ${r} -> ${path.relative(ROOT, target)}`);
      bad++;
    }
  }
  for (const need of ["/css/style.css", "/js/config.js", "/js/main.js"])
    if (!html.includes(need)) { console.log(`${rel} missing include: ${need}`); bad++; }
}
console.log(bad ? `${bad} problems` : "All internal links OK");
