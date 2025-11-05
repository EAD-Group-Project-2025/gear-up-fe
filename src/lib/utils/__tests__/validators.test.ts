import {
  validateFullName,
  validateEmail,
  validateMobile,
  validateNIC,
  validateDateOfBirth,
  validateAddress,
  normalizeFullName,
  normalizeEmail,
} from '../validators'

describe('validators', () => {
  describe('validateFullName', () => {
    it('should validate valid full names', () => {
      expect(validateFullName('John Doe')).toEqual({ isValid: true })
      expect(validateFullName('Jane Smith')).toEqual({ isValid: true })
      expect(validateFullName('A B')).toEqual({ isValid: true })
    })

    it('should reject names that are too short', () => {
      const result = validateFullName('A')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Name must be at least 2 characters')
    })

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(81)
      const result = validateFullName(longName)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Name must be less than 80 characters')
    })

    it('should trim whitespace and handle multiple spaces', () => {
      expect(validateFullName('  John   Doe  ')).toEqual({ isValid: true })
    })

    it('should reject empty or whitespace-only names', () => {
      const result = validateFullName('   ')
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateEmail', () => {
    it('should validate valid email addresses', () => {
      expect(validateEmail('test@example.com')).toEqual({ isValid: true })
      expect(validateEmail('user.name@domain.co.uk')).toEqual({ isValid: true })
      expect(validateEmail('test+tag@example.com')).toEqual({ isValid: true })
    })

    it('should reject invalid email formats', () => {
      const result = validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })

    it('should reject email without domain', () => {
      const result = validateEmail('test@')
      expect(result.isValid).toBe(false)
    })

    it('should reject email without @', () => {
      const result = validateEmail('testexample.com')
      expect(result.isValid).toBe(false)
    })

    it('should reject empty email', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Email is required')
    })

    it('should handle whitespace and case normalization', () => {
      expect(validateEmail('  TEST@EXAMPLE.COM  ')).toEqual({ isValid: true })
    })
  })

  describe('validateMobile', () => {
    it('should validate valid mobile numbers', () => {
      expect(validateMobile('0771234567')).toEqual({ isValid: true })
      expect(validateMobile('+94771234567')).toEqual({ isValid: true })
      expect(validateMobile('94771234567')).toEqual({ isValid: true })
    })

    it('should accept mobile with spaces', () => {
      expect(validateMobile('+94 77 123 4567')).toEqual({ isValid: true })
    })

    it('should reject mobile numbers that are too short', () => {
      const result = validateMobile('1234567')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('8-15 digits')
    })

    it('should reject mobile numbers that are too long', () => {
      const result = validateMobile('1234567890123456')
      expect(result.isValid).toBe(false)
    })

    it('should reject mobile with letters', () => {
      const result = validateMobile('077abc1234')
      expect(result.isValid).toBe(false)
    })

    it('should reject empty mobile', () => {
      const result = validateMobile('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Mobile number is required')
    })
  })

  describe('validateNIC', () => {
    it('should validate old format NIC (9 digits + V)', () => {
      expect(validateNIC('123456789V')).toEqual({ isValid: true })
      expect(validateNIC('987654321X')).toEqual({ isValid: true })
    })

    it('should validate new format NIC (12 digits)', () => {
      expect(validateNIC('200012345678')).toEqual({ isValid: true })
    })

    it('should allow empty NIC (optional field)', () => {
      expect(validateNIC('')).toEqual({ isValid: true })
    })

    it('should reject invalid NIC formats', () => {
      const result = validateNIC('12345')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('9 digits + V/X or 12 digits')
    })

    it('should handle case normalization', () => {
      expect(validateNIC('123456789v')).toEqual({ isValid: true })
    })
  })

  describe('validateDateOfBirth', () => {
    it('should validate valid past dates for adults', () => {
      const twentyYearsAgo = new Date()
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20)
      const dateString = twentyYearsAgo.toISOString().split('T')[0]
      
      expect(validateDateOfBirth(dateString)).toEqual({ isValid: true })
    })

    it('should allow empty date of birth (optional field)', () => {
      expect(validateDateOfBirth('')).toEqual({ isValid: true })
    })

    it('should reject future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateString = tomorrow.toISOString().split('T')[0]
      
      const result = validateDateOfBirth(dateString)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Date of birth must be in the past')
    })

    it('should reject dates for people under 16', () => {
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      const dateString = tenYearsAgo.toISOString().split('T')[0]
      
      const result = validateDateOfBirth(dateString)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('You must be at least 16 years old')
    })

    it('should reject invalid date strings', () => {
      const result = validateDateOfBirth('not-a-date')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid date')
    })
  })

  describe('validateAddress', () => {
    it('should validate valid addresses', () => {
      expect(validateAddress('123 Main Street')).toEqual({ isValid: true })
      expect(validateAddress('Apartment 4B, Building 2, Street Name, City')).toEqual({ 
        isValid: true 
      })
    })

    it('should reject addresses that are too short', () => {
      const result = validateAddress('123')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Address must be at least 5 characters')
    })

    it('should reject addresses that are too long', () => {
      const longAddress = 'A'.repeat(201)
      const result = validateAddress(longAddress)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Address must be less than 200 characters')
    })

    it('should trim whitespace', () => {
      expect(validateAddress('  123 Main St  ')).toEqual({ isValid: true })
    })
  })

  describe('normalizeFullName', () => {
    it('should trim and normalize whitespace', () => {
      expect(normalizeFullName('  John   Doe  ')).toBe('John Doe')
      expect(normalizeFullName('Jane    Smith')).toBe('Jane Smith')
    })

    it('should handle single spaces correctly', () => {
      expect(normalizeFullName('John Doe')).toBe('John Doe')
    })
  })

  describe('normalizeEmail', () => {
    it('should trim and lowercase email', () => {
      expect(normalizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com')
      expect(normalizeEmail('User@Domain.COM')).toBe('user@domain.com')
    })

    it('should handle already normalized emails', () => {
      expect(normalizeEmail('test@example.com')).toBe('test@example.com')
    })
  })
})

