/**
 * Helper Functions Tests
 * Tests for common utility functions
 */

// Zodiac sign calculator
function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius'
  return 'Pisces'
}

// Format date for display
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calculate age
function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

describe('Helper Functions', () => {
  describe('getZodiacSign', () => {
    it('should return Aries for March 21 - April 19', () => {
      expect(getZodiacSign(new Date('2023-03-21'))).toBe('Aries')
      expect(getZodiacSign(new Date('2023-04-19'))).toBe('Aries')
    })

    it('should return Taurus for April 20 - May 20', () => {
      expect(getZodiacSign(new Date('2023-04-20'))).toBe('Taurus')
      expect(getZodiacSign(new Date('2023-05-20'))).toBe('Taurus')
    })

    it('should return Leo for July 23 - August 22', () => {
      expect(getZodiacSign(new Date('2023-07-23'))).toBe('Leo')
      expect(getZodiacSign(new Date('2023-08-22'))).toBe('Leo')
    })

    it('should return Capricorn for December 22 - January 19', () => {
      expect(getZodiacSign(new Date('2023-12-22'))).toBe('Capricorn')
      expect(getZodiacSign(new Date('2024-01-19'))).toBe('Capricorn')
    })

    it('should return Pisces for February 19 - March 20', () => {
      expect(getZodiacSign(new Date('2023-02-19'))).toBe('Pisces')
      expect(getZodiacSign(new Date('2023-03-20'))).toBe('Pisces')
    })
  })

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('December')
      expect(formatted).toContain('25')
      expect(formatted).toContain('2023')
    })

    it('should format string date correctly', () => {
      const formatted = formatDate('2023-12-25')
      expect(formatted).toContain('December')
      expect(formatted).toContain('25')
      expect(formatted).toContain('2023')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true)
      expect(isValidEmail('name+tag@example.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('no@domain')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('calculateAge', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-12-20'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should calculate correct age', () => {
      expect(calculateAge(new Date('1990-01-01'))).toBe(35)
      expect(calculateAge('1990-01-01')).toBe(35)
    })

    it('should handle birthday not yet occurred this year', () => {
      expect(calculateAge(new Date('1990-12-25'))).toBe(34) // Birthday not yet passed
    })

    it('should handle birthday today', () => {
      expect(calculateAge(new Date('1990-12-20'))).toBe(35)
    })

    it('should return 0 for current year births', () => {
      expect(calculateAge(new Date('2025-06-01'))).toBe(0)
    })
  })
})
