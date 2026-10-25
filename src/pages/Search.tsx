import React from 'react'
import { Search as SearchIcon, Film, Sparkles } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'

export const Search: React.FC = () => {
  useDocumentTitle('Search — CineScope')

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      <SectionHeading
        as="h1"
        eyebrow="Instant Search"
        title="Search the TMDB Archives"
        subtitle="Search thousands of motion pictures across decades. Real-time debounced queries keep your search smooth and responsive."
      />

      {/* Large Search Bar Container */}
      <div className="max-w-3xl">
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">
            Search movies by title
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-[var(--gold)]">
            <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <input
            id="search-input"
            type="search"
            placeholder="Search by movie title (e.g. Inception, Dune, Casablanca)..."
            className="w-full pl-12 sm:pl-14 pr-4 py-3.5 sm:py-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-sm sm:text-base text-[var(--text)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all"
            disabled
          />
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
          <span>400ms debounce with minimum 2 characters. Syncs live with URL query (?q=) in Phase 4.</span>
        </p>
      </div>

      {/* Idle Search State */}
      <div className="py-16 sm:py-24 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mb-4">
          <Film className="w-8 h-8 text-[var(--gold)]" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--text)] mb-2">
          Ready to Explore
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
          Type a title above to begin exploring cast, crew, ratings, and plot summaries from TMDB.
        </p>
      </div>
    </div>
  )
}
