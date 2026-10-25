import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Compass, Trash2, ArrowUpDown, AlertCircle, X } from 'lucide-react'
import { useWatchlist } from '../context/WatchlistContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { WatchlistItem } from '../types/tmdb'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { MovieCard } from '../components/movie/MovieCard'

type SortOption = 'recent' | 'title' | 'rating'

interface ClearConfirmDialogProps {
  isOpen: boolean
  count: number
  onConfirm: () => void
  onCancel: () => void
}

const ClearConfirmDialog: React.FC<ClearConfirmDialogProps> = ({
  isOpen,
  count,
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    cancelButtonRef.current?.focus()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="clear-dialog-title"
      aria-describedby="clear-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3
            id="clear-dialog-title"
            className="font-serif text-xl sm:text-2xl font-bold text-[var(--text)]"
          >
            Clear Watchlist?
          </h3>
          <p id="clear-dialog-desc" className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            Are you sure you want to remove all{' '}
            <strong className="text-white">{count} {count === 1 ? 'title' : 'titles'}</strong> from
            your local watchlist? This action cannot be reversed.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--primary)] text-sm font-semibold text-white hover:brightness-110 shadow-[0_0_16px_rgba(229,9,20,0.4)] transition-all cursor-pointer"
          >
            Yes, Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export const Watchlist: React.FC = () => {
  const { items, count, clear } = useWatchlist()
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  useDocumentTitle(`Your Watchlist (${count}) — CineScope`)

  // Sorted items memo
  const sortedItems = useMemo(() => {
    const list: WatchlistItem[] = [...items]
    switch (sortBy) {
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title))
      case 'rating':
        return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      case 'recent':
      default:
        return list.sort((a, b) => b.addedAt - a.addedAt)
    }
  }, [items, sortBy])

  const handleClearConfirm = () => {
    clear()
    setIsConfirmOpen(false)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <SectionHeading
          as="h1"
          eyebrow="Personal Vault"
          title={`Your Watchlist · ${count} ${count === 1 ? 'Movie' : 'Movies'}`}
          subtitle="Saved cinematic titles safely stored in your browser's persistent local cache."
        />

        {count > 0 && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <label
                htmlFor="watchlist-sort"
                className="text-[var(--text-muted)] flex items-center gap-1 font-medium select-none"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Sort by:</span>
              </label>
              <select
                id="watchlist-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title (A–Z)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear All Trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmOpen(true)}
              icon={<Trash2 className="w-3.5 h-3.5 text-[var(--primary)]" />}
              className="text-[var(--text-muted)] hover:text-white hover:border-[var(--primary)]/40 text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Screen reader live announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {count === 0
          ? 'Your watchlist is empty'
          : `Showing ${count} ${count === 1 ? 'movie' : 'movies'} in your watchlist, sorted by ${
              sortBy === 'recent'
                ? 'recently added'
                : sortBy === 'title'
                ? 'title'
                : 'highest rated'
            }`}
      </div>

      {/* Content: Empty State vs Grid */}
      {count === 0 ? (
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
            You haven't saved any films yet. Explore our curated Discover section or search for titles to
            bookmark movies for your next cinema evening.
          </p>

          <Link to="/discover">
            <Button size="lg" icon={<Compass className="w-5 h-5" />}>
              Explore Discover Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {sortedItems.map((item) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      <ClearConfirmDialog
        isOpen={isConfirmOpen}
        count={count}
        onConfirm={handleClearConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  )
}
