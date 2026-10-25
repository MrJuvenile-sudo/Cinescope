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
