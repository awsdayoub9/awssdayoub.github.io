/** Resolves the locale-independent `related` paths of a page into links that exist in this locale. */
import { getCollection } from 'astro:content';
import { t, td, localeUrl, pathToKey, type Locale } from '../i18n';
import { getPage, hasInsights } from './pages';

export interface RelatedLink { href: string; eyebrow: string; title: string }

export async function resolveRelated(locale: Locale, paths: string[]): Promise<RelatedLink[]> {
  const c = t(locale);
  const d = td(locale);
  const out: RelatedLink[] = [];
  for (const raw of paths) {
    const key = pathToKey(raw);
    if (key === '') { out.push({ href: localeUrl(locale), eyebrow: c.nav.home, title: c.hero.h1 }); continue; }
    if (key.startsWith('work/')) {
      const slug = key.slice(5);
      const [e] = await getCollection('engagements', (x) => x.data.lang === locale && x.data.key === slug);
      if (e) out.push({ href: localeUrl(locale, key), eyebrow: e.data.sector, title: e.data.title });
      continue;
    }
    if (key === 'insights') {
      if (await hasInsights(locale)) {
        const idx = await getPage(locale, 'insights');
        out.push({ href: localeUrl(locale, key), eyebrow: idx?.data.breadcrumb ?? d.insights.breadcrumb, title: idx?.data.h1 ?? d.insights.h1 });
      }
      continue;
    }
    const page = await getPage(locale, key);
    if (page) out.push({ href: localeUrl(locale, key), eyebrow: page.data.breadcrumb, title: page.data.h1 });
  }
  return out;
}
