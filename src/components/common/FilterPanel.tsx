import React from 'react'
import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react'
import {
  DiscoverFilters,
  DISCOVER_DEFAULTS,
  SORT_OPTIONS,
  RATING_OPTIONS,
  getYearOptions,
} from '../../utils/discoverUrlState'
import { Genre } from '../../types/tmdb'
import { Button } from './Button'

export interface FilterPanelProps {
  filters: DiscoverFilters
  genres: Genre[]
  onFilterChange: (newFilters: Partial<DiscoverFilters>) => void
  onReset: () => void
  className?: string
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  genres,
  onFilterChange,
  onReset,
  className = '',
}) => {
  const years = getYearOptions()

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ genre: e.target.value, page: '1' })
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ year: e.target.value, page: '1' })
  }

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ rating: e.target.value, page: '1' })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sort: e.target.value, page: '1' })
  }

  const isDefault =
    filters.genre === DISCOVER_DEFAULTS.genre &&
    filters.year === DISCOVER_DEFAULTS.year &&
    filters.rating === DISCOVER_DEFAULTS.rating &&
    filters.sort === DISCOVER_DEFAULTS.sort

  return (
    <div
      aria-label="Filter & Sort Controls"
      className={`glass-panel rounded-2xl p-5 sm:p-7 space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Curated Filters</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isDefault}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          aria-label="Reset all filters to defaults"
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Genre Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-genre"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            Genre
          </label>
          <div className="relative">
            <select
              id="filter-genre"
              value={filters.genre}
              onChange={handleGenreChange}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] font-medium focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer pr-10 hover:border-[var(--border-strong)] transition-colors min-h-[44px]"
            >
              {genres.map((g) => (
                <option key={g.id} value={String(g.id)} className="bg-[var(--surface-2)] text-[var(--text)]">
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Release Year Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-year"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            Release Year
          </label>
          <div className="relative">
            <select
              id="filter-year"
              value={filters.year}
              onChange={handleYearChange}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] font-medium focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer pr-10 hover:border-[var(--border-strong)] transition-colors min-h-[44px]"
            >
              {years.map((y) => (
                <option key={y.value} value={y.value} className="bg-[var(--surface-2)] text-[var(--text)]">
                  {y.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Minimum Rating Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-rating"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            Minimum Rating
          </label>
          <div className="relative">
            <select
              id="filter-rating"
              value={filters.rating}
              onChange={handleRatingChange}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] font-medium focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer pr-10 hover:border-[var(--border-strong)] transition-colors min-h-[44px]"
            >
              {RATING_OPTIONS.map((r) => (
                <option key={r.value} value={r.value} className="bg-[var(--surface-2)] text-[var(--text)]">
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-sort"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            Sort Order
          </label>
          <div className="relative">
            <select
              id="filter-sort"
              value={filters.sort}
              onChange={handleSortChange}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] font-medium focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer pr-10 hover:border-[var(--border-strong)] transition-colors min-h-[44px]"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[var(--surface-2)] text-[var(--text)]">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
