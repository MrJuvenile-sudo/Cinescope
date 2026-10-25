import React from 'react'
import { Search as SearchIcon, X } from 'lucide-react'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (query: string) => void
  placeholder?: string
  variant?: 'compact' | 'large'
  autoFocus?: boolean
  className?: string
  id?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by title, director, or keyword...',
  variant = 'large',
  autoFocus = false,
  className = '',
  id = 'cinescope-search-input',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(value.trim())
    }
  }

  const handleClear = () => {
    onChange('')
  }

  if (variant === 'compact') {
    return (
      <form
        role="search"
        onSubmit={handleSubmit}
        className={`relative flex items-center ${className}`}
      >
        <label htmlFor={`${id}-compact`} className="sr-only">
          Search movies
        </label>
        <div className="absolute left-3 pointer-events-none text-[var(--text-muted)] flex items-center">
          <SearchIcon className="w-3.5 h-3.5" />
        </div>
        <input
          id={`${id}-compact`}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search movies..."
          autoFocus={autoFocus}
          className="w-44 lg:w-56 pl-8 pr-7 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all hover:border-[var(--border-strong)]"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-2 p-0.5 text-[var(--text-muted)] hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>
    )
  }

  // Large search bar variant for the Search page
  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`relative w-full ${className}`}
    >
      <label htmlFor={`${id}-large`} className="sr-only">
        Search movies by title
      </label>

      <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-[var(--gold)]">
        <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <input
        id={`${id}-large`}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="w-full pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-sm sm:text-base text-[var(--text)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all shadow-inner hover:border-[var(--border-strong)]"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  )
}
