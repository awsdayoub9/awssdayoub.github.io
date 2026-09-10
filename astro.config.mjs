// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { satteriDocPlugin } from './src/markdown/satteri-doc.mjs';
import { lastmodMap } from './scripts/lib/content-index.mjs';

// path → ISO date, read from the `updated` frontmatter of pages and engagements only (seo-decisions).
const lastmod = lastmodMap();

// https://astro.build/config
export default defineConfig({
  site: 'https://awsdayoub9.github.io',
  trailingSlash: 'always',
  compressHTML: 'jsx',
  build: { inlineStylesheets: 'never' }, // 'always' drops the stylesheet entirely in Astro 7.3.1
  prefetch: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Sätteri (Astro 7's native processor) with the document-page plugin: locale-aware links, ledger tables, FAQ <details>.
    processor: satteri({ hastPlugins: [satteriDocPlugin] }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      weights: [500],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      display: 'swap',
      optimizedFallbacks: true,
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      display: 'swap',
      optimizedFallbacks: true,
      fallbacks: ['Segoe UI', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      display: 'swap',
      optimizedFallbacks: true,
      fallbacks: ['Consolas', 'Cascadia Mono', 'monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans Arabic',
      cssVariable: '--font-arabic',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['arabic', 'latin'],
      formats: ['woff2'],
      // 'optional': the generated fallback face is metric-matched on Latin glyphs only, so an Arabic swap always
      // re-wraps the hero lead (CLS 0.14 on /ar/). The Arabic faces are preloaded; when they arrive within the block
      // period they paint first, otherwise the system Arabic stack stays for that view and the font is cached.
      display: 'optional',
      optimizedFallbacks: true,
      fallbacks: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', ar: 'ar' } },
      // Drafts are never built, so they never reach the sitemap; thanks and 404 are dropped here.
      filter: (page) => !/\/thanks\/$/.test(page) && !/\/404/.test(page),
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname;
        // lastmod ONLY from the per-page `updated` frontmatter (pages and engagements); nothing else emits one.
        if (lastmod[path]) item.lastmod = lastmod[path];
        else delete item.lastmod;
        // The integration lists the locale pair but never x-default; pages without a twin list themselves.
        const locale = /^\/ar(\/|$)/.test(path) ? 'ar' : 'en';
        if (!item.links?.length) item.links = [{ lang: locale, url: item.url }];
        const en = item.links.find((l) => l.lang === 'en') ?? item.links[0];
        if (!item.links.some((l) => l.lang === 'x-default')) item.links.push({ lang: 'x-default', url: en.url });
        return item;
      },
    }),
  ],
});
