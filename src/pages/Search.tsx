import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Film, Sparkles } from 'lucide-react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useTmdbQuery } from '../hooks/useTmdbQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { searchMovies } from '../services/movieService'
import { SectionHeading } from '../components/common/SectionHeading'
import { SearchBar } from '../components/common/SearchBar'
import { MovieGrid } from '../components/movie/MovieGrid'
import { LoadingSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { Pagination } from '../components/common/Pagination'

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlQuery = searchParams.get('q') || ''
  const urlPage = parseInt(searchParams.get('page') || '1', 10)
  const validPage = Number.isFinite(urlPage) && urlPage >= 1 ? urlPage : 1

  const [inputVal, setInputVal] = useState<string>(urlQuery)
  const debouncedInput = useDebouncedValue(inputVal, 400)

  // Sync input when URL query changes externally (e.g. from header search or back/forward)
  useEffect(() => {
    setInputVal(urlQuery)
  }, [urlQuery])

  // Update URL state with replace:true while typing (400ms debounce)
  useEffect(() => {
    const trimmed = debouncedInput.trim()
    if (trimmed === urlQuery) return

    if (trimmed.length >= 2) {
      setSearchParams({ q: trimmed, page: '1' }, { replace: true })
    } else if (trimmed.length === 0 && urlQuery) {
      setSearchParams({}, { replace: true })
    }
  }, [debouncedInput, urlQuery, setSearchParams])

  const activeQuery = urlQuery.trim()
  const isSearchActive = activeQuery.length >= 2

  // Dynamic document title
  useDocumentTitle(
    isSearchActive ? `Search: “${activeQuery}”` : 'Search Movies'
  )

  // TMDB Search query
  const {
    data: searchData,
    loading,
    error,
    retry,
  } = useTmdbQuery(
    (signal, isRetry) => searchMovies(activeQuery, validPage, signal, isRetry),
    [activeQuery, validPage],
    { enabled: isSearchActive }
  )

  const totalResults = searchData?.total_results ?? 0
  const totalPages = searchData ? Math.min(searchData.total_pages, 500) : 1

  const handlePageChange = (newPage: number) => {
    setSearchParams(
      { q: activeQuery, page: String(newPage) },
      { replace: false }
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchSubmit = (submittedQuery: string) => {
    if (submittedQuery.trim().length >= 2) {
      setSearchParams({ q: submittedQuery.trim(), page: '1' }, { replace: false })
    }
  }

  // Results status message for aria-live screen readers
  const statusMessage = useMemo(() => {
    if (loading) return `Searching for ${activeQuery}...`
    if (error) return `Error searching for ${activeQuery}`
    if (isSearchActive && searchData) {
      return `${totalResults.toLocaleString()} results found for ${activeQuery}`
    }
    return ''
  }, [loading, error, isSearchActive, searchData, totalResults, activeQuery])

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <SectionHeading
        as="h1"
        eyebrow="Global Search"
        title="Search the TMDB Archives"
        subtitle="Explore titles, franchises, and classics with instant debounced title queries."
      />

      {/* Prominent Search Bar */}
      <div className="max-w-3xl space-y-2">
        <SearchBar
          value={inputVal}
          onChange={setInputVal}
          onSubmit={handleSearchSubmit}
          autoFocus={!urlQuery}
          variant="large"
          placeholder="Search by movie title (e.g. Inception, Dune, Casablanca)..."
        />

        {/* Input hint / Validation message */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1 px-1">
          {inputVal.trim().length === 1 ? (
            <span className="text-[var(--gold)]">
              Enter at least 2 characters to trigger search...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>400ms debounce with instant URL sync (?q=)</span>
            </span>
          )}

          {isSearchActive && (
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {inputVal.length} chars
            </span>
          )}
        </div>
      </div>

      {/* Screen-reader live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {statusMessage}
      </div>

      {/* Main Content Area */}
      <div>
        {/* Results Info Bar when search is active */}
        {isSearchActive && (
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)] text-xs sm:text-sm text-[var(--text-muted)]">
            <div>
              {loading ? (
                <span>Searching catalog...</span>
              ) : (
                <span>
                  Found{' '}
                  <strong className="text-white font-semibold tabular-nums">
                    {totalResults.toLocaleString()}
                  </strong>{' '}
                  results for “<span className="text-[var(--gold)]">{activeQuery}</span>”
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <div className="tabular-nums">
                Page {validPage} of {totalPages}
              </div>
            )}
          </div>
        )}

        {/* 1. Idle State: No query or query < 2 chars */}
        {!isSearchActive ? (
          <div className="py-20 sm:py-28 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]/50 p-8 flex flex-col items-center justify-center max-w-xl mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mb-4 text-[var(--gold)] shadow-inner">
              <Film className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--text)] mb-2">
              Ready to Explore
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
              Type at least two characters above to search across thousands of theatrical releases,
              cult favorites, and modern blockbusters.
            </p>
          </div>
        ) : loading ? (
          /* 2. Loading Skeleton Grid */
          <LoadingSkeleton variant="card-grid" count={12} />
        ) : error ? (
          /* 3. Error State */
          <ErrorState error={error} onRetry={retry} />
        ) : !searchData || searchData.results.length === 0 ? (
          /* 4. Empty State */
          <EmptyState
            icon={<SearchIcon className="w-10 h-10" />}
            title="No Results Found"
            description={`We could not locate any titles matching “${activeQuery}”. Please check your spelling or try searching for another film.`}
          />
        ) : (
          /* 5. Results Grid */
          <div className="space-y-8">
            <MovieGrid movies={searchData.results} />

            {totalPages > 1 && (
              <Pagination
                currentPage={validPage}
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
