import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Deployment target: Cloudflare Pages (see CLAUDE.md for the budget/architecture rationale).
// output: 'server' + per-page `prerender = true` keeps every current page fully static at
// build time, while leaving room to add real SSR routes later (admin, auth, i18n content
// APIs) without switching rendering modes again.
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'id'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
