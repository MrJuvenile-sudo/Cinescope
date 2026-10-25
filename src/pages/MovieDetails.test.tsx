import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MovieDetails } from './MovieDetails'
import { WatchlistProvider } from '../context/WatchlistContext'
import * as movieService from '../services/movieService'
import { MovieDetails as MovieDetailsType, TmdbError } from '../types/tmdb'

const mockMovie: MovieDetailsType = {
  id: 550,
  title: 'Fight Club',
  tagline: 'Mischief. Mayhem. Soap.',
  poster_path: '/fightclub_poster.jpg',
  backdrop_path: '/fightclub_backdrop.jpg',
  overview:
    'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
  release_date: '1999-10-15',
  vote_average: 8.432,
  vote_count: 26000,
  popularity: 85.2,
  runtime: 139,
  genres: [
    { id: 18, name: 'Drama' },
    { id: 53, name: 'Thriller' },
  ],
  credits: {
    cast: [
      {
        id: 819,
        name: 'Edward Norton',
        character: 'The Narrator',
        profile_path: '/norton.jpg',
        order: 0,
      },
      {
        id: 287,
        name: 'Brad Pitt',
        character: 'Tyler Durden',
        profile_path: '/pitt.jpg',
        order: 1,
      },
    ],
    crew: [
      {
        id: 7467,
        name: 'David Fincher',
        job: 'Director',
        department: 'Directing',
        profile_path: '/fincher.jpg',
      },
    ],
  },
  videos: {
    results: [
      {
        id: 'vid123',
        key: 'c838YyR6L4U',
        name: 'Official Theatrical Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      },
    ],
  },
  similar: {
    page: 1,
    total_pages: 1,
    total_results: 1,
    results: [
      {
        id: 680,
        title: 'Pulp Fiction',
        poster_path: '/pulp.jpg',
        backdrop_path: null,
        overview: 'Pulp crime stories.',
        release_date: '1994-09-10',
        vote_average: 8.5,
        vote_count: 24000,
        popularity: 90.1,
      },
    ],
  },
}

describe('MovieDetails Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  const renderMovieDetails = (movieId = '550') => {
    return render(
      <WatchlistProvider>
        <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
          <Routes>
            <Route path="/movie/:movieId" element={<MovieDetails />} />
            <Route path="/discover" element={<div>Discover Catalog Screen</div>} />
          </Routes>
        </MemoryRouter>
      </WatchlistProvider>
    )
  }

  it('rejects invalid non-numeric movie IDs without calling the API', async () => {
    const detailsSpy = vi.spyOn(movieService, 'getMovieDetails')

    renderMovieDetails('invalid-slug')

    expect(screen.getByText(/Scene Not Found/i)).toBeInTheDocument()
    expect(screen.getByText(/identifier is not valid/i)).toBeInTheDocument()
    expect(detailsSpy).not.toHaveBeenCalled()
  })

  it('fetches movie details and renders full dossier with metadata, director, genres, and cast', async () => {
    vi.spyOn(movieService, 'getMovieDetails').mockResolvedValue(mockMovie)

    renderMovieDetails('550')

    // Initial loading
    expect(screen.getByRole('status', { name: /loading movie details/i })).toBeInTheDocument()

    // Title and tagline
    expect(await screen.findByRole('heading', { level: 1, name: 'Fight Club' })).toBeInTheDocument()
    expect(screen.getByText('"Mischief. Mayhem. Soap."')).toBeInTheDocument()

    // Release year and runtime
    expect(screen.getByText('1999')).toBeInTheDocument()
    expect(screen.getByText('2h 19m')).toBeInTheDocument()

    // Director
    expect(screen.getByText(/David Fincher/i)).toBeInTheDocument()

    // Genre chips linking to Discover
    expect(screen.getByText('Drama')).toBeInTheDocument()
    expect(screen.getByText('Thriller')).toBeInTheDocument()

    // Cast members
    expect(screen.getByText('Edward Norton')).toBeInTheDocument()
    expect(screen.getByText('The Narrator')).toBeInTheDocument()
    expect(screen.getByText('Brad Pitt')).toBeInTheDocument()
    expect(screen.getByText('Tyler Durden')).toBeInTheDocument()

    // Similar movies
    expect(screen.getByText('Pulp Fiction')).toBeInTheDocument()
  })

  it('opens accessible TrailerModal when clicking the trailer button and closes on Escape', async () => {
    vi.spyOn(movieService, 'getMovieDetails').mockResolvedValue(mockMovie)

    renderMovieDetails('550')

    const trailerBtn = await screen.findByRole('button', { name: /Play trailer for Fight Club/i })
    expect(trailerBtn).toBeInTheDocument()

    // Click to open modal
    fireEvent.click(trailerBtn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByTitle(/Fight Club trailer video player/i)).toBeInTheDocument()

    // Press Escape to close modal
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('handles 404 not_found error with friendly not-found screen and link to discover', async () => {
    vi.spyOn(movieService, 'getMovieDetails').mockRejectedValue(
      new TmdbError('not_found', 'Movie resource does not exist.')
    )

    renderMovieDetails('9999999')

    expect(await screen.findByText(/Movie Not Found/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Return to Discover/i })).toBeInTheDocument()
  })

  it('handles network error with retry button that triggers refetch', async () => {
    const detailsSpy = vi
      .spyOn(movieService, 'getMovieDetails')
      .mockRejectedValueOnce(new TmdbError('network', 'Network connection offline.'))
      .mockResolvedValueOnce(mockMovie)

    renderMovieDetails('550')

    expect(await screen.findByText(/Connection Offline/i)).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /Retry Request/i })

    fireEvent.click(retryBtn)

    expect(await screen.findByRole('heading', { level: 1, name: 'Fight Club' })).toBeInTheDocument()
    expect(detailsSpy).toHaveBeenCalledTimes(2)
  })

  it('navigates back to previous screen when clicking the back button', async () => {
    vi.spyOn(movieService, 'getMovieDetails').mockResolvedValue(mockMovie)

    renderMovieDetails('550')

    await screen.findByRole('heading', { level: 1, name: 'Fight Club' })
    const backBtn = screen.getByRole('button', { name: /Back/i })
    expect(backBtn).toBeInTheDocument()
    fireEvent.click(backBtn)
  })
})
