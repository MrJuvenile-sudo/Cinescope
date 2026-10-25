# CineScope — Theatrical Movie Discovery

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.4.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-89_Passed-729B1B?logo=vitest&logoColor=white)](https://vitest.dev)
[![TMDB API](https://img.shields.io/badge/TMDB_API-v3_REST-01D277?logo=themoviedb&logoColor=white)](https://www.themoviedb.org)

**CineScope** is an uncompromising, dark-mode movie discovery single-page application engineered with theatrical typography, warm near-black glass surfaces, and real-time integration with **The Movie Database (TMDB)**.

Built with an agentic-first persistent memory workflow (Antigravity Rules, Workflows, and `/docs`), CineScope features a URL-synced parametric discovery engine, 400ms debounced search, complete movie dossiers with trailer modals, and a persistent personal watchlist synchronized across browser tabs.

---

## The "Midnight Cinema" Design Philosophy

CineScope rejects sterile dashboards in favor of the sensory romance of mid-century cinema palaces:

- **Surface Palette:** Warm obsidian background (`#0A0A0D`), elevated glass surfaces (`#14141A`), and subtle border luminosity (`rgba(255,255,255,0.07)`).
- **Theatrical Accents:** Dynamic crimson glow (`#E50914`) for primary actions and vintage gold (`#D6B25E`) for typography highlights, ratings, and active genres.
- **Atmospheric Grain:** A lightweight 3% SVG procedural film grain overlay and radial crimson vignette.
- **Typography:** Classic editorial serif (`Playfair Display`) paired with clean sans-serif UI typography (`Inter`).
- **Motion & Accessibility:** Full `@media (prefers-reduced-motion: reduce)` support, visible focus rings, screen reader `aria-live` status feeds, and minimum 44px touch targets.

---

## Live Demo & Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **TMDB API Key or Read Access Token:** Free from [themoviedb.org](https://www.themoviedb.org/settings/api)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/cinescope.git
cd cinescope
npm install
```

### 2. Configure TMDB Credential
Create a `.env.local` file in the project root (this file is git-ignored):
```env
VITE_TMDB_CREDENTIAL=your_v3_api_key_or_read_access_token
```

> **Security Note:** If the credential begins with `eyJ` (JWT Read Access Token), CineScope sends `Authorization: Bearer <token>`. Otherwise, it automatically appends `api_key=<credential>`. CineScope gracefully renders a setup guide screen if the credential is not yet configured, preventing application crashes.

### 3. Development Server
Run the local Vite server:
```bash
npm run dev
```
Open **[http://localhost:5001](http://localhost:5001)** (or Vite's assigned port) in your browser.

### 4. Quality Suite & Production Build
```bash
npm run typecheck   # Strict TypeScript (tsc --noEmit)
npm run lint        # ESLint analysis (0 errors, 0 warnings)
npm test            # Run all 89 Vitest unit tests
npm run build       # Compile optimized production bundle to /dist
```

---

## Assignment Centerpiece: Parametric Discover Mapping

The Discover page (`/discover`) treats the URL as the **single source of truth**. Filter state is not duplicated in React; all filters synchronize to URL parameters and serialize into canonical TMDB REST query parameters.

### Canonical Mapping Table

| UI Filter | Discover URL Parameter | Default Value | TMDB REST API Parameter | API Value Example | Notes |
|:---|:---|:---|:---|:---|:---|
| **Genre** | `genre` | `35` (Comedy) | `with_genres` | `35` | Derived from `/genre/movie/list` (with fallback) |
| **Release Year** | `year` | `2025` | `primary_release_year` | `2025` | Omitted from TMDB request when `year=any` |
| **Minimum Rating** | `rating` | `7` | `vote_average.gte` | `7.0` | Formatted with 1 decimal place; omitted when `any` |
| **Sort By** | `sort` | `popularity.desc` | `sort_by` | `popularity.desc` | Options: popularity, vote_average, release_date |
| **Quality Filter** | *(Internal Rule)* | — | `vote_count.gte` | `50` | **Appended ONLY when `sort=vote_average.desc`** |
| **Pagination** | `page` | `1` | `page` | `1` | Clamped to `min(total_pages, 500)` |

### Default TMDB Request
When navigating to `/discover`, CineScope dispatches the exact required parametric query:
```http
GET https://api.themoviedb.org/3/discover/movie?with_genres=35&primary_release_year=2025&vote_average.gte=7.0&sort_by=popularity.desc&page=1&language=en-US&include_adult=false
```

---

## Architecture & Modular Organization

```text
src/
├── config/
│   └── tmdb.ts                    # Credential reader, constants & storage keys
├── types/
│   └── tmdb.ts                    # Nullable-aware TypeScript interfaces (Movie, Details, Cast, Video)
├── services/
│   ├── tmdbClient.ts              # Native fetch, AbortController, 5m TTL cache, typed error kinds
│   └── movieService.ts            # High-level TMDB endpoints (Trending, Popular, Discover, Search, Details)
├── context/
│   └── WatchlistContext.tsx       # React Context with validated localStorage init & multi-tab sync
├── hooks/
│   ├── useDebouncedValue.ts       # Configurable debounce hook (used for 400ms search)
│   ├── useTmdbQuery.ts            # Async query hook with AbortController, stale guard, & refetch key
│   └── useDocumentTitle.ts        # Dynamic document.title updater
├── utils/
│   ├── imageUrl.ts                # TMDB image size builder (w185, w342, w500, w1280)
│   ├── movieHelpers.ts            # getYear, formatRuntime, formatRating, pickTrailer
│   └── discoverUrlState.ts        # Pure URL parse, build & TMDB parameter conversion functions
├── components/
│   ├── common/                    # Primitives (Button, Chip, SectionHeading, Rating, Pagination, Skeletons)
│   ├── layout/                    # Shell (Header, Footer, Layout, MobileNav, ScrollToTop)
│   └── movie/                     # Domain (MovieCard, MovieGrid, MovieRow, MovieHero, WatchlistButton, CastList, TrailerModal)
└── pages/
    ├── Home.tsx                   # Theatrical hero + 3 independent reels + genre shortcuts
    ├── Discover.tsx               # Centerpiece parametric discovery catalog
    ├── Search.tsx                 # 400ms debounced search with live ARIA announcements
    ├── MovieDetails.tsx           # Full movie dossier (w1280 backdrop, w500 poster, cast, trailer, similar)
    ├── Watchlist.tsx              # Personal vault with multi-mode sorting & clear-all confirmation
    ├── About.tsx                  # Project narrative, tech stack, and assignment criteria demonstration
    ├── Contact.tsx                # Accessible validated form with honest mailto: dispatch
    └── NotFound.tsx               # Cinematic 404 "Scene Not Found" recovery
```

---

## TMDB Endpoints Utilized

| Endpoint | Purpose | Request Optimization |
|:---|:---|:---|
| `/trending/movie/week` | Weekly trending row & Home cinematic hero | 5-minute in-memory cache |
| `/movie/popular` | Popular Now row | 5-minute in-memory cache |
| `/movie/top_rated` | All-time Top Rated row | 5-minute in-memory cache |
| `/discover/movie` | Parametric filter engine | Strictly isolated from text search queries |
| `/search/movie` | Title search with 400ms debounce | Isolated from filter parameters |
| `/movie/{id}` | Complete movie dossier | **ONE single request** with `append_to_response=credits,videos,similar` |
| `/genre/movie/list` | Dynamic genre list with hardcoded fallback | Cached indefinitely per session |

---

## Assignment Requirements Traceability

| Requirement | Implementation Details | Verified By |
|:---|:---|:---|
| **Single Page Application (SPA)** | React Router v6 declarative routing across 8 routes with path-only scroll restoration and code-split chunks. | [`App.test.tsx`](src/App.test.tsx) |
| **REST API Integration** | Real TMDB v3 API consumption via native `fetch` + `AbortController` in `tmdbClient.ts`. No axios or direct component fetches. | [`tmdbClient.test.ts`](src/services/tmdbClient.test.ts) |
| **Search & Filtering** | Dedicated 400ms debounced Search page and separate Parametric Discover page. | [`Search.test.tsx`](src/pages/Search.test.tsx), [`Discover.test.tsx`](src/pages/Discover.test.tsx) |
| **Shared State & Persistence** | `WatchlistContext` stores movies in `localStorage` under key `cinescope:watchlist:v1` with multi-tab storage event sync. | [`WatchlistContext.test.tsx`](src/context/WatchlistContext.test.tsx) |
| **Loading & Error States** | Zero layout shift skeleton loaders, empty states, and typed error states with user-triggered Retry. | Unit test suites & DEV inspector |
| **CSS Framework & Tokens** | Tailwind CSS v4 custom token system ("Midnight Cinema") adhering to WCAG AA contrast standards. | Visual audit across 360px–1440px |

---

## Persistent Project Memory System

CineScope was developed using Google Antigravity's persistent agentic memory protocol:

1. **Standing Rules (`.agents/rules/`):**
   - `00-memory-protocol.md`: Mandatory doc read before every task; append-only changelogs; verification gates.
   - `01-stack-architecture.md`: Strict stack constraints (React 18, Vite, TS strict, no forbidden libraries).
   - `02-tmdb-data-layer.md`: TMDB API standards, Discover default parameters, and credential security.
   - `03-design-system.md`: "Midnight Cinema" design tokens, typography, and accessibility guidelines.
2. **Workflows (`.agents/workflows/`):** Slash commands automating phase verification (`/verify`), completion (`/phase-done`), and auditing (`/audit`).
3. **Repository Memory (`/docs/`):**
   - `PROJECT_BRIEF.md`: The immutable product spec.
   - `DEVELOPMENT_PLAN.md`: Phase-by-phase status tracking.
   - `DECISIONS.md`: Append-only record of all architectural choices.
   - `CHANGELOG.md`: Detailed history of files changed, features built, and verification steps.

---

## Known Limitations

- **Local Storage Scope:** Watchlist entries are stored in browser `localStorage` and do not sync across multiple physical devices.
- **Video Scope:** Full feature film streaming is out of scope per assignment rules; video playback is limited to trailers and teasers via YouTube privacy-enhanced embeds (`youtube-nocookie.com`).
- **Session Caching:** GET responses are cached in memory for 5 minutes per browser tab to stay within TMDB rate limits.

---

## Legal & Attribution

**This product uses the TMDB API but is not endorsed or certified by TMDB.**

All movie posters, backdrops, metadata, and cast images are copyright their respective studios and owners, provided courtesy of [The Movie Database (TMDB)](https://www.themoviedb.org).
