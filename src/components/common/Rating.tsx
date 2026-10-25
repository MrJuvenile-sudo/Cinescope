import React from 'react'
import { Star } from 'lucide-react'
import { formatRating } from '../../utils/movieHelpers'

export interface RatingProps {
  voteAverage?: number | null
  voteCount?: number
  variant?: 'pill' | 'text'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Rating: React.FC<RatingProps> = ({
  voteAverage,
  voteCount,
  variant = 'pill',
  size = 'md',
  className = '',
}) => {
  const ratingText = formatRating(voteAverage, voteCount)
  const isNR = ratingText === 'NR'

  const sizeClasses = {
    sm: 'text-xs gap-1 py-0.5 px-2',
    md: 'text-sm gap-1.5 py-1 px-2.5',
    lg: 'text-base gap-2 py-1.5 px-3',
  }[size]

  const starSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size]

  const ariaLabel = isNR ? 'Not rated' : `Rating: ${ratingText} out of 10`

  if (variant === 'text') {
    return (
      <span
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1 font-semibold tabular-nums text-[var(--gold)] ${className}`}
      >
        <Star className={`${starSizeClasses} fill-[var(--gold)]`} aria-hidden="true" />
        <span>{ratingText}</span>
      </span>
    )
  }

  // Pill variant: glass rating pill for MovieCard top-left
  return (
    <div
      aria-label={ariaLabel}
      className={`inline-flex items-center rounded-full bg-black/65 border border-white/15 backdrop-blur-md font-semibold tabular-nums text-white select-none ${sizeClasses} ${className}`}
    >
      <Star
        className={`${starSizeClasses} ${
          isNR ? 'text-[var(--text-muted)]' : 'text-[var(--gold)] fill-[var(--gold)]'
        }`}
        aria-hidden="true"
      />
      <span className={isNR ? 'text-[var(--text-muted)]' : 'text-white'}>
        {ratingText}
      </span>
    </div>
  )
}
