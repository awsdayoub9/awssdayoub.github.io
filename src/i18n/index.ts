import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import en from './en.json';
import ar from './ar.json';
import docEn from './doc.en.json';
import docAr from './doc.ar.json';

export type Locale = 'en' | 'ar';
export type Dict = typeof en;
export type DocDict = typeof docEn;

const dicts: Record<Locale, Dict> = { en, ar: ar as unknown as Dict };
const docDicts: Record<Locale, DocDict> = { en: docEn, ar: docAr as unknown as DocDict };

/** Typed copy accessor: `const c = t(locale); c.hero.h1` */
export function t(locale: Locale): Dict {
  return dicts[locale];
}

/** Document-template chrome strings (src/i18n/doc.<locale>.json). */
export function td(locale: Locale): DocDict {
  return docDicts[locale];
}

/**
 * Defensive read of a dotted key ("nav.about") with an English fallback. Used by chrome that must
 * keep building while the Arabic copy file is still catching up with new keys.
 */
export function tk(locale: Locale, key: string, fallback = ''): string {
  const read = (obj: unknown): unknown => key.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
  const v = read(dicts[locale]);
  if (typeof v === 'string' && v) return v;
  const e = read(dicts.en);
  return typeof e === 'string' && e ? e : fallback;
}

export const locales: readonly Locale[] = ['en', 'ar'] as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'ar';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

export function dirOf(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** Relative URL for a locale-independent path ('' = home, 'work/slug', 'thanks'). Always trailing slash. */
export function localeUrl(locale: Locale, path = ''): string {
  return getRelativeLocaleUrl(locale, path);
}

/** Absolute URL (canonical, hreflang, og:url). */
export function absoluteUrl(locale: Locale, path = ''): string {
  return getAbsoluteLocaleUrl(locale, path);
}

/** Home-section anchor that works from any page: `/#services` or `/ar/#services`. */
export function anchorUrl(locale: Locale, id: string): string {
  return `${localeUrl(locale)}#${id}`;
}

/** '/services/odoo-migration/' or '/ar/faq/' → 'services/odoo-migration' / 'faq'; '/' → ''. */
export function pathToKey(p: string): string {
  return p.replace(/^\/?(ar\/)?/, '').replace(/^\/+|\/+$/g, '');
}

/** Replace `{token}` placeholders in a copy string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in values ? String(values[k]) : m));
}

/**
 * Isolate mixed-direction tokens (e.g. `UTC+3`) so the bidi algorithm does not reorder them
 * inside Arabic sentences. Uses LRI…PDI (U+2066/U+2069); harmless in LTR text.
 */
export function bidi(text: string): string {
  return text.replace(/UTC\+3/g, '⁦UTC+3⁩');
}

/** Split a string containing `{token}` into [before, after] for wrapping the token in markup. */
export function splitAt(template: string, token: string): [string, string] {
  const i = template.indexOf(`{${token}}`);
  if (i < 0) return [template, ''];
  return [template.slice(0, i), template.slice(i + token.length + 2)];
}

/** Long date in the page language, Gregorian calendar, Western digits (design-spec §9). */
export function formatDate(d: Date, locale: Locale): string {
  const tag = locale === 'ar' ? 'ar-u-ca-gregory-nu-latn' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

/** ISO date (YYYY-MM-DD) for datetime attributes, sitemap lastmod and JSON-LD. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
