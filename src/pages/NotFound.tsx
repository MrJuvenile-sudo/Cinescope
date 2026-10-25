import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Home as HomeIcon, Compass } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Button } from '../components/common/Button'

export const NotFound: React.FC = () => {
  useDocumentTitle('Scene Not Found (404) — CineScope')

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-32 flex flex-col items-center justify-center text-center">
      <div className="glass-panel rounded-3xl p-8 sm:p-14 max-w-xl w-full border border-[var(--border)] shadow-2xl relative overflow-hidden">
        {/* Ambient crimson highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[var(--primary)]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] mx-auto flex items-center justify-center mb-6 shadow-inner relative z-10">
          <Film className="w-9 h-9 text-[var(--gold)]" />
        </div>

        <span className="inline-block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)] mb-3">
          Error 404 · Reel Missing
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
          Scene Not Found
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8 max-w-md mx-auto">
          The frame you are searching for appears to have been cut from the final print or moved to another reel.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link to="/">
            <Button size="md" icon={<HomeIcon className="w-4 h-4" />}>
              Return to Premiere
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="secondary" size="md" icon={<Compass className="w-4 h-4" />}>
              Explore Discover
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
