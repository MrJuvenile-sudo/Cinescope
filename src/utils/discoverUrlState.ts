export interface DiscoverFilters {
  genre: string
  year: string
  rating: string
  sort: string
  page: string
}

export const DISCOVER_DEFAULTS: DiscoverFilters = {
  genre: '35',
  year: '2025',
  rating: '7',
  sort: 'popularity.desc',
  page: '1',
}

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest First' },
  { value: 'primary_release_date.asc', label: 'Oldest First' },
] as const

export const VALID_SORTS = SORT_OPTIONS.map((opt) => opt.value)

export const RATING_OPTIONS = [
  { value: 'any', label: 'Any Rating' },
  { value: '5', label: '★ 5.0 and above' },
  { value: '6', label: '★ 6.0 and above' },
  { value: '7', label: '★ 7.0 and above' },
  { value: '8', label: '★ 8.0 and above' },
  { value: '9', label: '★ 9.0 and above' },
] as const

/**
 * Returns available year filter options: 'any' plus (currentYear + 1) down to 1980.
 */
export function getYearOptions(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear()
  const years: { value: string; label: string }[] = [{ value: 'any', label: 'Any Year' }]
  for (let y = currentYear + 1; y >= 1980; y--) {
    years.push({ value: String(y), label: String(y) })
  }
  return years
}

/**
 * Validates and parses search params from the URL.
 * Missing or invalid values are normalized to DISCOVER_DEFAULTS.
 * Returns both the validated filter set and whether normalization took place.
 */
export function parseDiscoverParams(searchParams: URLSearchParams): {
  filters: DiscoverFilters
  wasNormalized: boolean
} {
  let wasNormalized = false

  // 1. Genre: digits only, defaults to '35' (Comedy)
  const rawGenre = searchParams.get('genre')
  let genre = DISCOVER_DEFAULTS.genre
  if (rawGenre && /^\d+$/.test(rawGenre)) {
    genre = rawGenre
  } else if (rawGenre !== null) {
    wasNormalized = true
  } else {
    wasNormalized = true
  }

  // 2. Year: 'any' or 4 digits between 1900 and (currentYear + 1)
  const currentYear = new Date().getFullYear()
  const rawYear = searchParams.get('year')
  let year = DISCOVER_DEFAULTS.year
  if (rawYear === 'any') {
    year = 'any'
  } else if (rawYear && /^\d{4}$/.test(rawYear)) {
    const yearNum = parseInt(rawYear, 10)
    if (yearNum >= 1900 && yearNum <= currentYear + 1) {
      year = rawYear
    } else {
      wasNormalized = true
    }
  } else if (rawYear !== null) {
    wasNormalized = true
  } else {
    wasNormalized = true
  }

  // 3. Rating: 'any' or 0-10
  const rawRating = searchParams.get('rating')
  let rating = DISCOVER_DEFAULTS.rating
  if (rawRating === 'any') {
    rating = 'any'
  } else if (rawRating && /^\d+(\.\d+)?$/.test(rawRating)) {
    const rNum = parseFloat(rawRating)
    if (rNum >= 0 && rNum <= 10) {
      // Store clean integer/float representation
      rating = String(Math.round(rNum))
    } else {
      wasNormalized = true
    }
  } else if (rawRating !== null) {
    wasNormalized = true
  } else {
    wasNormalized = true
  }

  // 4. Sort: must be in VALID_SORTS
  const rawSort = searchParams.get('sort')
  let sort = DISCOVER_DEFAULTS.sort
  if (rawSort && (VALID_SORTS as readonly string[]).includes(rawSort)) {
    sort = rawSort
  } else if (rawSort !== null) {
    wasNormalized = true
  } else {
    wasNormalized = true
  }

  // 5. Page: integer between 1 and 500
  const rawPage = searchParams.get('page')
  let page = DISCOVER_DEFAULTS.page
  if (rawPage && /^\d+$/.test(rawPage)) {
    const pNum = parseInt(rawPage, 10)
    if (pNum >= 1 && pNum <= 500) {
      page = String(pNum)
    } else {
      wasNormalized = true
    }
  } else if (rawPage !== null) {
    wasNormalized = true
  } else {
    wasNormalized = true
  }

  return {
    filters: { genre, year, rating, sort, page },
    wasNormalized,
  }
}

/**
 * Builds URLSearchParams in a stable, canonical parameter order:
 * genre -> year -> rating -> sort -> page.
 */
export function buildDiscoverParams(
  filters: Partial<DiscoverFilters>
): URLSearchParams {
  const merged: DiscoverFilters = {
    ...DISCOVER_DEFAULTS,
    ...filters,
  }

  const params = new URLSearchParams()
  params.set('genre', merged.genre)
  params.set('year', merged.year)
  params.set('rating', merged.rating)
  params.set('sort', merged.sort)
  params.set('page', merged.page)

  return params
}

/**
 * Converts DiscoverFilters into TMDB REST API query parameters.
 * Requirements:
 * - genre -> with_genres
 * - year -> primary_release_year (omit if "any")
 * - rating -> vote_average.gte as 1 decimal string e.g. "7.0" (omit if "any")
 * - sort -> sort_by
 * - page -> page (number)
 * - vote_count.gte=50 ONLY when sort is "vote_average.desc"
 */
export function toTmdbParams(
  filters: DiscoverFilters
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    with_genres: filters.genre,
    sort_by: filters.sort,
    page: parseInt(filters.page, 10),
  }

  if (filters.year !== 'any') {
    params.primary_release_year = filters.year
  }

  if (filters.rating !== 'any') {
    params['vote_average.gte'] = `${parseFloat(filters.rating).toFixed(1)}`
  }

  // Add minimum vote count only when sorting by highest rated to filter out obscure 10/10 single-vote films
  if (filters.sort === 'vote_average.desc') {
    params['vote_count.gte'] = 50
  }

  return params
}
