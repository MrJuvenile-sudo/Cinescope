import React from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Compass } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTmdbQuery } from '../hooks/useTmdbQuery'
import {
  getTrending,
  getPopular,
  getTopRated,
  getTrendingTv,
  getMoviesByGenre,
  getMidMovies,
} from '../services/movieService'
import { useWatchlist } from '../context/WatchlistContext'
import { buildDiscoverParams } from '../utils/discoverUrlState'
import { MovieHero } from '../components/movie/MovieHero'
import { MovieRow } from '../components/movie/MovieRow'
import { MovieCard } from '../components/movie/MovieCard'
import { SectionHeading } from '../components/common/SectionHeading'
import { Chip } from '../components/common/Chip'
import { Divider } from '../components/common/Divider'
import { Button } from '../components/common/Button'

const GENRE_SHORTCUTS = [
  { id: '28', name: 'Action', emoji: '⚡' },
  { id: '35', name: 'Comedy', emoji: '😂' },
  { id: '18', name: 'Drama', emoji: '🎭' },
  { id: '878', name: 'Sci-Fi', emoji: '🚀' },
  { id: '53', name: 'Thriller', emoji: '🔪' },
  { id: '12', name: 'Adventure', emoji: '🗺️' },
  { id: '16', name: 'Animation', emoji: '✨' },
  { id: '27', name: 'Horror', emoji: '👻' },
  { id: 'mid', name: 'MID (18+)', emoji: '🔞', isMid: true },
]

export const Home: React.FC = () => {
  useDocumentTitle('Premiere — Midnight Cinema Discovery')
  const { items: watchlistItems } = useWatchlist()

  // 1. Trending movies query (powers Hero carousel & Trending Row)
  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
    retry: retryTrending,
  } = useTmdbQuery((signal, isRetry) => getTrending('week', signal, isRetry), [])

  // 2. Popular movies query
  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
    retry: retryPopular,
  } = useTmdbQuery((signal, isRetry) => getPopular(1, signal, isRetry), [])

  // 3. Trending TV Series query
  const {
    data: tvData,
    loading: tvLoading,
    error: tvError,
    retry: retryTv,
  } = useTmdbQuery((signal, isRetry) => getTrendingTv('week', signal, isRetry), [])

  // 4. Action & Adventure category query (Genre 28)
  const {
    data: actionData,
    loading: actionLoading,
    error: actionError,
    retry: retryAction,
  } = useTmdbQuery((signal, isRetry) => getMoviesByGenre('28', 1, signal, isRetry), [])

  // 5. Sci-Fi & Fantasy category query (Genre 878)
  const {
    data: sciFiData,
    loading: sciFiLoading,
    error: sciFiError,
    retry: retrySciFi,
  } = useTmdbQuery((signal, isRetry) => getMoviesByGenre('878', 1, signal, isRetry), [])

  // 6. Horror & Dark Thrillers category query (Genre 27)
  const {
    data: horrorData,
    loading: horrorLoading,
    error: horrorError,
    retry: retryHorror,
  } = useTmdbQuery((signal, isRetry) => getMoviesByGenre('27', 1, signal, isRetry), [])

  // 7. Top Rated Masterpieces
  const {
    data: topRatedData,
    loading: topRatedLoading,
    error: topRatedError,
    retry: retryTopRated,
  } = useTmdbQuery((signal, isRetry) => getTopRated(1, signal, isRetry), [])

  // 8. MID 18+ Category Reel
  const {
    data: midData,
    loading: midLoading,
    error: midError,
    retry: retryMid,
  } = useTmdbQuery((signal, isRetry) => getMidMovies(1, 'all', 'popularity.desc', signal, isRetry), [])

  // Movies for Hero Carousel (first 8 trending films)
  const heroMovies = trendingData?.results || []

  // Row movies
  const trendingRowMovies = trendingData?.results || []
  const popularRowMovies = popularData?.results || []
  const tvRowMovies = tvData?.results || []
  const actionRowMovies = actionData?.results || []
  const sciFiRowMovies = sciFiData?.results || []
  const horrorRowMovies = horrorData?.results || []
  const topRatedRowMovies = topRatedData?.results || []
  const midRowMovies = midData?.results || []

  // Recent 6 watchlist items
  const recentWatchlist = watchlistItems.slice(0, 6)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* Dynamic Multi-Movie Hero Carousel */}
      <MovieHero
        movies={heroMovies}
        loading={trendingLoading}
        error={trendingError}
        onRetry={retryTrending}
      />

      {/* Genre & Category Quick Launch Chips */}
      <section aria-label="Genre Shortcuts" className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Curated Categories
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text)] mt-1">
            Explore by Genre
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {GENRE_SHORTCUTS.map((genre, idx) => {
            const href = genre.isMid
              ? '/mid'
              : `/discover?${buildDiscoverParams({
                  genre: genre.id,
                  year: 'any',
                  rating: 'any',
                  sort: 'popularity.desc',
                  page: '1',
                }).toString()}`

            return (
              <Link key={genre.id} to={href} className={`animate-fade-up stagger-${Math.min(idx + 1, 6)}`}>
                <Chip
                  icon={<span aria-hidden="true">{genre.emoji}</span>}
                  className={
                    genre.isMid
                      ? 'border-[var(--primary)] text-white font-semibold bg-[rgba(229,9,20,0.18)] shadow-[var(--shadow-glow-red)] hover:bg-[rgba(229,9,20,0.28)] ring-1 ring-[var(--primary)]/50'
                      : ''
                  }
                >
                  {genre.name}
                </Chip>
              </Link>
            )
          })}
        </div>
      </section>

      <Divider />

      {/* Section 1: Trending Movies This Week */}
      <MovieRow
        eyebrow="Global Momentum"
        title="Trending Movies This Week"
        subtitle="The motion pictures capturing audience attention around the globe right now."
        viewAllHref="/discover?sort=popularity.desc"
        movies={trendingRowMovies}
        loading={trendingLoading}
        error={trendingError}
        onRetry={retryTrending}
      />

      <Divider />

      {/* Section 2: Top TV & Web Series Spotlight */}
      <MovieRow
        eyebrow="Binge-Worthy TV & Web Series"
        title="Trending Television Series"
        subtitle="Critically acclaimed drama, mystery, and streaming episodic series making waves."
        movies={tvRowMovies}
        loading={tvLoading}
        error={tvError}
        onRetry={retryTv}
      />

      <Divider />

      {/* Section 3: Popular Movies */}
      <MovieRow
        eyebrow="Box Office & Buzz"
        title="Popular Right Now"
        subtitle="Currently high in theatrical circulation and active streaming discussions."
        viewAllHref="/discover?sort=popularity.desc"
        movies={popularRowMovies}
        loading={popularLoading}
        error={popularError}
        onRetry={retryPopular}
      />

      <Divider />

      {/* Section 4: Action & High Adrenaline */}
      <MovieRow
        eyebrow="Adrenaline & Martial Arts"
        title="Action Blockbusters"
        subtitle="Explosive spectacles, fast-paced chases, and thrilling combat choreography."
        viewAllHref={`/discover?${buildDiscoverParams({ genre: '28', year: 'any', rating: 'any', sort: 'popularity.desc', page: '1' }).toString()}`}
        movies={actionRowMovies}
        loading={actionLoading}
        error={actionError}
        onRetry={retryAction}
      />

      <Divider />

      {/* Section 5: Sci-Fi & Futuristic Realities */}
      <MovieRow
        eyebrow="Speculative Worlds & Cyberpunk"
        title="Sci-Fi & Futuristic Realities"
        subtitle="Mind-bending space voyages, quantum physics, and dystopian future visions."
        viewAllHref={`/discover?${buildDiscoverParams({ genre: '878', year: 'any', rating: 'any', sort: 'popularity.desc', page: '1' }).toString()}`}
        movies={sciFiRowMovies}
        loading={sciFiLoading}
        error={sciFiError}
        onRetry={retrySciFi}
      />

      <Divider />

      {/* Section 6: Horror & Midnight Nightmares */}
      <MovieRow
        eyebrow="Supernatural & Psychological Horror"
        title="Horror & Midnight Chills"
        subtitle="Paranormal haunts, visceral tension, and dread engineered for midnight viewing."
        viewAllHref={`/discover?${buildDiscoverParams({ genre: '27', year: 'any', rating: 'any', sort: 'popularity.desc', page: '1' }).toString()}`}
        movies={horrorRowMovies}
        loading={horrorLoading}
        error={horrorError}
        onRetry={retryHorror}
      />

      <Divider />

      {/* Section 7: Top Rated Masterpieces */}
      <MovieRow
        eyebrow="Critical Acclaim"
        title="Top Rated Masterpieces"
        subtitle="The highest-rated cinematic triumphs evaluated by global film critics."
        viewAllHref="/discover?sort=vote_average.desc"
        movies={topRatedRowMovies}
        loading={topRatedLoading}
        error={topRatedError}
        onRetry={retryTopRated}
      />

      <Divider />

      {/* Section 8: MID 18+ Uncut Category Row */}
      <MovieRow
        eyebrow="🔞 18+ Mature Cinema Vault"
        title="MID 18+ Erotic & Mature Cinema"
        subtitle="Provocative, sensual, and uncut adult cinema curated strictly for mature audiences."
        viewAllHref="/mid"
        movies={midRowMovies}
        loading={midLoading}
        error={midError}
        onRetry={retryMid}
      />

      <Divider />

      {/* "Your Watchlist" Strip */}
      <section aria-label="Your Watchlist Reel" className="space-y-6">
        <SectionHeading
          eyebrow="Personal Vault"
          title={`Your Watchlist · ${watchlistItems.length} Saved`}
          subtitle="Quick access to movies and series queued for your next screening."
          viewAllHref="/watchlist"
          viewAllLabel="Open Watchlist Vault"
        />

        {recentWatchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {recentWatchlist.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-2)] border border-[var(--border)] mx-auto flex items-center justify-center text-[var(--gold)]">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[var(--text)]">
                Your Watchlist is Empty
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                Bookmark films across Trending reels, Series, or Discover to keep your upcoming screenings organized.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/discover">
                <Button size="md" icon={<Compass className="w-4 h-4" />}>
                  Discover Titles
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
