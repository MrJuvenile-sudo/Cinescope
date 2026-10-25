import { describe, it, expect } from 'vitest'
import {
  DISCOVER_DEFAULTS,
  parseDiscoverParams,
  buildDiscoverParams,
  toTmdbParams,
} from './discoverUrlState'

describe('discoverUrlState', () => {
  it('returns default filters and wasNormalized = true for empty search params', () => {
    const emptyParams = new URLSearchParams()
    const { filters, wasNormalized } = parseDiscoverParams(emptyParams)

    expect(filters).toEqual(DISCOVER_DEFAULTS)
    expect(wasNormalized).toBe(true)
  })

  it('recognizes valid complete search parameters without normalizing', () => {
    const validParams = new URLSearchParams(
      'genre=28&year=2024&rating=8&sort=vote_average.desc&page=3'
    )
    const { filters, wasNormalized } = parseDiscoverParams(validParams)

    expect(filters).toEqual({
      genre: '28',
      year: '2024',
      rating: '8',
      sort: 'vote_average.desc',
      page: '3',
    })
    expect(wasNormalized).toBe(false)
  })

  it('normalizes invalid parameters to defaults', () => {
    const invalidParams = new URLSearchParams(
      'genre=abc&year=99&page=-4&rating=15&sort=unrecognized_sort'
    )
    const { filters, wasNormalized } = parseDiscoverParams(invalidParams)

    expect(filters.genre).toBe(DISCOVER_DEFAULTS.genre)
    expect(filters.year).toBe(DISCOVER_DEFAULTS.year)
    expect(filters.page).toBe(DISCOVER_DEFAULTS.page)
    expect(filters.rating).toBe(DISCOVER_DEFAULTS.rating)
    expect(filters.sort).toBe(DISCOVER_DEFAULTS.sort)
    expect(wasNormalized).toBe(true)
  })

  it('supports year="any" and rating="any"', () => {
    const anyParams = new URLSearchParams(
      'genre=18&year=any&rating=any&sort=popularity.desc&page=1'
    )
    const { filters, wasNormalized } = parseDiscoverParams(anyParams)

    expect(filters.year).toBe('any')
    expect(filters.rating).toBe('any')
    expect(wasNormalized).toBe(false)
  })

  it('performs stable round-trip parse and build', () => {
    const initial = {
      genre: '12',
      year: '2023',
      rating: '6',
      sort: 'primary_release_date.desc',
      page: '2',
    }

    const built = buildDiscoverParams(initial)
    // Check stable order
    expect(Array.from(built.keys())).toEqual([
      'genre',
      'year',
      'rating',
      'sort',
      'page',
    ])

    const { filters, wasNormalized } = parseDiscoverParams(built)
    expect(filters).toEqual(initial)
    expect(wasNormalized).toBe(false)
  })

  describe('toTmdbParams', () => {
    it('produces the exact required default TMDB request params', () => {
      const tmdbParams = toTmdbParams(DISCOVER_DEFAULTS)

      expect(tmdbParams).toEqual({
        with_genres: '35',
        primary_release_year: '2025',
        'vote_average.gte': '7.0',
        sort_by: 'popularity.desc',
        page: 1,
      })
      // Ensure vote_count.gte is NOT present on default sort
      expect(tmdbParams).not.toHaveProperty('vote_count.gte')
    })

    it('adds vote_count.gte = 50 ONLY when sort is vote_average.desc', () => {
      const tmdbParams = toTmdbParams({
        ...DISCOVER_DEFAULTS,
        sort: 'vote_average.desc',
      })

      expect(tmdbParams['vote_count.gte']).toBe(50)
      expect(tmdbParams.sort_by).toBe('vote_average.desc')
    })

    it('omits primary_release_year when year is "any"', () => {
      const tmdbParams = toTmdbParams({
        ...DISCOVER_DEFAULTS,
        year: 'any',
      })

      expect(tmdbParams).not.toHaveProperty('primary_release_year')
      expect(tmdbParams.with_genres).toBe('35')
    })

    it('omits vote_average.gte when rating is "any"', () => {
      const tmdbParams = toTmdbParams({
        ...DISCOVER_DEFAULTS,
        rating: 'any',
      })

      expect(tmdbParams).not.toHaveProperty('vote_average.gte')
    })
  })
})
