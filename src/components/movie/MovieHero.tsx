import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Compass, Sparkles, Film, RotateCw } from 'lucide-react'
import { Movie } from '../../types/tmdb'
import { getImageUrl } from '../../utils/imageUrl'
import { getYear } from '../../utils/movieHelpers'
import { Rating } from '../common/Rating'
import { Button } from '../common/Button'
import { WatchlistButton } from './WatchlistButton'

export interface MovieHeroProps {
  movie: Movie | null
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export const MovieHero: React.FC<MovieHeroProps> = ({
  movie,
  loading = false,
  error = null,
  onRetry,
}) => {
  const [imageError, setImageError] = useState(false)

  // 1. Loading Skeleton state
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading featured premiere"
        className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] rounded-3xl overflow-hidden bg-[var(--surface-2)] animate-pulse border border-[var(--border)] p-8 sm:p-14 flex flex-col justify-end"
      >
        <div className="max-w-2xl space-y-4">
          <div className="h-4 w-32 rounded bg-white/10" />
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

  // 2. Error or Fallback state (e.g. offline, missing credential, or no trending movies)
  if (error || !movie) {
    return (
      <div className="relative w-full min-h-[440px] sm:min-h-[500px] rounded-3xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] via-[var(--surface)] to-[var(--bg)] p-8 sm:p-14 lg:p-16 flex flex-col justify-center shadow-2xl">
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to CineScope</span>
          </div>

          <h1 className="font-serif text-[clamp(2.25rem,5vw,4.25rem)] font-bold tracking-tight text-[var(--text)] leading-[1.05]">
            Step into the Midnight Cinema.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Discover cinematic treasures, explore curated genres, and maintain your personal
            movie watchlist with precision metadata.
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

        {/* Ambient background decoration */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
      </div>
    )
  }

  // 3. Featured Movie Hero Presentation
  const backdropUrl = getImageUrl(movie.backdrop_path || movie.poster_path, 'backdrop')
  const year = getYear(movie.release_date)

  return (
    <section
      aria-label="Featured Premiere"
      className="relative w-full h-[500px] sm:h-[580px] lg:h-[640px] rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl group select-none"
    >
      {/* Background Image with slow Ken-Burns zoom */}
      {backdropUrl && !imageError ? (
        <img
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top scale-100 motion-safe:group-hover:scale-105 transition-transform duration-[8000ms] ease-out will-change-transform"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--bg)] flex items-center justify-center">
          <Film className="w-24 h-24 text-white/10" />
        </div>
      )}

      {/* Dual Gradients for flawless readability */}
      {/* 1. Left-to-right gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/85 to-transparent sm:w-3/4 pointer-events-none" />
      {/* 2. Bottom-to-top gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-5">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>Featured Premiere</span>
        </div>

        {/* Serif Movie Title */}
        <h1 className="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold tracking-tight text-[var(--text)] leading-[1.08] drop-shadow-md">
          {movie.title}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm text-[var(--text-muted)]">
          <Rating voteAverage={movie.vote_average} voteCount={movie.vote_count} variant="pill" size="sm" />
          <span>•</span>
          <span className="font-medium text-[var(--text)]">{year}</span>
          {movie.original_language && (
            <>
              <span>•</span>
              <span className="uppercase text-[11px] font-mono tracking-wider bg-white/10 px-2 py-0.5 rounded">
                {movie.original_language}
              </span>
            </>
          )}
        </div>

        {/* 2-line Overview */}
        {movie.overview && (
          <p className="text-sm sm:text-base text-[var(--text-muted)] line-clamp-2 leading-relaxed max-w-2xl">
            {movie.overview}
          </p>
        )}

        {/* Action Pair & Watchlist */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <Link to={`/movie/${movie.id}`}>
            <Button size="lg" icon={<Play className="w-4 h-4 fill-current" />}>
              View Details
            </Button>
          </Link>

          <WatchlistButton movie={movie} variant="button" size="lg" />

          <Link to="/discover">
            <Button variant="secondary" size="lg" icon={<Compass className="w-4 h-4" />}>
              Explore Discover
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
