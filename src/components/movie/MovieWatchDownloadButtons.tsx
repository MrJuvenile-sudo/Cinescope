import React, { useState } from 'react'
import { Play, Download, ExternalLink, Film, Check, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { MovieDetails } from '../../types/tmdb'
import { getImageUrl } from '../../utils/imageUrl'
import { pickTrailer } from '../../utils/movieHelpers'
import { TrailerModal } from './TrailerModal'

export interface MovieWatchDownloadButtonsProps {
  movie: MovieDetails
  className?: string
}

export const MovieWatchDownloadButtons: React.FC<MovieWatchDownloadButtonsProps> = ({
  movie,
  className = '',
}) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null)

  const trailer = pickTrailer(movie.videos?.results)
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original') || getImageUrl(movie.backdrop_path, 'backdrop')
  const posterUrl = getImageUrl(movie.poster_path, 'original') || getImageUrl(movie.poster_path, 'poster_details')

  const sanitizeFilename = (title: string, suffix: string) => {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${suffix}.jpg`
  }

  // Real browser file download helper using Blob fetching
  const handleDownloadFile = async (imageUrl: string | null, filename: string, label: string) => {
    if (!imageUrl) {
      toast.error('Image asset is not available for download')
      return
    }

    setIsDownloading(true)
    toast.info(`Preparing ${label} for download...`)

    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      setDownloadedItem(label)
      toast.success(`${label} downloaded successfully!`)
    } catch {
      // Fallback: Open high-res image directly in new tab with download intent
      window.open(imageUrl, '_blank')
      toast.success(`Opening ${label} in new tab`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadMetadata = () => {
    const dataStr = JSON.stringify(
      {
        id: movie.id,
        title: movie.title,
        tagline: movie.tagline,
        overview: movie.overview,
        release_date: movie.release_date,
        rating: movie.vote_average,
        vote_count: movie.vote_count,
        runtime_minutes: movie.runtime,
        genres: movie.genres.map((g) => g.name),
        imdb_id: movie.imdb_id,
        downloaded_from: 'CineScope Midnight Cinema',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )

    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dossier.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Movie metadata dossier downloaded!')
  }

  return (
    <div className={`flex flex-wrap items-center gap-3.5 ${className}`}>
      {/* 1. Watch Button */}
      <button
        type="button"
        onClick={() => setIsTrailerOpen(true)}
        aria-label={`Play trailer for ${movie.title}`}
        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-base text-white bg-gradient-to-b from-[#ff3040] to-[#E50914] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),var(--shadow-glow-red)] hover:brightness-110 hover:-translate-y-[2px] active:translate-y-0 active:brightness-95 transition-all duration-200 cursor-pointer min-h-[48px]"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Watch</span>
      </button>

      {/* 2. Download Button */}
      <button
        type="button"
        onClick={() => setIsDownloadModalOpen(true)}
        aria-label={`Download media assets for ${movie.title}`}
        className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-medium text-base text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] hover:text-white hover:border-[var(--gold)]/50 hover:bg-white/8 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 cursor-pointer min-h-[48px]"
      >
        <Download className="w-4 h-4 text-[var(--gold)]" />
        <span>Download</span>
      </button>

      {/* Trailer & Stream Modal */}
      {trailer && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          trailer={trailer}
          movieTitle={movie.title}
        />
      )}

      {/* Fallback Watch Modal when no trailer is available */}
      {!trailer && isTrailerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="watch-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={() => setIsTrailerOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                <Film className="w-4 h-4" />
                <span>Stream & Watch</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTrailerOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 id="watch-dialog-title" className="font-serif text-2xl font-bold text-white">
                {movie.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Watch official streaming availability, theatrical releases, and official home media on authorized platforms.
              </p>
            </div>

            <div className="space-y-2.5">
              <a
                href={`https://www.themoviedb.org/movie/${movie.id}/watch`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-white hover:border-[var(--primary)] hover:bg-white/5 transition-all text-sm font-medium"
              >
                <span>View Streaming Providers (JustWatch / TMDB)</span>
                <ExternalLink className="w-4 h-4 text-[var(--gold)]" />
              </a>

              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-white hover:border-[var(--primary)] hover:bg-white/5 transition-all text-sm font-medium"
                >
                  <span>Check IMDb Showtimes & Streaming</span>
                  <ExternalLink className="w-4 h-4 text-[var(--gold)]" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Options Modal */}
      {isDownloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={() => setIsDownloadModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                <Sparkles className="w-4 h-4" />
                <span>Media Download Vault</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 id="download-dialog-title" className="font-serif text-2xl font-bold text-white">
                Download {movie.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Save official cinema stills, 4K wallpapers, theatrical posters, or structured metadata directly to your device.
              </p>
            </div>

            {/* Download Options List */}
            <div className="space-y-3">
              {backdropUrl && (
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() =>
                    handleDownloadFile(
                      backdropUrl,
                      sanitizeFilename(movie.title, '4k-scene-wallpaper'),
                      '4K Scene Wallpaper (Backdrop)'
                    )
                  }
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-left hover:border-[var(--primary)] hover:bg-white/8 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)]">
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        4K Scene Wallpaper (Backdrop)
                      </p>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Full-bleed high resolution cinematic backdrop
                      </span>
                    </div>
                  </div>
                  {downloadedItem === '4K Scene Wallpaper (Backdrop)' ? (
                    <Check className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <span className="text-xs font-mono text-[var(--gold)] px-2 py-0.5 rounded bg-white/5">
                      JPG
                    </span>
                  )}
                </button>
              )}

              {posterUrl && (
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() =>
                    handleDownloadFile(
                      posterUrl,
                      sanitizeFilename(movie.title, 'theatrical-poster'),
                      'Theatrical Poster (Original HD)'
                    )
                  }
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-left hover:border-[var(--primary)] hover:bg-white/8 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)]">
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Theatrical Poster (Original HD)
                      </p>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Official portrait movie artwork
                      </span>
                    </div>
                  </div>
                  {downloadedItem === 'Theatrical Poster (Original HD)' ? (
                    <Check className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <span className="text-xs font-mono text-[var(--gold)] px-2 py-0.5 rounded bg-white/5">
                      JPG
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadMetadata}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-left hover:border-[var(--primary)] hover:bg-white/8 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)]">
                    <Film className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Movie Metadata Dossier
                    </p>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Complete synopsis, runtime, rating, and cast dossier
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--gold)] px-2 py-0.5 rounded bg-white/5">
                  JSON
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
