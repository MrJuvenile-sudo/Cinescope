import React, { useState } from 'react'
import { Flame, ShieldAlert, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTmdbQuery } from '../hooks/useTmdbQuery'
import { getMidMovies } from '../services/movieService'
import { SectionHeading } from '../components/common/SectionHeading'
import { MovieCard } from '../components/movie/MovieCard'
import { Pagination } from '../components/common/Pagination'
import { LoadingSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/ErrorState'
import { Chip } from '../components/common/Chip'

type MidSubCategory = 'all' | 'thriller' | 'horror' | 'drama' | 'explicit'

const SUB_CATEGORIES: { id: MidSubCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'All 18+ Cinema', emoji: '🔥' },
  { id: 'thriller', label: '18+ Thriller & Crime', emoji: '🔪' },
  { id: 'horror', label: '18+ Horror & Dark', emoji: '🩸' },
  { id: 'drama', label: '18+ Mature Drama', emoji: '🍷' },
  { id: 'explicit', label: 'NC-17 & Unrated', emoji: '🔞' },
]

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest First' },
  { value: 'primary_release_date.asc', label: 'Oldest First' },
]

export const Mid: React.FC = () => {
  useDocumentTitle('MID · 18+ Mature Cinema — CineScope')

  const [subCategory, setSubCategory] = useState<MidSubCategory>('all')
  const [sort, setSort] = useState('popularity.desc')
  const [page, setPage] = useState(1)

  const { data, loading, error, retry } = useTmdbQuery(
    (signal, isRetry) => getMidMovies(page, subCategory, sort, signal, isRetry),
    [page, subCategory, sort]
  )

  const handleSubCategoryChange = (cat: MidSubCategory) => {
    setSubCategory(cat)
    setPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    setPage(1)
  }

  const movies = data?.results || []
  const totalPages = data?.total_pages || 1

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-10">
      {/* 18+ Advisory Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[var(--primary)]/30 bg-gradient-to-r from-[rgba(229,9,20,0.14)] via-[rgba(16,16,21,0.9)] to-[rgba(10,10,13,0.9)] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-widest shadow-[var(--shadow-glow-red)]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>18+ Mature Audience Advisory</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              MID <span className="text-[var(--primary)]">Midnight Cinema</span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Curated mature content, R-rated masterworks, NC-17 provocative narratives, psychological thrillers, and uncut cinema from international auteurs.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shrink-0 select-none">
            <Flame className="w-5 h-5 text-[var(--primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              Explicit & Uncut
            </span>
          </div>
        </div>
      </div>

      {/* Subcategory & Sort Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Subcategory Chips */}
          <div className="flex flex-wrap gap-2">
            {SUB_CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                selected={subCategory === cat.id}
                onClick={() => handleSubCategoryChange(cat.id)}
                icon={<span aria-hidden="true">{cat.emoji}</span>}
              >
                {cat.label}
              </Chip>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2.5 shrink-0">
            <label
              htmlFor="mid-sort"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Sort:</span>
            </label>
            <select
              id="mid-sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-white font-medium focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[var(--surface-2)] text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Heading & Live Count */}
      <div className="flex items-end justify-between">
        <SectionHeading
          eyebrow="18+ Catalog"
          title={`${SUB_CATEGORIES.find((c) => c.id === subCategory)?.label || 'MID'} Vault`}
          subtitle="Showing R-rated, NC-17, and mature motion pictures"
        />
      </div>

      {/* Movie Results Grid */}
      {loading ? (
        <LoadingSkeleton variant="card-grid" count={12} />
      ) : error ? (
        <div className="py-8">
          <ErrorState
            error={error}
            onRetry={retry}
            title="MID Vault Temporarily Unavailable"
            description="Unable to load 18+ titles from TMDB. Please check your network or try again."
          />
        </div>
      ) : movies.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 max-w-lg mx-auto space-y-4">
          <Flame className="w-12 h-12 text-[var(--primary)] mx-auto opacity-70" />
          <h3 className="font-serif text-xl font-bold text-white">No 18+ Titles Found</h3>
          <p className="text-sm text-[var(--text-muted)]">
            No mature titles matched this subcategory or filter combination.
          </p>
          <button
            type="button"
            onClick={() => handleSubCategoryChange('all')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs text-white border border-[var(--border)] hover:border-[var(--primary)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to All 18+</span>
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  )
}
