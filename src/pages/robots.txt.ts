import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /guyue-mingli-blog/app/\nDisallow: /guyue-mingli-blog/auth/\nSitemap: ${new URL('guyue-mingli-blog/sitemap-index.xml', site)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
