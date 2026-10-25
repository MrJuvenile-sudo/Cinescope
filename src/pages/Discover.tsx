import React, { useEffect, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Compass, Sparkles, Terminal } from 'lucide-react'
import {
  parseDiscoverParams,
  buildDiscoverParams,
  toTmdbParams,
  DiscoverFilters,
  DISCOVER_DEFAULTS,
} from '../utils/discoverUrlState'
import { discoverMovies, getGenres, FALLBACK_GENRES } from '../services/movieService'
import { useTmdbQuery } from '../hooks/useTmdbQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { FilterPanel } from '../components/common/FilterPanel'
import { MovieGrid } from '../components/movie/MovieGrid'
import { LoadingSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { Pagination } from '../components/common/Pagination'
import { Button } from '../components/common/Button'

export const Discover: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsTopRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)

  // 1. URL is the single source of truth: parse & validate
  const { filters, wasNormalized } = useMemo(
    () => parseDiscoverParams(searchParams),
    [searchParams]
  )

  // 2. If invalid or missing params, replace URL immediately with canonical defaults
  useEffect(() => {
    if (wasNormalized) {
      setSearchParams(buildDiscoverParams(filters), { replace: true })
    }
  }, [wasNormalized, filters, setSearchParams])

  // 3. Fetch Genres list (with cached/fallback support)
  const { data: genresData } = useTmdbQuery(
    (signal) => getGenres(signal),
    []
  )
  const genres = genresData?.genres?.length ? genresData.genres : FALLBACK_GENRES

  // Derive active genre name for dynamic heading
  const selectedGenre = useMemo(() => {
    return (
      genres.find((g) => String(g.id) === filters.genre) || {
        id: 35,
        name: 'Comedy',
      }
    )
  }, [genres, filters.genre])

  // 4. Fetch movies via discover endpoint using toTmdbParams
  const tmdbQueryParams = useMemo(() => toTmdbParams(filters), [filters])

  const {
    data: moviesData,
    loading,
    error,
    retry,
  } = useTmdbQuery(
    (signal, isRetry) => discoverMovies(tmdbQueryParams, signal, isRetry),
    [filters.genre, filters.year, filters.rating, filters.sort, filters.page]
  )

  // 5. Dynamic document title
  const headingYear = filters.year === 'any' ? 'All Time' : filters.year
  useDocumentTitle(`Discover ${selectedGenre.name} (${headingYear}) — CineScope`)

  // 6. Handle page overflow: if page > min(total_pages, 500), replace URL to last valid page
  useEffect(() => {
    if (moviesData && moviesData.total_pages > 0) {
      const maxPages = Math.min(moviesData.total_pages, 500)
      const currentPage = parseInt(filters.page, 10)
      if (currentPage > maxPages) {
        setSearchParams(
          buildDiscoverParams({ ...filters, page: String(maxPages) }),
          { replace: true }
        )
      }
    }
  }, [moviesData, filters, setSearchParams])

  // 7. Scroll to top of results on page change (skipping initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [filters.page])

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<DiscoverFilters>) => {
    setSearchParams(buildDiscoverParams({ ...filters, ...newFilters }), {
      replace: false,
    })
  }

  const handleReset = () => {
    setSearchParams(buildDiscoverParams(DISCOVER_DEFAULTS), { replace: false })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams(
      buildDiscoverParams({ ...filters, page: String(newPage) }),
      { replace: false }
    )
  }

  // Derive dynamic heading text
  const headingTitle =
    filters.year === 'any'
      ? `${selectedGenre.name} Cinema`
      : `${filters.year} ${selectedGenre.name} Films`

  const totalPages = moviesData ? Math.min(moviesData.total_pages, 500) : 1
  const currentPage = parseInt(filters.page, 10)
  const totalResults = moviesData?.total_results ?? 0

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div>
        <SectionHeading
          as="h1"
          eyebrow="Parametric Discovery"
          title={headingTitle}
          subtitle={`Discover the greatest ${selectedGenre.name.toLowerCase()} features. Filter by release vintage, audience acclaim, and sorting preferences.`}
        />
      </div>

      {/* Filter & Sort Controls Panel */}
      <FilterPanel
        filters={filters}
        genres={genres}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Dev-only TMDB query parameters inspector */}
      {import.meta.env.DEV && (
        <div
          role="region"
          aria-label="Developer Parameters Inspector"
          className="rounded-xl bg-black/70 border border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-[var(--gold)] font-mono overflow-x-auto gap-4"
        >
          <div className="flex items-center gap-2 shrink-0 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>DEV Inspector</span>
          </div>
          <div className="truncate text-right">
            <span className="text-[var(--text-muted)]">TMDB Request: </span>
            <span className="text-white select-all">
              /discover/movie?
              {new URLSearchParams(
                tmdbQueryParams as Record<string, string>
              ).toString()}
            </span>
          </div>
        </div>
      )}

      {/* Results Section Anchor */}
      <div ref={resultsTopRef} className="pt-2">
        {/* Results Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-muted)]">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            {loading ? (
              <span>Scanning catalog...</span>
            ) : (
              <span>
                Found{' '}
                <strong className="text-white tabular-nums font-semibold">
                  {totalResults.toLocaleString()}
                </strong>{' '}
                curated movies
              </span>
            )}
          </div>

          <div className="text-xs text-[var(--text-muted)] tabular-nums">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Dynamic States: Loading, Error, Empty, or Results Grid */}
        {loading ? (
          <LoadingSkeleton variant="card-grid" count={12} />
        ) : error ? (
          <ErrorState error={error} onRetry={retry} />
        ) : !moviesData || moviesData.results.length === 0 ? (
          <EmptyState
            icon={<Compass className="w-10 h-10" />}
            title="No Matching Films Found"
            description="No films matched your active filter parameters. Try expanding your release year range or lowering the minimum rating threshold."
            action={
              <Button onClick={handleReset} size="md">
                Reset All Filters
              </Button>
            }
          />
        ) : (
          <div className="space-y-8">
            <MovieGrid movies={moviesData.results} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
