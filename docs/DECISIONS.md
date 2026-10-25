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
