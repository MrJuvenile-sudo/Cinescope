import React from 'react'
import { Link } from 'react-router-dom'
import { Clapperboard, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--bg-elevated)] border-t border-[var(--border)] mt-auto relative overflow-hidden">
      {/* Gold hairline on top */}
      <div className="gold-hairline absolute top-0 left-0 right-0" />

      {/* Subtle crimson ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[var(--primary)]/6 blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-6 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C1C24] to-[#101015] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--gold)]/50 transition-colors">
                <Clapperboard className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[var(--text)]">
                Cine<span className="text-[var(--primary)]">Scope</span>
              </span>
            </Link>

            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              The Midnight Cinema discovery experience. Explore cinematic gems, curated genres,
              and build your personal watchlist powered by real-time movie data.
            </p>

            {/* TMDB attribution badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
              <span className="text-[var(--gold)] font-bold font-serif text-sm">TMDB</span>
              <span>Powered by The Movie Database</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              {[
                { to: '/', label: 'Home' },
                { to: '/discover', label: 'Discover Movies' },
                { to: '/search', label: 'Search' },
                { to: '/watchlist', label: 'Your Watchlist' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-white transition-colors duration-150 hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project & Legal */}
          <div className="md:col-span-4 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Project & Info
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150 inline-block">
                  About CineScope
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-150 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1"
                >
                  The Movie Database ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution & Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p className="text-center sm:text-left leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="shrink-0 text-center sm:text-right inline-flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} CineScope.</span>
            <span className="inline-flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-[var(--primary)] fill-current" /> for film enthusiasts.
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
