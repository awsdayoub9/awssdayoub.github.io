import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localeSchema = z.enum(['en', 'ar']);

/**
 * Engagements: one entry per engagement per locale (`<slug>.<locale>.md`).
 * Reduced schema per build-decisions A6 (no phase tracks). Node geometry and
 * labels live in src/data/schematics/<slug>.json, not here.
 */
const engagements = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/engagements' }),
  schema: ({ image }) =>
    z.object({
      /** URL slug shared by the EN and AR entries (`slug` itself is reserved by the glob loader). */
      key: z.string(),
      order: z.number().int().min(1),
      lang: localeSchema,
      sector: z.string(),
      title: z.string(),
      status: z.enum(['production', 'deployment', 'progress']),
      status_label: z.string(),
      period: z.string(),
      client: z.string(),
      /** Employment attribution line (build-decisions / seo-decisions): who employed Aws when the work was delivered. */
      attribution: z.string().default(''),
      role: z.string(),
      situation: z.string(),
      situation_detail: z.string(),
      approach: z.string(),
      scope: z.string(),
      delivered: z.string(),
      stack: z.array(z.string()).max(6),
      odoo_version: z.string().default(''),
      /** Last content revision of this file: the only source of sitemap lastmod and Article.dateModified (seo-decisions). */
      updated: z.coerce.date().optional(),
      record: z.object({
        version: z.string(),
        modules: z.array(z.string()),
        integrations: z.array(z.string()),
        role: z.string(),
        status: z.string(),
      }),
      schematic_alt: z.string(),
      detail_note: z.string().default(''),
      titleblock: z.object({
        project: z.string(),
        odoo: z.string(),
        status: z.string(),
        role: z.string(),
      }),
      screenshots: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string() }))
        .default([]),
    }),
});

/** Testimonials: intentionally empty until real, approved quotes exist. */
const testimonials = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/testimonials' }),
  schema: z.object({
    lang: localeSchema,
    quote: z.string().max(280),
    name: z.string().max(40),
    role: z.string().max(60),
    company: z.string().max(60),
    approved: z.boolean().default(false),
  }),
});

export const pageKinds = ['hub', 'service', 'index', 'method', 'about', 'faq', 'privacy', 'article'] as const;

/**
 * Pages: every document-style page (services hub and pages, work index, method, FAQ, privacy,
 * insights articles). File name: `<translationKey with "/" replaced by "__">.<locale>.md`, body = Markdown.
 * One shared layout (DocPage) renders every kind. `draft: true` removes the page from routes,
 * sitemap and RSS. The About page renders from the `about` object in src/i18n/*.json instead.
 */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    lead: z.string(),
    og_alt: z.string(),
    locale: localeSchema,
    /** The page slug shared by both locales: "services/odoo-migration", "faq", "insights/<slug>". */
    translationKey: z.string(),
    kind: z.enum(pageKinds),
    updated: z.coerce.date(),
    pubDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    breadcrumb: z.string(),
    /** Locale-independent paths ("/services/odoo-support/"); resolved per locale and dropped when the target is missing. */
    related: z.array(z.string()).default([]),
    questions: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    cta: z.object({
      heading: z.string(),
      body: z.string(),
      whatsapp_label: z.string(),
      email_label: z.string(),
    }),
    draft: z.boolean().default(false),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }),
});

export const collections = { engagements, testimonials, pages };
