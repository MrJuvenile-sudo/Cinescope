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

## 2026-10-25 — Phase 3 — Discover (assignment centerpiece)
- Files changed / created:
  - Logic & URL State: src/utils/discoverUrlState.ts (parseDiscoverParams, buildDiscoverParams, toTmdbParams, DEFAULTS, validation, vote_count.gte=50 rule for vote_average.desc), src/utils/discoverUrlState.test.ts (9 tests)
  - Components: src/components/movie/MovieCard.tsx (2/3 aspect poster, glass rating pill, circular glass WatchlistButton, hover lift & crimson glow, metadata, lazy images, fallback poster), src/components/movie/MovieGrid.tsx (responsive columns 2/3/4/5/6 with staggered entry), src/components/common/FilterPanel.tsx (glass panel, custom selects for genre, year, rating, sort, reset button)
  - Page: src/pages/Discover.tsx (URL single source of truth, canonical normalization with replace:true, dynamic heading based on genre and year, total results count, 12-card LoadingSkeleton, ErrorState with Retry, EmptyState, clamped Pagination, page change scroll-to-top, dev-only TMDB query inspector)
  - Tests: src/pages/Discover.test.tsx (4 tests verifying URL sync, filter changes resetting page to 1, error state, and empty state), src/test/setup.ts (Element.prototype.scrollIntoView mock for jsdom), src/App.test.tsx
- What was built:
  - Complete parametric movie discovery engine strictly synchronized with the URL.
  - Guaranteed default request mapping: `/discover/movie?with_genres=35&primary_release_year=2025&vote_average.gte=7.0&sort_by=popularity.desc&page=1`.
  - Seamless filter updates resetting pagination to page 1.
  - Full error and setup recovery state for missing credential or offline network failure.
- How verified:
  - `npm run typecheck` passed (tsc --noEmit, 0 errors).
  - `npm run lint` passed (eslint, 0 errors, 0 warnings).
  - `npm test` passed (9 test files, 58 tests passed).
  - `npm run build` passed (production build in dist/).
  - Dev server tested for `/discover` responding 200 OK.

## 2026-10-25 — Phase 4 — Home and Search
- Files changed / created:
  - Components: src/components/movie/MovieHero.tsx (featured trending backdrop, dual gradients, Ken-Burns zoom, meta info, CTAs, loading skeleton, and graceful fallback), src/components/movie/MovieRow.tsx (scroll-snap reel, keyboard focusable, md+ arrow navigation buttons, edge fades, hidden scrollbar, independent loading & error states), src/components/common/SearchBar.tsx (compact and large variants, role="search", clear button, form submission)
  - Pages & Navigation: src/pages/Home.tsx (MovieHero, Trending / Popular / Top Rated independent rows, 8 genre shortcut chips with URL generator, and recent watchlist strip), src/pages/Search.tsx (400ms debounce, URL query synchronization with replace:true, minimum 2-character validation hint, aria-live status message, idle/loading/results/empty/error states, clamped pagination), src/components/layout/Header.tsx (wired active compact SearchBar navigating to /search?q=)
  - Tests: src/components/common/SearchBar.test.tsx (5 tests), src/pages/Search.test.tsx (5 tests)
- What was built:
  - Complete cinematic Home experience with independent row loading, genre navigation, and personal watchlist preview.
  - Fully debounced title search page strictly following rule 02 (400ms debounce, minimum 2 chars, URL synchronization, live screen reader announcements, zero unneeded network requests).
- How verified:
  - `npm run typecheck` passed (tsc --noEmit clean, 0 errors).
  - `npm run lint` passed (eslint clean, 0 warnings, 0 errors).
  - `npm test` passed (11 test files, 68 tests passed).
  - `npm run build` passed (production bundle compiled cleanly in dist/).
  - Vite dev server tested for Home (`/`) and Search (`/search?q=Dune`) responding 200 OK.

## 2026-10-25 — Phase 5 — Movie Details dossier, trailer modal, and Watchlist management
- Files changed / created:
  - Components: src/components/movie/CastList.tsx (top 12 billed cast, w185 profiles with initials fallback, responsive grid, hides if empty), src/components/movie/TrailerModal.tsx (accessible dialog, focus trap, Escape key listener, YouTube nocookie embed with external fallback), src/components/movie/TrailerButton.tsx (picks best trailer, primary/secondary/glass variants, auto-hides if no video), src/components/common/SectionHeading.tsx (added id prop for aria-labelledby bindings)
  - Pages: src/pages/MovieDetails.tsx (strict numeric ID guard, single request via getMovieDetails with credits, videos, and similar appended, cinematic backdrop with dual gradients, w500 poster, tagline, runtime, rating, director, interactive genre badges linking to Discover, CastList, similar MovieRow, error and 404 recovery), src/pages/Watchlist.tsx (reads WatchlistContext, live count heading, client-side sorting by recently added / title / rating, responsive movie cards, accessible confirmation dialog for clear-all, premium empty state)
  - Tests: src/pages/MovieDetails.test.tsx (5 tests), src/pages/Watchlist.test.tsx (6 tests)
- What was built:
  - Full-featured Movie Details dossier honoring all brief requirements and design tokens.
  - Interactive trailer modal with privacy-conscious YouTube player and keyboard accessibility.
  - Complete Watchlist view with multi-mode sorting, single item removal, and protected clear-all confirmation.
- How verified:
  - `npm run typecheck` passed (tsc --noEmit clean, 0 errors).
  - `npm run lint` passed (eslint clean, 0 warnings, 0 errors).
  - `npm test` passed (13 test files, 79 tests passed).
  - `npm run build` passed (production build compiled in dist/ with 0 errors).

## 2026-10-25 — Phase 6 — About, Contact, and NotFound pages
- Files changed / created:
  - Pages: src/pages/About.tsx (project narrative, tech stack architecture cards, criteria-to-implementation mapping with interactive links, text-only TMDB legal attribution, known limitations), src/pages/Contact.tsx (Name 2+ chars, email regex, subject select, message 10-1000 chars with live counter, accessible inline errors with aria-invalid/aria-describedby, auto-focus first invalid input, honest mailto: dispatch, transparency notice), src/pages/NotFound.tsx (cinematic 404 presentation with Home and Discover quick links)
  - Tests: src/pages/About.test.tsx (3 tests), src/pages/Contact.test.tsx (5 tests), src/pages/NotFound.test.tsx (2 tests)
- What was built:
  - Comprehensive, beautifully styled About page highlighting engineering architecture and legal requirements.
  - Fully accessible Contact form strictly following validation and honest no-backend disclosure constraints.
  - Theatrical 404 screen with swift navigation recovery.
- How verified:
  - `npm run typecheck` passed (tsc --noEmit clean, 0 errors).
  - `npm run lint` passed (eslint clean, 0 warnings, 0 errors).
  - `npm test` passed (16 test files, 89 tests passed).
  - `npm run build` passed (production bundle compiled cleanly in dist/).
  - Vite dev server running on port 5001 responding 200 OK across `/`, `/about`, `/contact`, `/discover`, `/watchlist`.
