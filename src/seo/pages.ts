/**
 * Lookups over the `pages` collection shared by routes, DocPage, Header/Footer and the RSS feeds.
 * Drafts are invisible everywhere unless PUBLISH_DRAFTS=1 is set for a local preview build.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { anchorUrl, localeUrl, otherLocale, t, td, type Locale } from '../i18n';

export type PageEntry = CollectionEntry<'pages'>;
export type PageKind = PageEntry['data']['kind'];
export type NavKey = 'services' | 'work' | 'process' | 'about' | 'faq' | 'contact' | 'privacy' | 'insights';

const includeDrafts = process.env.PUBLISH_DRAFTS === '1';

export async function allPages(): Promise<PageEntry[]> {
  return getCollection('pages', (e) => includeDrafts || !e.data.draft);
}

export async function pagesFor(locale: Locale): Promise<PageEntry[]> {
  return (await allPages()).filter((e) => e.data.locale === locale);
}

export async function getPage(locale: Locale, key: string): Promise<PageEntry | undefined> {
  return (await allPages()).find((e) => e.data.locale === locale && e.data.translationKey === key);
}

/** Articles of one locale, newest first. */
export async function articles(locale: Locale): Promise<PageEntry[]> {
  return (await pagesFor(locale))
    .filter((e) => e.data.kind === 'article')
    .sort((a, b) => (b.data.pubDate ?? b.data.updated).getTime() - (a.data.pubDate ?? a.data.updated).getTime());
}

/** Whether the insights index exists in this locale (only when at least one article is published). */
export async function hasInsights(locale: Locale): Promise<boolean> {
  return (await articles(locale)).length > 0;
}

/** Keys that exist in both locales regardless of the collection (routes the code always builds). */
const ALWAYS_TWINNED = new Set(['', 'thanks']);

/** True when the same page exists in the other locale (drives hreflang and the language switcher). */
export async function hasTwin(locale: Locale, key: string): Promise<boolean> {
  if (ALWAYS_TWINNED.has(key)) return true;
  const other = otherLocale(locale);
  if (key.startsWith('work/')) {
    const slug = key.slice(5);
    return (await getCollection('engagements', (e) => e.data.lang === other && e.data.key === slug)).length > 0;
  }
  if (key === 'insights') return (await getPage(other, 'insights')) !== undefined || (await hasInsights(other));
  return (await getPage(other, key)) !== undefined;
}

/**
 * Href of a locale-independent page key, falling back to a home anchor (or the home page) when the
 * page does not exist in this locale yet, so navigation never links to a missing route.
 */
export async function pageHref(locale: Locale, key: string, fallbackAnchor?: string): Promise<string> {
  if (key === '') return localeUrl(locale);
  if (key === 'insights') return (await hasInsights(locale)) ? localeUrl(locale, key) : localeUrl(locale);
  if (key.startsWith('work/')) return localeUrl(locale, key);
  if (await getPage(locale, key)) return localeUrl(locale, key);
  return fallbackAnchor ? anchorUrl(locale, fallbackAnchor) : localeUrl(locale);
}

/** Href of a page key only when that page exists in this locale, else '' (for optional "more" links). */
export async function pageLink(locale: Locale, key: string): Promise<string> {
  return (await getPage(locale, key)) ? localeUrl(locale, key) : '';
}

export interface NavItem { key: NavKey; href: string; label: string }

/** The six primary items (Services, Work, How I work, About, FAQ, Contact) with page-aware hrefs. */
export async function navItems(locale: Locale): Promise<NavItem[]> {
  const c = t(locale);
  const en = t('en');
  const label = (k: keyof typeof c.nav) => (c.nav[k] as string | undefined) ?? en.nav[k];
  return [
    { key: 'services', href: await pageHref(locale, 'services', 'services'), label: label('services') },
    { key: 'work', href: await pageHref(locale, 'work', 'work'), label: label('work') },
    { key: 'process', href: await pageHref(locale, 'how-i-work', 'process'), label: label('process') },
    { key: 'about', href: await pageHref(locale, 'about'), label: label('about') },
    { key: 'faq', href: await pageHref(locale, 'faq', 'faq'), label: label('faq') },
    { key: 'contact', href: anchorUrl(locale, 'contact'), label: label('contact') },
  ];
}

/** Nav key highlighted (`aria-current`) for a page kind. */
export function currentFor(kind: PageKind): NavKey | undefined {
  switch (kind) {
    case 'hub':
    case 'service': return 'services';
    case 'index': return 'work';
    case 'method': return 'process';
    case 'about': return 'about';
    case 'faq': return 'faq';
    case 'privacy': return 'privacy';
    case 'article': return 'insights';
    default: return undefined;
  }
}

/** Parent crumb of a page key: services/* → the hub, insights/* → the index, otherwise none. */
export async function parentOf(locale: Locale, key: string): Promise<{ label: string; href: string; key: string } | undefined> {
  const c = t(locale);
  if (key.startsWith('services/')) {
    const hub = await getPage(locale, 'services');
    return { key: 'services', label: hub?.data.breadcrumb ?? c.nav.services, href: await pageHref(locale, 'services', 'services') };
  }
  if (key.startsWith('insights/')) {
    const idx = await getPage(locale, 'insights');
    return { key: 'insights', label: idx?.data.breadcrumb ?? td(locale).insights.breadcrumb, href: await pageHref(locale, 'insights') };
  }
  if (key.startsWith('work/')) {
    const idx = await getPage(locale, 'work');
    return { key: 'work', label: idx?.data.breadcrumb ?? c.nav.work, href: await pageHref(locale, 'work', 'work') };
  }
  return undefined;
}
