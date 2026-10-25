import React from 'react'
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/common/Button'
import { Divider } from '../components/common/Divider'

export const Discover: React.FC = () => {
  useDocumentTitle('Discover — Filter & Browse')

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <SectionHeading
          as="h1"
          eyebrow="Parametric Discovery"
          title="Curated Discovery Engine"
          subtitle="Explore the TMDB catalog with precision filters. The URL maintains synchronized state for seamless bookmarking, sharing, and navigation."
        />
      </div>

      {/* Filter Panel Placeholder */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Active Filters & Sorting</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Default: Comedy (35) · 2025 · 7.0+ · Popularity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Genre
            </label>
            <div className="h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 flex items-center text-sm text-[var(--text)]">
              Comedy (35)
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Release Year
            </label>
            <div className="h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 flex items-center text-sm text-[var(--text)]">
              2025
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Minimum Rating
            </label>
            <div className="h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 flex items-center text-sm text-[var(--text)]">
              ★ 7.0 & above
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Sort By
            </label>
            <div className="h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 flex items-center text-sm text-[var(--text)]">
              Most Popular
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" icon={<Filter className="w-4 h-4" />}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Divider />

      {/* Grid Placeholder */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[var(--text-muted)]">
            Showing curated results (Active in Phase 3)
          </span>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sorted by popularity</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden aspect-[2/3] flex flex-col justify-end p-4 relative group hover:border-[var(--border-strong)] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-80" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[var(--gold)]">
                  ★ 7.{idx % 10}
                </span>
                <p className="font-serif text-sm font-semibold text-[var(--text)] truncate">
                  Film Discovery #{idx}
                </p>
                <p className="text-xs text-[var(--text-muted)]">2025 · Comedy</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
