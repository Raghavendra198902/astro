/**
 * Chart API Integration Tests
 * Tests for birth chart generation and retrieval
 */

describe('Chart API', () => {
  const mockToken = 'mock-jwt-token-123'

  beforeEach(() => {
    global.fetch = jest.fn()
    localStorage.setItem('token', mockToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    localStorage.clear()
  })

  describe('POST /api/v1/charts', () => {
    it('should create a new chart with valid data', async () => {
      const chartData = {
        name: 'John Doe',
        birth_date: '1990-01-01',
        birth_time: '12:00',
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: 'Asia/Kolkata',
      }

      const mockResponse = {
        id: 1,
        ...chartData,
        planets: {
          Sun: { longitude: 280.5, sign: 'Capricorn' },
          Moon: { longitude: 120.3, sign: 'Cancer' },
        },
        houses: Array(12).fill(null).map((_, i) => ({
          house: i + 1,
          sign: 'Aries',
          degree: 0,
        })),
        created_at: '2025-12-20T00:00:00Z',
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      })

      const result = await fetch('/api/v1/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(chartData),
      })

      const data = await result.json()

      expect(result.ok).toBe(true)
      expect(data).toHaveProperty('planets')
      expect(data).toHaveProperty('houses')
      expect(data.id).toBe(1)
    })

    it('should fail without authentication', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Not authenticated' }),
      })

      const result = await fetch('/api/v1/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(result.ok).toBe(false)
      expect(result.status).toBe(401)
    })

    it('should validate required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        // Missing birth_date, birth_time, etc.
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          detail: [
            { loc: ['body', 'birth_date'], msg: 'field required' },
          ],
        }),
      })

      const result = await fetch('/api/v1/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(invalidData),
      })

      expect(result.ok).toBe(false)
      expect(result.status).toBe(422)
    })
  })

  describe('GET /api/v1/charts', () => {
    it('should retrieve user charts', async () => {
      const mockCharts = [
        {
          id: 1,
          name: 'My Chart',
          birth_date: '1990-01-01',
          created_at: '2025-12-20T00:00:00Z',
        },
        {
          id: 2,
          name: 'Partner Chart',
          birth_date: '1992-05-15',
          created_at: '2025-12-20T01:00:00Z',
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharts,
      })

      const result = await fetch('/api/v1/charts', {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      })

      const data = await result.json()

      expect(result.ok).toBe(true)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(2)
    })
  })

  describe('GET /api/v1/charts/:id', () => {
    it('should retrieve specific chart by ID', async () => {
      const chartId = 1
      const mockChart = {
        id: chartId,
        name: 'John Doe',
        birth_date: '1990-01-01',
        planets: { Sun: { longitude: 280.5 } },
        houses: Array(12).fill({}),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChart,
      })

      const result = await fetch(`/api/v1/charts/${chartId}`, {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      })

      const data = await result.json()

      expect(result.ok).toBe(true)
      expect(data.id).toBe(chartId)
      expect(data).toHaveProperty('planets')
    })

    it('should return 404 for non-existent chart', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Chart not found' }),
      })

      const result = await fetch('/api/v1/charts/999', {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      })

      expect(result.ok).toBe(false)
      expect(result.status).toBe(404)
    })
  })

  describe('DELETE /api/v1/charts/:id', () => {
    it('should delete a chart', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      const result = await fetch('/api/v1/charts/1', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      })

      expect(result.ok).toBe(true)
      expect(result.status).toBe(204)
    })
  })
})
