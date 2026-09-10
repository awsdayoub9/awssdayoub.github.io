/** getStaticPaths helpers: every content-driven route derives from the `pages` collection, so a missing or draft file simply produces no route. */
import type { Locale } from '../i18n';
import { articles, pagesFor, type PageEntry } from './pages';

/** Top-level document pages: services hub, work index, how-i-work, about, faq, privacy (insights has its own route). */
export async function topLevelPaths(locale: Locale) {
  const pages = await pagesFor(locale);
  return pages
    .filter((p) => !p.data.translationKey.includes('/') && !['insights', ''].includes(p.data.translationKey) && !['article', 'service'].includes(p.data.kind))
    .map((entry) => ({ params: { page: entry.data.translationKey }, props: { entry } }));
}

export async function servicePaths(locale: Locale) {
  const pages = await pagesFor(locale);
  return pages
    .filter((p) => p.data.kind === 'service' && p.data.translationKey.startsWith('services/'))
    .map((entry) => ({ params: { slug: entry.data.translationKey.slice('services/'.length) }, props: { entry } }));
}

/** `/insights/` (slug undefined) plus one route per article; nothing at all when no article is published. */
export async function insightPaths(locale: Locale) {
  const list = await articles(locale);
  if (!list.length) return [];
  return [
    { params: { slug: undefined }, props: { index: true as const, entry: undefined as PageEntry | undefined } },
    ...list.map((entry) => ({ params: { slug: entry.data.translationKey.replace(/^insights\//, '') }, props: { index: false as const, entry } })),
  ];
}

export async function feedPaths(locale: Locale) {
  return (await articles(locale)).length ? [{ params: { feed: 'rss' } }] : [];
}
