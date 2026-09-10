/**
 * Post-build report (never aborts): HTML size, inline CSS/JS bytes and the font bytes each
 * locale's home page references, against the budgets in design-spec §12.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist = path.resolve(process.cwd(), process.env.DIST || 'dist');
const pages = { en: 'index.html', ar: path.join('ar', 'index.html') };
const budgets = { en: { html: 70 * 1024, fonts: 100 * 1024 }, ar: { html: 75 * 1024, fonts: 115 * 1024 } };
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

for (const [locale, rel] of Object.entries(pages)) {
  const file = path.join(dist, rel);
  if (!fs.existsSync(file)) { console.log(`report: ${rel} missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const raw = Buffer.byteLength(html);
  const gz = zlib.gzipSync(html).length;
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((n, m) => n + Buffer.byteLength(m[1]), 0);
  const js = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].reduce((n, m) => n + Buffer.byteLength(m[1]), 0);
  const fontUrls = [...new Set([...html.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)].map((m) => m[1]))];
  const preloaded = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map((m) => m[1]);
  let fontBytes = 0;
  const rows = [];
  for (const u of fontUrls) {
    const p = path.join(dist, u.replace(/^\//, ''));
    const size = fs.existsSync(p) ? fs.statSync(p).size : 0;
    fontBytes += size;
    rows.push(`      ${path.basename(u)} ${kb(size)}${preloaded.includes(u) ? ' (preload)' : ''}`);
  }
  const b = budgets[locale];
  console.log(`report [${locale}] ${rel}`);
  console.log(`   HTML ${kb(raw)} raw / ${kb(gz)} gzip (budget ${kb(b.html)} raw)${raw > b.html ? '  OVER' : ''}`);
  console.log(`   inline CSS ${kb(css)} · inline JS ${js} bytes`);
  console.log(`   fonts declared: ${fontUrls.length} files, ${kb(fontBytes)} (budget ${kb(b.fonts)})${fontBytes > b.fonts ? '  OVER' : ''}`);
  for (const r of rows) console.log(r);
}
