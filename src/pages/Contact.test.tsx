import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Contact } from './Contact'

describe('Contact Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const renderContact = () => {
    return render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
  }

  it('renders all form fields, subject dropdown, and live character counter', () => {
    renderContact()

    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject Matter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message Body/i)).toBeInTheDocument()
    expect(screen.getByText('0 / 1000')).toBeInTheDocument()
  })

  it('validates empty inputs on submit and displays accessible inline errors', () => {
    renderContact()

    const submitBtn = screen.getByRole('button', { name: /Dispatch Message/i })
    fireEvent.click(submitBtn)

    // Inline errors appear
    const nameError = screen.getByText(/Please enter your name \(minimum 2 characters\)/i)
    const emailError = screen.getByText(/Please enter a valid email address/i)
    const messageError = screen.getByText(/Please provide a message containing at least 10 characters/i)

    expect(nameError).toBeInTheDocument()
    expect(emailError).toBeInTheDocument()
    expect(messageError).toBeInTheDocument()

    // Aria attributes
    const nameInput = screen.getByLabelText(/Your Name/i)
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(nameInput).toHaveAttribute('aria-describedby', 'contact-name-error')
    expect(nameInput).toHaveFocus() // First invalid field focused
  })

  it('updates live character counter as user types in message textarea', () => {
    renderContact()

    const messageInput = screen.getByLabelText(/Message Body/i)
    fireEvent.change(messageInput, { target: { value: 'A thoughtful cinema review note.' } })

    expect(screen.getByText('32 / 1000')).toBeInTheDocument()
  })

  it('validates email format on blur when entering invalid format', () => {
    renderContact()

    const emailInput = screen.getByLabelText(/Email Address/i)
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } })
    fireEvent.blur(emailInput)

    expect(
      screen.getByText(/Please enter a valid email address/i)
    ).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('launches mailto: flow and displays honest transparency notice on valid submission', () => {
    // Mock window.location
    const originalLocation = window.location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { ...originalLocation, href: '' } as any

    renderContact()

    fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: 'Stanley Kubrick' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'stanley@overlook.com' } })
    fireEvent.change(screen.getByLabelText(/Subject Matter/i), { target: { value: 'Film Recommendation' } })
    fireEvent.change(screen.getByLabelText(/Message Body/i), {
      target: { value: 'I highly recommend exploring 2001: A Space Odyssey in your catalog.' },
    })

    const submitBtn = screen.getByRole('button', { name: /Dispatch Message/i })
    fireEvent.click(submitBtn)

    // Validates mailto URL formed
    expect(window.location.href).toContain('mailto:')
    expect(window.location.href).toContain('Stanley%20Kubrick')

    // Renders honest transparency notice
    expect(screen.getByText(/Mail Client Launched/i)).toBeInTheDocument()
    expect(
      screen.getByText(/CineScope operates exclusively as a client-side single-page application/i)
    ).toBeInTheDocument()

    // Can reset
    const resetBtn = screen.getByRole('button', { name: /Send Another Note/i })
    fireEvent.click(resetBtn)
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument()

    // Restore location
    window.location = originalLocation
  })
})
