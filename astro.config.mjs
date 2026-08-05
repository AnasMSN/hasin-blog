import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Deployment target: Cloudflare Pages (see CLAUDE.md for the budget/architecture rationale).
// output: 'server' + per-page `prerender = true` keeps every current page fully static at
// build time, while leaving room to add real SSR routes later (admin, auth, i18n content
// APIs) without switching rendering modes again.
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  // We manage our own auth/session state in D1 (see src/lib/session.ts) and never use
  // Astro's built-in Astro.session API. Without an explicit driver here, the Cloudflare
  // adapter auto-provisions a KV namespace binding for that unused feature, which then
  // fails to deploy because no real KV namespace backs it.
  session: {
    driver: 'memory',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'id'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
