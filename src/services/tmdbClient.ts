import { TMDB_CREDENTIAL, TMDB_BASE_URL } from '../config/tmdb'
import { TmdbError } from '../types/tmdb'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

// 5-minute in-memory TTL cache for successful requests
const CACHE_TTL_MS = 5 * 60 * 1000
const memoryCache = new Map<string, CacheEntry<unknown>>()

/**
 * Normalizes query parameters into a deterministic cache key.
 */
function createCacheKey(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return endpoint

  const sortedPairs = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)

  return sortedPairs.length > 0 ? `${endpoint}?${sortedPairs.join('&')}` : endpoint
}

/**
 * Clears the in-memory response cache (used in tests or manual cache flushes).
 */
export function clearCache(): void {
  memoryCache.clear()
}

/**
 * Determines error kind and friendly message from HTTP status code or exception.
 */
function mapError(status: number | undefined, error?: unknown): TmdbError {
  if (status === 401 || status === 403) {
    return new TmdbError(
      'auth',
      'TMDB authentication failed. Please verify your API credential.',
      status
    )
  }

  if (status === 404) {
    return new TmdbError(
      'not_found',
      'The requested movie or resource was not found.',
      status
    )
  }

  if (status === 429) {
    return new TmdbError(
      'rate_limit',
      'TMDB request rate limit exceeded. Please wait a moment.',
      status
    )
  }

  if (status && status >= 500 && status < 600) {
    return new TmdbError(
      'server',
      'TMDB server encountered an error. Please try again shortly.',
      status
    )
  }

  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return new TmdbError(
      'network',
      'Unable to connect to TMDB. Please check your network connection.'
    )
  }

  return new TmdbError(
    'unknown',
    'An unexpected error occurred while communicating with TMDB.',
    status
  )
}

/**
 * Single request dispatcher for TMDB API.
 * Handles credential detection (JWT Bearer vs API key query param),
 * in-memory 5-minute caching, AbortSignal cancellation, and typed error handling.
 */
export async function request<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  signal?: AbortSignal,
  bypassCache = false
): Promise<T> {
  const credential = TMDB_CREDENTIAL.trim()

  if (!credential) {
    throw new TmdbError(
      'missing_credential',
      'TMDB credential is missing. Please set VITE_TMDB_API_KEY (or VITE_TMDB_CREDENTIAL) in .env.local.'
    )
  }

  const cacheKey = createCacheKey(endpoint, params)

  // Check TTL Cache
  if (!bypassCache) {
    const cached = memoryCache.get(cacheKey)
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data as T
    }
  }

  // Construct URL and Query
  const base = TMDB_BASE_URL.startsWith('/')
    ? `${typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://api.themoviedb.org'}${TMDB_BASE_URL}`
    : TMDB_BASE_URL
  const url = new URL(`${base}${endpoint}`)
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  const isJwt = credential.startsWith('eyJ')

  if (isJwt) {
    headers['Authorization'] = `Bearer ${credential}`
  } else {
    url.searchParams.set('api_key', credential)
  }

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.set(key, String(val))
      }
    })
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      signal,
    })

    if (!response.ok) {
      throw mapError(response.status)
    }

    const data: T = await response.json()

    // Store in cache
    memoryCache.set(cacheKey, {
      data,
      expiresAt: Date.now() + CACHE_TTL_MS,
    })

    return data
  } catch (err: unknown) {
    // Pass AbortError directly without transforming into user error
    if (
      err instanceof DOMException && err.name === 'AbortError' ||
      (err as { name?: string })?.name === 'AbortError'
    ) {
      throw err
    }

    if (err instanceof TmdbError) {
      throw err
    }

    throw mapError(undefined, err)
  }
}
