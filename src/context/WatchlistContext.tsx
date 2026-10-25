import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { toast } from 'sonner'
import { WATCHLIST_STORAGE_KEY } from '../config/tmdb'
import { Movie, WatchlistItem } from '../types/tmdb'

export { WATCHLIST_STORAGE_KEY }

export interface WatchlistContextType {
  items: WatchlistItem[]
  count: number
  add: (movie: Movie | WatchlistItem) => void
  remove: (movieId: number) => void
  toggle: (movie: Movie | WatchlistItem) => void
  has: (movieId: number) => boolean
  clear: () => void
}

const WatchlistContext = createContext<WatchlistContextType | null>(null)

/**
 * Validates whether an unknown object conforms to WatchlistItem structure.
 * Discards malformed entries per rule 02.
 */
function isValidWatchlistItem(item: unknown): item is WatchlistItem {
  if (!item || typeof item !== 'object') return false
  const candidate = item as Record<string, unknown>

  return (
    typeof candidate.id === 'number' &&
    Number.isFinite(candidate.id) &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    (candidate.poster_path === null || typeof candidate.poster_path === 'string') &&
    (candidate.release_date === null || typeof candidate.release_date === 'string') &&
    typeof candidate.vote_average === 'number' &&
    typeof candidate.addedAt === 'number'
  )
}

/**
 * Safely initializes watchlist from localStorage.
 */
function loadWatchlist(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Filter and sanitize entries
    return parsed.filter(isValidWatchlistItem)
  } catch {
    // If JSON parsing fails or storage access is restricted, safely recover
    return []
  }
}

/**
 * Safely persists watchlist to localStorage.
 */
function persistWatchlist(items: WatchlistItem[]): void {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to persist watchlist to localStorage', error)
  }
}

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>(loadWatchlist)

  // Cross-tab synchronization via window 'storage' event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WATCHLIST_STORAGE_KEY) {
        setItems(loadWatchlist())
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const has = useCallback(
    (movieId: number): boolean => {
      return items.some((item) => item.id === movieId)
    },
    [items]
  )

  const add = useCallback((movie: Movie | WatchlistItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev
      }

      const newItem: WatchlistItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path ?? null,
        release_date: movie.release_date ?? null,
        vote_average: movie.vote_average ?? 0,
        addedAt: Date.now(),
      }

      const next = [newItem, ...prev]
      persistWatchlist(next)
      toast.success(`Added "${newItem.title}" to your Watchlist`)
      return next
    })
  }, [])

  const remove = useCallback((movieId: number) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === movieId)
      if (!target) return prev

      const next = prev.filter((item) => item.id !== movieId)
      persistWatchlist(next)
      toast.info(`Removed "${target.title}" from your Watchlist`)
      return next
    })
  }, [])

  const toggle = useCallback((movie: Movie | WatchlistItem) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === movie.id)
      if (exists) {
        const next = prev.filter((item) => item.id !== movie.id)
        persistWatchlist(next)
        toast.info(`Removed "${movie.title}" from your Watchlist`)
        return next
      } else {
        const newItem: WatchlistItem = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ?? null,
          release_date: movie.release_date ?? null,
          vote_average: movie.vote_average ?? 0,
          addedAt: Date.now(),
        }
        const next = [newItem, ...prev]
        persistWatchlist(next)
        toast.success(`Added "${newItem.title}" to your Watchlist`)
        return next
      }
    })
  }, [])

  const clear = useCallback(() => {
    setItems([])
    persistWatchlist([])
    toast.info('Watchlist cleared')
  }, [])

  const contextValue = useMemo(
    () => ({
      items,
      count: items.length,
      add,
      remove,
      toggle,
      has,
      clear,
    }),
    [items, add, remove, toggle, has, clear]
  )

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWatchlist(): WatchlistContextType {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}
