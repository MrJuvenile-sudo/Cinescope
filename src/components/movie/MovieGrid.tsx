import React from 'react'
import { Movie, WatchlistItem } from '../../types/tmdb'
import { MovieCard } from './MovieCard'

export interface MovieGridProps {
  movies: (Movie | WatchlistItem)[]
  className?: string
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 ${className}`}
    >
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="transition-all duration-300"
          style={{
            animationDelay: `${Math.min(index, 12) * 40}ms`,
          }}
        >
          <MovieCard movie={movie} priority={index < 4} />
        </div>
      ))}
    </div>
  )
}
