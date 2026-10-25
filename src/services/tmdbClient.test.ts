import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as config from '../config/tmdb'
import { request, clearCache } from './tmdbClient'
import { TmdbError } from '../types/tmdb'

describe('tmdbClient', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    clearCache()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('throws missing_credential error when TMDB_CREDENTIAL is empty', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('')

    await expect(request('/movie/popular')).rejects.toThrow(TmdbError)
    await expect(request('/movie/popular')).rejects.toMatchObject({
      kind: 'missing_credential',
    })
  })

  it('sends Authorization: Bearer header when credential starts with eyJ (JWT), and no api_key param', async () => {
    const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken'
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue(mockJwt)

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    })
    global.fetch = mockFetch

    await request('/movie/popular')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [calledUrl, calledOptions] = mockFetch.mock.calls[0]
    expect(calledOptions.headers['Authorization']).toBe(`Bearer ${mockJwt}`)
    expect(new URL(calledUrl).searchParams.has('api_key')).toBe(false)
  })

  it('sends api_key query param when credential is not JWT, and no Authorization header', async () => {
    const mockApiKey = '1234567890abcdef'
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue(mockApiKey)

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    })
    global.fetch = mockFetch

    await request('/movie/popular')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [calledUrl, calledOptions] = mockFetch.mock.calls[0]
    expect(new URL(calledUrl).searchParams.get('api_key')).toBe(mockApiKey)
    expect(calledOptions.headers['Authorization']).toBeUndefined()
  })

  it('maps HTTP 401 and 403 to auth error kind', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    })

    await expect(request('/movie/popular')).rejects.toMatchObject({
      kind: 'auth',
      status: 401,
    })
  })

  it('maps HTTP 404 to not_found error kind', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })

    await expect(request('/movie/99999999')).rejects.toMatchObject({
      kind: 'not_found',
      status: 404,
    })
  })

  it('maps HTTP 429 to rate_limit error kind', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    })

    await expect(request('/movie/popular')).rejects.toMatchObject({
      kind: 'rate_limit',
      status: 429,
    })
  })

  it('maps HTTP 500 to server error kind', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(request('/movie/popular')).rejects.toMatchObject({
      kind: 'server',
      status: 500,
    })
  })

  it('caches successful GET responses for 5 minutes', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 550, title: 'Fight Club' }),
    })
    global.fetch = mockFetch

    // First call -> network
    const result1 = await request('/movie/550')
    expect(result1).toEqual({ id: 550, title: 'Fight Club' })
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Second call -> cached
    const result2 = await request('/movie/550')
    expect(result2).toEqual({ id: 550, title: 'Fight Club' })
    expect(mockFetch).toHaveBeenCalledTimes(1) // Not called again!
  })

  it('bypasses cache when bypassCache = true', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 550, title: 'Fight Club' }),
    })
    global.fetch = mockFetch

    await request('/movie/550')
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Bypass cache
    await request('/movie/550', undefined, undefined, true)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('passes AbortError through without converting to TmdbError', async () => {
    vi.spyOn(config, 'TMDB_CREDENTIAL', 'get').mockReturnValue('mock_key')

    const abortError = new DOMException('The user aborted a request.', 'AbortError')
    global.fetch = vi.fn().mockRejectedValue(abortError)

    await expect(request('/movie/popular')).rejects.toThrow('The user aborted a request.')
  })
})
