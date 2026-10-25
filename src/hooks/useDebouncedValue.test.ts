import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with the given value', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 400))
    expect(result.current).toBe('initial')
  })

  it('updates debounced value only after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebouncedValue(val, delay),
      { initialProps: { val: 'first', delay: 400 } }
    )

    rerender({ val: 'second', delay: 400 })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('second')
  })

  it('cancels pending update if value changes quickly within delay window', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebouncedValue(val, delay),
      { initialProps: { val: 'first', delay: 400 } }
    )

    rerender({ val: 'second', delay: 400 })
    act(() => {
      vi.advanceTimersByTime(250)
    })

    rerender({ val: 'third', delay: 400 })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    // 250ms has elapsed since 'third', so it should not have updated yet
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe('third')
  })
})
