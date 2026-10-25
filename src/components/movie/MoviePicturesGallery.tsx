import React, { useState, useEffect } from 'react'
import { Download, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { toast } from 'sonner'
import { ImageItem } from '../../types/tmdb'
import { getImageUrl } from '../../utils/imageUrl'
import { SectionHeading } from '../common/SectionHeading'

export interface MoviePicturesGalleryProps {
  images?: ImageItem[]
  movieTitle: string
  className?: string
}

export const MoviePicturesGallery: React.FC<MoviePicturesGalleryProps> = ({
  images,
  movieTitle,
  className = '',
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Filter valid image paths, take up to 24 pictures
  const pictureList = (images || []).filter((item) => Boolean(item.file_path)).slice(0, 24)

  useEffect(() => {
    if (selectedIdx === null) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIdx(null)
      } else if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % pictureList.length : null))
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) =>
          prev !== null ? (prev - 1 + pictureList.length) % pictureList.length : null
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIdx, pictureList.length])

  if (pictureList.length === 0) {
    return null
  }

  const activePicture = selectedIdx !== null ? pictureList[selectedIdx] : null
  const activePictureUrl = activePicture
    ? getImageUrl(activePicture.file_path, 'original') || getImageUrl(activePicture.file_path, 'backdrop')
    : null

  const handleDownloadStill = async (stillUrl: string | null, index: number) => {
    if (!stillUrl) return
    setIsDownloading(true)
    toast.info('Downloading movie picture...')

    const filename = `${movieTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-scene-${index + 1}.jpg`

    try {
      const response = await fetch(stillUrl)
      if (!response.ok) throw new Error('Fetch failed')
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      toast.success('Scene picture downloaded!')
    } catch {
      window.open(stillUrl, '_blank')
      toast.success('Opening picture in new tab')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section aria-labelledby="pictures-heading" className={`space-y-6 ${className}`}>
      <SectionHeading
        id="pictures-heading"
        as="h2"
        eyebrow="Visuals & Stills"
        title="Movie Scenes & Pictures"
        subtitle={`Official production photography and cinematic scene captures from ${movieTitle}`}
      />

      {/* Picture Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {pictureList.map((pic, idx) => {
          const thumbUrl = getImageUrl(pic.file_path, 'backdrop') || getImageUrl(pic.file_path, 'poster_details')
          if (!thumbUrl) return null

          return (
            <div
              key={pic.file_path}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)]/60 cursor-pointer card-hover shadow-md"
            >
              <img
                src={thumbUrl}
                alt={`${movieTitle} scene ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3">
                <span className="text-[11px] font-mono text-[var(--gold)]">
                  {pic.width} × {pic.height}
                </span>
                <div className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && activePicture && activePictureUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${movieTitle} scene lightbox`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in select-none"
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-3 text-white">
              <span className="font-serif text-sm sm:text-base font-semibold drop-shadow">
                {movieTitle}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {selectedIdx + 1} / {pictureList.length}
              </span>
              <span className="hidden sm:inline text-xs font-mono text-[var(--gold)] px-2 py-0.5 rounded bg-white/10">
                {activePicture.width} × {activePicture.height}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isDownloading}
                onClick={() => handleDownloadStill(activePictureUrl, selectedIdx)}
                aria-label="Download this picture"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-medium text-white hover:border-[var(--gold)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span className="hidden sm:inline">Download Still</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                aria-label="Close lightbox"
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Previous Arrow */}
          <button
            type="button"
            onClick={() =>
              setSelectedIdx((prev) =>
                prev !== null ? (prev - 1 + pictureList.length) % pictureList.length : null
              )
            }
            aria-label="Previous scene"
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Central Image View */}
          <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center p-2">
            <img
              src={activePictureUrl}
              alt={`${movieTitle} scene ${selectedIdx + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={() =>
              setSelectedIdx((prev) => (prev !== null ? (prev + 1) % pictureList.length : null))
            }
            aria-label="Next scene"
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  )
}
