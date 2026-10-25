---
trigger: always_on
description: TMDB API rules, request layer, credential handling, Discover/Search/Watchlist logic
---
# TMDB API
- Base https://api.themoviedb.org/3 ; images https://image.tmdb.org/t/p/{size}{path}. Sizes: card poster w342, details poster w500, backdrop w1280, profile w185 (via utils/imageUrl.ts, returns null when the path is missing).
- Endpoints: /trending/movie/week, /movie/popular, /movie/top_rated, /discover/movie, /search/movie, /movie/{id}?append_to_response=credits,videos,similar (ONE request for details), /genre/movie/list. Send language=en-US and include_adult=false where supported.
- Discover and Search are SEPARATE. Never send a text query to /discover/movie; never filter by genre/year/rating through /search/movie.
- Pagination comes from the response (page, total_pages, total_results); clamp usable pages to min(total_pages, 500).
- Never assume poster_path, backdrop_path, overview, release_date, runtime or videos exist.

# Credential
Read only from src/config/tmdb.ts, which exports TMDB_CREDENTIAL = import.meta.env.VITE_TMDB_CREDENTIAL. Provide .env.example (placeholder only); .env.local stays git-ignored. If the value looks like a JWT (starts with "eyJ") send header Authorization: Bearer <token>; otherwise append the api_key query param. Never both. If empty, show a friendly "TMDB credential missing" ErrorState with setup steps (no crash). NEVER print, log, hardcode, screenshot or commit the credential. Note in docs that a VITE_ variable ships in the browser bundle, so only a public, permitted key may be used.

# Request layer
One request<T>(path, params, signal). Typed TmdbError with kind: auth (401) | not_found (404) | rate_limit (429) | network | server (5xx) | unknown, plus a friendly message. AbortError is never shown to the user. NO automatic retry loops; retry happens only on a user click. In-memory TTL cache (~5 min) for successful GETs.
useTmdbQuery(fetcher, deps) returns { data, loading, error, retry }: AbortController per run, stale-result guard, retry() increments an internal retryKey so Retry ALWAYS triggers a real refetch.

# Discover (assignment centerpiece)
- The URL is the single source of truth: /discover?genre=35&year=2025&rating=7&sort=popularity.desc&page=1. No duplicate filter state in React.
- Defaults for missing/invalid params: genre=35, year=2025, rating=7, sort=popularity.desc, page=1.
- Mapping: genre->with_genres | year->primary_release_year (omit if "any") | rating->vote_average.gte (omit if "any") | sort->sort_by | page->page.
- The default request MUST be: /discover/movie?with_genres=35&primary_release_year=2025&vote_average.gte=7.0&sort_by=popularity.desc&page=1
- Add vote_count.gte=50 ONLY when sort is vote_average.desc.
- Sorts: popularity.desc, vote_average.desc, primary_release_date.desc, primary_release_date.asc (Most Popular, Highest Rated, Newest First, Oldest First).
- Genres from /genre/movie/list (cached) with a hardcoded fallback; the heading derives from the selected genre. Years: Any + (currentYear+1) down to 1980. Ratings: Any, 5+, 6+, 7+, 8+, 9+.
- Any non-page filter change resets page to 1. Previous disabled on page 1; Next disabled on the last page.
- utils/discoverUrlState.ts exports parseDiscoverParams, buildDiscoverParams, toTmdbParams. Invalid values normalise to defaults using navigate/setSearchParams with replace:true. If page > total_pages, redirect (replace) to the last valid page.

# Search
400 ms debounce, trim, minimum 2 characters (hint below that, no request). Query in the URL (?q=, &page=) updated with replace:true while typing. Abort stale requests. States: idle, loading, results, empty, error+Retry. The Header has a compact SearchBar that navigates to /search?q=.

# Watchlist
Context exposes items, count, add, remove, toggle, has, clear. localStorage key cinescope:watchlist:v1. Store only id, title, poster_path, release_date, vote_average, addedAt. Lazy, validated initialisation inside try/catch (discard malformed entries); try/catch on writes; cross-tab sync via the storage event; memoised context value. WatchlistButton: aria-pressed, dynamic aria-label, toast feedback. Header shows a live count badge. Provider wraps the router.
