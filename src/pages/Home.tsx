import React from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Compass, Flame } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTmdbQuery } from '../hooks/useTmdbQuery'
import { getTrending, getPopular, getTopRated } from '../services/movieService'
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
  { id: '878', name: 'Science Fiction', emoji: '🚀' },
  { id: '53', name: 'Thriller', emoji: '🔪' },
  { id: '12', name: 'Adventure', emoji: '🗺️' },
  { id: '16', name: 'Animation', emoji: '✨' },
  { id: '27', name: 'Horror', emoji: '👻' },
]

export const Home: React.FC = () => {
  useDocumentTitle('Premiere — Midnight Cinema Discovery')
  const { items: watchlistItems } = useWatchlist()

  // 1. Trending movies query (powers Hero and Trending Row)
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

  // 3. Top Rated movies query
  const {
    data: topRatedData,
    loading: topRatedLoading,
    error: topRatedError,
    retry: retryTopRated,
  } = useTmdbQuery((signal, isRetry) => getTopRated(1, signal, isRetry), [])

  // First trending movie with backdrop for hero
  const featuredMovie =
    trendingData?.results?.find((m) => m.backdrop_path || m.poster_path) ||
    trendingData?.results?.[0] ||
    null

  // Trending row items (slice after hero if available, or full list)
  const trendingRowMovies = trendingData?.results || []
  const popularRowMovies = popularData?.results || []
  const topRatedRowMovies = topRatedData?.results || []

  // Recent 6 watchlist items
  const recentWatchlist = watchlistItems.slice(0, 6)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* Cinematic Hero */}
      <MovieHero
        movie={featuredMovie}
        loading={trendingLoading}
        error={trendingError}
        onRetry={retryTrending}
      />

      {/* Genre Shortcut Chips */}
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
            const discoverUrl = `/discover?${buildDiscoverParams({
              genre: genre.id,
              year: 'any',
              rating: 'any',
              sort: 'popularity.desc',
              page: '1',
            }).toString()}`

            return (
              <Link key={genre.id} to={discoverUrl} className={`animate-fade-up stagger-${Math.min(idx + 1, 6)}`}>
                <Chip icon={<span aria-hidden="true">{genre.emoji}</span>}>{genre.name}</Chip>
              </Link>
            )
          })}
        </div>
      </section>

      <Divider />

      {/* Row 1: Trending This Week */}
      <MovieRow
        eyebrow="Global Momentum"
        title="Trending This Week"
        subtitle="The motion pictures capturing audience attention around the globe right now."
        viewAllHref="/discover?sort=popularity.desc"
        movies={trendingRowMovies}
        loading={trendingLoading}
        error={trendingError}
        onRetry={retryTrending}
      />

      <Divider />

      {/* Row 2: Popular Now */}
      <MovieRow
        eyebrow="Box Office & Buzz"
        title="Popular Now"
        subtitle="Currently high in theatrical circulation and active streaming discussions."
        viewAllHref="/discover?sort=popularity.desc"
        movies={popularRowMovies}
        loading={popularLoading}
        error={popularError}
        onRetry={retryPopular}
      />

      <Divider />

      {/* Row 3: Top Rated Classics */}
      <MovieRow
        eyebrow="Critical Acclaim"
        title="Top Rated Classics"
        subtitle="The highest-rated cinematic masterpieces of all time evaluated by film enthusiasts."
        viewAllHref="/discover?sort=vote_average.desc"
        movies={topRatedRowMovies}
        loading={topRatedLoading}
        error={topRatedError}
        onRetry={retryTopRated}
      />

      <Divider />

      {/* MID 18+ Cinema Spotlight Banner */}
      <section aria-label="MID 18+ Cinema Spotlight" className="relative rounded-3xl overflow-hidden border border-[var(--primary)]/30 bg-gradient-to-r from-[rgba(229,9,20,0.16)] via-[rgba(20,20,26,0.95)] to-[rgba(10,10,13,0.95)] p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-widest shadow-[var(--shadow-glow-red)]">
              <span>🔞 18+ Adult Cinema</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Step Into the MID Vault
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Explore uncut, provocative R-rated and NC-17 films, psychological thrillers, and dark mature productions curated for adult audiences.
            </p>
          </div>
          <Link to="/mid" className="shrink-0">
            <Button size="lg" icon={<Flame className="w-4 h-4 text-white" />}>
              Explore MID (18+)
            </Button>
          </Link>
        </div>
      </section>

      <Divider />

      {/* "Your Watchlist" Strip */}
      <section aria-label="Your Watchlist Reel" className="space-y-6">
        <SectionHeading
          eyebrow="Personal Vault"
          title={`Your Watchlist · ${watchlistItems.length} Saved`}
          subtitle="Quick access to movies queued for your next screening."
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
                Bookmark films across Trending reels or Discover to keep your upcoming screenings organized.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/discover">
                <Button size="md" icon={<Compass className="w-4 h-4" />}>
                  Discover Movies
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
