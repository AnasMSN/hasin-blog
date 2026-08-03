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
  pages/              English routes (default locale, no URL prefix)
  pages/ko/           Korean routes
  pages/id/           Indonesian routes
  pages/admin/        Admin UI (login, dashboard, new post) — requires auth
  pages/api/admin/    Admin API endpoints (login, logout, posts, upload)
  pages/uploads/      Public route that serves post images out of R2
  components/         Navbar, language switcher, per-page content components
  layouts/            BaseLayout.astro (public site), AdminLayout.astro (admin UI)
  data/cv/            CV content, one typed file per locale (en.ts, ko.ts, id.ts)
  i18n/               UI string dictionary + locale helpers
  lib/                Auth/session/CSRF/rate-limit/password-hashing helpers
  middleware.ts       Protects /admin and /api/admin, adds security headers
  styles/             Global CSS + admin-specific CSS
public/               Static assets (images, favicon)
migrations/           D1 (SQLite) schema migrations
scripts/              create-admin.mjs — CLI to create/reset the admin login
wrangler.jsonc        D1 + R2 bindings (see "Admin & database setup" below)
```

## Adding a new page

Every route needs one file per locale (English at the root, `ko/` and `id/` mirrored). Keep the page files thin — put real content in a shared component under `src/components/pages/` and import it from each locale's page file, the way `HomeContent.astro`, `PortfolioContent.astro`, and `BlogContent.astro` are used today.

## Localization

- Locales: `en` (default, unprefixed), `ko`, `id` — configured in `astro.config.mjs`.
- UI strings (nav labels, section headings, etc.) live in `src/i18n/ui.ts`.
- Page content (currently just the CV) lives in `src/data/cv/{en,ko,id}.ts`.
- The language switcher is in the main navbar and preserves the current page when switching locales.

To add a new locale: add it to `locales` in `astro.config.mjs`, add its entry to `src/i18n/ui.ts` and `src/data/cv/`, and add its page files under `src/pages/<locale>/`.

## Admin & database setup

The site has a password-protected `/admin` area for writing blog posts (with inline images) without touching git. It's backed by two Cloudflare resources — D1 (a SQLite database, for posts/sessions/the admin login) and R2 (object storage, for uploaded images) — both free at this site's traffic level.

**Local development** (already done once for you, safe to re-run):

```bash
make db-migrate-local   # creates the local dev database tables
make admin-create       # prompts for a username + password (min 12 chars)
```

Then `make dev` and open `http://localhost:4321/admin/login`.

**First-time production setup** (after `npx wrangler login`):

```bash
make db-create          # creates the real D1 database — copy the printed database_id
                         # into wrangler.jsonc's d1_databases[0].database_id
make bucket-create       # creates the real R2 bucket for post images
make db-migrate-remote   # applies the schema to the real database
make admin-create-remote # prompts for a username + password for production
```

After that, `make deploy` works as normal.

### How admin login security works

- **No password is ever sent to or stored on the server as-is.** The browser derives a 600,000-iteration PBKDF2-SHA256 hash of the password *client-side* before sending it — this is a deliberate design choice: Cloudflare Workers' free tier caps CPU time at 10ms per request, far too little for a proper password KDF, so the expensive step runs on your own device (free, and no per-request billing implication) instead. The server only ever does one cheap SHA-256 on top of that before comparing, so a stolen database row can't be replayed as a login credential either.
- Sessions are random tokens stored server-side in D1, referenced by an `httpOnly`, `Secure` (in production), `SameSite=Strict` cookie — the cookie itself never carries anything meaningful.
- CSRF is covered two ways: Astro's built-in same-origin check on state-changing requests, plus our own double-submit CSRF token on login/post/upload endpoints.
- Failed logins are rate-limited (5 attempts per IP+username per 15 minutes) using generic error messages that don't reveal whether an account exists.
- There is **no web-based account signup/reset route** — the only way to create or reset the admin login is `scripts/create-admin.mjs`, run locally by you. This removes an entire class of attack surface (there's nothing for an attacker to reach over HTTP to bootstrap or take over the account).
- Uploaded images are validated by their actual file signature (magic bytes), not the filename or the browser-supplied content type, and SVG is deliberately not accepted (a common image-upload XSS vector).

## Deployment

Hosted on Cloudflare's free tier (Workers + static assets + D1 + R2) to stay within a ~$5/month total budget (hosting + domain) — see `CLAUDE.md` for the reasoning. To deploy:

1. `npx wrangler login` (one-time, opens a browser to authenticate with your Cloudflare account).
2. Complete the one-time production setup above if you haven't yet.
3. `make deploy`.

There is no CI/CD wired up yet — deploys are manual via the command above.
