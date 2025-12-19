/**
 * Configuration Utility Tests
 * Tests for app/config.ts
 */

describe('Config Utils', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = process.env
    jest.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('API_URL', () => {
    it('should use environment variable when set', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
      const { API_URL } = require('@/app/config')
      expect(API_URL).toBe('https://api.example.com')
    })

    it('should default to empty string when not set', () => {
      delete process.env.NEXT_PUBLIC_API_URL
      const { API_URL } = require('@/app/config')
      expect(API_URL).toBe('')
    })
  })

  describe('WS_URL', () => {
    it('should use environment variable when set', () => {
      process.env.NEXT_PUBLIC_WS_URL = 'wss://api.example.com'
      const { WS_URL } = require('@/app/config')
      expect(WS_URL).toBe('wss://api.example.com')
    })

    it('should have fallback value', () => {
      delete process.env.NEXT_PUBLIC_WS_URL
      const { WS_URL } = require('@/app/config')
      expect(WS_URL).toContain('ws://')
    })
  })
})
