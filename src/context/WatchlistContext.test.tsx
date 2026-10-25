import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import {
  WatchlistProvider,
  useWatchlist,
  WATCHLIST_STORAGE_KEY,
} from './WatchlistContext'
import { Movie } from '../types/tmdb'

describe('WatchlistContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <WatchlistProvider>{children}</WatchlistProvider>
  )

  const mockMovie: Movie = {
    id: 550,
    title: 'Fight Club',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    overview: 'An insomniac office worker...',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 24000,
    popularity: 65.4,
  }

  it('initializes empty when localStorage is empty', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('adds movie to watchlist and persists only specified fields', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })

    act(() => {
      result.current.add(mockMovie)
    })

    expect(result.current.count).toBe(1)
    expect(result.current.has(550)).toBe(true)

    const stored = JSON.parse(localStorage.getItem(WATCHLIST_STORAGE_KEY) || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0]).toEqual({
      id: 550,
      title: 'Fight Club',
      poster_path: '/poster.jpg',
      release_date: '1999-10-15',
      vote_average: 8.4,
      addedAt: expect.any(Number),
    })
  })

  it('removes movie from watchlist', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })

    act(() => {
      result.current.add(mockMovie)
    })
    expect(result.current.has(550)).toBe(true)

    act(() => {
      result.current.remove(550)
    })
    expect(result.current.has(550)).toBe(false)
    expect(result.current.count).toBe(0)
  })

  it('toggles movie state in watchlist', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })

    act(() => {
      result.current.toggle(mockMovie)
    })
    expect(result.current.has(550)).toBe(true)

    act(() => {
      result.current.toggle(mockMovie)
    })
    expect(result.current.has(550)).toBe(false)
  })

  it('clears all watchlist items', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })

    act(() => {
      result.current.add(mockMovie)
      result.current.add({ ...mockMovie, id: 680, title: 'Pulp Fiction' })
    })
    expect(result.current.count).toBe(2)

    act(() => {
      result.current.clear()
    })
    expect(result.current.count).toBe(0)
    expect(localStorage.getItem(WATCHLIST_STORAGE_KEY)).toBe('[]')
  })

  it('gracefully handles malformed or corrupted localStorage JSON without crashing', () => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, 'corrupted{invalid:json}')

    const { result } = renderHook(() => useWatchlist(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('discards malformed item objects from localStorage', () => {
    const mixedData = [
      { id: 550, title: 'Fight Club', poster_path: null, release_date: '1999', vote_average: 8.4, addedAt: 12345 },
      { id: 'not-a-number', title: 'Invalid' },
      null,
      'just a string',
      { id: 100 }, // missing title, addedAt, etc.
    ]
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(mixedData))

    const { result } = renderHook(() => useWatchlist(), { wrapper })
    expect(result.current.count).toBe(1)
    expect(result.current.items[0].id).toBe(550)
  })

  it('synchronizes state when storage event fires from another tab', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })
    expect(result.current.count).toBe(0)

    const updatedList = [
      { id: 700, title: 'Interstellar', poster_path: null, release_date: '2014', vote_average: 8.6, addedAt: Date.now() },
    ]
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updatedList))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: WATCHLIST_STORAGE_KEY,
        })
      )
    })

    expect(result.current.count).toBe(1)
    expect(result.current.has(700)).toBe(true)
  })
})
