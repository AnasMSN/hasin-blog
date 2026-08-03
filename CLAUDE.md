# hasin-blog — project context

## What this is becoming

A personal, multi-purpose website for Hasin — not just a blog. It replaces the current static Jekyll blog with a dynamic site that will eventually showcase professional work, host a blog, and be self-administrable. Migration happens **incrementally**, one small piece at a time, not as a big-bang rewrite.

## Current state (as of 2026-08)

Still the original static Jekyll blog: `minima` theme, GitHub Pages "deploy from branch", posts as markdown files under `_posts/YYYY/MM/`, no backend, no admin, no build tooling (no Gemfile/CI). Nothing on the target stack below has been built yet — this file describes where the project is headed, not what exists today.

## Hard constraint: budget

**Max $5/month total**, cloud hosting + domain combined. This drives every infra decision below — always prefer $0-cost / generous-free-tier options over anything metered that could grow past this ceiling.

## Tech stack (decided 2026-08-03)

- **Language: TypeScript, mono-language.** One language across frontend, backend/API, and admin panel — no context-switching, single toolchain, solo-maintainer friendly.
- **Framework: Astro.** Renders to static HTML by default and only hydrates interactive pieces as islands (e.g. the admin panel) — keeps the public-facing pages essentially free to serve and matches the "very light / low resource" requirement. Its content-collections model is also a natural fit for migrating the existing markdown posts.
- **Hosting: Cloudflare** (Pages/Workers unified) — realistic cost **$0/month** for this traffic level (Workers free tier: 100k req/day).
- **Database: Cloudflare D1** (SQLite at the edge) — free up to 5GB. Used for posts/content once blogging moves off flat markdown, and later for admin config, i18n strings, etc.
- **Object storage: Cloudflare R2** — free up to 10GB, no egress fees. Used for images/assets.
- **Domain: Cloudflare registrar (or Porkbun)** — at-cost, no renewal markup, ~$9–12/year (<$1/month). This is effectively the entire monthly budget spend.
- **Admin auth (when built): Cloudflare Access** (free for personal use, up to 50 users) preferred over rolling custom auth, unless requirements outgrow it.

Known tradeoff accepted: Cloudflare Workers runtime constraints (no long-running processes, subset of Node APIs, some vendor lock-in) in exchange for near-zero cost and zero server maintenance.

## Target site structure (roadmap, build incrementally)

1. **Home page** — CV/résumé style: professional introduction, photo.
2. **Portfolio page** — index of projects/work done.
3. **Per-project pages** — each portfolio entry gets its own page.
   - Some are simple redirects to an external site/repo.
   - Some are light enough to live inside this same repo as an embedded mini-project/showcase.
4. **Blog** — migrated from the current Jekyll `_posts`, kept as a feature within the same site rather than a separate one.
5. *(Later)* **Admin page** — configure site content/settings without editing code directly.
6. *(Later)* **Localization** — English, Korean (한국어), Indonesian.
7. *(Later, lower priority)* **Marketing page(s)** for products.

Items 1–4 are the near-term focus; 5–7 are explicitly deferred and should not be over-engineered for prematurely (e.g. don't build i18n plumbing before there's content to localize).

## Working conventions

- Keep every addition consistent with the $5/month ceiling — flag it clearly if a requested feature would risk exceeding Cloudflare free tiers or require a paid add-on.
- Prefer static rendering wherever content doesn't need to be dynamic; only reach for D1/server logic where truly needed (admin, auth, i18n lookups).
- No premature scope: build in the order of the roadmap above unless told otherwise.
