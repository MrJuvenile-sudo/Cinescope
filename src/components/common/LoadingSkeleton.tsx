import React from 'react'

export interface LoadingSkeletonProps {
  variant?: 'card-grid' | 'details' | 'row'
  count?: number
  className?: string
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card-grid',
  count = 12,
  className = '',
}) => {
  if (variant === 'row') {
    return (
      <div
        role="status"
        aria-label="Loading movies row"
        className={`flex gap-4 sm:gap-6 overflow-hidden py-2 ${className}`}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="w-[160px] sm:w-[200px] shrink-0 space-y-3"
          >
            <div className="w-full aspect-[2/3] rounded-2xl bg-[var(--surface-2)] animate-pulse border border-[var(--border)]" />
            <div className="h-4 w-3/4 rounded-md bg-[var(--surface-2)] animate-pulse" />
            <div className="h-3 w-1/2 rounded-md bg-[var(--surface-2)]/60 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'details') {
    return (
      <div
        role="status"
        aria-label="Loading movie details"
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8 animate-pulse ${className}`}
      >
        <div className="h-4 w-28 rounded bg-[var(--surface-2)]" />

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 lg:col-span-3 aspect-[2/3] rounded-2xl bg-[var(--surface-2)]" />
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              <div className="h-3 w-32 rounded bg-[var(--surface-2)]" />
              <div className="h-10 sm:h-14 w-3/4 rounded-xl bg-[var(--surface-2)]" />
              <div className="h-4 w-1/2 rounded bg-[var(--surface-2)]" />
              <div className="flex gap-3">
                <div className="h-6 w-16 rounded-full bg-[var(--surface-2)]" />
                <div className="h-6 w-16 rounded-full bg-[var(--surface-2)]" />
                <div className="h-6 w-16 rounded-full bg-[var(--surface-2)]" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-[var(--surface-2)]" />
                <div className="h-4 w-5/6 rounded bg-[var(--surface-2)]" />
                <div className="h-4 w-4/6 rounded bg-[var(--surface-2)]" />
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-40 rounded-xl bg-[var(--surface-2)]" />
                <div className="h-12 w-40 rounded-xl bg-[var(--surface-2)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: 'card-grid' matching Rule 03 responsive columns
  return (
    <div
      role="status"
      aria-label="Loading movie catalog"
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="space-y-3">
          <div className="w-full aspect-[2/3] rounded-2xl bg-[var(--surface-2)] animate-pulse border border-[var(--border)] relative overflow-hidden" />
          <div className="h-4 w-4/5 rounded bg-[var(--surface-2)] animate-pulse" />
          <div className="h-3 w-2/5 rounded bg-[var(--surface-2)]/60 animate-pulse" />
        </div>
      ))}
    </div>
  )
}
