/**
 * Renders public/og/en.png and public/og/ar.png (1200x630) from scripts/og-template.html
 * with Playwright + system Chrome. Not part of `astro build`; the PNGs are committed.
 * Usage: node scripts/og.mjs [--playwright <path to node_modules/playwright>]
 * Fonts are fetched from Google Fonts at generation time (network needed once).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const argIdx = process.argv.indexOf('--playwright');
const candidates = [
  argIdx > -1 ? process.argv[argIdx + 1] : null,
  process.env.PLAYWRIGHT_PATH,
  'C:/Users/DELLLA~1/AppData/Local/Temp/claude/c--portfolio/8a361d92-4110-4322-9463-b48f525cd232/scratchpad/tools/node_modules/playwright',
  'playwright',
].filter(Boolean);

const require = createRequire(import.meta.url);
let playwright;
for (const c of candidates) {
  try { playwright = require(c); break; } catch { /* try next */ }
}
if (!playwright) {
  console.error('og: playwright not found. Pass --playwright <path> or set PLAYWRIGHT_PATH.');
  process.exit(1);
}

const template = pathToFileURL(path.join(root, 'scripts', 'og-template.html')).href;
const outDir = path.join(root, 'public', 'og');
fs.mkdirSync(outDir, { recursive: true });

const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const locale of ['en', 'ar']) {
    const copy = JSON.parse(fs.readFileSync(path.join(root, 'src', 'i18n', `${locale}.json`), 'utf8'));
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(template);
    await page.evaluate(({ locale, og, name }) => {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.getElementById('index').textContent = og.cover_index;
      document.getElementById('name').textContent = name;
      document.getElementById('line').textContent = og.positioning_line;
      document.getElementById('eyebrow-text').textContent = og.eyebrow;
      document.getElementById('url').textContent = og.url;
    }, { locale, og: copy.og, name: copy.site.name });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const file = path.join(outDir, `${locale}.png`);
    await page.screenshot({ path: file, type: 'png' });
    console.log(`og: wrote ${path.relative(root, file)} (${fs.statSync(file).size} bytes)`);
    await page.close();
  }
} finally {
  await browser.close();
}
