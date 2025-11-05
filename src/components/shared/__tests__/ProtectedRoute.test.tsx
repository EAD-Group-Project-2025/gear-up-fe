import { render, screen, waitFor } from '@testing-library/react'
import ProtectedRoute from '../ProtectedRoute'
import { UserRole } from '@/lib/types/Auth'
import { authService, getUserFromToken } from '@/lib/services/authService'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockPush = jest.fn()

jest.mock('@/lib/services/authService', () => ({
  authService: {
    isAuthenticated: jest.fn(),
  },
  getUserFromToken: jest.fn(),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockPush.mockClear()
  })

  it('should show loading state initially', () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'mock-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText(/verifying authentication/i)).toBeInTheDocument()
  })

  it('should render children when user has required role', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'mock-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  it('should redirect to login when not authenticated', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(false)

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should redirect when no token found', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should redirect when token is invalid', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'invalid-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue(null)

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should redirect to customer dashboard when customer tries to access admin route', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'mock-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      role: UserRole.CUSTOMER,
      isAuthenticated: true,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <div>Admin Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/customer')
    })
  })

  it('should redirect to employee dashboard when employee tries to access admin route', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'mock-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue({
      email: 'employee@example.com',
      role: UserRole.EMPLOYEE,
      isAuthenticated: true,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <div>Admin Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/employee')
    })
  })

  it('should redirect to admin dashboard when admin tries to access customer route', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'mock-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue({
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      isAuthenticated: true,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
        <div>Customer Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin')
    })
  })

  it('should use custom redirectTo path', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(false)

    render(
      <ProtectedRoute requiredRole={UserRole.CUSTOMER} redirectTo="/custom-login">
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/custom-login')
    })
  })

  it('should allow admin to access admin routes', async () => {
    ;(authService.isAuthenticated as jest.Mock).mockReturnValue(true)
    localStorage.setItem('accessToken', 'mock-token')
    ;(getUserFromToken as jest.Mock).mockReturnValue({
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      isAuthenticated: true,
    })

    render(
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <div>Admin Content</div>
      </ProtectedRoute>
    )

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })
  })
})

