import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Mid } from './Mid'
import { WatchlistProvider } from '../context/WatchlistContext'
import * as movieService from '../services/movieService'
import { Movie, Paginated } from '../types/tmdb'

const mockMidMovies: Paginated<Movie> = {
  page: 1,
  total_pages: 5,
  total_results: 100,
  results: [
    {
      id: 991,
      title: 'Midnight Sinners',
      poster_path: '/mid1.jpg',
      backdrop_path: '/mid1_bg.jpg',
      overview: 'A gritty, uncut noir thriller exploring the depths of the city.',
      release_date: '2024-05-12',
      vote_average: 8.2,
      vote_count: 540,
      popularity: 76.5,
      adult: true,
    },
    {
      id: 992,
      title: 'Dark Sacrament',
      poster_path: '/mid2.jpg',
      backdrop_path: '/mid2_bg.jpg',
      overview: 'An intense, psychological horror tale of obsession and ritual.',
      release_date: '2023-10-31',
      vote_average: 7.6,
      vote_count: 820,
      popularity: 64.2,
      adult: false,
    },
  ],
}

describe('MID 18+ Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders 18+ mature audience banner, category chips, and movie cards', async () => {
    const getMidSpy = vi.spyOn(movieService, 'getMidMovies').mockResolvedValue(mockMidMovies)

    render(
      <WatchlistProvider>
        <MemoryRouter>
          <Mid />
        </MemoryRouter>
      </WatchlistProvider>
    )

    // Verify mature audience banner
    expect(screen.getByText(/Mature Audience Guidance/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Midnight/i)
    expect(screen.getByText('All Titles')).toBeInTheDocument()
    expect(screen.getByText('Sensual & Romance')).toBeInTheDocument()
    expect(screen.getByText('Erotica & Passion')).toBeInTheDocument()

    // Verify movies loaded
    await waitFor(() => {
      expect(screen.getByText('Midnight Sinners')).toBeInTheDocument()
      expect(screen.getByText('Dark Sacrament')).toBeInTheDocument()
    })

    expect(getMidSpy).toHaveBeenCalledWith(1, 'all', 'popularity.desc', expect.any(AbortSignal), false)
  })

  it('switches subcategory when clicking a chip and calls getMidMovies with selected filter', async () => {
    const getMidSpy = vi.spyOn(movieService, 'getMidMovies').mockResolvedValue(mockMidMovies)

    render(
      <WatchlistProvider>
        <MemoryRouter>
          <Mid />
        </MemoryRouter>
      </WatchlistProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Midnight Sinners')).toBeInTheDocument()
    })

    // Click on Sensual & Romance chip
    const nudeChip = screen.getByText('Sensual & Romance')
    fireEvent.click(nudeChip)

    await waitFor(() => {
      expect(getMidSpy).toHaveBeenCalledWith(1, 'nude', 'popularity.desc', expect.any(AbortSignal), false)
    })
  })
})
