/* Tiny static dev server for e:/projects/HomeServices */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = require("path").join(__dirname, "..");
const PORT = 5500;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  // Folder URLs -> index.html (mirrors GitHub Pages): "/", "/pest-control/", "/pest-control"
  if (urlPath.endsWith("/")) urlPath += "index.html";
  else if (!path.extname(urlPath)) urlPath += "/index.html";
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(path.normalize(ROOT)) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 Not Found: " + urlPath);
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Dev server running at http://localhost:${PORT}/`));
