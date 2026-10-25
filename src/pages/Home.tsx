import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Sparkles, TrendingUp, Star, Bookmark } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { Chip } from '../components/common/Chip'
import { Divider } from '../components/common/Divider'

export const Home: React.FC = () => {
  useDocumentTitle('Home — Midnight Cinema Discovery')

  const popularGenres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Animation']

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Hero Showcase Placeholder */}
      <section className="relative rounded-2xl sm:rounded-3xl border border-[var(--border)] overflow-hidden bg-gradient-to-b from-[var(--surface-2)]/50 to-[var(--surface)] p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="max-w-2xl space-y-4 sm:space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Cinema
          </span>
          <h1 className="font-serif text-[clamp(2.25rem,5vw,4.25rem)] font-bold tracking-tight text-[var(--text)] leading-[1.05]">
            Discover the Art of Motion Pictures.
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Step into the midnight screening room. Explore trending masterpieces, browse curated genres,
            and maintain your personal cinematic watchlist with precision metadata.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/discover">
              <Button size="lg" icon={<Compass className="w-5 h-5" />}>
                Explore Discover
              </Button>
            </Link>
            <Link to="/watchlist">
              <Button variant="secondary" size="lg" icon={<Bookmark className="w-5 h-5" />}>
                Your Watchlist
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Genre Shortcuts */}
      <section>
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Quick Exploration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text)] mt-1">
            Browse by Genre
          </h2>
        </div>
        <div className="flex flex-wrap gap-2.5 pt-2">
          {popularGenres.map((genre) => (
            <Link key={genre} to={`/discover?genre=${genre.toLowerCase()}`}>
              <Chip>{genre}</Chip>
            </Link>
          ))}
        </div>
      </section>

      <Divider />

      {/* Rows Preview Sections */}
      <div className="space-y-12">
        <section>
          <SectionHeading
            eyebrow="Trending This Week"
            title="The Films Captivating Audiences"
            subtitle="Real-time cinematic trends updated daily from global theater and streaming reception."
            viewAllHref="/discover?sort=popularity.desc"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col items-center justify-center text-center aspect-[2/3] hover:border-[var(--border-strong)] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <span className="font-serif text-sm font-medium text-[var(--text)]">Trending Item {item}</span>
                <span className="text-xs text-[var(--text-muted)] mt-1">TMDB Syncing in Phase 4</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="All-Time Classics"
            title="Top Rated Cinema"
            subtitle="The highest-rated cinematic works evaluated by critics and cinephiles."
            viewAllHref="/discover?sort=vote_average.desc"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col items-center justify-center text-center aspect-[2/3] hover:border-[var(--border-strong)] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <span className="font-serif text-sm font-medium text-[var(--text)]">Top Rated {item}</span>
                <span className="text-xs text-[var(--text-muted)] mt-1">TMDB Syncing in Phase 4</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
