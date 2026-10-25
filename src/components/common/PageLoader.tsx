import React from 'react'
import { Clapperboard } from 'lucide-react'

export interface PageLoaderProps {
  className?: string
}

export const PageLoader: React.FC<PageLoaderProps> = ({ className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className={`min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-fade-in ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] shadow-2xl animate-pulse">
        <Clapperboard className="w-7 h-7" />
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
        <span>Preparing Reel</span>
      </div>
    </div>
  )
}
