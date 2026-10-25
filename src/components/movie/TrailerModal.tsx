import React, { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { Video } from '../../types/tmdb'

export interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
  trailer: Video | null
  movieTitle: string
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailer,
  movieTitle,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Focus close button on open
    closeButtonRef.current?.focus()

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !trailer) {
    return null
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`
  const externalUrl = `https://www.youtube.com/watch?v=${trailer.key}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
          <div className="min-w-0 pr-4">
            <h3
              id="trailer-modal-title"
              className="font-serif text-base sm:text-lg font-bold text-[var(--text)] truncate"
            >
              {movieTitle} — {trailer.name || 'Official Trailer'}
            </h3>
            <span className="text-xs text-[var(--gold)]">
              {trailer.official ? 'Official TMDB Video' : 'YouTube Preview'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-white transition-colors px-2.5 py-1.5 rounded-lg border border-transparent hover:border-[var(--border)]"
              title="Watch directly on YouTube"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close trailer"
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={`${movieTitle} trailer video player`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Modal Footer (mobile link) */}
        <div className="sm:hidden px-4 py-3 bg-[var(--surface-2)]/40 border-t border-[var(--border)] flex justify-end">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
