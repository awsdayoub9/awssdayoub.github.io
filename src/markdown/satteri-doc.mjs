/**
 * Sätteri hast plugin for the Markdown bodies of the `pages` collection (Astro 7's default processor):
 *  1. Root-relative links are normalised to a trailing slash and, in Arabic files, prefixed with /ar/
 *     (writers link with locale-independent paths such as /services/odoo-support/).
 *  2. External links get rel="noopener" (same tab; only WhatsApp opens a new tab, design-spec §7.4).
 *  3. Tables are wrapped in a scrolling container so a wide ledger never scrolls the page.
 *  4. On `kind: faq` pages, each H3 question and the content that follows it become an independent
 *     <details class="faq"> (summary = the heading + plus icon; body = the following blocks), so the FAQ
 *     page reads like the home FAQ without any client JS.
 * Frontmatter comes from ctx.data.astro.frontmatter (set by Astro before the plugins run).
 */

import { expectedRoutes } from '../../scripts/lib/content-index.mjs';

const isQuestion = (text) => /[?؟]\s*$/.test(text.trim());
const raw = (value) => ({ type: 'raw', value });

function localeOf(ctx) {
  const fm = ctx.data?.astro?.frontmatter ?? {};
  if (fm.locale === 'ar' || fm.locale === 'en') return fm.locale;
  return /\.ar\.md$/.test(ctx.fileURL?.pathname ?? '') ? 'ar' : 'en';
}

/** Routes the build will emit (from the content collections on disk), so a body link to a draft or missing page is unwrapped instead of shipping a 404. */
let routes;
const isBuilt = (path) => {
  routes ??= new Set(expectedRoutes().filter((r) => !r.file).map((r) => r.path));
  return routes.has(path);
};

export const satteriDocPlugin = {
  name: 'doc-pages',
  element: [
    {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (href == null) return;
        const h = String(href);
        if (/^https?:\/\//i.test(h)) {
          if (!/\/\/awsdayoub\.github\.io(\/|$)/.test(h)) ctx.setProperty(node, 'rel', 'noopener');
          return;
        }
        if (!h.startsWith('/') || h.startsWith('//')) return;
        const [p, hash] = h.split('#');
        let clean = p;
        const isFile = /\.[a-z0-9]+$/i.test(clean);
        if (!isFile && !clean.endsWith('/')) clean += '/';
        if (localeOf(ctx) === 'ar' && !isFile && !/^\/ar(\/|$)/.test(clean)) clean = clean === '/' ? '/ar/' : `/ar${clean}`;
        if (!isFile && !isBuilt(clean)) {
          // target not published yet (draft article, missing twin): keep the words, drop the link
          ctx.replaceNode(node, { type: 'element', tagName: 'span', properties: { className: ['link-pending'] }, children: [{ type: 'text', value: ctx.textContent(node) }] });
          return;
        }
        const next = clean + (hash ? `#${hash}` : '');
        if (next !== h) ctx.setProperty(node, 'href', next);
      },
    },
    {
      filter: ['table'],
      visit(node, ctx) {
        const parent = ctx.parent(node);
        if (parent?.type === 'element' && parent.tagName === 'div' && (parent.properties?.className ?? []).includes('table-wrap')) return;
        ctx.wrapNode(node, { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [] });
      },
    },
  ],
  after(root, ctx) {
    const fm = ctx.data?.astro?.frontmatter ?? {};
    if (fm.kind !== 'faq') return;
    const kids = root.children;
    for (let i = 0; i < kids.length; i++) {
      const n = kids[i];
      if (!(n.type === 'element' && n.tagName === 'h3' && isQuestion(ctx.textContent(n)))) continue;
      let j = i + 1;
      while (j < kids.length && !(kids[j].type === 'element' && /^h[1-3]$/.test(kids[j].tagName))) j++;
      const last = kids[j - 1];
      const open = '<details class="faq"><summary>';
      const mid = '<span class="faq__icon" aria-hidden="true"></span></summary><div class="faq__body">';
      const close = '</div></details>';
      ctx.insertBefore(n, raw(open));
      if (last === n) ctx.insertAfter(n, raw(mid + close));
      else {
        ctx.insertAfter(n, raw(mid));
        ctx.insertAfter(last, raw(close));
      }
      i = j - 1;
    }
  },
};

export default satteriDocPlugin;
