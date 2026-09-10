/**
 * /llms.txt — generated from the same copy and collections as the pages, so it can never list a page
 * that does not exist. Format: one H1, one blockquote, H2 sections of "- [Title](URL): description".
 * No <link> in the head points at it (seo-decisions).
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';
import { t, td, absoluteUrl, type Locale } from '../i18n';
import { articles, pagesFor } from '../seo/pages';

const strip = (title: string) => title.replace(/\s*\|\s*[^|]+$/, '');

async function section(locale: Locale, heading: string, lines: string[]) {
  return lines.length ? `## ${heading}\n${lines.join('\n')}\n` : '';
}

export async function GET(_ctx: APIContext) {
  const en = t('en');
  const ar = t('ar');
  const pages = await pagesFor('en');
  const byKey = (k: string) => pages.find((p) => p.data.translationKey === k);
  const line = (key: string, title: string, description: string) => `- [${strip(title)}](${absoluteUrl('en', key)}): ${description}`;

  const services = ['services', ...pages.filter((p) => p.data.kind === 'service').map((p) => p.data.translationKey)]
    .map((k) => byKey(k))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => line(p.data.translationKey, p.data.title, p.data.description));

  const engagements = (await getCollection('engagements', (e) => e.data.lang === 'en')).sort((a, b) => a.data.order - b.data.order);
  const work = byKey('work');
  const cases = [
    ...(work ? [line('work', work.data.title, work.data.description)] : []),
    ...engagements.map((e) => {
      const seo = en.seo[e.data.key as keyof typeof en.seo] as { title: string; description: string };
      return line(`work/${e.data.key}`, seo.title, seo.description);
    }),
  ];

  const about = ['about', 'how-i-work', 'faq', 'privacy'].map((k) => byKey(k)).filter((p): p is NonNullable<typeof p> => !!p).map((p) => line(p.data.translationKey, p.data.title, p.data.description));

  const posts = await articles('en');
  const insights = posts.length
    ? [line('insights', td('en').insights.title, td('en').insights.description), ...posts.map((p) => line(p.data.translationKey, p.data.title, p.data.description))]
    : [];

  const arabic = [`- [${strip(ar.seo.home.title)}](${absoluteUrl('ar')}): ${ar.seo.home.description}`];

  const body = [
    `# ${en.site.name} — ${en.jsonld.job_title}`,
    '',
    `> ${en.hero.lead}`,
    '',
    `${en.footer.description} ${en.contact.hours}`,
    `Contact: WhatsApp ${site.phoneDisplay}, ${site.email}, ${site.linkedinLabel}, ${site.githubLabel}.`,
    '',
    await section('en', en.nav.services, services),
    await section('en', en.nav.work, cases),
    await section('en', en.nav.about, about),
    await section('en', td('en').insights.breadcrumb, insights),
    await section('en', ar.lang.switch_label === 'English' ? 'العربية' : en.lang.switch_label, arabic),
  ].join('\n').replace(/\n{3,}/g, '\n\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
