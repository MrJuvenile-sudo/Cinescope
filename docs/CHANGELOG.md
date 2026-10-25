# Changelog (append-only, newest at bottom)
Format: ## YYYY-MM-DD — Phase N — title / Files changed / What was built / How verified

## Phase 0 — Bootstrap
- Created AGENTS.md, .agents/rules/00-03, .agents/workflows/*, docs/*.

## 2026-10-25 — Phase 1 — Scaffold, premium foundation, routing, layout
- Files changed / created:
  - Configuration: package.json, vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json, eslint.config.js, .env.example, .gitignore, vercel.json, public/_redirects, public/clapperboard.svg, index.html
  - Styling: src/index.css (Midnight Cinema design tokens, atmosphere glow, 3% grain, custom scrollbars, focus ring)
  - Config & hooks: src/config/tmdb.ts, src/hooks/useDocumentTitle.ts
  - Primitives: src/components/common/{Button, Chip, SectionHeading, Divider}.tsx
  - Layout: src/components/layout/{Header, Footer, Layout, MobileNav, ScrollToTop}.tsx
  - Pages: src/pages/{Home, Discover, Search, MovieDetails, Watchlist, About, Contact, NotFound}.tsx
  - App & Tests: src/App.tsx, src/main.tsx, src/vite-env.d.ts, src/test/setup.ts, src/App.test.tsx
- What was built:
  - React 18 + Vite + TypeScript strict scaffold with @tailwindcss/vite and Vitest.
  - Complete Midnight Cinema dark design system with CSS custom properties and Google Fonts (Playfair Display + Inter).
  - Declarative client-side routing across all 8 routes with path-only ScrollToTop.
  - Sticky glass header with brand wordmark, nav links, active underline indicator, watchlist badge, and accessible mobile sheet drawer.
  - Full footer with TMDB text-only attribution and legal compliance.
  - Production SPA rewrite rules for Netlify and Vercel.
- How verified:
  - `npm run typecheck` passed (tsc --noEmit clean).
  - `npm run lint` passed (eslint clean, 0 warnings, 0 errors).
  - `npm test` passed (Vitest App smoke test & 404 test passed).
  - `npm run build` passed (production bundle compiled cleanly to dist/).
  - Vite dev server tested across all 8 routes returning 200 OK.
