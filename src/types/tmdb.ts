/**
 * TMDB Data Layer Types
 * Nullable-aware interfaces representing TMDB API v3 responses.
 */

export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string | null
  release_date: string | null
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids?: number[]
  genres?: Genre[]
  adult?: boolean
  original_language?: string
  original_title?: string
  video?: boolean
}

export interface CastMember {
  id: number
  name: string
  original_name?: string
  character: string | null
  profile_path: string | null
  order: number
  credit_id?: string
  known_for_department?: string
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  credit_id?: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  size?: number
  type: string
  official: boolean
  published_at?: string
}

export interface MovieDetails extends Movie {
  tagline: string | null
  runtime: number | null
  status?: string
  budget?: number
  revenue?: number
  homepage?: string | null
  imdb_id?: string | null
  genres: Genre[]
  credits?: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos?: {
    results: Video[]
  }
  similar?: Paginated<Movie>
}

export interface Paginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface WatchlistItem {
  id: number
  title: string
  poster_path: string | null
  release_date: string | null
  vote_average: number
  addedAt: number
}

export type TmdbErrorKind =
  | 'missing_credential'
  | 'auth'
  | 'not_found'
  | 'rate_limit'
  | 'network'
  | 'server'
  | 'unknown'

export class TmdbError extends Error {
  readonly kind: TmdbErrorKind
  readonly status?: number

  constructor(kind: TmdbErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'TmdbError'
    this.kind = kind
    this.status = status
    Object.setPrototypeOf(this, TmdbError.prototype)
  }
}
