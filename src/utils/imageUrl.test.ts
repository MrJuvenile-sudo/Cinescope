import { describe, it, expect } from 'vitest'
import { getImageUrl } from './imageUrl'

describe('imageUrl', () => {
  it('builds valid poster card url (w342)', () => {
    expect(getImageUrl('/test-poster.jpg', 'poster_card')).toBe(
      'https://image.tmdb.org/t/p/w342/test-poster.jpg'
    )
  })

  it('builds valid poster details url (w500)', () => {
    expect(getImageUrl('/details.jpg', 'poster_details')).toBe(
      'https://image.tmdb.org/t/p/w500/details.jpg'
    )
  })

  it('builds valid backdrop url (w1280)', () => {
    expect(getImageUrl('/backdrop.jpg', 'backdrop')).toBe(
      'https://image.tmdb.org/t/p/w1280/backdrop.jpg'
    )
  })

  it('builds valid profile url (w185)', () => {
    expect(getImageUrl('/actor.jpg', 'profile')).toBe(
      'https://image.tmdb.org/t/p/w185/actor.jpg'
    )
  })

  it('prepends leading slash if omitted', () => {
    expect(getImageUrl('no-leading-slash.jpg', 'poster_card')).toBe(
      'https://image.tmdb.org/t/p/w342/no-leading-slash.jpg'
    )
  })

  it('returns null for null, undefined, or empty path', () => {
    expect(getImageUrl(null)).toBeNull()
    expect(getImageUrl(undefined)).toBeNull()
    expect(getImageUrl('')).toBeNull()
    expect(getImageUrl('   ')).toBeNull()
  })
})
