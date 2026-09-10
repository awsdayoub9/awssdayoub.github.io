/**
 * Build-time copy checks (build-decisions C10). Runs before `astro build` and aborts on failure.
 *  1. Number allowlist over STRING VALUES of src/i18n/*.json, src/content/** (frontmatter + Markdown body)
 *     and src/data/schematics/*.json.
 *  2. Forbidden terms: Odoo model identifiers outside technical.*, *.stack and schematic idLine;
 *     "Independent" / «مستقل» as a status adjective; "Freelance Odoo developer" / «مطور أودو مستقل» as a status
 *     adjective outside SEO titles/descriptions (seo-decisions.md: the buyer's search phrase is allowed there
 *     only; "freelance projects" / «مشاريع مستقلة» phrasing is allowed everywhere); client names other than
 *     Grand Hotel Tartus. The status-adjective rules cover Aws's own positioning copy (i18n JSON, engagements),
 *     not src/content/pages, whose articles discuss freelancers and partners generically (coordinator note).
 *  3. Length caps: SEO title <= 60, description <= 160, H1 <= 80, schematic_alt <= 60 words.
 * Font budget is reported (not enforced) by scripts/report.mjs after the build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.mjs';

const root = process.cwd();
const errors = [];
const fail = (file, key, msg, value) => errors.push(`${file} › ${key}: ${msg}${value ? `\n    "${String(value).slice(0, 160)}"` : ''}`);

// ---- allowed numeric patterns (removed before the residual-digit test) ----
const MONTHS_EN = 'January|February|March|April|May|June|July|August|September|October|November|December';
const MONTHS_AR = 'يناير|فبراير|مارس|أبريل|إبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر|كانون الثاني|شباط|آذار|نيسان|أيار|حزيران|تموز|آب|أيلول|تشرين الأول|تشرين الثاني|كانون الأول';
const ALLOWED = [
  /https?:\/\/\S+/g,                        // URLs (documentation paths, forum ids)
  /\+?963[ ]?983[ ]?354[ ]?124/g,          // phone (digits / spaced / tel:)
  new RegExp(`\\b\\d{1,2}[ \\u00a0](?:${MONTHS_EN}) 20\\d\\d\\b`, 'g'), // "6 September 2026"
  new RegExp(`\\b\\d{1,2}[ \\u00a0](?:${MONTHS_AR}) 20\\d\\d`, 'g'),    // Arabic long dates
  /\b(0[1-9]|1[0-2])\/20\d\d\b/g,           // MM/YYYY
  /\b20(19|2[0-6])(-\d\d-\d\d)?\b/g,        // years 2019-2026 and ISO dates
  /\b1[4-9](\.0)?\b/g,                      // Odoo versions 14-19 (also "17.0")
  /UTC\+3/g,
  /\bC1\b/g, /\bB1\b/g, /B\.Sc\.?/g,
  /\b(0[0-9]|10)\b/g,                       // section / phase indices 00-10
  /\{year\}/g, /\{size\}/g,
  /l10n_sa(_edi)?/g,
  /Phase 2/g, /المرحلة الثانية/g,           // ZATCA Phase 2
  /\bPhase[  ][1-6]\b/g, /المرحلة[  ][1-6]\b/g, // the six phases on the method page
  /awsdayoub1@gmail\.com/g,
  /awsdayoub9\.github\.io/g,
  /aws-dayoub-7bba83257/g,
];
const FORBIDDEN_NUMERIC = [
  [/%/, 'percent sign'],
  [/\d+\s*\+(?!3\b)/, 'digit followed by plus'],
  [/\b\d+\s?x\b/i, '"Nx" multiplier'],
  [/\d+\s*(clients?|projects?|companies|years?|عملاء|مشاريع|شركات|سنوات)/i, 'count claim'],
];
const MODEL_ID = /\b(hr|account|sale|purchase|stock|project|pos|res|mail|product|crm|hotel|payment|website|portal)\.[a-z_]+\b/;
const INDEPENDENT_EN = /\bIndependent\b|\bindependent (odoo|developer|consultant)/i;
const INDEPENDENT_AR = /مستقل(?!ة)/;
/** "Freelance <role>" as a status adjective: allowed only in SEO titles/descriptions (build-decisions A1, seo-decisions on-page rules). */
const FREELANCE_EN = /\bfreelance (odoo|developer|consultant|erp)\b/i;
/** seo.<page>.title|description in the i18n files; title|description in page frontmatter. */
const SEO_HEAD_KEY = /^(seo\.[^.]+\.)?(title|description)$/;
/** Only Grand Hotel Tartus may be named. Add patterns here if a client name leaks in. */
const CLIENT_NAME_BLOCKLIST = [];

const stripUrls = (value) => value.replace(/https?:\/\/\S+/g, ' ');

function checkString(file, key, value, { statusRules = true } = {}) {
  const isTechnical = /^technical\./.test(key) || /(^|\.)stack(\[|$)/.test(key) || /idLine$/.test(key) || /^contact_values\./.test(key) || /(^|\.)sources\[/.test(key);
  const text = stripUrls(value);
  for (const [re, why] of FORBIDDEN_NUMERIC) if (re.test(text)) fail(file, key, `forbidden numeric pattern (${why})`, value);
  let residual = value;
  for (const re of ALLOWED) residual = residual.replace(re, ' ');
  if (/\d/.test(residual)) fail(file, key, 'digit outside the allowlist', residual.match(/.{0,40}\d.{0,40}/)?.[0] ?? value);
  if (!isTechnical && MODEL_ID.test(text)) fail(file, key, 'Odoo model identifier outside technical.* / stack / idLine', text.match(MODEL_ID)?.[0]);
  if (statusRules && INDEPENDENT_EN.test(text)) fail(file, key, '"Independent" used as a status adjective', value);
  if (statusRules && !SEO_HEAD_KEY.test(key) && FREELANCE_EN.test(text)) fail(file, key, '"Freelance" used as a status adjective outside SEO title/description', value);
  if (statusRules && !SEO_HEAD_KEY.test(key) && INDEPENDENT_AR.test(text) && !/مشاريع(?: \S+){0,3} مستقل/.test(text)) fail(file, key, '«مستقل» used as a status adjective outside SEO title/description', value);
  for (const re of CLIENT_NAME_BLOCKLIST) if (re.test(text)) fail(file, key, 'client name not permitted', value);
}

function walk(obj, key, file, opts) {
  if (typeof obj === 'string') return checkString(file, key, obj, opts);
  if (Array.isArray(obj)) return obj.forEach((v, i) => walk(v, `${key}[${i}]`, file, opts));
  if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) walk(v, key ? `${key}.${k}` : k, file, opts);
}

// ---- i18n JSON (en.json, ar.json, doc.en.json, doc.ar.json) ----
const i18nDir = path.join(root, 'src', 'i18n');
for (const f of fs.readdirSync(i18nDir).filter((n) => n.endsWith('.json'))) {
  const file = `src/i18n/${f}`;
  const json = JSON.parse(fs.readFileSync(path.join(i18nDir, f), 'utf8'));
  const { _meta, ...copy } = json;
  walk(copy, '', file);
  if (copy.seo) {
    for (const [page, seo] of Object.entries(copy.seo)) {
      if (seo.title.length > 60) fail(file, `seo.${page}.title`, `title is ${seo.title.length} chars (max 60)`);
      if (seo.description.length > 160) fail(file, `seo.${page}.description`, `description is ${seo.description.length} chars (max 160)`);
    }
  }
  if (copy.about?.title && copy.about.title.length > 60) fail(file, 'about.title', `title is ${copy.about.title.length} chars (max 60)`);
  if (copy.about?.description && copy.about.description.length > 160) fail(file, 'about.description', `description is ${copy.about.description.length} chars (max 160)`);
  if (copy.about?.h1 && copy.about.h1.length > 80) fail(file, 'about.h1', `h1 is ${copy.about.h1.length} chars (max 80)`);
  if (copy.engagements) {
    for (const [slug, e] of Object.entries(copy.engagements)) {
      const words = e.schematic_alt.trim().split(/\s+/).length;
      if (words > 60) fail(file, `engagements.${slug}.schematic_alt`, `${words} words (max 60)`);
    }
  }
}

// ---- schematic data ----
const schDir = path.join(root, 'src', 'data', 'schematics');
for (const f of fs.readdirSync(schDir)) {
  const file = `src/data/schematics/${f}`;
  walk(JSON.parse(fs.readFileSync(path.join(schDir, f), 'utf8')), '', file);
}

// ---- content collections (frontmatter + body) ----
function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? listFiles(path.join(dir, d.name)) : d.name.endsWith('.md') ? [path.join(dir, d.name)] : []);
}
for (const abs of listFiles(path.join(root, 'src', 'content'))) {
  const file = path.relative(root, abs).replace(/\\/g, '/');
  const text = fs.readFileSync(abs, 'utf8');
  let fm, body;
  try { ({ data: fm, body } = parseFrontmatter(text)); } catch (e) { fail(file, 'frontmatter', e.message); continue; }
  const isPage = file.startsWith('src/content/pages/');
  walk(fm, '', file, { statusRules: !isPage });
  if (typeof fm.title === 'string' && fm.title.length > 60) fail(file, 'title', `title is ${fm.title.length} chars (max 60)`);
  if (typeof fm.description === 'string' && fm.description.length > 160) fail(file, 'description', `description is ${fm.description.length} chars (max 160)`);
  if (typeof fm.h1 === 'string' && fm.h1.length > 80) fail(file, 'h1', `h1 is ${fm.h1.length} chars (max 80)`);
  if (typeof fm.schematic_alt === 'string') {
    const words = fm.schematic_alt.trim().split(/\s+/).length;
    if (words > 60) fail(file, 'schematic_alt', `${words} words (max 60)`);
  }
  if (body.trim()) checkString(file, 'body', body.trim(), { statusRules: !isPage });
}

if (errors.length) {
  console.error(`\ncheck: ${errors.length} problem(s) found\n`);
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}
console.log('check: copy, content and schematic data pass the number allowlist, forbidden-term and length checks.');
