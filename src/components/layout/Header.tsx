import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Clapperboard, Search, Menu } from 'lucide-react'
import { MobileNav } from './MobileNav'

export interface HeaderProps {
  watchlistCount?: number
}

export const Header: React.FC<HeaderProps> = ({ watchlistCount = 0 }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-4 rounded-lg"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1C1C24] to-[#101015] border border-[var(--border-strong)] flex items-center justify-center shadow-lg group-hover:border-[var(--gold)]/60 transition-colors">
              <Clapperboard className="w-5 h-5 text-[var(--gold)] transition-transform duration-200 group-hover:rotate-[-6deg]" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              Cine<span className="text-[var(--primary)]">Scope</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 h-full"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative flex items-center h-full text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Home</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `relative flex items-center h-full text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Discover</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `relative flex items-center gap-2 h-full text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Watchlist</span>
                  <span
                    className={`px-1.5 py-0.5 text-[11px] font-semibold rounded-full tabular-nums ${
                      watchlistCount > 0
                        ? 'bg-[var(--primary)] text-white shadow-[0_0_8px_rgba(229,9,20,0.4)]'
                        : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
                    }`}
                    aria-label={`Watchlist, ${watchlistCount} movies`}
                  >
                    {watchlistCount}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Right actions: Search Trigger & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/search"
              aria-label="Search movies"
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-white transition-all w-44 lg:w-56 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            >
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              <span className="truncate">Search movies...</span>
              <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[var(--text-muted)] shrink-0">
                /
              </kbd>
            </Link>

            <Link
              to="/search"
              aria-label="Search movies"
              className="sm:hidden p-2.5 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileNavOpen}
              className="md:hidden p-2.5 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Nav Sheet */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        watchlistCount={watchlistCount}
      />
    </>
  )
}
