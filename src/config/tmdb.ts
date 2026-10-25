/**
 * TMDB Configuration
 * Reads TMDB_CREDENTIAL from environment variable VITE_TMDB_CREDENTIAL.
 * Note: Never log, print, or hardcode credentials.
 */
export const TMDB_CREDENTIAL = (import.meta.env.VITE_TMDB_CREDENTIAL || '').trim()

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
export const CONTACT_EMAIL = 'hello@cinescope.movie'
export const WATCHLIST_STORAGE_KEY = 'cinescope:watchlist:v1'
