import { TMDB_IMAGE_BASE_URL } from '../config/tmdb'

export type ImageSize =
  | 'poster_card' // w342
  | 'poster_details' // w500
  | 'backdrop' // w1280
  | 'profile' // w185
  | 'original'

const SIZE_MAP: Record<ImageSize, string> = {
  poster_card: 'w342',
  poster_details: 'w500',
  backdrop: 'w1280',
  profile: 'w185',
  original: 'original',
}

/**
 * Builds a secure TMDB image URL from path and size.
 * Returns null if the path is null, undefined, or empty.
 */
export function getImageUrl(
  path: string | null | undefined,
  size: ImageSize = 'poster_card'
): string | null {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return null
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const tmdbSize = SIZE_MAP[size] || 'w342'

  return `${TMDB_IMAGE_BASE_URL}/${tmdbSize}${cleanPath}`
}
