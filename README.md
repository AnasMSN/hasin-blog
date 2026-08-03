# hasin-blog

Anas Mahasin Nabih's personal site — CV/résumé, portfolio, and blog. Built with [Astro](https://astro.build) (TypeScript), deployed on [Cloudflare](https://developers.cloudflare.com/workers/) as a Worker with static assets. Built with English/Korean/Indonesian localization from the start. See `CLAUDE.md` for the full architecture rationale and roadmap.

> The site previously ran as a static Jekyll blog. Those files (`_posts/`, `_config.yml`, `_includes/`) are still present but no longer used to build the site — the 31 existing posts are pending migration into the new Blog page.

## Requirements

- [Node.js](https://nodejs.org/) 22+
- npm (comes with Node)

## Quick start

```bash
make install   # npm install
make dev       # start the dev server at http://localhost:4321
```

Or without `make`: `npm install && npm run dev`.

## Available commands

| Command        | What it does                                                                 |
| -------------- | ----------------------------------------------------------------------------- |
| `make install` | Install dependencies                                                          |
| `make dev`     | Start the Astro dev server with hot reload                                    |
| `make build`   | Build the production site into `dist/`                                       |
| `make preview` | Build, then serve it locally through Wrangler — closest to real Cloudflare behavior |
| `make deploy`  | Build, then deploy to Cloudflare (run `npx wrangler login` once first)        |
| `make clean`   | Remove build artifacts and caches                                             |

Run `make` with no target to see this list.

## Project structure

```
src/
  pages/            English routes (default locale, no URL prefix)
  pages/ko/          Korean routes
  pages/id/          Indonesian routes
  components/        Navbar, language switcher, per-page content components
  layouts/           BaseLayout.astro (html shell, nav, styles)
  data/cv/            CV content, one typed file per locale (en.ts, ko.ts, id.ts)
  i18n/               UI string dictionary + locale helpers
  styles/             Global CSS
public/               Static assets (images, favicon)
```

## Adding a new page

Every route needs one file per locale (English at the root, `ko/` and `id/` mirrored). Keep the page files thin — put real content in a shared component under `src/components/pages/` and import it from each locale's page file, the way `HomeContent.astro`, `PortfolioContent.astro`, and `BlogContent.astro` are used today.

## Localization

- Locales: `en` (default, unprefixed), `ko`, `id` — configured in `astro.config.mjs`.
- UI strings (nav labels, section headings, etc.) live in `src/i18n/ui.ts`.
- Page content (currently just the CV) lives in `src/data/cv/{en,ko,id}.ts`.
- The language switcher is in the main navbar and preserves the current page when switching locales.

To add a new locale: add it to `locales` in `astro.config.mjs`, add its entry to `src/i18n/ui.ts` and `src/data/cv/`, and add its page files under `src/pages/<locale>/`.

## Deployment

Hosted on Cloudflare's free tier (Workers + static assets) to stay within a ~$5/month total budget (hosting + domain) — see `CLAUDE.md` for the reasoning. To deploy:

1. `npx wrangler login` (one-time, opens a browser to authenticate with your Cloudflare account).
2. `make deploy`.

There is no CI/CD wired up yet — deploys are manual via the command above.
