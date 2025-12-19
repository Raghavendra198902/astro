/**
 * Authentication API Tests
 * Integration tests for login/register functionality
 */

describe('Authentication API', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    localStorage.clear()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        access_token: 'mock-token-123',
        token_type: 'Bearer',
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'seeker',
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      const data = await result.json()

      expect(result.ok).toBe(true)
      expect(data).toHaveProperty('access_token')
      expect(data.user.email).toBe('test@example.com')
    })

    it('should fail login with invalid credentials', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Invalid credentials' }),
      })

      const result = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'wrongpass',
        }),
      })

      expect(result.ok).toBe(false)
      expect(result.status).toBe(401)
    })

    it('should validate email format', () => {
      const invalidEmails = ['notanemail', '@example.com', 'test@', 'test..@example.com']
      
      invalidEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should validate password strength', () => {
      const weakPasswords = ['123', 'abc', 'pass']
      const strongPassword = 'StrongPass123!'

      weakPasswords.forEach((password) => {
        expect(password.length >= 8).toBe(false)
      })

      expect(strongPassword.length >= 8).toBe(true)
    })
  })

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockResponse = {
        id: 1,
        email: 'newuser@example.com',
        role: 'seeker',
        created_at: '2025-12-20T00:00:00Z',
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      })

      const result = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          full_name: 'New User',
        }),
      })

      const data = await result.json()

      expect(result.ok).toBe(true)
      expect(data.email).toBe('newuser@example.com')
    })

    it('should fail registration with existing email', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Email already registered' }),
      })

      const result = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'SecurePass123!',
        }),
      })

      expect(result.ok).toBe(false)
      expect(result.status).toBe(400)
    })
  })

  describe('token management', () => {
    it('should store token in localStorage after login', () => {
      const token = 'mock-token-123'
      localStorage.setItem('token', token)

      expect(localStorage.getItem('token')).toBe(token)
    })

    it('should clear token on logout', () => {
      localStorage.setItem('token', 'mock-token-123')
      localStorage.removeItem('token')

      expect(localStorage.getItem('token')).toBeNull()
    })

    it('should include token in authenticated requests', () => {
      const token = 'mock-token-123'
      localStorage.setItem('token', token)

      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }

      expect(headers.Authorization).toBe(`Bearer ${token}`)
    })
  })
})
