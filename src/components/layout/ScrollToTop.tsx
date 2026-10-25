import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls window to top ONLY when pathname changes,
 * deliberately ignoring search query-param changes (e.g. pagination/filter updates).
 */
export function ScrollToTop(): null {
  const { pathname } = useLocation()
  const prevPathnameRef = useRef<string>(pathname)

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  return null
}
