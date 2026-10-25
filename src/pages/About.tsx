import React from 'react'
import { Link } from 'react-router-dom'
import { Database, ShieldCheck, ExternalLink, Code2, Film, Layers, Sparkles, Terminal } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SectionHeading } from '../components/common/SectionHeading'
import { Divider } from '../components/common/Divider'

export const About: React.FC = () => {
  useDocumentTitle('About CineScope — CineScope')

  const techStack = [
    {
      title: 'React 18 & Vite',
      icon: <Layers className="w-5 h-5" />,
      desc: 'Modern single-page architecture with strict TypeScript compilation, fast HMR bundling, and declarative lifecycle hooks.',
    },
    {
      title: 'React Router v6',
      icon: <Code2 className="w-5 h-5" />,
      desc: 'Declarative client-side routing where the URL serves as the single source of truth for filters, pagination, and queries.',
    },
    {
      title: 'Tailwind CSS v4',
      icon: <Sparkles className="w-5 h-5" />,
      desc: 'Bespoke "Midnight Cinema" design tokens featuring warm off-black surfaces, theatrical crimson accents, and gold highlights.',
    },
    {
      title: 'TMDB REST API v3',
      icon: <Database className="w-5 h-5" />,
      desc: 'Dynamic REST endpoints powering weekly trending reels, parametric discovery, instant debounced search, and complete movie dossiers.',
    },
    {
      title: 'Persistent Watchlist Context',
      icon: <Film className="w-5 h-5" />,
      desc: 'React Context with validated localStorage initialization, multi-tab storage event synchronization, and optimistic UI updates.',
    },
    {
      title: 'Vitest & Testing Library',
      icon: <Terminal className="w-5 h-5" />,
      desc: 'Comprehensive unit test coverage across pure state machines, API clients, React hooks, and interactive pages.',
    },
  ]

  const requirements = [
    {
      label: 'Single Page Application (SPA)',
      detail: 'Client-side routing across 8 routes (Home, Discover, Search, Details, Watchlist, About, Contact, NotFound) with seamless navigation and path-only scroll restoration.',
      linkText: 'Explore Discover Catalog',
      href: '/discover',
    },
    {
      label: 'REST API & Discover Engine',
      detail: 'Real-time TMDB v3 API consumption with parametric filtering by genre, year, and rating, guaranteed default mappings, and 5-minute memory TTL caching.',
      linkText: 'Test Discover Filters',
      href: '/discover',
    },
    {
      label: 'Debounced Search Query',
      detail: '400ms debounced title search with live URL synchronization, minimum 2-character validation, and screen reader announcements.',
      linkText: 'Try Movie Search',
      href: '/search',
    },
    {
      label: 'CSS Framework & Design Tokens',
      detail: 'Tailwind CSS "Midnight Cinema" theme with custom fonts (Playfair Display + Inter), subtle 3% grain atmosphere, and full keyboard accessibility.',
      linkText: 'View Theatrical Home',
      href: '/',
    },
    {
      label: 'Shared State & Watchlist',
      detail: 'React Context managing saved titles with cross-tab localStorage synchronization, interactive toast alerts, and client-side sorting.',
      linkText: 'Open Personal Watchlist',
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
      <section aria-labelledby="tech-stack-heading" className="space-y-6">
        <SectionHeading
          id="tech-stack-heading"
          eyebrow="Engineering Architecture"
          title="Technology Stack"
          subtitle="Built on a modern, strictly typed foundation adhering to web quality standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech) => (
            <div
              key={tech.title}
              className="glass-panel rounded-2xl p-6 space-y-3 hover:border-[var(--border-strong)] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)]">
                {tech.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-[var(--text)]">{tech.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Assignment Requirements Mapping */}
      <section aria-labelledby="requirements-heading" className="space-y-6">
        <SectionHeading
          id="requirements-heading"
          eyebrow="Demonstration"
          title="How Assignment Requirements Are Met"
          subtitle="Direct mapping between academic criteria and production implementation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section aria-labelledby="attribution-heading" className="glass-panel rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
          <Database className="w-4 h-4" />
          <span>Data Source & Legal Attribution</span>
        </div>

        <div className="space-y-3 max-w-2xl">
          <h2 id="attribution-heading" className="font-serif text-2xl font-bold text-[var(--text)]">
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
      <section aria-labelledby="limitations-heading" className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/30 p-6 sm:p-8 space-y-3">
        <h3 id="limitations-heading" className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
          Known Limitations
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
          <li>Watchlist items are stored locally in the browser and not synced across multiple devices.</li>
          <li>Video playback is restricted to trailers and teasers provided through official YouTube embeds.</li>
          <li>In-memory cache retains successful GET requests for 5 minutes per browser session.</li>
          <li>Full film streaming is out of scope per assignment specifications.</li>
        </ul>
      </section>
    </div>
  )
}
