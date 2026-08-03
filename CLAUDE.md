# hasin-blog — project context

## What this is becoming

A personal, multi-purpose website for Hasin — not just a blog. It replaces the current static Jekyll blog with a dynamic site that will eventually showcase professional work, host a blog, and be self-administrable. Migration happens **incrementally**, one small piece at a time, not as a big-bang rewrite.

## Current state (as of 2026-08-03)

Astro scaffolding is live (see `README.md` for the full project structure and commands):
- Public site: home (CV, from `src/data/cv/{en,ko,id}.ts`), portfolio (placeholder), blog (placeholder) — all three localized (en/ko/id), all statically prerendered.
- Admin: `/admin` (password-protected) can create blog posts — title/date/categories matching the old `_posts` frontmatter shape, plus a markdown body that supports inline images (EasyMDE editor, uploads to R2). Backed by D1 (`migrations/0001_init.sql`: `admin_users`, `sessions`, `login_attempts`, `posts`) and R2 (`POST_IMAGES` binding, served publicly via `src/pages/uploads/[...key].ts`).
- **Gap to close next**: the public `/blog` page does not yet read from the `posts` table — it's still the placeholder. Posts created via `/admin` aren't visible anywhere publicly yet. The 31 original Jekyll posts under `_posts/` also haven't been migrated into D1.
- The legacy Jekyll files (`_posts/`, `_config.yml`, `_includes/`, root `index.md`) are still present and untouched, no longer used to build the site.

See "Admin auth" below for why the auth design deviated from the original Cloudflare Access plan.

## Hard constraint: budget

**Max $5/month total**, cloud hosting + domain combined. This drives every infra decision below — always prefer $0-cost / generous-free-tier options over anything metered that could grow past this ceiling.

## Tech stack (decided 2026-08-03)

- **Language: TypeScript, mono-language.** One language across frontend, backend/API, and admin panel — no context-switching, single toolchain, solo-maintainer friendly.
- **Framework: Astro.** Renders to static HTML by default and only hydrates interactive pieces as islands (e.g. the admin panel) — keeps the public-facing pages essentially free to serve and matches the "very light / low resource" requirement. Its content-collections model is also a natural fit for migrating the existing markdown posts.
- **Hosting: Cloudflare** (Pages/Workers unified) — realistic cost **$0/month** for this traffic level (Workers free tier: 100k req/day).
- **Database: Cloudflare D1** (SQLite at the edge) — free up to 5GB. Used for posts/content once blogging moves off flat markdown, and later for admin config, i18n strings, etc.
- **Object storage: Cloudflare R2** — free up to 10GB, no egress fees. Used for images/assets.
- **Domain: Cloudflare registrar (or Porkbun)** — at-cost, no renewal markup, ~$9–12/year (<$1/month). This is effectively the entire monthly budget spend.
- **Admin auth (built 2026-08-03): custom password + server-side session**, not Cloudflare Access as originally planned — the site isn't deployed behind a Cloudflare zone yet, so Access (which protects a hostname at the edge) wasn't usable, and the user explicitly wanted an in-app login page. Layering Cloudflare Access on top later, once there's a real domain, remains a reasonable defense-in-depth addition — it wouldn't conflict with the in-app auth.

Known tradeoff accepted: Cloudflare Workers runtime constraints (no long-running processes, subset of Node APIs, some vendor lock-in) in exchange for near-zero cost and zero server maintenance.

### Admin auth design — read before touching `src/lib/password.ts` or `src/middleware.ts`

**Cloudflare Workers' free tier caps CPU time at 10ms per request.** A properly-parameterized password KDF (Argon2id, or even PBKDF2 at OWASP-recommended iteration counts) takes 100s of ms — nowhere close. The fix, and the reason the login flow looks two-step: the browser does the expensive 600k-iteration PBKDF2-SHA256 stretch (its own CPU, no Workers billing implication, ~300ms, imperceptible for a login click); the Worker only ever does one cheap SHA-256 on top before comparing to the stored hash. This preserves full brute-force resistance (an attacker must still replicate the same 600k-iteration step per guess) while fitting the CPU budget, and it also means a stolen D1 row can't be replayed directly as a login credential (see `src/lib/password.ts` for the full writeup). **Do not "simplify" this back to a single server-side hash step** — that either breaks on the free tier (CPU limit) or requires upgrading to Workers Paid ($5/mo on its own, blowing the total budget).

There is deliberately **no web-based admin signup/setup/password-reset route**. The only way to create or reset the admin account is `scripts/create-admin.mjs`, run locally against D1 via Wrangler. Don't add an HTTP-reachable bootstrap endpoint for this even for convenience — it's the main piece of attack surface this design avoids.

## Target site structure (roadmap, build incrementally)

1. ✅ **Home page** — CV/résumé style: professional introduction, photo. (Content is the "Research PhD" CV variant; Indonesian copy is a first-pass translation flagged for review, see `src/data/cv/id.ts`.)
2. 🚧 **Portfolio page** — index of projects/work done. Route + i18n scaffolding exist; content is still a placeholder.
3. ⬜ **Per-project pages** — each portfolio entry gets its own page.
   - Some are simple redirects to an external site/repo.
   - Some are light enough to live inside this same repo as an embedded mini-project/showcase.
4. 🚧 **Blog** — admin can write posts into D1 (with inline images) as of 2026-08-03, but the public `/blog` page doesn't render them yet, and the 31 original Jekyll posts under `_posts/` haven't been migrated in. Both are the natural next step here.
5. 🚧 *(Started early, ahead of schedule)* **Admin page** — post creation exists (`/admin`, `/admin/posts/new`) with real auth (see "Admin auth design" above). Site-wide config/settings editing is not built yet.
6. ✅ **Localization** — English (default), Korean, Indonesian, built in from the start via Astro's native i18n routing + a small string dictionary (`src/i18n/`). Adding a page still means adding it per-locale; adding a new locale is cheap (see README).
7. ⬜ *(Later, lower priority)* **Marketing page(s)** for products.

Item 4 (finishing the blog: render D1 posts publicly + migrate the old Jekyll posts) is the natural next step. Items 3 and 7 remain deferred and should not be over-engineered for prematurely.

## Working conventions

- Keep every addition consistent with the $5/month ceiling — flag it clearly if a requested feature would risk exceeding Cloudflare free tiers or require a paid add-on.
- Prefer static rendering wherever content doesn't need to be dynamic; only reach for D1/server logic where truly needed (admin, auth, i18n lookups).
- No premature scope: build in the order of the roadmap above unless told otherwise.
