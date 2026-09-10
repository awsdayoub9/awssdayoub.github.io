/**
 * Reads the content collections straight from disk (no Astro runtime) so that the build scripts
 * and astro.config.mjs derive the page set from the same source of truth the site is built from.
 *  - pages:       src/content/pages/<translationKey with / as __>.<locale>.md
 *  - engagements: src/content/engagements/<key>.<locale>.md
 * Drafts are excluded unless PUBLISH_DRAFTS=1 (the same switch src/seo/pages.ts honours).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';

export const SITE = 'https://awsdayoub.github.io';
export const LOCALES = ['en', 'ar'];

export const includeDrafts = () => process.env.PUBLISH_DRAFTS === '1';

/** Locale-independent key → site path: ('ar', 'services/odoo-migration') → '/ar/services/odoo-migration/' */
export function localePath(locale, key = '') {
  const p = key ? `${key.replace(/^\/+|\/+$/g, '')}/` : '';
  return locale === 'ar' ? `/ar/${p}` : `/${p}`;
}

function readDir(root, rel) {
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const { data, body } = parseFrontmatter(text);
    return { file: `${rel}/${f}`.replace(/\\/g, '/'), data, body };
  });
}

export function readPages(root = process.cwd()) {
  return readDir(root, 'src/content/pages').map((e) => ({
    ...e,
    locale: e.data.locale,
    key: String(e.data.translationKey ?? ''),
    kind: e.data.kind,
    draft: e.data.draft === true,
    updated: e.data.updated ? String(e.data.updated) : '',
    path: localePath(e.data.locale, String(e.data.translationKey ?? '')),
  }));
}

export function readEngagements(root = process.cwd()) {
  return readDir(root, 'src/content/engagements').map((e) => ({
    ...e,
    locale: e.data.lang,
    key: String(e.data.key ?? ''),
    kind: 'engagement',
    draft: false,
    updated: e.data.updated ? String(e.data.updated) : '',
    path: localePath(e.data.lang, `work/${e.data.key}`),
  }));
}

/** Pages that will be built (drafts removed unless PUBLISH_DRAFTS=1). */
export function publishedPages(root = process.cwd()) {
  return readPages(root).filter((p) => includeDrafts() || !p.draft);
}

/** path → lastmod (ISO date) for every route whose own file carries `updated` (pages and engagements only). */
export function lastmodMap(root = process.cwd()) {
  const out = {};
  for (const e of [...publishedPages(root), ...readEngagements(root)]) if (e.updated) out[e.path] = e.updated;
  return out;
}

/** Every route the build is expected to emit, per locale, with its kind. */
export function expectedRoutes(root = process.cwd()) {
  const routes = [];
  for (const locale of LOCALES) {
    routes.push({ path: localePath(locale), locale, kind: 'home', indexable: true });
    routes.push({ path: localePath(locale, 'thanks'), locale, kind: 'thanks', indexable: false });
  }
  for (const e of readEngagements(root)) routes.push({ path: e.path, locale: e.locale, kind: 'engagement', indexable: true, key: `work/${e.key}` });
  const pages = publishedPages(root);
  for (const p of pages) routes.push({ path: p.path, locale: p.locale, kind: p.kind, indexable: true, key: p.key, questions: p.data.questions ?? [] });
  for (const locale of LOCALES) {
    const hasArticles = pages.some((p) => p.locale === locale && p.kind === 'article');
    const hasIndexFile = pages.some((p) => p.locale === locale && p.key === 'insights');
    if (hasArticles && !hasIndexFile) routes.push({ path: localePath(locale, 'insights'), locale, kind: 'index', indexable: true, key: 'insights' });
    if (hasArticles) routes.push({ path: locale === 'ar' ? '/ar/rss.xml' : '/rss.xml', locale, kind: 'rss', indexable: false, file: true });
  }
  return routes;
}
