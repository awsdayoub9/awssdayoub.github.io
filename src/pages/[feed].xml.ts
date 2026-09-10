/** /rss.xml — exists only when an English article is published. */
import type { APIContext } from 'astro';
import { feedFor } from '../seo/rss';
import { feedPaths } from '../seo/routes';

export async function getStaticPaths() {
  return feedPaths('en');
}
export async function GET(context: APIContext) {
  return feedFor('en', context.site);
}
