---
trigger: always_on
description: CineScope fixed stack, folder structure, code quality rules
---
# Stack (fixed — do not add alternatives)
React 18 + Vite + TypeScript (strict), react-router-dom (latest stable, declarative BrowserRouter/Routes — import from one package consistently, check the installed version's docs), Tailwind CSS (use the current official Vite plugin setup, not an older guide), native fetch + AbortController, React Context, localStorage, lucide-react, sonner for toasts, Vitest + React Testing Library for unit tests.
FORBIDDEN: axios, Redux/Zustand, React Query/SWR, any backend or database, authentication, extra UI kits. Small headless primitives (e.g. Radix Dialog/Sheet) are allowed only for accessible overlays.

# Folder structure
src/config/tmdb.ts | src/types/tmdb.ts | src/services/{tmdbClient,movieService}.ts | src/context/WatchlistContext.tsx | src/hooks/{useDebouncedValue,useTmdbQuery,useDocumentTitle}.ts | src/utils/{imageUrl,discoverUrlState,movieHelpers}.ts | src/components/layout/{Header,Footer,Layout,MobileNav} | src/components/movie/{MovieCard,MovieGrid,MovieRow,MovieHero,WatchlistButton,CastList,TrailerButton} | src/components/common/{SearchBar,FilterPanel,Pagination,LoadingSkeleton,ErrorState,EmptyState,Rating,Button,Chip,SectionHeading} | src/pages/{Home,Discover,Search,MovieDetails,Watchlist,About,Contact,NotFound}
Pages own screen behaviour. Components are presentational and reusable. Services own all HTTP. Utils are pure functions. NO component calls fetch directly.

# Code quality
TypeScript strict, no `any`, typed props, exhaustive error kinds. Small single-purpose components. No dead code or unused imports. No console errors/warnings. Handle null/undefined TMDB fields everywhere. Pure logic (discoverUrlState, movieHelpers, watchlist operations, request param building) must have unit tests. Scripts required in package.json: dev, build, lint, test, typecheck (tsc --noEmit).
