import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.scrollTo for jsdom
window.scrollTo = vi.fn()

// Mock Element.prototype.scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn()
