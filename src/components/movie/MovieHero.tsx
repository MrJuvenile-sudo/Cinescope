import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Compass, Sparkles, Film, RotateCw, ChevronLeft, ChevronRight, Tv } from 'lucide-react'
import { Movie } from '../../types/tmdb'
import { getImageUrl } from '../../utils/imageUrl'
import { getYear, getDisplayTitle } from '../../utils/movieHelpers'
import { Rating } from '../common/Rating'
import { Button } from '../common/Button'
import { WatchlistButton } from './WatchlistButton'

export interface MovieHeroProps {
  movie?: Movie | null
  movies?: Movie[]
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export const MovieHero: React.FC<MovieHeroProps> = ({
  movie,
  movies = [],
  loading = false,
  error = null,
  onRetry,
}) => {
  // Pool of carousel movies: either passed list or single movie fallback
  const heroList = (movies && movies.length > 0)
    ? movies.filter((m) => m.backdrop_path || m.poster_path).slice(0, 8)
    : movie ? [movie] : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({})

  // Auto-advance carousel every 6 seconds unless paused
  useEffect(() => {
    if (heroList.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroList.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroList.length, isPaused])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroList.length) % heroList.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroList.length)
  }

  // 1. Loading Skeleton state
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading featured premiere"
        className="relative w-full h-[500px] sm:h-[580px] lg:h-[680px] rounded-3xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] p-8 sm:p-14 flex flex-col justify-end"
      >
        <div className="absolute inset-0 shimmer opacity-60" />
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="h-10 sm:h-14 w-3/4 rounded-xl bg-white/10" />
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-4/5 rounded bg-white/10" />
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 rounded-xl bg-white/10" />
            <div className="h-12 w-36 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  // 2. Error or Fallback state
  if (error || heroList.length === 0) {
    return (
      <div className="relative w-full min-h-[440px] sm:min-h-[520px] rounded-3xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] via-[var(--surface)] to-[var(--bg)] p-8 sm:p-14 lg:p-16 flex flex-col justify-center shadow-2xl">
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to CineScope</span>
          </div>

          <h1 className="font-serif text-[clamp(2.25rem,5vw,4.25rem)] font-bold tracking-tight text-[var(--text)] leading-[1.05]">
            Step into the Midnight Cinema.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Discover cinematic treasures, explore curated genres, series and midnight vaults with precision metadata.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/discover">
              <Button size="lg" icon={<Compass className="w-5 h-5" />}>
                Explore Discover
              </Button>
            </Link>

            {error && onRetry && (
              <Button
                variant="secondary"
                size="lg"
                onClick={onRetry}
                icon={<RotateCw className="w-5 h-5" />}
              >
                Retry Loading Hero
              </Button>
            )}
          </div>
        </div>

        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-[var(--gold)]/5 blur-3xl pointer-events-none" />
      </div>
    )
  }

  // Current active movie in carousel
  const activeMovie = heroList[currentIndex] || heroList[0]
  const backdropUrl = getImageUrl(activeMovie.backdrop_path || activeMovie.poster_path, 'backdrop')
  const year = getYear(activeMovie.release_date || activeMovie.first_air_date)
  const isTv = activeMovie.media_type === 'tv'
  const displayTitle = getDisplayTitle(activeMovie)
  const detailLink = `/movie/${activeMovie.id}${isTv ? '?type=tv' : ''}`

  return (
    <section
      aria-label="Featured Premiere Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl group select-none"
    >
      {/* Background Images for carousel items */}
      {heroList.map((m, idx) => {
        const itemBackdrop = getImageUrl(m.backdrop_path || m.poster_path, 'backdrop')
        const isCurrent = idx === currentIndex
        const hasError = imageErrorMap[m.id]

        if (!itemBackdrop || hasError) return null

        return (
          <img
            key={m.id}
            src={itemBackdrop}
            alt={`${getDisplayTitle(m)} backdrop`}
            onError={() => setImageErrorMap((prev) => ({ ...prev, [m.id]: true }))}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-95 pointer-events-none'
            } transition-transform duration-[8000ms] ease-out will-change-transform`}
          />
        )
      })}

      {(!backdropUrl || imageErrorMap[activeMovie.id]) && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--bg)] flex items-center justify-center">
          <Film className="w-24 h-24 text-white/10" />
        </div>
      )}

      {/* Strong gradients for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D] via-[rgba(10,10,13,0.88)] to-[rgba(10,10,13,0.3)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[rgba(10,10,13,0.72)] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(10,10,13,0.55)] to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-5">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)] text-glow-gold">
          {isTv ? <Tv className="w-3.5 h-3.5 text-[var(--gold)]" /> : <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />}
          <span>{isTv ? 'Featured Series Spotlight' : 'Featured Premiere'}</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[11px] text-white/70">
            {currentIndex + 1} / {heroList.length}
          </span>
        </div>

        {/* Serif Movie Title */}
        <h1
          key={activeMovie.id}
          className="font-serif text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight text-white leading-[1.06] drop-shadow-xl animate-fade-in"
        >
          {displayTitle}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm text-[var(--text-muted)]">
          <Rating voteAverage={activeMovie.vote_average} voteCount={activeMovie.vote_count} variant="pill" size="sm" />
          <span className="text-white/30">•</span>
          <span className="font-medium text-[var(--text)]">{year}</span>
          {activeMovie.original_language && (
            <>
              <span className="text-white/30">•</span>
              <span className="uppercase text-[11px] font-mono tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">
                {activeMovie.original_language}
              </span>
            </>
          )}
          {isTv && (
            <>
              <span className="text-white/30">•</span>
              <span className="uppercase text-[11px] font-bold tracking-wider text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/30">
                TV Series
              </span>
            </>
          )}
        </div>

        {/* 2-line Overview */}
        {activeMovie.overview && (
          <p className="text-sm sm:text-base text-[var(--text-muted)] line-clamp-2 leading-relaxed max-w-xl">
            {activeMovie.overview}
          </p>
        )}

        {/* Action Pair & Watchlist */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
          <Link to={detailLink}>
            <Button size="md" className="sm:!h-12 sm:!px-6" icon={<Play className="w-4 h-4 fill-current" />}>
              View Details
            </Button>
          </Link>

          <WatchlistButton movie={{ ...activeMovie, title: displayTitle }} variant="button" size="md" />

          <Link to="/discover" className="hidden sm:inline-block">
            <Button variant="secondary" size="md" className="sm:!h-12 sm:!px-6" icon={<Compass className="w-4 h-4" />}>
              Explore Discover
            </Button>
          </Link>
        </div>
      </div>

      {/* Carousel Controls: Arrows and Indicators */}
      {heroList.length > 1 && (
        <>
          {/* Navigation Arrows - Desktop/Tablet */}
          <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous featured movie"
              className="w-10 h-10 rounded-full bg-[rgba(20,20,26,0.7)] hover:bg-[var(--primary)] border border-white/10 text-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next featured movie"
              className="w-10 h-10 rounded-full bg-[rgba(20,20,26,0.7)] hover:bg-[var(--primary)] border border-white/10 text-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel dots - Mobile & Desktop */}
          <div className="absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/40 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full backdrop-blur-sm sm:backdrop-blur-none">
            {heroList.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${getDisplayTitle(m)}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-[var(--primary)] shadow-[var(--shadow-glow-red)]'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
