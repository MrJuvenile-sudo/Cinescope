import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Smoke Test', () => {
  it('renders application brand and navigates to Discover page', async () => {
    render(<App />)

    // Brand wordmark exists in Header
    const brandLinks = screen.getAllByRole('link', { name: /CineScope/i })
    expect(brandLinks.length).toBeGreaterThan(0)

    // Main navigation exists
    const discoverLinks = screen.getAllByRole('link', { name: /^Discover$/i })
    expect(discoverLinks.length).toBeGreaterThan(0)

    // Click the Discover navigation link
    fireEvent.click(discoverLinks[0])

    // Discover page heading rendered
    expect(
      await screen.findByRole('heading', { name: /Comedy Films/i })
    ).toBeInTheDocument()
  })

  it('renders 404 Scene Not Found for unmatched routes', () => {
    // Direct test with history or render
    window.history.pushState({}, '', '/non-existent-reel')
    render(<App />)

    expect(screen.getByRole('heading', { name: /Scene Not Found/i })).toBeInTheDocument()
  })
})
