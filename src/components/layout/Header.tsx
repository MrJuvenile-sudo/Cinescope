import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Clapperboard, Search, Menu } from 'lucide-react'
import { useWatchlist } from '../../context/WatchlistContext'
import { SearchBar } from '../common/SearchBar'
import { MobileNav } from './MobileNav'

export const Header: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [headerQuery, setHeaderQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { count } = useWatchlist()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearchSubmit = (q: string) => {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`)
      setHeaderQuery('')
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
          scrolled
            ? 'glass-panel-strong border-[var(--border)]'
            : 'bg-transparent border-transparent backdrop-blur-none'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-4 rounded-lg"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1C1C24] to-[#101015] border border-[var(--border-strong)] flex items-center justify-center shadow-lg group-hover:border-[var(--gold)]/70 group-hover:shadow-[var(--shadow-glow-gold)] transition-all duration-200">
              <Clapperboard className="w-5 h-5 text-[var(--gold)] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
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
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full shadow-[0_0_8px_rgba(229,9,20,0.6)] animate-fade-in" />
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
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full shadow-[0_0_8px_rgba(229,9,20,0.6)] animate-fade-in" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/mid"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 h-full text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>MID</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[var(--primary)] text-white shadow-[var(--shadow-glow-red)]">
                    18+
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full shadow-[0_0_8px_rgba(229,9,20,0.6)] animate-fade-in" />
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
                  {count > 0 && (
                    <span
                      className="px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums bg-[var(--primary)] text-white shadow-[var(--shadow-glow-red)] animate-scale-in"
                      aria-label={`Watchlist, ${count} movies`}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full shadow-[0_0_8px_rgba(229,9,20,0.6)] animate-fade-in" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Right actions: Compact Search & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <SearchBar
                value={headerQuery}
                onChange={setHeaderQuery}
                onSubmit={handleSearchSubmit}
                variant="compact"
              />
            </div>

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
        watchlistCount={count}
      />
    </>
  )
}
