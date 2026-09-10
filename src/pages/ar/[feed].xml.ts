/** /ar/rss.xml — exists only when an Arabic article is published. */
import type { APIContext } from 'astro';
import { feedFor } from '../../seo/rss';
import { feedPaths } from '../../seo/routes';

export async function getStaticPaths() {
  return feedPaths('ar');
}
export async function GET(context: APIContext) {
  return feedFor('ar', context.site);
}
