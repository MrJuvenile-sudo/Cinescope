import React from 'react'
import { Link } from 'react-router-dom'
import { Database, ShieldCheck, ExternalLink, Code2 } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Divider } from '../components/common/Divider'

export const About: React.FC = () => {
  useDocumentTitle('About — CineScope')

  const techStack = [
    {
      title: 'React 18 & Vite',
      desc: 'Blazing fast single-page application bundling, strict TypeScript typing, and responsive component lifecycle.',
    },
    {
      title: 'React Router v6',
      desc: 'Declarative, client-side routing with URL synchronization serving as the single source of truth.',
    },
    {
      title: 'Tailwind CSS',
      desc: 'Custom "Midnight Cinema" design system with meticulous tokens, accessible contrast, and zero layout shift.',
    },
    {
      title: 'TMDB API v3',
      desc: 'Real-time REST endpoints powering trending reels, parametric discovery, instant search, and complete dossiers.',
    },
    {
      title: 'Persistent Context & Storage',
      desc: 'Local browser storage synchronization with multi-tab consistency and memory memoization.',
    },
    {
      title: 'Strict Quality Suite',
      desc: 'Unit testing via Vitest & React Testing Library, ESLint, and strict TypeScript compilation.',
    },
  ]

  const requirements = [
    {
      label: 'Single Page Application (SPA)',
      detail: 'Client-side routing across 7 core screens without page reloads; persistent state maintained through React Context.',
      linkText: 'Test Discover Route',
      href: '/discover',
    },
    {
      label: 'REST API Integration',
      detail: 'Direct TMDB v3 API consumption with parametric filtering, 400ms debounced search, AbortController cancellation, and typed error handling.',
      linkText: 'Test Search Route',
      href: '/search',
    },
    {
      label: 'CSS Framework & Design System',
      detail: 'Tailwind CSS "Midnight Cinema" palette featuring warm off-black, crimson accents, gold highlights, and Playfair serif typography.',
      linkText: 'View Watchlist Experience',
      href: '/watchlist',
    },
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-12">
      {/* Hero / Project Story */}
      <div className="max-w-3xl space-y-4">
        <SectionHeading
          as="h1"
          eyebrow="The Story Behind CineScope"
          title="Crafted for the Love of Cinema"
          subtitle="CineScope is an uncompromising, dark-mode movie discovery platform engineered to make film exploration effortless, tactile, and cinematic."
        />
        <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
          Inspired by mid-century theatrical aesthetics and classic movie palaces, CineScope marries modern web performance with rich metadata from The Movie Database. Every detail—from our custom color tokens to parametric URL state—is designed to deliver an unforgettable digital screening room.
        </p>
      </div>

      <Divider />

      {/* Architecture & Tech Stack Cards */}
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Engineering Architecture"
          title="Technology Stack"
          subtitle="Built on a modern, strictly typed foundation adhering to modern web standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech) => (
            <div
              key={tech.title}
              className="glass-panel rounded-2xl p-6 space-y-3 hover:border-[var(--border-strong)] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)]">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[var(--text)]">{tech.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Assignment Requirements Mapping */}
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Demonstration"
          title="How Assignment Requirements Are Met"
          subtitle="Direct mapping between academic criteria and production implementation."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requirements.map((req) => (
            <div
              key={req.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between space-y-4 hover:border-[var(--border-strong)] transition-all"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Criterion</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text)]">{req.label}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{req.detail}</p>
              </div>

              <Link
                to={req.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold)] hover:text-white transition-colors pt-2"
              >
                <span>{req.linkText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Data Source & Legal Attribution */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
          <Database className="w-4 h-4" />
          <span>Data Source & Legal Attribution</span>
        </div>

        <div className="space-y-3 max-w-2xl">
          <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
            The Movie Database (TMDB) Integration
          </h2>
          <p className="text-base text-[var(--text)] font-medium leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Movie metadata, posters, backdrops, cast bios, and video keys are fetched directly via
            TMDB's v3 REST endpoints. All film imagery and intellectual property remain the property of
            their respective studios and copyright holders.
          </p>
        </div>

        <div>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-white transition-colors"
          >
            <span>Visit TMDB Official Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Known Limitations */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/30 p-6 sm:p-8 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
          Known Limitations
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
          <li>Watchlist items are stored locally in the browser and not synced across multiple devices.</li>
          <li>Video playback is restricted to trailers and teasers provided through official YouTube embeds.</li>
          <li>Full film streaming is out of scope per assignment specifications.</li>
        </ul>
      </section>
    </div>
  )
}
