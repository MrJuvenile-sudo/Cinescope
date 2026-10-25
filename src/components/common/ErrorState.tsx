import React from 'react'
import {
  AlertTriangle,
  RotateCw,
  KeyRound,
  WifiOff,
  Clock,
  HelpCircle,
  ServerCrash,
} from 'lucide-react'
import { TmdbError, TmdbErrorKind } from '../../types/tmdb'
import { Button } from './Button'

export interface ErrorStateProps {
  error?: TmdbError | Error | null
  onRetry?: () => void
  title?: string
  description?: string
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  title,
  description,
  className = '',
}) => {
  const kind: TmdbErrorKind =
    error instanceof TmdbError ? error.kind : 'unknown'

  // Credential Missing Special Setup Guidance
  if (kind === 'missing_credential') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={`max-w-xl mx-auto py-12 px-6 sm:px-8 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl space-y-6 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-[rgba(214,178,94,0.12)] border border-[var(--gold)]/30 mx-auto flex items-center justify-center text-[var(--gold)] shadow-inner">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Setup Required
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text)] mt-1">
            TMDB Credential Missing
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            CineScope requires a free TMDB API key or Read Access Token to display cinematic catalog data.
          </p>
        </div>

        {/* Step by step setup box */}
        <div className="rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-4 text-left space-y-2.5 text-xs text-[var(--text)] font-mono">
          <p className="font-sans font-semibold text-white uppercase tracking-wider text-[11px]">
            To connect TMDB:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-[var(--text-muted)] font-sans">
            <li>
              Create a <code className="text-[var(--gold)] font-mono">.env.local</code> file in the project root.
            </li>
            <li>
              Add: <code className="text-white font-mono select-all">VITE_TMDB_CREDENTIAL=your_token_here</code>
            </li>
            <li>Restart your Vite development server or build process.</li>
          </ol>
        </div>

        {onRetry && (
          <div className="pt-2">
            <Button
              onClick={onRetry}
              size="md"
              icon={<RotateCw className="w-4 h-4" />}
            >
              Verify Credential
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Kind-specific defaults
  const kindConfig = {
    auth: {
      icon: <KeyRound className="w-8 h-8 text-[var(--primary)]" />,
      title: 'Authentication Failed',
      desc: 'Your TMDB API credential was rejected. Please verify the key in your .env.local file.',
    },
    not_found: {
      icon: <HelpCircle className="w-8 h-8 text-[var(--gold)]" />,
      title: 'Scene Not Found',
      desc: 'The requested movie or catalog resource could not be found.',
    },
    rate_limit: {
      icon: <Clock className="w-8 h-8 text-[var(--gold)]" />,
      title: 'Rate Limit Reached',
      desc: 'TMDB is receiving too many requests right now. Please wait a moment and try again.',
    },
    network: {
      icon: <WifiOff className="w-8 h-8 text-[var(--primary)]" />,
      title: 'Connection Offline',
      desc: 'Unable to communicate with TMDB servers. Please check your network connection.',
    },
    server: {
      icon: <ServerCrash className="w-8 h-8 text-[var(--primary)]" />,
      title: 'TMDB Server Error',
      desc: 'The remote movie service encountered a temporary error. Please try again shortly.',
    },
    unknown: {
      icon: <AlertTriangle className="w-8 h-8 text-[var(--primary)]" />,
      title: 'Playback Interrupted',
      desc: error?.message || 'An unexpected error occurred while loading movie data.',
    },
  }[kind]

  const displayTitle = title || kindConfig.title
  const displayDesc = description || kindConfig.desc

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`max-w-md mx-auto py-12 px-6 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl space-y-5 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] mx-auto flex items-center justify-center shadow-inner">
        {kindConfig.icon}
      </div>

      <div>
        <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
          {displayTitle}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-center">
          <Button
            onClick={onRetry}
            size="md"
            icon={<RotateCw className="w-4 h-4" />}
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  )
}
