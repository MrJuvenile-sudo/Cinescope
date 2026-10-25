import React from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useWatchlist } from '../../context/WatchlistContext'
import { Movie, WatchlistItem } from '../../types/tmdb'

export interface WatchlistButtonProps {
  movie: Movie | WatchlistItem
  variant?: 'icon' | 'button'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  movie,
  variant = 'icon',
  size = 'md',
  className = '',
}) => {
  const { has, toggle } = useWatchlist()
  const isSaved = has(movie.id)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(movie)
  }

  const ariaLabel = isSaved
    ? `Remove ${movie.title} from Watchlist`
    : `Add ${movie.title} to Watchlist`

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isSaved}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-center gap-2 font-semibold select-none transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 cursor-pointer ${
          size === 'sm'
            ? 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]'
            : size === 'lg'
            ? 'px-6 py-3 text-base rounded-xl min-h-[48px]'
            : 'px-4 py-2.5 text-sm rounded-xl min-h-[44px]'
        } ${
          isSaved
            ? 'bg-[var(--primary)] text-white shadow-[0_0_16px_rgba(229,9,20,0.35)] hover:brightness-110'
            : 'glass-panel text-[var(--text)] hover:text-white hover:border-[var(--border-strong)] hover:bg-white/5'
        } ${className}`}
      >
        {isSaved ? (
          <BookmarkCheck className="w-5 h-5 fill-current" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
        <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </button>
    )
  }

  // Circular glass icon button (default for MovieCard top-right)
  const iconSizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size]

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={ariaLabel}
      className={`rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 cursor-pointer select-none ${iconSizeClasses} ${
        isSaved
          ? 'bg-[var(--primary)] text-white shadow-[0_0_12px_rgba(229,9,20,0.5)] border border-[var(--primary)] scale-105'
          : 'bg-black/60 border border-white/15 text-white/80 hover:text-white hover:bg-black/80 hover:scale-105'
      } ${className}`}
    >
      {isSaved ? (
        <BookmarkCheck className="w-4 h-4 fill-current" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </button>
  )
}
