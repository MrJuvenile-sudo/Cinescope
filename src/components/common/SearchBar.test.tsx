import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders large variant with placeholder and accessible label', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} variant="large" placeholder="Search films..." />)

    const input = screen.getByPlaceholderText('Search films...')
    expect(input).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('renders compact variant', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} variant="compact" />)

    expect(screen.getByPlaceholderText(/Search movies/i)).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} />)

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'Inception' } })

    expect(handleChange).toHaveBeenCalledWith('Inception')
  })

  it('displays clear button when value is non-empty, and clicking it clears value', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="Dune" onChange={handleChange} />)

    const clearButton = screen.getByRole('button', { name: /Clear search input/i })
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('calls onSubmit on form submit', () => {
    const handleSubmit = vi.fn()
    render(<SearchBar value="Casablanca" onChange={vi.fn()} onSubmit={handleSubmit} />)

    const form = screen.getByRole('search')
    fireEvent.submit(form)

    expect(handleSubmit).toHaveBeenCalledWith('Casablanca')
  })
})
