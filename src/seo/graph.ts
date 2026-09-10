/**
 * Single source of every JSON-LD node (seo-decisions.md, on-page rules → Schema):
 *  - WebSite + Person (worksFor iLines Solutions; no ZATCA in knowsAbout) + ProfessionalService
 *    (with address; serviceType = implementation, customization, migration, integration, support) on every page;
 *  - a WebPage-family node per page (ProfilePage on /about/);
 *  - BreadcrumbList on every non-home page;
 *  - Article on case studies and insights (image = the locale's OG PNG);
 *  - FAQPage only on /faq/.
 * BaseLayout merges the shared nodes with the page's nodes into ONE <script type="application/ld+json">.
 * CV facts only: never ratings, reviews, counts, prices or credentials schema.
 */
import { site, ogImage } from '../config/site';
import { t, absoluteUrl, type Locale } from '../i18n';

export type Node = Record<string, unknown>;

export const ID = {
  person: `${site.url}/#person`,
  service: `${site.url}/#service`,
  website: `${site.url}/#website`,
} as const;

export function website(locale: Locale): Node {
  const j = t(locale).jsonld;
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${site.url}/`,
    name: j.person_name,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': ID.person },
  };
}

export function person(locale: Locale): Node {
  const j = t(locale).jsonld;
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: j.person_name,
    alternateName: j.person_alternate_name,
    jobTitle: j.job_title,
    email: `mailto:${site.email}`,
    telephone: `+${site.phoneDigits}`,
    url: `${site.url}/`,
    image: `${site.url}/og/portrait.jpg`,
    address: { '@type': 'PostalAddress', addressLocality: 'Latakia', addressCountry: 'SY' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Tishreen University' },
    knowsLanguage: ['ar', 'en', 'de'],
    knowsAbout: j.knows_about,
    worksFor: {
      '@type': 'Organization',
      name: 'iLines Solutions',
      address: { '@type': 'PostalAddress', addressLocality: 'Riyadh', addressCountry: 'SA' },
    },
    sameAs: [site.linkedin, site.github],
  };
}

export function professionalService(locale: Locale): Node {
  const j = t(locale).jsonld;
  return {
    '@type': 'ProfessionalService',
    '@id': ID.service,
    name: j.service_name,
    url: `${site.url}/`,
    image: `${site.url}/og/portrait.jpg`,
    telephone: `+${site.phoneDigits}`,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Latakia', addressCountry: 'SY' },
    founder: { '@id': ID.person },
    areaServed: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'SY'],
    availableLanguage: ['ar', 'en'],
    serviceType: j.service_types,
  };
}

/** The three nodes every indexable page carries. */
export function sharedGraph(locale: Locale): Node[] {
  return [website(locale), person(locale), professionalService(locale)];
}

interface WebPageOpts {
  locale: Locale;
  /** Locale-independent path ('' = home). */
  path: string;
  name: string;
  description: string;
  type?: 'WebPage' | 'ProfilePage' | 'CollectionPage' | 'AboutPage';
  /** ISO date; only when the page's own file carries `updated`. */
  dateModified?: string;
  datePublished?: string;
  mainEntityId?: string;
  breadcrumb?: boolean;
}

export function webPage(o: WebPageOpts): Node {
  const url = absoluteUrl(o.locale, o.path);
  return {
    '@type': o.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: o.name,
    description: o.description,
    inLanguage: o.locale,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.service },
    ...(o.datePublished ? { datePublished: o.datePublished } : {}),
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.mainEntityId ? { mainEntity: { '@id': o.mainEntityId } } : {}),
    ...(o.breadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
}

export interface Crumb { label: string; href?: string }

/** BreadcrumbList mirroring the visible trail (relative hrefs are made absolute; the current page has none). */
export function breadcrumbList(locale: Locale, path: string, items: Crumb[]): Node {
  const url = absoluteUrl(locale, path);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: new URL(it.href, site.url).href } : {}),
    })),
  };
}

interface ArticleOpts {
  locale: Locale;
  path: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  about?: string;
  mentions?: string[];
  keywords?: string[];
}

export function article(o: ArticleOpts): Node {
  const url = absoluteUrl(o.locale, o.path);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    headline: o.headline,
    description: o.description,
    inLanguage: o.locale,
    author: { '@id': ID.person },
    publisher: { '@id': ID.person },
    image: [ogImage(o.locale)],
    ...(o.datePublished ? { datePublished: o.datePublished } : {}),
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.about ? { about: { '@type': 'Thing', name: o.about } } : {}),
    ...(o.mentions?.length ? { mentions: o.mentions.map((name) => ({ '@type': 'Organization', name })) } : {}),
    ...(o.keywords?.length ? { keywords: o.keywords.join(', ') } : {}),
  };
}

export function faqPage(locale: Locale, path: string, qa: { q: string; a: string }[]): Node {
  const url = absoluteUrl(locale, path);
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
