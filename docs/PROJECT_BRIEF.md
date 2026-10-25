# CineScope — Project Brief (source of truth; changes only via /update-brief)

## 1. Product
CineScope is a premium, responsive movie discovery single-page application. Users discover movies, search by title, filter by genre/year/rating, read details, and keep a persistent personal watchlist.
Core journey that must work flawlessly: Discover a movie -> search or filter -> open details -> add to watchlist -> return later and manage saved movies.

## 2. Assignment requirements (must be demonstrable on the deployed site)
- SPA: at least 3 pages, React Router, smooth client-side navigation, shared state (Watchlist via React Context).
- REST API: real TMDB v3 data, dynamic content, search AND filtering, loading + error states, debounced search.
- CSS framework: Tailwind CSS, professional responsive UI, consistent tokens, accessible components.

## 3. Routes
/ Home | /discover | /search?q= | /movie/:movieId | /watchlist | /about | /contact | * NotFound
One shared Layout (Header, main, Footer). Internal navigation with Link/NavLink only. Scroll to top on pathname change (not on query-only changes). document.title per page.

## 4. Pages
- Home: cinematic hero from the first trending movie with a backdrop; rows for Trending this week, Popular now, Top rated (each loads and fails independently); genre shortcut chips; recent watchlist strip.
- Discover: URL-synced filters (genre, year, minimum rating, sort), paginated grid, loading/error/empty states, reset, result count.
- Search: debounced title search with URL state and all states.
- Movie details: backdrop, poster, title, tagline, year, runtime, rating, genre chips, director, overview, watchlist button, trailer (accessible modal or new tab), top-12 cast, similar movies. Sections without data are hidden.
- Watchlist: grid from stored data, remove, sort (Recently added / Title A-Z / Highest rated), clear-all with confirm, premium empty state.
- About: project story, tech-stack cards, how the requirements are met (with links), data-source section with the TMDB attribution sentence, known limitations.
- Contact: validated form (Name 2+, valid Email, Subject select, Message 10-1000 with live counter), inline errors with aria-describedby and aria-invalid, focus first invalid field. No backend: on valid submit open a prefilled mailto: (recipient constant in src/config) and say plainly that nothing was sent automatically. Never claim delivery.
- NotFound: cinematic 404 ("Scene not found") with links to Home and Discover.

## 5. Legal
Footer and About show: "This product uses the TMDB API but is not endorsed or certified by TMDB." Text only; never draw or invent a TMDB logo.

## 6. Out of scope
Accounts, backend, database, payments, AI recommendations, comments, playing movies, cloud-synced lists, analytics.

## 7. Deployment
public/_redirects (/* /index.html 200) and vercel.json rewrite /(.*) -> /index.html. Build: npm run build; output: dist. README with setup, endpoints, Discover mapping table, attribution, limitations, and a "Project memory" section explaining .agents/ and /docs.
