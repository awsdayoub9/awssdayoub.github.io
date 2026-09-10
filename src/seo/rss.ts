/** One RSS feed per locale (@astrojs/rss), listing the published articles only. */
import rss from '@astrojs/rss';
import { site } from '../config/site';
import { td, localeUrl, type Locale } from '../i18n';
import { articles } from './pages';

export async function feedFor(locale: Locale, siteUrl: URL | undefined) {
  const posts = await articles(locale);
  const d = td(locale);
  return rss({
    title: d.rss.title,
    description: d.rss.description,
    site: siteUrl ?? site.url,
    trailingSlash: true,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate ?? p.data.updated,
      link: localeUrl(locale, p.data.translationKey),
    })),
    customData: `<language>${locale}</language>`,
  });
}
