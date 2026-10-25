import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { About } from './About'

describe('About Page', () => {
  const renderAbout = () => {
    return render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
  }

  it('renders story heading, tech stack cards, and assignment criteria', () => {
    renderAbout()

    expect(screen.getByRole('heading', { level: 1, name: /Crafted for the Love of Cinema/i })).toBeInTheDocument()
    expect(screen.getByText(/React 18 & Vite/i)).toBeInTheDocument()
    expect(screen.getByText(/React Router v6/i)).toBeInTheDocument()
    expect(screen.getByText(/Tailwind CSS v4/i)).toBeInTheDocument()
    expect(screen.getByText(/TMDB REST API v3/i)).toBeInTheDocument()
  })

  it('displays the exact legal TMDB attribution sentence without logo images', () => {
    renderAbout()

    const attributionText = screen.getByText(
      /This product uses the TMDB API but is not endorsed or certified by TMDB\./i
    )
    expect(attributionText).toBeInTheDocument()

    const tmdbLink = screen.getByRole('link', { name: /Visit TMDB Official Website/i })
    expect(tmdbLink).toHaveAttribute('href', 'https://www.themoviedb.org')
    expect(tmdbLink).toHaveAttribute('target', '_blank')
  })

  it('renders functional navigation links for assignment requirements', () => {
    renderAbout()

    const discoverLinks = screen.getAllByRole('link', { name: /Explore Discover Catalog|Test Discover Filters/i })
    expect(discoverLinks.length).toBeGreaterThan(0)
    expect(discoverLinks[0]).toHaveAttribute('href', '/discover')

    const searchLink = screen.getByRole('link', { name: /Try Movie Search/i })
    expect(searchLink).toHaveAttribute('href', '/search')

    const watchlistLink = screen.getByRole('link', { name: /Open Personal Watchlist/i })
    expect(watchlistLink).toHaveAttribute('href', '/watchlist')
  })
})
