import { UserRole } from '../../types/Auth'

export const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.CUSTOMER,
  isAuthenticated: true,
}

export const mockAuthService = {
  login: jest.fn().mockResolvedValue({
    user: mockUser,
    token: 'mock-token',
  }),
  
  register: jest.fn().mockResolvedValue({
    user: mockUser,
    message: 'Registration successful',
  }),
  
  logout: jest.fn().mockResolvedValue(undefined),
  
  getCurrentUser: jest.fn().mockReturnValue(mockUser),
  
  isAuthenticated: jest.fn().mockReturnValue(true),
  
  getToken: jest.fn().mockReturnValue('mock-token'),
  
  hasRole: jest.fn((role: UserRole) => role === UserRole.CUSTOMER),
  
  hasAnyRole: jest.fn((roles: UserRole[]) => 
    roles.includes(UserRole.CUSTOMER)
  ),
  
  getUserRole: jest.fn().mockReturnValue(UserRole.CUSTOMER),
  
  requiresPasswordChange: jest.fn().mockReturnValue(false),
  
  verifyEmail: jest.fn().mockResolvedValue({
    message: 'Email verified successfully',
  }),
  
  resendVerificationEmail: jest.fn().mockResolvedValue({
    message: 'Verification email sent',
  }),
  
  forgotPassword: jest.fn().mockResolvedValue({
    message: 'Password reset email sent',
  }),
  
  resetPassword: jest.fn().mockResolvedValue({
    message: 'Password reset successful',
  }),
  
  changePassword: jest.fn().mockResolvedValue({
    message: 'Password changed successfully',
    requiresPasswordChange: false,
  }),
}

export const authService = mockAuthService

