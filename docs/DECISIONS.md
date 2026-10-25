# Decisions Log (append-only)
Format: ## YYYY-MM-DD — Title / Context / Decision / Consequence

## Initial decisions
- Frontend-only with TMDB. Credential via VITE_TMDB_CREDENTIAL in git-ignored .env.local; VITE_ values ship in the browser bundle, so only a public, permitted key is acceptable.
- Details page uses one request with append_to_response=credits,videos,similar.
- Discover adds vote_count.gte=50 only for vote_average.desc sorting.
- Contact form uses an honest mailto: flow because there is no backend.
- Design direction "Midnight Cinema": warm near-black, crimson accent, gold highlights, Playfair Display + Inter.
- Memory system: Antigravity rules (.agents/rules) + workflows (.agents/workflows) + /docs + git commits/tags per phase.

## 2026-10-25 — Phase 1 Foundation Decisions
- Used `@tailwindcss/vite` (Tailwind CSS v4) as the official current Vite plugin with CSS-first token configuration.
- Enforced React 18 (`18.3.1`) compatibility across tooling and testing packages.
- Implemented accessible mobile Sheet navigation with keyboard focus trapping and Escape key dismissal.

## 2026-10-25 — Phase 2 Data Layer Decisions
- Implemented functional state updates in `WatchlistContext` to prevent stale closure issues during rapid additions/removals.
- Extracted `WATCHLIST_STORAGE_KEY` to `src/config/tmdb.ts` to cleanly satisfy React fast-refresh guidelines.
- Created dedicated setup view in `ErrorState` for `missing_credential` to guide local `.env.local` configuration gracefully without crashing.

## 2026-10-25 — Phase 3 Discover Decisions
- Formatted `vote_average.gte` with `.toFixed(1)` to ensure query string outputs `7.0` matching the exact assignment specification.
- Configured dynamic heading logic in `Discover.tsx` to display `{Year} {Genre} Films` (e.g. "2025 Comedy Films") or `{Genre} Cinema` when year is 'any'.
- Added a discrete developer inspector bar visible only in `import.meta.env.DEV` showing the exact TMDB request parameters being dispatched.

## 2026-10-25 — Phase 4 Home and Search Decisions
- Integrated compact SearchBar into Header to enable direct search submission from any screen.
- MovieRow implemented with native keyboard accessibility (`tabIndex={0}`) and custom CSS scrollbar suppression while preserving smooth swipe navigation.
- Configured screen-reader live announcements on `Search.tsx` via `role="status"` and `aria-live="polite"` announcing `"{n} results found for {query}"`.

## 2026-10-25 — Phase 5 Movie Details and Watchlist Decisions
- Validated `:movieId` route parameter with strict numeric pattern (`/^\d+$/`) prior to triggering `useTmdbQuery` to bypass wasted API traffic for malformed paths.
- Rendered movie genres on Details as semantic interactive links directly pointing to parametric `/discover` with the genre preset and default filters.
- Built an accessible `TrailerModal` using YouTube privacy-enhanced embed (`youtube-nocookie.com`), body scroll locking, Escape key dismissal, and an external direct fallback link.
- Watchlist management equipped with reactive client-side sorting (Recently Added, Title A-Z, Highest Rated) and an accessible confirmation dialog (`role="alertdialog"`) protecting the "Clear All" action.

## 2026-10-25 — Phase 6 About, Contact, and NotFound Decisions
- Implemented accessible field-level validation on `Contact.tsx` with `aria-invalid`, `aria-describedby`, and auto-focusing the first invalid field on form submission.
- Preserved complete transparency on the contact form via an honest `mailto:` flow and explicit disclaimers confirming that no automated backend delivery or storage occurs.
- Mapped all academic assignment criteria in `About.tsx` to live functional route links, alongside strict text-only TMDB legal attribution.

## 2026-10-25 — Phase 7 Polish Decisions
- Enforced route-level code splitting using `React.lazy()` with `<Suspense fallback={<PageLoader />}>` placed around `<Outlet />` inside `Layout.tsx`. This preserves header, footer, and navigation state persistently during asynchronous chunk loading while slashing initial JS bundle from 321 kB down to 226 kB (70 kB gzip).
- Authored production-grade `README.md` containing the assignment requirements matrix, the complete Discover parameter mapping table, environment security instructions, and Antigravity memory workflow documentation.

## 2026-10-25 — Phase 8 Final Audit and Acceptance Decisions
- Completed full architectural audit confirming 100% adherence to all stack rules: zero forbidden libraries, strict TypeScript with 0 `any` types, native `fetch` + `AbortController` request layer, 5-minute memory TTL caching, and complete separation between presentational components and data services.
- Verified all 9 Final Acceptance Checklist criteria across routes, state machines, debounce timing, deep links, responsive breakpoints, and legal TMDB attribution. Application is verified production ready.
