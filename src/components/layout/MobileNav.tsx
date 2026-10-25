import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Film, Compass, Bookmark, Search, Info, Mail } from 'lucide-react'

export interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  watchlistCount?: number
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  watchlistCount = 0,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Close on Escape & trap focus
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button on open
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
      className="fixed inset-0 z-50 md:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={sheetRef}
        className="fixed inset-y-0 right-0 w-[82vw] max-w-sm bg-[var(--surface)] border-l border-[var(--border)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-[var(--text)]">
                Cine<span className="text-[var(--primary)]">Scope</span>
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[rgba(229,9,20,0.15)] text-white border border-[var(--primary)]/40 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-[var(--gold)]" />
                <span>Home</span>
              </div>
            </NavLink>

            <NavLink
              to="/discover"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[rgba(229,9,20,0.15)] text-white border border-[var(--primary)]/40 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[var(--gold)]" />
                <span>Discover</span>
              </div>
            </NavLink>

            <NavLink
              to="/mid"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[rgba(229,9,20,0.15)] text-white border border-[var(--primary)]/40 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🔥</span>
                <span>MID (18+)</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[var(--primary)] text-white shadow-[var(--shadow-glow-red)]">
                18+
              </span>
            </NavLink>

            <NavLink
              to="/search"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[rgba(229,9,20,0.15)] text-white border border-[var(--primary)]/40 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[var(--gold)]" />
                <span>Search</span>
              </div>
            </NavLink>

            <NavLink
              to="/watchlist"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[rgba(229,9,20,0.15)] text-white border border-[var(--primary)]/40 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-[var(--gold)]" />
                <span>Watchlist</span>
              </div>
              {watchlistCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--primary)] text-white">
                  {watchlistCount}
                </span>
              )}
            </NavLink>

            <div className="my-3 border-t border-[var(--border)]" />

            <NavLink
              to="/about"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`
              }
            >
              <Info className="w-4 h-4 text-[var(--text-muted)]" />
              <span>About CineScope</span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`
              }
            >
              <Mail className="w-4 h-4 text-[var(--text-muted)]" />
              <span>Contact</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer info in drawer */}
        <div className="pt-6 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
          <p className="leading-relaxed">
            Powered by TMDB API. A premium cinematic discovery experience.
          </p>
        </div>
      </div>
    </div>
  )
}
