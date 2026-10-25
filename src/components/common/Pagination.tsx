import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

/** Compute a compact page window: always show first, last, current ±1, and ellipses */
function buildPageWindows(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = []
  const addPage = (p: number) => {
    if (!pages.includes(p)) pages.push(p)
  }

  addPage(1)
  if (current > 3) pages.push('ellipsis')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    addPage(p)
  }
  if (current < total - 2) pages.push('ellipsis')
  addPage(total)

  return pages
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className = '',
}) => {
  // Clamp usable total pages to max 500 per TMDB specifications
  const clampedTotalPages = Math.max(1, Math.min(totalPages || 1, 500))
  const clampedCurrentPage = Math.max(1, Math.min(currentPage || 1, clampedTotalPages))

  const isFirstPage = clampedCurrentPage <= 1
  const isLastPage = clampedCurrentPage >= clampedTotalPages

  const handlePrevious = () => {
    if (!isFirstPage && !disabled) {
      onPageChange(clampedCurrentPage - 1)
    }
  }

  const handleNext = () => {
    if (!isLastPage && !disabled) {
      onPageChange(clampedCurrentPage + 1)
    }
  }

  const pageWindows = buildPageWindows(clampedCurrentPage, clampedTotalPages)

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center justify-center gap-2 sm:gap-3 py-6 flex-wrap ${className}`}
    >
      {/* Previous */}
      <Button
        variant="secondary"
        size="md"
        onClick={handlePrevious}
        disabled={isFirstPage || disabled}
        aria-label="Previous Page"
        icon={<ChevronLeft className="w-4 h-4" />}
      >
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Numbered Pages — hidden on small screens to save space */}
      <div className="hidden sm:flex items-center gap-1.5">
        {pageWindows.map((item, idx) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-xs text-[var(--text-muted)] select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => !disabled && onPageChange(item)}
              disabled={disabled}
              aria-label={`Page ${item}`}
              aria-current={item === clampedCurrentPage ? 'page' : undefined}
              className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] tabular-nums ${
                item === clampedCurrentPage
                  ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-glow-red)] scale-105'
                  : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] hover:bg-white/8'
              } ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Compact "Page X of Y" — visible on mobile */}
      <span
        aria-current="page"
        className="sm:hidden text-xs sm:text-sm font-medium text-[var(--text)] tabular-nums px-2"
      >
        <span className="font-semibold text-white">{clampedCurrentPage}</span>
        <span className="text-[var(--text-muted)]"> / </span>
        <span className="font-semibold text-[var(--gold)]">{clampedTotalPages}</span>
      </span>

      {/* Next */}
      <Button
        variant="secondary"
        size="md"
        onClick={handleNext}
        disabled={isLastPage || disabled}
        aria-label="Next Page"
        icon={<ChevronRight className="w-4 h-4" />}
        iconPosition="right"
      >
        <span className="hidden sm:inline">Next</span>
      </Button>
    </nav>
  )
}
