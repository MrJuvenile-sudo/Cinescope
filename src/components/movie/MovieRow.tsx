import React, { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Movie } from '../../types/tmdb'
import { SectionHeading } from '../common/SectionHeading'
import { MovieCard } from './MovieCard'
import { LoadingSkeleton } from '../common/LoadingSkeleton'
import { ErrorState } from '../common/ErrorState'

export interface MovieRowProps {
  title: string
  eyebrow?: string
  subtitle?: string
  viewAllHref?: string
  movies: Movie[]
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  className?: string
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  eyebrow,
  subtitle,
  viewAllHref,
  movies,
  loading = false,
  error = null,
  onRetry,
  className = '',
}) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const checkScroll = useCallback(() => {
    if (!rowRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    const maxScroll = scrollWidth - clientWidth
    setScrollProgress(maxScroll > 0 ? Math.min(scrollLeft / maxScroll, 1) : 0)
  }, [])

  useEffect(() => {
    checkScroll()
    const handleResize = () => checkScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [movies, loading, checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return
    const scrollAmount = rowRef.current.clientWidth * 0.75
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section aria-label={title} className={`relative space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          viewAllHref={viewAllHref}
        />

        {/* Desktop Arrow Controls on md+ */}
        {!loading && !error && movies.length > 0 && (
          <div className="hidden md:flex items-center gap-2 shrink-0 pb-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
              className={`p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-white transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--primary)] ${
                canScrollLeft
                  ? 'hover:bg-white/10 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-glow-red)] cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
              className={`p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-white transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--primary)] ${
                canScrollRight
                  ? 'hover:bg-white/10 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-glow-red)] cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Row Body */}
      {loading ? (
        <LoadingSkeleton variant="row" />
      ) : error ? (
        <div className="py-6">
          <ErrorState
            error={error}
            onRetry={onRetry}
            title={`${title} Unavailable`}
            description="Unable to load this section from TMDB. You can retry or browse other categories."
          />
        </div>
      ) : movies.length === 0 ? (
        <div className="py-8 text-center text-sm text-[var(--text-muted)] bg-[var(--surface)]/50 rounded-2xl border border-[var(--border)]">
          No films currently listed in this category.
        </div>
      ) : (
        <div className="relative group/row">
          {/* Left gradient edge fade — wider for cinematic feel */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Horizontally Scrollable Reel */}
          <div
            ref={rowRef}
            tabIndex={0}
            onScroll={checkScroll}
            aria-label={`${title} movie carousel`}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 focus-visible:outline-2 focus-visible:outline-[var(--primary)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="w-[150px] sm:w-[190px] md:w-[210px] shrink-0 snap-start"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {/* Right gradient edge fade — wider for cinematic feel */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Scroll-progress thin bar */}
          {movies.length > 0 && (
            <div className="scroll-bar-track mt-3 mx-1">
              <div
                className="scroll-bar-thumb"
                style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
