import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Watchlist } from './Watchlist'
import { WatchlistProvider } from '../context/WatchlistContext'
import { WATCHLIST_STORAGE_KEY } from '../config/tmdb'
import { WatchlistItem } from '../types/tmdb'

const sampleItems: WatchlistItem[] = [
  {
    id: 101,
    title: 'The Dark Knight',
    poster_path: '/darkknight.jpg',
    release_date: '2008-07-18',
    vote_average: 8.5,
    addedAt: 1000,
  },
  {
    id: 102,
    title: 'Alien',
    poster_path: '/alien.jpg',
    release_date: '1979-05-25',
    vote_average: 8.1,
    addedAt: 3000,
  },
  {
    id: 103,
    title: 'Interstellar',
    poster_path: '/interstellar.jpg',
    release_date: '2014-11-05',
    vote_average: 8.7,
    addedAt: 2000,
  },
]

describe('Watchlist Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  const renderWatchlist = (storedItems: WatchlistItem[] = []) => {
    if (storedItems.length > 0) {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(storedItems))
    }

    return render(
      <WatchlistProvider>
        <MemoryRouter initialEntries={['/watchlist']}>
          <Routes>
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/discover" element={<div>Discover Catalog</div>} />
          </Routes>
        </MemoryRouter>
      </WatchlistProvider>
    )
  }

  it('renders vault empty state when watchlist has 0 items', () => {
    renderWatchlist([])

    expect(screen.getByText(/Your Screening Queue Awaits/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore Discover Catalog/i })).toBeInTheDocument()
  })

  it('renders saved movie cards with correct count in heading', () => {
    renderWatchlist(sampleItems)

    expect(
      screen.getByRole('heading', { level: 1, name: /Your Watchlist · 3 Movies/i })
    ).toBeInTheDocument()

    expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    expect(screen.getByText('Alien')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  it('sorts movies by recently added, title, and highest rated', () => {
    renderWatchlist(sampleItems)

    const sortSelect = screen.getByLabelText(/Sort by:/i)

    // Default: 'recent' (Alien addedAt:3000, Interstellar addedAt:2000, The Dark Knight addedAt:1000)
    const getCardTitles = () => {
      return screen
        .getAllByRole('link')
        .map((a) => a.textContent)
        .filter((text) =>
          ['The Dark Knight', 'Alien', 'Interstellar'].includes(text || '')
        )
    }

    expect(getCardTitles()).toEqual(['Alien', 'Interstellar', 'The Dark Knight'])

    // Change sort to Title (A-Z)
    fireEvent.change(sortSelect, { target: { value: 'title' } })
    expect(getCardTitles()).toEqual(['Alien', 'Interstellar', 'The Dark Knight'])

    // Change sort to Highest Rated (Interstellar 8.7, Dark Knight 8.5, Alien 8.1)
    fireEvent.change(sortSelect, { target: { value: 'rating' } })
    expect(getCardTitles()).toEqual(['Interstellar', 'The Dark Knight', 'Alien'])
  })

  it('removes an item from watchlist when clicking its remove button', () => {
    renderWatchlist(sampleItems)

    const removeAlienBtn = screen.getByRole('button', {
      name: /Remove Alien from Watchlist/i,
    })
    fireEvent.click(removeAlienBtn)

    expect(screen.queryByText('Alien')).not.toBeInTheDocument()
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  it('opens confirmation dialog on Clear All and cancels cleanly without purging', () => {
    renderWatchlist(sampleItems)

    const clearAllBtn = screen.getByRole('button', { name: /Clear All/i })
    fireEvent.click(clearAllBtn)

    // Alert dialog opens
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to remove all/i)).toBeInTheDocument()

    // Click cancel
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText('Alien')).toBeInTheDocument()
  })

  it('purges all items on confirming Clear All and renders empty state', () => {
    renderWatchlist(sampleItems)

    const clearAllBtn = screen.getByRole('button', { name: /Clear All/i })
    fireEvent.click(clearAllBtn)

    const confirmBtn = screen.getByRole('button', { name: /Yes, Clear All/i })
    fireEvent.click(confirmBtn)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText(/Your Screening Queue Awaits/i)).toBeInTheDocument()
    expect(screen.queryByText('Alien')).not.toBeInTheDocument()
    expect(localStorage.getItem(WATCHLIST_STORAGE_KEY)).toBe('[]')
  })
})
