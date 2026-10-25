import { useEffect } from 'react'

/**
 * Sets document.title on mount and updates when title changes.
 */
export function useDocumentTitle(title: string, suffix = 'CineScope'): void {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} · ${suffix}` : suffix
    return () => {
      document.title = prevTitle
    }
  }, [title, suffix])
}
