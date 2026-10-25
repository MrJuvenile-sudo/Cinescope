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

## 2026-10-25 — Phase 2 — Data and state layer
- Files changed / created:
  - Types: src/types/tmdb.ts (nullable-aware Movie, MovieDetails, Genre, Paginated, CastMember, Video, WatchlistItem, TmdbError)
  - Services: src/services/tmdbClient.ts (request<T>, JWT Bearer vs API key param auto-detection, 5-min TTL cache, abort handling, typed error kinds), src/services/movieService.ts (trending, popular, top rated, discover, search, movie details, genres)
  - Utils: src/utils/imageUrl.ts (w342, w500, w1280, w185 sizes with null fallback), src/utils/movieHelpers.ts (getYear, formatRuntime, formatRating, pickTrailer)
  - Hooks: src/hooks/useDebouncedValue.ts, src/hooks/useTmdbQuery.ts (AbortController per run, stale-guard, retry refetch)
  - State: src/context/WatchlistContext.tsx (validated lazy init, cinescope:watchlist:v1 key, cross-tab storage sync, memoised context, sonner toast feedback), src/components/movie/WatchlistButton.tsx
  - Components: src/components/common/{LoadingSkeleton, ErrorState, EmptyState, Rating, Pagination}.tsx
  - Layout & Config: src/config/tmdb.ts (WATCHLIST_STORAGE_KEY), src/components/layout/Header.tsx (live count badge hidden at 0), src/App.tsx (WatchlistProvider wrapping router)
  - Unit Tests: src/services/tmdbClient.test.ts, src/utils/movieHelpers.test.ts, src/utils/imageUrl.test.ts, src/hooks/useDebouncedValue.test.ts, src/hooks/useTmdbQuery.test.ts, src/context/WatchlistContext.test.tsx
- What was built:
  - Complete TMDB data layer with credential auto-detection and 5-minute memory TTL caching.
  - Zero direct `fetch` calls outside `tmdbClient.ts`. Zero `any` types.
  - Robust Watchlist state with functional updates, corrupted localStorage recovery, and multi-tab synchronization.
  - Suite of accessible feedback components (`LoadingSkeleton`, `ErrorState` with credential setup guidance, `EmptyState`, `Rating`, `Pagination`).
- How verified:
  - `npm run typecheck` passed (tsc --noEmit with strict typechecking, 0 errors).
  - `npm run lint` passed (eslint with 0 errors, 0 warnings).
  - `npm test` passed (7 test files, 45 test cases covering credential logic, cache hits, error mapping, aborts, retry, watchlist, and helpers).
  - `npm run build` passed (clean production bundle).
