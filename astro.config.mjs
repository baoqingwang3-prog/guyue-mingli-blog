// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://baoqingwang3-prog.github.io',
  base: '/guyue-mingli-blog',
  output: 'static',
  integrations: [sitemap({
    filter: (page) => !['/login/', '/auth/callback/', '/app/']
      .some((suffix) => new URL(page).pathname.endsWith(suffix)),
  })],
  vite: {
    build: { sourcemap: false },
  },
});
