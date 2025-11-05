import {
  getAuthToken,
  getAuthHeaders,
  isAuthenticated,
  handleAuthError,
  authenticatedFetch,
} from '../authUtils'

describe('authUtils', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('getAuthToken', () => {
    it('should return null when no token exists', () => {
      const token = getAuthToken()
      expect(token).toBeNull()
    })

    it('should return token from accessToken key', () => {
      localStorage.setItem('accessToken', 'test-token')
      const token = getAuthToken()
      expect(token).toBe('test-token')
    })

    it('should fallback to token key if accessToken not found', () => {
      localStorage.setItem('token', 'fallback-token')
      const token = getAuthToken()
      expect(token).toBe('fallback-token')
    })

    it('should prioritize accessToken over token', () => {
      localStorage.setItem('accessToken', 'access-token')
      localStorage.setItem('token', 'fallback-token')
      const token = getAuthToken()
      expect(token).toBe('access-token')
    })
  })

  describe('getAuthHeaders', () => {
    it('should return headers without Authorization when no token', () => {
      const headers = getAuthHeaders()
      expect(headers).toEqual({
        'Content-Type': 'application/json',
      })
    })

    it('should return headers with Authorization when token exists', () => {
      localStorage.setItem('accessToken', 'test-token')
      const headers = getAuthHeaders()
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      })
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return true when token exists', () => {
      localStorage.setItem('accessToken', 'test-token')
      expect(isAuthenticated()).toBe(true)
    })
  })

  describe('handleAuthError', () => {
    it('should clear localStorage and return session expired error for 401', () => {
      localStorage.setItem('accessToken', 'test-token')
      localStorage.setItem('otherKey', 'otherValue')
      const response = { status: 401 } as Response
      
      const error = handleAuthError(response)
      
      expect(error.message).toBe('Session expired. Please login again.')
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('otherKey')).toBeNull()
    })

    it('should return generic error for non-401 status', () => {
      const response = { status: 500 } as Response
      
      const error = handleAuthError(response)
      
      expect(error.message).toBe('Request failed with status 500')
    })
  })

  describe('authenticatedFetch', () => {
    beforeEach(() => {
      global.fetch = jest.fn()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should throw error when no token exists', async () => {
      await expect(
        authenticatedFetch('https://api.example.com/test')
      ).rejects.toThrow('Please login to continue')
    })

    it('should make authenticated request with token', async () => {
      localStorage.setItem('accessToken', 'test-token')
      const mockResponse = { status: 200, ok: true } as Response
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const response = await authenticatedFetch('https://api.example.com/test')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
      expect(response).toBe(mockResponse)
    })

    it('should clear localStorage and throw error on 401 response', async () => {
      localStorage.setItem('accessToken', 'test-token')
      const mockResponse = { status: 401, ok: false } as Response
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(
        authenticatedFetch('https://api.example.com/test')
      ).rejects.toThrow('Session expired. Please login again.')
      
      expect(localStorage.getItem('accessToken')).toBeNull()
    })

    it('should merge custom headers with auth headers', async () => {
      localStorage.setItem('accessToken', 'test-token')
      const mockResponse = { status: 200, ok: true } as Response
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await authenticatedFetch('https://api.example.com/test', {
        headers: { 'X-Custom-Header': 'custom-value' },
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'X-Custom-Header': 'custom-value',
          }),
        })
      )
    })
  })
})

