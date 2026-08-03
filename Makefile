.DEFAULT_GOAL := help

.PHONY: help install dev build preview deploy clean \
        db-create db-migrate-local db-migrate-remote \
        bucket-create admin-create admin-create-remote

help: ## Show this help
	@echo "Usage: make <target>"
	@echo ""
	@echo "  install            Install dependencies"
	@echo "  dev                Start the local dev server with hot reload (http://localhost:4321)"
	@echo "  build              Build the production site into dist/"
	@echo "  preview            Build, then serve it locally through Wrangler (closest to real Cloudflare behavior)"
	@echo "  deploy             Build, then deploy to Cloudflare (needs 'npx wrangler login' once beforehand)"
	@echo "  clean              Remove build artifacts and caches"
	@echo ""
	@echo "  One-time production setup (after 'npx wrangler login'):"
	@echo "  db-create          Create the real D1 database on your Cloudflare account"
	@echo "  db-migrate-remote  Apply schema migrations to the real D1 database"
	@echo "  bucket-create      Create the real R2 bucket (for post images) on your Cloudflare account"
	@echo "  admin-create-remote  Create/reset the admin login on the real D1 database"
	@echo ""
	@echo "  Local dev database:"
	@echo "  db-migrate-local   Apply schema migrations to the local dev D1 (safe to re-run)"
	@echo "  admin-create       Create/reset the admin login on the local dev D1"

install: ## Install dependencies
	npm install

dev: ## Start the Astro dev server
	npm run dev

build: ## Build the production site
	npm run build

preview: build ## Build and run locally through Wrangler
	npx wrangler dev --config dist/server/wrangler.json

deploy: build ## Build and deploy to Cloudflare
	npx wrangler deploy --config dist/server/wrangler.json

clean: ## Remove build artifacts and caches
	rm -rf dist .astro

db-create: ## One-time: create the real D1 database (then copy its database_id into wrangler.jsonc)
	npx wrangler d1 create hasin-site-db

db-migrate-local: ## Apply schema migrations to the local dev D1
	npx wrangler d1 migrations apply hasin-site-db --local

db-migrate-remote: ## Apply schema migrations to the real, deployed D1
	npx wrangler d1 migrations apply hasin-site-db --remote

bucket-create: ## One-time: create the real R2 bucket for post images
	npx wrangler r2 bucket create hasin-site-images

admin-create: ## Create/reset the admin login on the local dev D1
	node scripts/create-admin.mjs

admin-create-remote: ## Create/reset the admin login on the real, deployed D1
	node scripts/create-admin.mjs --remote
