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

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center justify-center gap-4 sm:gap-6 py-6 ${className}`}
    >
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

      <span
        aria-current="page"
        className="text-xs sm:text-sm font-medium text-[var(--text)] tabular-nums"
      >
        Page <span className="font-semibold text-white">{clampedCurrentPage}</span> of{' '}
        <span className="font-semibold text-[var(--gold)]">{clampedTotalPages}</span>
      </span>

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
