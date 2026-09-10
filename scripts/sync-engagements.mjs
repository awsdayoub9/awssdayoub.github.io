/**
 * Regenerates src/content/engagements/<slug>.<locale>.md from the `engagements` object in
 * src/i18n/<locale>.json. Run after swapping the copy files: `npm run sync`.
 * Frontmatter is emitted as a constrained YAML subset (double-quoted scalars, block lists)
 * that scripts/check.mjs can parse without a YAML library.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'src', 'content', 'engagements');
fs.mkdirSync(outDir, { recursive: true });

const q = (s) => JSON.stringify(String(s));

function emit(obj, indent = '') {
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      if (v.length === 0) lines.push(`${indent}${k}: []`);
      else {
        lines.push(`${indent}${k}:`);
        for (const item of v) lines.push(`${indent}  - ${q(item)}`);
      }
    } else if (v && typeof v === 'object') {
      lines.push(`${indent}${k}:`);
      lines.push(...emit(v, indent + '  '));
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      lines.push(`${indent}${k}: ${v}`);
    } else {
      lines.push(`${indent}${k}: ${q(v)}`);
    }
  }
  return lines;
}

let count = 0;
for (const locale of ['en', 'ar']) {
  const json = JSON.parse(fs.readFileSync(path.join(root, 'src', 'i18n', `${locale}.json`), 'utf8'));
  for (const [slug, e] of Object.entries(json.engagements)) {
    const fm = {
      key: slug,
      order: e.order,
      lang: locale,
      sector: e.sector,
      title: e.title,
      status: e.status,
      status_label: e.status_label,
      period: e.period,
      client: e.client,
      attribution: e.attribution ?? '',
      role: e.role,
      situation: e.situation,
      situation_detail: e.situation_detail,
      approach: e.approach,
      scope: e.scope,
      delivered: e.delivered,
      stack: e.stack,
      odoo_version: e.odoo_version ?? '',
      ...(e.updated ? { updated: e.updated } : {}),
      record: e.record,
      schematic_alt: e.schematic_alt,
      detail_note: e.detail_note ?? '',
      titleblock: e.titleblock,
      screenshots: e.screenshots ?? [],
    };
    const body = `---\n${emit(fm).join('\n')}\n---\n`;
    const file = path.join(outDir, `${slug}.${locale}.md`);
    fs.writeFileSync(file, body, 'utf8');
    count++;
  }
}
console.log(`sync-engagements: wrote ${count} files to src/content/engagements/`);
