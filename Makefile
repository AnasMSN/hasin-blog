.DEFAULT_GOAL := help

.PHONY: help install dev build preview deploy clean

help: ## Show this help
	@echo "Usage: make <target>"
	@echo ""
	@echo "  install   Install dependencies"
	@echo "  dev       Start the local dev server with hot reload (http://localhost:4321)"
	@echo "  build     Build the production site into dist/"
	@echo "  preview   Build, then serve it locally through Wrangler (closest to real Cloudflare behavior)"
	@echo "  deploy    Build, then deploy to Cloudflare (needs 'npx wrangler login' once beforehand)"
	@echo "  clean     Remove build artifacts and caches"

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
