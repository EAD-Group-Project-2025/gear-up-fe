import { decodeToken, isTokenExpired, getUserFromToken } from '../authService'
import { UserRole } from '../../types/Auth'

describe('authService token utilities', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiZXhwIjoxNzAwMDAwMDAwLCJpYXQiOjE2OTk5OTYwMDB9.test'
  
  const validPayload = {
    sub: 'test@example.com',
    role: UserRole.CUSTOMER,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }

  const expiredPayload = {
    sub: 'test@example.com',
    role: UserRole.CUSTOMER,
    exp: Math.floor(Date.now() / 1000) - 3600,
    iat: Math.floor(Date.now() / 1000) - 7200,
  }

  const createMockToken = (payload: any): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = btoa(JSON.stringify(payload))
    return `${header}.${body}.signature`
  }

  describe('decodeToken', () => {
    it('should decode valid JWT token', () => {
      const token = createMockToken(validPayload)
      const decoded = decodeToken(token)
      
      expect(decoded).toBeTruthy()
      expect(decoded?.sub).toBe('test@example.com')
      expect(decoded?.role).toBe(UserRole.CUSTOMER)
    })

    it('should return null for invalid token', () => {
      const decoded = decodeToken('invalid-token')
      expect(decoded).toBeNull()
    })

    it('should return null for empty token', () => {
      const decoded = decodeToken('')
      expect(decoded).toBeNull()
    })

    it('should handle malformed tokens gracefully', () => {
      const decoded = decodeToken('not.a.valid.jwt.token')
      expect(decoded).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      const token = createMockToken(validPayload)
      const expired = isTokenExpired(token)
      expect(expired).toBe(false)
    })

    it('should return true for expired token', () => {
      const token = createMockToken(expiredPayload)
      const expired = isTokenExpired(token)
      expect(expired).toBe(true)
    })

    it('should return true for invalid token', () => {
      const expired = isTokenExpired('invalid-token')
      expect(expired).toBe(true)
    })

    it('should return true for empty token', () => {
      const expired = isTokenExpired('')
      expect(expired).toBe(true)
    })
  })

  describe('getUserFromToken', () => {
    it('should extract user info from valid token', () => {
      const token = createMockToken(validPayload)
      const user = getUserFromToken(token)
      
      expect(user).toBeTruthy()
      expect(user?.email).toBe('test@example.com')
      expect(user?.role).toBe(UserRole.CUSTOMER)
      expect(user?.isAuthenticated).toBe(true)
    })

    it('should return null for invalid token', () => {
      const user = getUserFromToken('invalid-token')
      expect(user).toBeNull()
    })

    it('should return null for empty token', () => {
      const user = getUserFromToken('')
      expect(user).toBeNull()
    })

    it('should handle different roles correctly', () => {
      const adminPayload = { ...validPayload, role: UserRole.ADMIN }
      const token = createMockToken(adminPayload)
      const user = getUserFromToken(token)
      
      expect(user?.role).toBe(UserRole.ADMIN)
    })

    it('should handle employee role', () => {
      const employeePayload = { ...validPayload, role: UserRole.EMPLOYEE }
      const token = createMockToken(employeePayload)
      const user = getUserFromToken(token)
      
      expect(user?.role).toBe(UserRole.EMPLOYEE)
    })
  })
})

