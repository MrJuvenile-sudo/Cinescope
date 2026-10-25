# CineScope — Development Plan & Status
Legend: [ ] todo | [~] in progress | [x] done. Update after EVERY task.

## Current phase: Phase 7
## Last completed task: Phase 6 — About, Contact, and NotFound pages (89 unit tests)
## Next 3 tasks: Route lazy loading & Suspense, accessible motion & SEO metadata, comprehensive README with screenshots & architecture

- [x] Phase 0 — Bootstrap: AGENTS.md, .agents/rules, .agents/workflows, /docs
- [x] Phase 1 — Scaffold & foundation: Vite React-TS app, Tailwind, Vitest, tokens/fonts/atmosphere, Button/Chip/SectionHeading, Layout/Header/MobileNav/Footer, all routes with premium placeholders, SPA rewrites, .env.example
- [x] Phase 2 — Data & state: types, tmdbClient (typed errors, cache, abort), movieService, imageUrl/movieHelpers, hooks, WatchlistContext + header badge, LoadingSkeleton/ErrorState/EmptyState/Rating/Pagination, unit tests
- [x] Phase 3 — Discover: discoverUrlState (+tests), MovieCard/MovieGrid, FilterPanel, URL-synced page with pagination and states, browser verification
- [x] Phase 4 — Home & Search: hero, rows, genre chips, watchlist strip; debounced Search + header SearchBar
- [x] Phase 5 — Details & Watchlist pages
- [x] Phase 6 — About, Contact, NotFound
- [ ] Phase 7 — Polish: motion, lazy routes, a11y audit, SEO meta, responsive QA, README
- [ ] Phase 8 — Audit, fixes, deployment, final checklist

## Final acceptance checklist
- [ ] Default Discover request: with_genres=35, primary_release_year=2025, vote_average.gte=7.0, sort_by=popularity.desc, page=1
- [ ] Filters/page restore via URL, Back/Forward, refresh, shared link
- [ ] Search debounce verified in Network tab (one request after the pause)
- [ ] Watchlist persists; count and buttons stay in sync everywhere
- [ ] Loading, error+Retry and empty states each verified
- [ ] Deep links work on the deployed URL (/discover, /movie/550, /watchlist)
- [ ] TMDB attribution in Footer and About
- [ ] Premium design verified at 360 / 768 / 1024 / 1440
- [ ] npm run build, lint, typecheck and tests all pass; README complete with live URL and screenshots
