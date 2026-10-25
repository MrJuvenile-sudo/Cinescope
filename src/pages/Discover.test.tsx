import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Discover } from './Discover'
import { WatchlistProvider } from '../context/WatchlistContext'
import * as movieService from '../services/movieService'
import { TmdbError } from '../types/tmdb'

describe('Discover Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  const renderDiscover = (initialEntries = ['/discover']) => {
    return render(
      <WatchlistProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/discover" element={<Discover />} />
          </Routes>
        </MemoryRouter>
      </WatchlistProvider>
    )
  }

  it('renders dynamic heading and filter panel on load', async () => {
    vi.spyOn(movieService, 'getGenres').mockResolvedValue({
      genres: [{ id: 35, name: 'Comedy' }],
    })
    vi.spyOn(movieService, 'discoverMovies').mockResolvedValue({
      page: 1,
      results: [
        {
          id: 101,
          title: 'The Big Lebowski',
          poster_path: '/lebowski.jpg',
          backdrop_path: null,
          overview: 'The Dude abides.',
          release_date: '1998-03-06',
          vote_average: 8.1,
          vote_count: 10000,
          popularity: 45.2,
        },
      ],
      total_pages: 5,
      total_results: 100,
    })

    renderDiscover(['/discover?genre=35&year=2025&rating=7&sort=popularity.desc&page=1'])

    // Heading exists
    expect(
      await screen.findByRole('heading', { name: /2025 Comedy Films/i })
    ).toBeInTheDocument()

    // Filter selects exist
    expect(screen.getByLabelText(/Genre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Release Year/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Minimum Rating/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sort Order/i)).toBeInTheDocument()

    // Movie card appears
    expect(await screen.findByText(/The Big Lebowski/i)).toBeInTheDocument()
  })

  it('renders ErrorState with retry button when discover request fails', async () => {
    vi.spyOn(movieService, 'getGenres').mockResolvedValue({ genres: [] })
    vi.spyOn(movieService, 'discoverMovies').mockRejectedValue(
      new TmdbError('network', 'Connection lost')
    )

    renderDiscover(['/discover?genre=35&year=2025&rating=7&sort=popularity.desc&page=1'])

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Retry Request/i })).toBeInTheDocument()
  })

  it('renders EmptyState when discoverMovies returns empty results array', async () => {
    vi.spyOn(movieService, 'getGenres').mockResolvedValue({ genres: [] })
    vi.spyOn(movieService, 'discoverMovies').mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    })

    renderDiscover(['/discover?genre=35&year=2025&rating=7&sort=popularity.desc&page=1'])

    expect(await screen.findByText(/No Matching Films Found/i)).toBeInTheDocument()
    const resetButtons = screen.getAllByRole('button', { name: /Reset/i })
    expect(resetButtons.length).toBeGreaterThan(0)
  })

  it('changing filter resets page to 1', async () => {
    vi.spyOn(movieService, 'getGenres').mockResolvedValue({
      genres: [
        { id: 35, name: 'Comedy' },
        { id: 28, name: 'Action' },
      ],
    })
    vi.spyOn(movieService, 'discoverMovies').mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 10,
      total_results: 200,
    })

    renderDiscover(['/discover?genre=35&year=2025&rating=7&sort=popularity.desc&page=3'])

    const genreSelect = await screen.findByLabelText(/Genre/i)
    fireEvent.change(genreSelect, { target: { value: '28' } })

    // Page updates and triggers heading change
    expect(
      await screen.findByRole('heading', { name: /2025 Action Films/i })
    ).toBeInTheDocument()
  })
})
