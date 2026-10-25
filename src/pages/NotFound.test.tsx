import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFound } from './NotFound'

describe('NotFound Page', () => {
  const renderNotFound = () => {
    return render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
  }

  it('renders Scene Not Found 404 presentation and explanation', () => {
    renderNotFound()

    expect(screen.getByRole('heading', { level: 1, name: /Scene Not Found/i })).toBeInTheDocument()
    expect(screen.getByText(/Error 404 · Reel Missing/i)).toBeInTheDocument()
    expect(
      screen.getByText(/The frame you are searching for appears to have been cut from the final print/i)
    ).toBeInTheDocument()
  })

  it('provides navigation links back to Home and Discover', () => {
    renderNotFound()

    const homeLink = screen.getByRole('link', { name: /Return to Premiere/i })
    expect(homeLink).toHaveAttribute('href', '/')

    const discoverLink = screen.getByRole('link', { name: /Explore Discover/i })
    expect(discoverLink).toHaveAttribute('href', '/discover')
  })
})
