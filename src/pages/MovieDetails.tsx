import React, { useEffect } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Film, Calendar, Clock, ArrowLeft, Clapperboard, Compass, Tv } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTmdbQuery } from '../hooks/useTmdbQuery'
import { getMovieDetails, getTvDetails } from '../services/movieService'
import { MovieDetails as MovieDetailsType, TmdbError } from '../types/tmdb'
import { getImageUrl } from '../utils/imageUrl'
import { getYear, formatRuntime, getDisplayTitle } from '../utils/movieHelpers'
import { buildDiscoverParams } from '../utils/discoverUrlState'
import { LoadingSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/ErrorState'
import { Rating } from '../components/common/Rating'
import { Button } from '../components/common/Button'
import { WatchlistButton } from '../components/movie/WatchlistButton'
import { MovieWatchDownloadButtons } from '../components/movie/MovieWatchDownloadButtons'
import { MoviePicturesGallery } from '../components/movie/MoviePicturesGallery'
import { CastList } from '../components/movie/CastList'
import { MovieRow } from '../components/movie/MovieRow'

export const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isTv = searchParams.get('type') === 'tv'

  // Validate numeric ID: must be non-empty digits
  const isValidId = Boolean(movieId && /^\d+$/.test(movieId))

  const handleBack = () => {
    // Navigate back exactly 1 single screen page in history
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  // Scroll to top on movie ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [movieId])

  const {
    data: movie,
    loading,
    error,
    retry,
  } = useTmdbQuery<MovieDetailsType>(
    (signal) => (isTv ? getTvDetails(movieId!, signal) : getMovieDetails(movieId!, signal)),
    [movieId, isTv],
    { enabled: isValidId }
  )

  const titleText = getDisplayTitle(movie)

  useDocumentTitle(
    titleText
      ? `${titleText} — CineScope`
      : isValidId
      ? isTv ? 'Loading Series... — CineScope' : 'Loading Movie... — CineScope'
      : 'Title Not Found — CineScope'
  )

  // 1. Invalid ID parameter guard
  if (!isValidId) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <ErrorState
          error={new TmdbError('not_found', 'Invalid identifier provided in the URL.')}
          title="Scene Not Found"
          description="The requested title identifier is not valid. Please select a valid title from the catalog."
        />
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-white hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link to="/discover">
            <Button size="md" icon={<Compass className="w-4 h-4" />}>
              Explore Catalog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 2. Loading state
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 mb-6">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to previous page"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--gold)] hover:text-white transition-colors cursor-pointer select-none py-1.5 px-3 -ml-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[var(--border)] hover:border-[var(--gold)]/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
        <LoadingSkeleton variant="details" />
      </div>
    )
  }

  // 3. Error state
  if (error || !movie) {
    const isNotFound = error?.kind === 'not_found'
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <ErrorState
          error={error}
          onRetry={isNotFound ? undefined : retry}
          title={isNotFound ? 'Movie Not Found' : undefined}
          description={
            isNotFound
              ? 'This cinematic title could not be found in the TMDB catalog or may have been removed.'
              : undefined
          }
        />
        {isNotFound && (
          <div className="mt-8 flex justify-center">
            <Link to="/discover">
              <Button size="md" icon={<Compass className="w-4 h-4" />}>
                Return to Discover
              </Button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  // 4. Dossier Data Preparation
  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop')
  const posterUrl = getImageUrl(movie.poster_path, 'poster_details')
  const releaseYear = getYear(movie.release_date || movie.first_air_date)
  const runtimeFormatted = isTv
    ? movie.number_of_seasons
      ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? 's' : ''}${movie.number_of_episodes ? ` (${movie.number_of_episodes} eps)` : ''}`
      : 'Series'
    : formatRuntime(movie.runtime)
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')
  const similarMovies = movie.similar?.results?.filter((m) => m.id !== movie.id) || []
  const title = getDisplayTitle(movie)

  return (
    <article aria-labelledby="movie-details-title" className="space-y-12 sm:space-y-16 pb-16">
      {/* Cinematic Backdrop Hero Dossier */}
      <div className="relative min-h-[500px] lg:min-h-[620px] bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden">
        {/* Backdrop Image & Atmospheric Gradients */}
        {backdropUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={backdropUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-30 select-none pointer-events-none scale-105 filter blur-[1px]"
            />
            {/* Multi-layered Cinema Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-[var(--bg)]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/70 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
          {/* Breadcrumb / Back Link */}
          <div>
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back to previous page"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--gold)] hover:text-white transition-colors cursor-pointer select-none py-1.5 px-3 -ml-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[var(--border)] hover:border-[var(--gold)]/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Poster Dossier */}
            <div className="md:col-span-5 lg:col-span-4 xl:col-span-3">
              <div className="relative aspect-[2/3] w-full max-w-[320px] mx-auto md:max-w-none rounded-2xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border-strong)] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.9)]">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={`${title} theatrical poster`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] text-[var(--text-muted)]">
                    {isTv ? <Tv className="w-12 h-12 text-[var(--gold)]/70 mb-3" /> : <Film className="w-12 h-12 text-[var(--gold)]/70 mb-3" />}
                    <span className="font-serif text-base font-semibold text-[var(--text)]">
                      {title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] mt-1">
                      No Poster Available
                    </span>
                  </div>
                )}

                {/* Poster corner rating badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Rating voteAverage={movie.vote_average} variant="pill" size="md" />
                </div>
              </div>
            </div>

            {/* Right Column: Title, Metadata, Actions, Synopsis */}
            <div className="md:col-span-7 lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Header Titles */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  {isTv ? <Tv className="w-3.5 h-3.5" /> : <Clapperboard className="w-3.5 h-3.5" />}
                  <span>{isTv ? 'Television Series Dossier' : 'Feature Presentation'}</span>
                </div>

                <h1
                  id="movie-details-title"
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text)] leading-tight"
                >
                  {title}
                </h1>

                {movie.tagline && (
                  <p className="font-serif italic text-base sm:text-lg text-[var(--gold)]/90 leading-snug">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              {/* Metadata Badges Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[var(--text-muted)] border-y border-[var(--border)] py-3">
                <div className="flex items-center gap-1.5 font-medium text-white">
                  <Calendar className="w-4 h-4 text-[var(--gold)]" />
                  <span>{releaseYear}</span>
                </div>

                {runtimeFormatted !== '—' && (
                  <div className="flex items-center gap-1.5 font-medium text-white">
                    <Clock className="w-4 h-4 text-[var(--gold)]" />
                    <span>{runtimeFormatted}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">Rating:</span>
                  <Rating voteAverage={movie.vote_average} variant="text" size="sm" />
                  <span className="text-xs text-[var(--text-muted)]">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>

                {director && (
                  <div className="text-xs sm:text-sm">
                    <span className="text-[var(--text-muted)]">Directed by </span>
                    <strong className="text-white font-medium">{director.name}</strong>
                  </div>
                )}
              </div>

              {/* Genre Badges linking to Discover */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center" aria-label="Movie genres">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/discover?${buildDiscoverParams({
                        genre: String(genre.id),
                        year: 'any',
                        rating: 'any',
                        sort: 'popularity.desc',
                        page: '1',
                      }).toString()}`}
                      title={`Discover more ${genre.name} titles`}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--gold)] hover:border-[var(--gold)] hover:text-white transition-all duration-200 select-none"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Action Buttons: Watch Now, Download & Watchlist */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <MovieWatchDownloadButtons movie={{ ...movie, title }} />
                <WatchlistButton movie={{ ...movie, title }} variant="button" size="lg" />
              </div>

              {/* Synopsis / Overview */}
              <div className="space-y-2.5 pt-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Synopsis
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[var(--text-muted)] max-w-3xl">
                  {movie.overview && movie.overview.trim().length > 0
                    ? movie.overview
                    : 'No synopsis has been provided for this title yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dossier Sections */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Movie Pictures & Scene Stills Gallery */}
        {movie.images?.backdrops && movie.images.backdrops.length > 0 && (
          <MoviePicturesGallery
            images={movie.images.backdrops}
            movieTitle={title}
          />
        )}

        {/* Cast Section (hidden automatically if empty) */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <CastList cast={movie.credits.cast} />
        )}

        {/* Similar Movies Section (hidden if empty) */}
        {similarMovies.length > 0 && (
          <MovieRow
            eyebrow="Recommendations"
            title="Similar Productions"
            subtitle="Titles sharing thematic or stylistic connections"
            movies={similarMovies.slice(0, 12)}
          />
        )}
      </div>
    </article>
  )
}
