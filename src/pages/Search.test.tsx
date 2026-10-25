import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Search } from './Search'
import { WatchlistProvider } from '../context/WatchlistContext'
import * as movieService from '../services/movieService'
import { TmdbError } from '../types/tmdb'

describe('Search Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  const renderSearch = (initialEntries = ['/search']) => {
    return render(
      <WatchlistProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/search" element={<Search />} />
          </Routes>
        </MemoryRouter>
      </WatchlistProvider>
    )
  }

  it('renders idle state and sends no API request when query is empty or less than 2 characters', async () => {
    const searchSpy = vi.spyOn(movieService, 'searchMovies')

    renderSearch(['/search'])

    expect(screen.getByText(/Ready to Explore/i)).toBeInTheDocument()
    expect(searchSpy).not.toHaveBeenCalled()
  })

  it('renders idle hint when query has only 1 character without fetching', async () => {
    const searchSpy = vi.spyOn(movieService, 'searchMovies')

    renderSearch(['/search?q=a'])

    expect(
      screen.getByText(/Enter at least 2 characters to trigger search/i)
    ).toBeInTheDocument()
    expect(searchSpy).not.toHaveBeenCalled()
  })

  it('executes search query and renders movie grid when query is >= 2 characters', async () => {
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      page: 1,
      results: [
        {
          id: 550,
          title: 'Fight Club',
          poster_path: '/poster.jpg',
          backdrop_path: null,
          overview: 'Rule 1: Do not talk about Fight Club.',
          release_date: '1999-10-15',
          vote_average: 8.4,
          vote_count: 24000,
          popularity: 70.5,
        },
      ],
      total_pages: 1,
      total_results: 1,
    })

    renderSearch(['/search?q=Fight'])

    expect(await screen.findByText('Fight Club')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/1 results found for Fight/i)
  })

  it('renders empty state when search returns zero results', async () => {
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    })

    renderSearch(['/search?q=nonexistentfilmtitle'])

    expect(await screen.findByText(/No Results Found/i)).toBeInTheDocument()
  })

  it('renders error state with retry button on request failure', async () => {
    vi.spyOn(movieService, 'searchMovies').mockRejectedValue(
      new TmdbError('network', 'Network connection offline')
    )

    renderSearch(['/search?q=Matrix'])

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Retry Request/i })).toBeInTheDocument()
  })
})
