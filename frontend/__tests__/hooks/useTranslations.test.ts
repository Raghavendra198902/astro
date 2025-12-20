/**
 * Hook Tests for useTranslations
 * Covers: Hook behavior, state management, performance
 */

import { renderHook } from '@testing-library/react';
import { useTranslations } from '@/app/hooks/useTranslations';
import { useI18n } from '@/app/contexts/I18nContext';

jest.mock('@/app/contexts/I18nContext');

const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>;

describe('useTranslations Hook Tests', () => {
  const mockGetNamespace = jest.fn();
  const mockT = jest.fn();

  beforeEach(() => {
    mockGetNamespace.mockClear();
    mockT.mockClear();
    
    mockUseI18n.mockReturnValue({
      locale: 'en',
      setLocale: jest.fn(),
      t: mockT,
      getNamespace: mockGetNamespace,
    });
  });

  describe('Happy Path Tests', () => {
    test('should return locale from context', () => {
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.locale).toBe('en');
    });

    test('should return t function', () => {
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.t).toBeDefined();
      expect(typeof result.current.t).toBe('function');
    });

    test('should return getNamespace function', () => {
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.getNamespace).toBeDefined();
      expect(typeof result.current.getNamespace).toBe('function');
    });

    test('should return all namespace shortcuts', () => {
      mockGetNamespace.mockReturnValue({ test: 'value' });
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.common).toBeDefined();
      expect(result.current.nav).toBeDefined();
      expect(result.current.dashboard).toBeDefined();
      expect(result.current.charts).toBeDefined();
      expect(result.current.predictions).toBeDefined();
      expect(result.current.compatibility).toBeDefined();
      expect(result.current.numerology).toBeDefined();
      expect(result.current.consultations).toBeDefined();
      expect(result.current.lifeEvents).toBeDefined();
      expect(result.current.faceReading).toBeDefined();
      expect(result.current.learning).toBeDefined();
      expect(result.current.settings).toBeDefined();
    });

    test('should call getNamespace for each namespace shortcut', () => {
      mockGetNamespace.mockReturnValue({});
      
      renderHook(() => useTranslations());
      
      expect(mockGetNamespace).toHaveBeenCalledWith('common');
      expect(mockGetNamespace).toHaveBeenCalledWith('nav');
      expect(mockGetNamespace).toHaveBeenCalledWith('dashboard');
      expect(mockGetNamespace).toHaveBeenCalledWith('charts');
    });

    test('should return namespace data correctly', () => {
      const mockData = { welcome: 'Welcome', goodbye: 'Goodbye' };
      mockGetNamespace.mockReturnValue(mockData);
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.common).toEqual(mockData);
    });
  });

  describe('Negative Tests', () => {
    test('should handle missing locale', () => {
      mockUseI18n.mockReturnValue({
        locale: undefined as any,
        setLocale: jest.fn(),
        t: mockT,
        getNamespace: mockGetNamespace,
      });
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.locale).toBeUndefined();
    });

    test('should handle null namespace data', () => {
      mockGetNamespace.mockReturnValue(null as any);
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.common).toBeNull();
    });

    test('should handle undefined namespace data', () => {
      mockGetNamespace.mockReturnValue(undefined as any);
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.common).toBeUndefined();
    });

    test('should handle getNamespace throwing error', () => {
      mockGetNamespace.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      expect(() => renderHook(() => useTranslations())).toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('should not re-fetch namespaces on every render', () => {
      mockGetNamespace.mockReturnValue({});
      
      const { rerender } = renderHook(() => useTranslations());
      
      const initialCallCount = mockGetNamespace.mock.calls.length;
      
      rerender();
      rerender();
      rerender();
      
      // Should only call once per namespace, not on every render
      expect(mockGetNamespace.mock.calls.length).toBe(initialCallCount);
    });

    test('should handle 1000 hook calls under 100ms', () => {
      mockGetNamespace.mockReturnValue({});
      
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        renderHook(() => useTranslations());
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    test('should handle locale change', () => {
      mockGetNamespace.mockReturnValue({});
      
      const { result, rerender } = renderHook(() => useTranslations());
      
      expect(result.current.locale).toBe('en');
      
      // Change locale
      mockUseI18n.mockReturnValue({
        locale: 'hi',
        setLocale: jest.fn(),
        t: mockT,
        getNamespace: mockGetNamespace,
      });
      
      rerender();
      
      expect(result.current.locale).toBe('hi');
    });

    test('should handle empty namespace object', () => {
      mockGetNamespace.mockReturnValue({});
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.common).toEqual({});
    });

    test('should handle namespace with special characters', () => {
      const specialData = { 'key-with-dash': 'value', 'key.with.dot': 'value2' };
      mockGetNamespace.mockReturnValue(specialData);
      
      const { result } = renderHook(() => useTranslations());
      
      expect(result.current.common).toEqual(specialData);
    });
  });
});
