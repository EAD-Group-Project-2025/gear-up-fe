import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { authService } from '../../services/authService'
import { UserRole } from '../../types/Auth'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock('../../services/authService')

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current).toBeDefined()
    expect(result.current.user).toBeDefined()
    expect(result.current.login).toBeDefined()
    expect(result.current.logout).toBeDefined()
    expect(result.current.hasRole).toBeDefined()
  })

  it('should initialize with null user when not authenticated', () => {
    ;(authService.getCurrentUser as jest.Mock).mockReturnValue(null)
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(false)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should initialize with user when authenticated', () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    }

    ;(authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser)
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle login successfully', async () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    }

    ;(authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle logout', async () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    }

    ;(authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser)
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    ;(authService.logout as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.logout()
    })

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
    })
  })

  it('should check user role correctly', () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    }

    ;(authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser)
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.hasRole(UserRole.CUSTOMER)).toBe(true)
    expect(result.current.hasRole(UserRole.ADMIN)).toBe(false)
    expect(result.current.hasRole(UserRole.EMPLOYEE)).toBe(false)
  })

  it('should handle loading state', () => {
    ;(authService.getCurrentUser as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.loading).toBe(false)
  })

  it('should throw error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleError.mockRestore()
  })
})

