import { request } from './tmdbClient'
import { Movie, MovieDetails, Genre, Paginated } from '../types/tmdb'

export const FALLBACK_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

/**
 * Fetches trending movies (defaults to weekly window).
 */
export async function getTrending(
  timeWindow: 'day' | 'week' = 'week',
  signal?: AbortSignal,
  bypassCache = false
): Promise<Paginated<Movie>> {
  return request<Paginated<Movie>>(
    `/trending/movie/${timeWindow}`,
    { language: 'en-US' },
    signal,
    bypassCache
  )
}

/**
 * Fetches popular movies.
 */
export async function getPopular(
  page = 1,
  signal?: AbortSignal,
  bypassCache = false
): Promise<Paginated<Movie>> {
  return request<Paginated<Movie>>(
    '/movie/popular',
    { page, language: 'en-US' },
    signal,
    bypassCache
  )
}

/**
 * Fetches top rated movies.
 */
export async function getTopRated(
  page = 1,
  signal?: AbortSignal,
  bypassCache = false
): Promise<Paginated<Movie>> {
  return request<Paginated<Movie>>(
    '/movie/top_rated',
    { page, language: 'en-US' },
    signal,
    bypassCache
  )
}

/**
 * Fetches parametric discover movies.
 * Never pass a text search query to this endpoint per rule 02.
 */
export async function discoverMovies(
  params: Record<string, string | number | boolean | undefined>,
  signal?: AbortSignal,
  bypassCache = false
): Promise<Paginated<Movie>> {
  return request<Paginated<Movie>>(
    '/discover/movie',
    {
      language: 'en-US',
      include_adult: false,
      ...params,
    },
    signal,
    bypassCache
  )
}

/**
 * Searches movies by title with pagination.
 * Never pass genre/year filters to this endpoint per rule 02.
 */
export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
  bypassCache = false
): Promise<Paginated<Movie>> {
  return request<Paginated<Movie>>(
    '/search/movie',
    {
      query,
      page,
      language: 'en-US',
      include_adult: false,
    },
    signal,
    bypassCache
  )
}

/**
 * Fetches single movie dossier with appended credits, videos, similar movies, and scene images in ONE request.
 */
export async function getMovieDetails(
  movieId: string | number,
  signal?: AbortSignal,
  bypassCache = false
): Promise<MovieDetails> {
  return request<MovieDetails>(
    `/movie/${movieId}`,
    {
      append_to_response: 'credits,videos,similar,images',
      language: 'en-US',
      include_image_language: 'en,null',
    },
    signal,
    bypassCache
  )
}

/**
 * Fetches MID (Midnight / 18+ / Mature Audiences) movies:
 * Covers 18+, R-rated, NC-17, explicit, and mature cinematic productions.
 */
export async function getMidMovies(
  page = 1,
  subCategory = 'all',
  sort = 'popularity.desc',
  signal?: AbortSignal,
  bypassCache = false
): Promise<Paginated<Movie>> {
  const baseParams: Record<string, string | number | boolean | undefined> = {
    language: 'en-US',
    include_adult: true,
    sort_by: sort,
    page,
  }

  if (subCategory === 'horror') {
    baseParams.with_genres = '27'
    baseParams.certification_country = 'US'
    baseParams.certification = 'R|NC-17'
  } else if (subCategory === 'thriller') {
    baseParams.with_genres = '53,80'
    baseParams.certification_country = 'US'
    baseParams.certification = 'R|NC-17'
  } else if (subCategory === 'drama') {
    baseParams.with_genres = '18,10749'
    baseParams.certification_country = 'US'
    baseParams.certification = 'R|NC-17'
  } else if (subCategory === 'explicit') {
    baseParams.include_adult = true
    baseParams.certification_country = 'US'
    baseParams.certification = 'NC-17'
  } else {
    baseParams.certification_country = 'US'
    baseParams.certification = 'R|NC-17'
  }

  return request<Paginated<Movie>>(
    '/discover/movie',
    baseParams,
    signal,
    bypassCache
  )
}

/**
 * Fetches list of official movie genres from TMDB.
 */
export async function getGenres(
  signal?: AbortSignal,
  bypassCache = false
): Promise<{ genres: Genre[] }> {
  try {
    return await request<{ genres: Genre[] }>(
      '/genre/movie/list',
      { language: 'en-US' },
      signal,
      bypassCache
    )
  } catch {
    // If request fails or is aborted/offline, return fallback genres
    return { genres: FALLBACK_GENRES }
  }
}
