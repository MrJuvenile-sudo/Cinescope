import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useTmdbQuery } from './useTmdbQuery'
import { TmdbError } from '../types/tmdb'

describe('useTmdbQuery', () => {
  it('successfully fetches and stores data', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1, title: 'Inception' })

    const { result } = renderHook(() => useTmdbQuery(fetcher, []))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual({ id: 1, title: 'Inception' })
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('surfaces TmdbError when fetcher fails', async () => {
    const error = new TmdbError('auth', 'Invalid token', 401)
    const fetcher = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useTmdbQuery(fetcher, []))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe(error)
    expect(result.current.error?.kind).toBe('auth')
  })

  it('does not surface AbortError to error state', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    const fetcher = vi.fn().mockRejectedValue(abortError)

    const { result } = renderHook(() => useTmdbQuery(fetcher, []))

    // Give it a tick
    await new Promise((r) => setTimeout(r, 50))

    expect(result.current.error).toBeNull()
  })

  it('calling retry() triggers refetch with isRetry = true', async () => {
    let callCount = 0
    const fetcher = vi.fn().mockImplementation(async (_signal, isRetry) => {
      callCount++
      if (callCount === 1) {
        throw new TmdbError('network', 'Offline')
      }
      return { id: 2, title: 'Interstellar', isRetry }
    })

    const { result } = renderHook(() => useTmdbQuery(fetcher, []))

    await waitFor(() => {
      expect(result.current.error?.kind).toBe('network')
    })

    // Click retry
    act(() => {
      result.current.retry()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({ id: 2, title: 'Interstellar', isRetry: true })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('discards stale response when deps change rapidly', async () => {
    const fetcher = vi.fn().mockImplementation((_signal, _isRetry) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ timestamp: Date.now() })
        }, 100)
      })
    })

    const { result, rerender } = renderHook(
      ({ query }) => useTmdbQuery(fetcher, [query]),
      { initialProps: { query: 'first' } }
    )

    // Rapidly change dependency
    rerender({ query: 'second' })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
