import React, { useState } from 'react'
import { Play } from 'lucide-react'
import { Video } from '../../types/tmdb'
import { pickTrailer } from '../../utils/movieHelpers'
import { TrailerModal } from './TrailerModal'

export interface TrailerButtonProps {
  videos?: Video[] | null
  movieTitle: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'glass'
  className?: string
}

export const TrailerButton: React.FC<TrailerButtonProps> = ({
  videos,
  movieTitle,
  size = 'md',
  variant = 'glass',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const trailer = pickTrailer(videos)

  if (!trailer) {
    return null
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-xl min-h-[44px]',
    lg: 'px-6 py-3 text-base rounded-xl min-h-[48px]',
  }[size]

  const variantClasses = {
    primary:
      'bg-[var(--primary)] text-white shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:brightness-110 active:scale-95',
    secondary:
      'bg-[var(--gold)] text-black font-semibold shadow-[0_0_16px_rgba(230,180,80,0.3)] hover:brightness-110 active:scale-95',
    glass:
      'glass-panel text-white hover:border-[var(--gold)]/40 hover:bg-white/10 active:scale-95',
  }[variant]

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label={`Play trailer for ${movieTitle}`}
        className={`inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 cursor-pointer select-none ${sizeClasses} ${variantClasses} ${className}`}
      >
        <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
          <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
        </div>
        <span>Watch Trailer</span>
      </button>

      <TrailerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trailer={trailer}
        movieTitle={movieTitle}
      />
    </>
  )
}
