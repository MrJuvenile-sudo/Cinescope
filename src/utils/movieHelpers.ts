import { Video } from '../types/tmdb'

/**
 * Extracts a clean 4-digit year from release_date or first_air_date string.
 * Returns 'TBA' if missing or unparseable.
 */
export function getYear(releaseDate?: string | null): string {
  if (!releaseDate || typeof releaseDate !== 'string') {
    return 'TBA'
  }

  const match = releaseDate.match(/^(\d{4})/)
  return match ? match[1] : 'TBA'
}

/**
 * Returns clean display title for either a movie (title) or TV series (name).
 */
export function getDisplayTitle(item?: { title?: string; name?: string } | null): string {
  if (!item) return ''
  return item.title || item.name || 'Untitled'
}

/**
 * Formats runtime minutes into readable 'Xh YYm' format.
 * Returns '—' if runtime is missing, 0, or negative.
 */
export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0 || !Number.isFinite(minutes)) {
    return '—'
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}m`
  }

  const paddedMinutes = String(remainingMinutes).padStart(2, '0')
  return `${hours}h ${paddedMinutes}m`
}

/**
 * Formats TMDB rating with tabular single-decimal precision.
 * Returns 'NR' (Not Rated) when voteCount is 0 or voteAverage is unrated.
 */
export function formatRating(
  voteAverage?: number | null,
  voteCount?: number
): string {
  if (
    voteCount === 0 ||
    voteAverage === null ||
    voteAverage === undefined ||
    voteAverage === 0 ||
    !Number.isFinite(voteAverage)
  ) {
    return 'NR'
  }

  return voteAverage.toFixed(1)
}

/**
 * Selects the best trailer video preferring an official YouTube trailer.
 * Fallback priority:
 * 1. Official YouTube Trailer
 * 2. Unofficial YouTube Trailer
 * 3. Official YouTube Teaser
 * 4. Any YouTube Video
 * 5. null
 */
export function pickTrailer(videos?: Video[] | null): Video | null {
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    return null
  }

  const youtubeVideos = videos.filter(
    (v) => v.site?.toLowerCase() === 'youtube' && v.key
  )

  if (youtubeVideos.length === 0) {
    return null
  }

  // 1. Official YouTube Trailer
  const officialTrailer = youtubeVideos.find(
    (v) => v.official && v.type?.toLowerCase() === 'trailer'
  )
  if (officialTrailer) return officialTrailer

  // 2. Unofficial YouTube Trailer
  const trailer = youtubeVideos.find(
    (v) => v.type?.toLowerCase() === 'trailer'
  )
  if (trailer) return trailer

  // 3. Official YouTube Teaser
  const officialTeaser = youtubeVideos.find(
    (v) => v.official && v.type?.toLowerCase() === 'teaser'
  )
  if (officialTeaser) return officialTeaser

  // 4. Any YouTube Video
  return youtubeVideos[0]
}
