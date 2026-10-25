import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Film, Play, Bookmark, Star, Clock, Calendar, ArrowLeft } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Button } from '../components/common/Button'
import { Chip } from '../components/common/Chip'
import { Divider } from '../components/common/Divider'

export const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>()
  useDocumentTitle(movieId ? `Movie #${movieId}` : 'Movie Details')

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--gold)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Hero Header Dossier */}
      <div className="relative rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--surface)] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Poster placeholder */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="aspect-[2/3] rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col items-center justify-center text-center p-6 shadow-xl">
              <Film className="w-12 h-12 text-[var(--gold)] mb-3" />
              <span className="font-serif text-sm font-semibold text-[var(--text)]">Poster Slot</span>
              <span className="text-xs text-[var(--text-muted)] mt-1">w500 TMDB Image (Phase 5)</span>
            </div>
          </div>

          {/* Details Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Movie Identifier: #{movieId || '550'}
              </span>
              <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text)] leading-tight mt-1">
                Cinematic Feature Presentation
              </h1>
              <p className="text-sm sm:text-base italic text-[var(--gold)]/80 mt-1">
                "An unforgettable story forged through light and shadow."
              </p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 text-[var(--gold)] font-semibold">
                <Star className="w-4 h-4 fill-[var(--gold)]" />
                8.4 / 10
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                2024
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                2h 28m
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              <Chip>Drama</Chip>
              <Chip>Thriller</Chip>
              <Chip>Mystery</Chip>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Synopsis
              </h2>
              <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed max-w-3xl">
                Comprehensive movie synopsis, director credentials, credits, runtime formatting,
                and high-definition trailer playback are wired directly in Phase 5 via TMDB append_to_response endpoint.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" icon={<Bookmark className="w-5 h-5" />}>
                Add to Watchlist
              </Button>
              <Button variant="secondary" size="lg" icon={<Play className="w-5 h-5" />}>
                Watch Official Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Cast placeholder */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-[var(--text)]">Top Billed Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((c) => (
            <div key={c} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--surface-2)] mx-auto mb-2 flex items-center justify-center font-serif text-xs text-[var(--gold)]">
                Actor {c}
              </div>
              <p className="text-xs font-semibold text-[var(--text)] truncate">Cast Member</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">Character Name</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
