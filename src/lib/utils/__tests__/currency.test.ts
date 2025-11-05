import { formatCurrencyLKR, parseCurrencyLKR } from '../currency'

describe('currency utilities', () => {
  describe('formatCurrencyLKR', () => {
    it('should format numbers as LKR currency', () => {
      expect(formatCurrencyLKR(15000)).toContain('15,000.00')
      expect(formatCurrencyLKR(1234.56)).toContain('1,234.56')
    })

    it('should handle zero', () => {
      const result = formatCurrencyLKR(0)
      expect(result).toContain('0.00')
    })

    it('should handle decimal numbers', () => {
      const result = formatCurrencyLKR(1234.5)
      expect(result).toContain('1,234.50')
    })

    it('should handle large numbers', () => {
      const result = formatCurrencyLKR(1000000)
      expect(result).toContain('1,000,000.00')
    })

    it('should handle negative numbers', () => {
      const result = formatCurrencyLKR(-500)
      expect(result).toContain('500')
    })

    it('should always show two decimal places', () => {
      const result = formatCurrencyLKR(100)
      expect(result).toContain('.00')
    })
  })

  describe('parseCurrencyLKR', () => {
    it('should parse formatted currency strings', () => {
      expect(parseCurrencyLKR('LKR 15,000.00')).toBe(15000)
      expect(parseCurrencyLKR('LKR 1,234.56')).toBe(1234.56)
    })

    it('should parse numbers with commas', () => {
      expect(parseCurrencyLKR('1,000,000')).toBe(1000000)
    })

    it('should parse plain numbers', () => {
      expect(parseCurrencyLKR('1234.56')).toBe(1234.56)
    })

    it('should handle zero', () => {
      expect(parseCurrencyLKR('0')).toBe(0)
      expect(parseCurrencyLKR('0.00')).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(parseCurrencyLKR('-500')).toBe(-500)
      expect(parseCurrencyLKR('LKR -1,234.56')).toBe(-1234.56)
    })

    it('should return 0 for invalid input', () => {
      expect(parseCurrencyLKR('invalid')).toBe(0)
      expect(parseCurrencyLKR('')).toBe(0)
      expect(parseCurrencyLKR('abc123')).toBe(0)
    })

    it('should handle strings with currency symbols', () => {
      expect(parseCurrencyLKR('Rs. 1,500.00')).toBe(1500)
      expect(parseCurrencyLKR('$ 1,000')).toBe(1000)
    })

    it('should handle decimal-only strings', () => {
      expect(parseCurrencyLKR('.50')).toBe(0.5)
      expect(parseCurrencyLKR('0.99')).toBe(0.99)
    })
  })
})

