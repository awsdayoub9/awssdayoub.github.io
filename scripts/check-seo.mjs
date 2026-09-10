/**
 * Post-build SEO checks over the built HTML (seo-decisions.md automated check + seo-technical §22).
 * Fails (exit 1) when:
 *  - a page the content collections say must exist is missing, or a draft page was built;
 *  - any normalised question heading (<summary> text, or an H2/H3 ending with "?" / "؟") appears on more than
 *    one indexable page of the same locale;
 *  - any H1 is longer than 80 characters, or a page has no single H1;
 *  - any description is longer than 160 characters or missing;
 *  - any indexable page lacks a canonical or an hreflang set (self + x-default at least);
 *  - any twin pair (same key in both locales) does not carry the reciprocal en/ar/x-default set, or a page
 *    without a twin points hreflang at a locale where it does not exist;
 *  - 404.html has a canonical, hreflang or JSON-LD, or lacks noindex; a thanks page lacks noindex;
 *  - JSON-LD is invalid, missing/duplicated on an indexable page, FAQPage appears outside /faq/, or the
 *    BreadcrumbList count differs from the visible trail;
 *  - the sitemap lists a noindex page, misses an indexable one, lacks x-default, or carries lastmod for a page
 *    whose own file has no `updated`;
 *  - an internal link points at a file that was not built.
 * Expected page sets derive from src/content (scripts/lib/content-index.mjs), never from constants.
 * Usage: node scripts/check-seo.mjs            (reads ./dist; override with DIST=<dir>)
 */
import fs from 'node:fs';
import path from 'node:path';
import { SITE, expectedRoutes, readPages, lastmodMap, includeDrafts } from './lib/content-index.mjs';

const root = process.cwd();
const DIST = path.resolve(root, process.env.DIST || 'dist');
const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

if (!fs.existsSync(DIST)) { console.error(`check-seo: ${DIST} does not exist`); process.exit(1); }

// ---------- collect HTML ----------
const htmlFiles = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) htmlFiles.push(p);
  }
})(DIST);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const norm = (s) => text(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? decode(m[1]) : undefined; };
const chars = (s) => [...s].length;

const pages = htmlFiles.map((file) => {
  const rel = '/' + path.relative(DIST, file).replace(/\\/g, '/');
  const route = rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
  const html = fs.readFileSync(file, 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
  const links = [...head.matchAll(/<link [^>]*>/g)].map((m) => m[0]);
  const metas = [...head.matchAll(/<meta [^>]*>/g)].map((m) => m[0]);
  const canonical = links.filter((l) => /rel="canonical"/.test(l)).map((l) => attr(l, 'href'));
  const hreflang = links.filter((l) => /rel="alternate"/.test(l) && /hreflang=/.test(l)).map((l) => ({ lang: attr(l, 'hreflang'), href: attr(l, 'href') }));
  const robots = metas.filter((m) => /name="robots"/.test(m)).map((m) => attr(m, 'content'));
  const description = metas.filter((m) => /name="description"/.test(m)).map((m) => attr(m, 'content'));
  const title = [...head.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  const dir = html.match(/<html[^>]*\sdir="([^"]+)"/)?.[1];
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
  const questions = [
    ...[...main.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((m) => text(m[1])),
    ...[...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => text(m[1])).filter((t) => /[?؟]$/.test(t)),
  ];
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const crumbLis = (html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0].match(/<li/g) ?? []).length;
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)].map((m) => m[1]);
  const noindex = robots.some((r) => /noindex/.test(r ?? ''));
  const is404 = rel === '/404.html';
  const locale = /^\/ar(\/|$)/.test(route) ? 'ar' : 'en';
  return { file, rel, route, locale, canonical, hreflang, robots, description, title, lang, dir, h1, questions, jsonld, crumbLis, hrefs, noindex, is404, indexable: !noindex && !is404 };
});
const byRoute = new Map(pages.map((p) => [p.route, p]));

// ---------- expected routes from the content collections ----------
const expected = expectedRoutes(root);
for (const r of expected) {
  const file = r.file ? path.join(DIST, r.path) : path.join(DIST, r.path, 'index.html');
  if (!fs.existsSync(file)) fail(`expected route not built: ${r.path} (${r.kind}, ${r.locale})`);
}
if (!includeDrafts()) {
  for (const p of readPages(root).filter((p) => p.draft)) {
    if (fs.existsSync(path.join(DIST, p.path, 'index.html'))) fail(`draft page was built: ${p.path} (${p.file})`);
  }
}
const expectedKinds = new Map(expected.map((r) => [r.path, r.kind]));
for (const p of pages) if (!p.is404 && !expectedKinds.has(p.route)) warn(`built page not derived from content: ${p.route}`);

// ---------- per-page head checks ----------
for (const p of pages) {
  const tag = p.rel;
  if (p.title.length !== 1 || !p.title[0]) fail(`${tag}: expected one non-empty <title>, found ${p.title.length}`);
  if (p.description.length !== 1 || !p.description[0]) fail(`${tag}: expected one meta description, found ${p.description.length}`);
  else if (chars(p.description[0]) > 160) fail(`${tag}: description is ${chars(p.description[0])} chars (max 160)`);
  if (p.h1.length !== 1) fail(`${tag}: expected exactly one <h1>, found ${p.h1.length}`);
  for (const h of p.h1) if (chars(h) > 80) fail(`${tag}: H1 is ${chars(h)} chars (max 80): "${h}"`);
  if (p.locale === 'ar' && !(p.lang === 'ar' && p.dir === 'rtl')) fail(`${tag}: <html> must carry lang="ar" dir="rtl"`);
  if (p.locale === 'en' && p.lang !== 'en') fail(`${tag}: <html> must carry lang="en"`);

  if (p.is404) {
    if (p.canonical.length) fail(`${tag}: the 404 page must not have a canonical`);
    if (p.hreflang.length) fail(`${tag}: the 404 page must not have hreflang`);
    if (p.jsonld.length) fail(`${tag}: the 404 page must not have JSON-LD`);
    if (!p.noindex) fail(`${tag}: the 404 page must be noindex`);
    continue;
  }
  if (/\/thanks\/$/.test(p.route)) {
    if (!p.noindex) fail(`${tag}: the thanks page must be noindex`);
    if (p.hreflang.length) fail(`${tag}: noindex pages must not emit hreflang`);
    if (p.jsonld.length) fail(`${tag}: noindex pages must not emit JSON-LD`);
  }
  if (!p.indexable) continue;

  const self = SITE + p.route;
  if (p.canonical.length !== 1) fail(`${tag}: expected one canonical, found ${p.canonical.length}`);
  else if (p.canonical[0] !== self) fail(`${tag}: canonical ${p.canonical[0]} != ${self}`);
  if (!p.hreflang.length) fail(`${tag}: indexable page without hreflang`);
  else {
    const langs = p.hreflang.map((h) => h.lang);
    if (!langs.includes('x-default')) fail(`${tag}: hreflang set lacks x-default`);
    if (!p.hreflang.some((h) => h.lang === p.locale && h.href === self)) fail(`${tag}: hreflang set does not list the page itself`);
    for (const h of p.hreflang) {
      if (h.lang === 'x-default') continue;
      const target = h.href?.replace(SITE, '');
      const built = target && fs.existsSync(path.join(DIST, target, 'index.html'));
      if (!built) fail(`${tag}: hreflang="${h.lang}" points at ${h.href}, which was not built`);
      else if (byRoute.get(target)?.noindex) fail(`${tag}: hreflang points at a noindex page ${h.href}`);
    }
    const twinRoute = p.locale === 'en' ? `/ar${p.route}` : p.route.replace(/^\/ar/, '') || '/';
    const twin = byRoute.get(twinRoute);
    if (twin && twin.indexable) {
      const mine = p.hreflang.map((h) => `${h.lang} ${h.href}`).sort().join('|');
      const theirs = twin.hreflang.map((h) => `${h.lang} ${h.href}`).sort().join('|');
      if (mine !== theirs) fail(`${tag}: hreflang set differs from its twin ${twin.rel}\n      ${mine}\n      ${theirs}`);
      if (!langs.includes('en') || !langs.includes('ar')) fail(`${tag}: twin exists but hreflang set lacks en/ar`);
    } else if (langs.includes(p.locale === 'en' ? 'ar' : 'en')) fail(`${tag}: hreflang points at a twin that does not exist (${twinRoute})`);
  }
  // og:url = canonical
  const html = fs.readFileSync(p.file, 'utf8');
  const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
  if (ogUrl !== self) fail(`${tag}: og:url ${ogUrl} != canonical`);
  const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (!ogImage || !fs.existsSync(path.join(DIST, ogImage.replace(SITE, '')))) fail(`${tag}: og:image missing or not built (${ogImage})`);

  // JSON-LD
  if (p.jsonld.length !== 1) fail(`${tag}: expected exactly one JSON-LD block, found ${p.jsonld.length}`);
  for (const block of p.jsonld) {
    let g;
    try { g = JSON.parse(block); } catch (e) { fail(`${tag}: invalid JSON-LD (${e.message})`); continue; }
    const nodes = g['@graph'] ?? [g];
    if (/"(aggregateRating|review|award|priceRange|openingHoursSpecification|hasCredential)"/.test(block)) fail(`${tag}: forbidden JSON-LD key`);
    const ids = new Set(nodes.map((n) => n['@id']).filter(Boolean));
    for (const ref of [...block.matchAll(/"@id":"([^"]+)"/g)].map((m) => m[1])) if (!ids.has(ref)) fail(`${tag}: dangling @id reference ${ref}`);
    for (const n of nodes) {
      if (!n['@type']) fail(`${tag}: JSON-LD node without @type`);
      if (n['@id'] && !String(n['@id']).startsWith(SITE)) fail(`${tag}: relative @id ${n['@id']}`);
    }
    const kind = expectedKinds.get(p.route);
    if (nodes.some((n) => n['@type'] === 'FAQPage') && kind !== 'faq') fail(`${tag}: FAQPage outside the faq kind`);
    if (kind === 'faq' && !nodes.some((n) => n['@type'] === 'FAQPage')) fail(`${tag}: faq page without FAQPage`);
    if (kind === 'about' && !nodes.some((n) => n['@type'] === 'ProfilePage')) fail(`${tag}: about page without ProfilePage`);
    if ((kind === 'engagement' || kind === 'article') && !nodes.some((n) => n['@type'] === 'Article')) fail(`${tag}: ${kind} without Article`);
    const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
    if (kind !== 'home' && !bc) fail(`${tag}: non-home page without BreadcrumbList`);
    if (kind === 'home' && bc) fail(`${tag}: home page must not carry BreadcrumbList`);
    if (bc && bc.itemListElement.length !== p.crumbLis) fail(`${tag}: BreadcrumbList has ${bc.itemListElement.length} items, visible trail has ${p.crumbLis}`);
    if (!nodes.some((n) => n['@type'] === 'Person' && n.worksFor?.name === 'iLines Solutions')) fail(`${tag}: Person.worksFor iLines Solutions missing`);
    // seo-decisions: no ZATCA in Person.knowsAbout or ProfessionalService.serviceType (the FAQPage may mirror the visible ZATCA question)
    for (const n of nodes.filter((n) => n['@type'] === 'Person' || n['@type'] === 'ProfessionalService')) {
      if (/ZATCA/i.test(JSON.stringify(n))) fail(`${tag}: ZATCA must not appear in the ${n['@type']} node`);
    }
  }

  // internal links resolve
  for (const href of new Set(p.hrefs)) {
    if (/^\/_astro\//.test(href)) continue;
    const target = href.endsWith('/') ? path.join(DIST, href, 'index.html') : path.join(DIST, href);
    if (!fs.existsSync(target)) fail(`${tag}: link to ${href} does not resolve`);
    if (!href.endsWith('/') && !/\.[a-z0-9]+$/i.test(href)) fail(`${tag}: internal link without trailing slash: ${href}`);
  }
}

// ---------- question ownership: one page per normalised question per locale ----------
for (const locale of ['en', 'ar']) {
  const owners = new Map();
  for (const p of pages.filter((p) => p.indexable && p.locale === locale)) {
    for (const q of new Set(p.questions.map(norm).filter(Boolean))) {
      if (owners.has(q) && owners.get(q) !== p.route) fail(`duplicate question in ${locale}: "${q}" on ${owners.get(q)} and ${p.route}`);
      owners.set(q, p.route);
    }
  }
}

// ---------- sitemap ----------
const smFile = path.join(DIST, 'sitemap-0.xml');
if (!fs.existsSync(smFile) || !fs.existsSync(path.join(DIST, 'sitemap-index.xml'))) fail('sitemap-index.xml / sitemap-0.xml missing');
else {
  const sm = fs.readFileSync(smFile, 'utf8');
  const urls = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const locs = urls.map((u) => u.match(/<loc>([^<]+)<\/loc>/)?.[1]);
  const lastmod = lastmodMap(root);
  for (const u of urls) {
    const loc = u.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
    const route = loc.replace(SITE, '');
    if (/\/thanks\/$|404/.test(route)) fail(`sitemap lists a noindex page: ${loc}`);
    if (!/hreflang="x-default"/.test(u)) fail(`sitemap entry without x-default: ${loc}`);
    const hasLastmod = /<lastmod>/.test(u);
    if (hasLastmod && !lastmod[route]) fail(`sitemap lastmod on a page whose file has no updated date: ${loc}`);
    if (!hasLastmod && lastmod[route]) fail(`sitemap lastmod missing for ${loc}`);
    if (!byRoute.has(route)) fail(`sitemap URL not built: ${loc}`);
    const page = byRoute.get(route);
    if (page) {
      const smSet = [...u.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]} ${m[2]}`).sort().join('|');
      const htmlSet = page.hreflang.map((h) => `${h.lang} ${h.href}`).sort().join('|');
      if (smSet !== htmlSet) fail(`sitemap alternates differ from HTML hreflang for ${loc}\n      ${smSet}\n      ${htmlSet}`);
    }
  }
  for (const p of pages.filter((p) => p.indexable)) if (!locs.includes(SITE + p.route)) fail(`indexable page missing from sitemap: ${p.route}`);
}

// ---------- files ----------
for (const f of ['robots.txt', 'llms.txt', 'manifest.webmanifest', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og/en.png', 'og/ar.png']) {
  if (!fs.existsSync(path.join(DIST, f))) fail(`missing static file: ${f}`);
}
if (fs.existsSync(path.join(DIST, 'robots.txt')) && /\r/.test(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8'))) fail('robots.txt has CRLF line endings');

// ---------- report ----------
for (const w of warnings) console.log('check-seo: warning: ' + w);
if (errors.length) {
  console.error(`\ncheck-seo: ${errors.length} problem(s) found in ${path.relative(root, DIST)}\n`);
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}
const indexable = pages.filter((p) => p.indexable).length;
console.log(`check-seo: ${pages.length} pages (${indexable} indexable) in ${path.relative(root, DIST)} pass canonical, hreflang, twin, heading, description, question-ownership, JSON-LD, sitemap and link checks.`);
