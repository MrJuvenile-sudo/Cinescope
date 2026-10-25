import { useState, useEffect, useRef, useCallback, DependencyList } from 'react'
import { TmdbError } from '../types/tmdb'

export interface UseTmdbQueryResult<T> {
  data: T | null
  loading: boolean
  error: TmdbError | null
  retry: () => void
}

export interface UseTmdbQueryOptions {
  enabled?: boolean
}

/**
 * Standard data fetching hook for TMDB requests.
 * Features:
 * - Dedicated AbortController per run
 * - Stale-response guard
 * - AbortError is never surfaced to the UI
 * - retry() increments internal retryKey so Retry ALWAYS triggers a fresh refetch
 */
export function useTmdbQuery<T>(
  fetcher: (signal: AbortSignal, isRetry: boolean) => Promise<T>,
  deps: DependencyList,
  options: UseTmdbQueryOptions = {}
): UseTmdbQueryResult<T> {
  const { enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<TmdbError | null>(null)
  const [retryKey, setRetryKey] = useState<number>(0)

  // Track active run to guard against stale responses
  const activeRunIdRef = useRef<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const retry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    // Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    const currentRunId = ++activeRunIdRef.current
    const isRetry = retryKey > 0

    setLoading(true)
    setError(null)

    fetcher(controller.signal, isRetry)
      .then((result) => {
        // Stale-response guard
        if (currentRunId === activeRunIdRef.current) {
          setData(result)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        // Discard stale responses
        if (currentRunId !== activeRunIdRef.current) {
          return
        }

        // Suppress AbortError: never surface to the user
        if (
          (err instanceof DOMException && err.name === 'AbortError') ||
          (err as { name?: string })?.name === 'AbortError'
        ) {
          return
        }

        if (err instanceof TmdbError) {
          setError(err)
        } else {
          setError(
            new TmdbError(
              'unknown',
              err instanceof Error ? err.message : 'An unexpected error occurred.'
            )
          )
        }
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryKey, enabled])

  return { data, loading, error, retry }
}
