import { describe, it, expect } from 'vitest'
import {
  getYear,
  formatRuntime,
  formatRating,
  pickTrailer,
} from './movieHelpers'
import { Video } from '../types/tmdb'

describe('movieHelpers', () => {
  describe('getYear', () => {
    it('extracts 4-digit year from standard ISO release date', () => {
      expect(getYear('2025-07-11')).toBe('2025')
      expect(getYear('1999-10-15')).toBe('1999')
    })

    it('returns TBA for null, undefined, or empty release dates', () => {
      expect(getYear(null)).toBe('TBA')
      expect(getYear(undefined)).toBe('TBA')
      expect(getYear('')).toBe('TBA')
      expect(getYear('invalid-date')).toBe('TBA')
    })
  })

  describe('formatRuntime', () => {
    it('formats minutes into Xh YYm', () => {
      expect(formatRuntime(125)).toBe('2h 05m')
      expect(formatRuntime(120)).toBe('2h 00m')
      expect(formatRuntime(61)).toBe('1h 01m')
    })

    it('formats sub-hour runtimes as minutes only', () => {
      expect(formatRuntime(45)).toBe('45m')
      expect(formatRuntime(15)).toBe('15m')
    })

    it('returns em-dash for 0, negative, or missing runtime', () => {
      expect(formatRuntime(0)).toBe('—')
      expect(formatRuntime(-5)).toBe('—')
      expect(formatRuntime(null)).toBe('—')
      expect(formatRuntime(undefined)).toBe('—')
    })
  })

  describe('formatRating', () => {
    it('formats score to single decimal', () => {
      expect(formatRating(7.43, 100)).toBe('7.4')
      expect(formatRating(8, 50)).toBe('8.0')
      expect(formatRating(9.99, 10)).toBe('10.0')
    })

    it('returns NR when voteCount is 0 or unrated', () => {
      expect(formatRating(0, 0)).toBe('NR')
      expect(formatRating(7.5, 0)).toBe('NR')
      expect(formatRating(null, 100)).toBe('NR')
      expect(formatRating(undefined, 100)).toBe('NR')
    })
  })

  describe('pickTrailer', () => {
    const mockVideos: Video[] = [
      {
        id: '1',
        key: 'clip_key',
        name: 'Behind the Scenes',
        site: 'YouTube',
        type: 'Behind the Scenes',
        official: true,
      },
      {
        id: '2',
        key: 'teaser_key',
        name: 'Official Teaser',
        site: 'YouTube',
        type: 'Teaser',
        official: true,
      },
      {
        id: '3',
        key: 'trailer_key',
        name: 'Official Main Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
      {
        id: '4',
        key: 'unofficial_trailer_key',
        name: 'Fan Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: false,
      },
    ]

    it('prioritizes official YouTube Trailer', () => {
      const selected = pickTrailer(mockVideos)
      expect(selected?.key).toBe('trailer_key')
    })

    it('falls back to unofficial trailer if official trailer is absent', () => {
      const withoutOfficial = mockVideos.filter((v) => v.id !== '3')
      const selected = pickTrailer(withoutOfficial)
      expect(selected?.key).toBe('unofficial_trailer_key')
    })

    it('falls back to official teaser if no trailers exist', () => {
      const withoutTrailers = mockVideos.filter((v) => !v.type.toLowerCase().includes('trailer'))
      const selected = pickTrailer(withoutTrailers)
      expect(selected?.key).toBe('teaser_key')
    })

    it('returns null when no YouTube videos exist', () => {
      expect(pickTrailer([])).toBeNull()
      expect(pickTrailer(null)).toBeNull()
      expect(
        pickTrailer([
          {
            id: '5',
            key: 'vimeo_key',
            name: 'Vimeo Video',
            site: 'Vimeo',
            type: 'Trailer',
            official: true,
          },
        ])
      ).toBeNull()
    })
  })
})
