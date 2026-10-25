import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Film } from 'lucide-react'
import { Movie, WatchlistItem } from '../../types/tmdb'
import { getImageUrl } from '../../utils/imageUrl'
import { getYear } from '../../utils/movieHelpers'
import { Rating } from '../common/Rating'
import { WatchlistButton } from './WatchlistButton'

export interface MovieCardProps {
  movie: Movie | WatchlistItem
  priority?: boolean
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, priority = false }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const posterUrl = getImageUrl(movie.poster_path, 'poster_card')
  const year = getYear(movie.release_date)

  return (
    <div className="group relative flex flex-col h-full select-none">
      <Link
        to={`/movie/${movie.id}`}
        className="relative block w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] card-hover group-hover:border-[var(--border-strong)] group-hover:ring-1 group-hover:ring-[var(--primary)]/25 focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-4"
      >
        {/* Shimmer placeholder while loading */}
        {posterUrl && !imageLoaded && !imageError && (
          <div className="absolute inset-0 shimmer rounded-2xl" aria-hidden="true" />
        )}

        {/* Poster Image or Placeholder Fallback */}
        {posterUrl && !imageError ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] text-[var(--text-muted)]">
            <div className="w-14 h-14 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-3 shadow-inner animate-float">
              <Film className="w-7 h-7 text-[var(--gold)]/70" />
            </div>
            <span className="font-serif text-xs font-medium text-[var(--text)] line-clamp-2">
              {movie.title}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">No Poster</span>
          </div>
        )}

        {/* Top-left: Glass Rating Pill */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <Rating voteAverage={movie.vote_average} variant="pill" size="sm" />
        </div>

        {/* Top-right: Circular Glass Watchlist Button — visible on hover */}
        <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WatchlistButton movie={movie} size="sm" />
        </div>

        {/* Hover Bottom Shadow Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      {/* Meta details always visible below card */}
      <div className="pt-2.5 px-0.5 space-y-1">
        <Link
          to={`/movie/${movie.id}`}
          className="font-serif text-sm sm:text-base font-semibold text-[var(--text)] leading-snug line-clamp-2 hover:text-[var(--gold)] transition-colors duration-150"
        >
          {movie.title}
        </Link>
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{year}</span>
          <span className="font-mono text-[11px] text-[var(--gold)] text-glow-gold">
            ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
          </span>
        </div>
      </div>
    </div>
  )
}
