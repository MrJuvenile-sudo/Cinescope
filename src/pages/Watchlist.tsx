import React from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Compass, Trash2, ArrowUpDown } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'

export const Watchlist: React.FC = () => {
  useDocumentTitle('Your Watchlist — CineScope')

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Heading & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <SectionHeading
          as="h1"
          eyebrow="Personal Vault"
          title="Your Watchlist · 0 Movies"
          subtitle="Saved cinematic titles safely stored in your browser's persistent local cache."
        />

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" icon={<ArrowUpDown className="w-4 h-4" />}>
            Recently Added
          </Button>
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Premium Empty State */}
      <div className="py-20 sm:py-28 text-center rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface-2)]/40 to-[var(--surface)] p-8 sm:p-12 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] flex items-center justify-center mb-6 shadow-inner">
          <Bookmark className="w-9 h-9 text-[var(--gold)]" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)] mb-2">
          Vault Empty
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">
          Your Screening Queue Awaits
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-8">
          You haven't saved any films yet. Explore our curated Discover section to bookmark movies for your next cinema evening.
        </p>

        <Link to="/discover">
          <Button size="lg" icon={<Compass className="w-5 h-5" />}>
            Explore Discover Catalog
          </Button>
        </Link>
      </div>
    </div>
  )
}
