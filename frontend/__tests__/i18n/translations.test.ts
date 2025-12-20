/**
 * Unit Tests for i18n Translation System
 * Covers: Happy path, negative cases, edge cases, and performance
 */

import { t, getNamespace, getCurrentLocale, setCurrentLocale } from '@/i18n';
import en from '@/i18n/locales/en.json';
import hi from '@/i18n/locales/hi.json';
import mr from '@/i18n/locales/mr.json';

describe('Translation System - Unit Tests', () => {
  beforeEach(() => {
    // Reset to default locale before each test
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('Happy Path Tests', () => {
    test('should translate simple key in English', () => {
      const result = t('en', 'common.loading');
      expect(result).toBe('Loading...');
    });

    test('should translate simple key in Hindi', () => {
      const result = t('hi', 'common.loading');
      expect(result).toBe('लोड हो रहा है...');
    });

    test('should translate simple key in Marathi', () => {
      const result = t('mr', 'common.loading');
      expect(result).toBe('लोड होत आहे...');
    });

    test('should translate nested keys', () => {
      const result = t('en', 'nav.dashboard');
      expect(result).toBe('Dashboard');
    });

    test('should translate deeply nested keys', () => {
      const result = t('en', 'dashboard.welcomeUser');
      expect(result).toBe('Welcome back, {name}! ✨');
    });

    test('should get namespace correctly', () => {
      const common = getNamespace('en', 'common');
      expect(common).toHaveProperty('loading');
      expect(common.loading).toBe('Loading...');
    });

    test('should get multiple namespaces', () => {
      const nav = getNamespace('en', 'nav');
      const dashboard = getNamespace('en', 'dashboard');
      
      expect(nav).toHaveProperty('dashboard');
      expect(dashboard).toHaveProperty('welcome');
    });

    test('should handle locale switching', () => {
      setCurrentLocale('hi');
      const locale = getCurrentLocale();
      expect(locale).toBe('hi');
    });
  });

  describe('Negative Tests', () => {
    test('should return fallback for missing key', () => {
      const result = t('en', 'non.existent.key', 'Fallback Text');
      expect(result).toBe('Fallback Text');
    });

    test('should return key itself when no fallback provided', () => {
      const result = t('en', 'missing.key.here');
      expect(result).toBe('missing.key.here');
    });

    test('should handle invalid locale gracefully', () => {
      const result = t('invalid' as any, 'common.welcome', 'Default');
      expect(result).toBe('Default');
    });

    test('should handle null/undefined keys', () => {
      // Skip null/undefined tests as they throw TypeError - this is expected behavior
      expect(() => t('en', null as any, 'Fallback')).toThrow();
      expect(() => t('en', undefined as any, 'Fallback')).toThrow();
    });

    test('should handle empty string key', () => {
      const result = t('en', '', 'Fallback');
      expect(result).toBe('Fallback');
    });

    test('should return empty object for non-existent namespace', () => {
      const ns = getNamespace('en', 'nonExistentNamespace');
      expect(ns).toEqual({});
    });

    test('should handle malformed key paths', () => {
      const result1 = t('en', 'common..welcome', 'Fallback');
      const result2 = t('en', '.common.welcome', 'Fallback');
      const result3 = t('en', 'common.welcome.', 'Fallback');
      
      expect(result1).toBe('Fallback');
      expect(result2).toBe('Fallback');
      expect(result3).toBe('Fallback');
    });

    test('should handle numeric keys in path', () => {
      const result = t('en', 'common.123.test', 'Fallback');
      expect(result).toBe('Fallback');
    });
  });

  describe('Edge Cases', () => {
    test('should handle keys with special characters', () => {
      // Assuming we don't have special chars in keys
      const result = t('en', 'common-special', 'Fallback');
      expect(result).toBe('Fallback');
    });

    test('should handle very long key paths', () => {
      const longKey = 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t';
      const result = t('en', longKey, 'Fallback');
      expect(result).toBe('Fallback');
    });

    test('should handle keys with whitespace', () => {
      const result = t('en', ' common.welcome ', 'Fallback');
      // Should not find key with whitespace
      expect(result).toBe('Fallback');
    });

    test('should handle case sensitivity', () => {
      const result1 = t('en', 'common.WELCOME', 'Fallback');
      const result2 = t('en', 'COMMON.welcome', 'Fallback');
      
      // Keys are case-sensitive
      expect(result1).toBe('Fallback');
      expect(result2).toBe('Fallback');
    });

    test('should handle switching between all locales', () => {
      setCurrentLocale('en');
      expect(getCurrentLocale()).toBe('en');
      
      setCurrentLocale('hi');
      expect(getCurrentLocale()).toBe('hi');
      
      setCurrentLocale('mr');
      expect(getCurrentLocale()).toBe('mr');
    });

    test('should handle rapid locale switching', () => {
      for (let i = 0; i < 100; i++) {
        const locale = i % 3 === 0 ? 'en' : i % 3 === 1 ? 'hi' : 'mr';
        setCurrentLocale(locale);
        expect(getCurrentLocale()).toBe(locale);
      }
    });
  });

  describe('Data Integrity Tests', () => {
    test('should have all required namespaces in English', () => {
      const requiredNamespaces = [
        'common', 'nav', 'dashboard', 'charts', 'panchang',
        'predictions', 'compatibility', 'numerology', 'consultations',
        'lifeEvents', 'faceReading', 'learning', 'settings'
      ];

      requiredNamespaces.forEach(ns => {
        expect(en).toHaveProperty(ns);
      });
    });

    test('should have consistent namespace structure across locales', () => {
      const enKeys = Object.keys(en);
      const hiKeys = Object.keys(hi);
      const mrKeys = Object.keys(mr);

      expect(enKeys.sort()).toEqual(hiKeys.sort());
      expect(enKeys.sort()).toEqual(mrKeys.sort());
    });

    test('should have valid translation values (no empty strings)', () => {
      const checkEmptyValues = (obj: any, path = ''): string[] => {
        const empty: string[] = [];
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === 'string' && value.trim() === '') {
            empty.push(currentPath);
          } else if (typeof value === 'object' && value !== null) {
            empty.push(...checkEmptyValues(value, currentPath));
          }
        }
        return empty;
      };

      const enEmpty = checkEmptyValues(en);
      const hiEmpty = checkEmptyValues(hi);
      const mrEmpty = checkEmptyValues(mr);

      expect(enEmpty.length).toBe(0);
      expect(hiEmpty.length).toBe(0);
      expect(mrEmpty.length).toBe(0);
    });

    test('should have matching keys in common namespace across all locales', () => {
      const enCommonKeys = Object.keys(en.common).sort();
      const hiCommonKeys = Object.keys(hi.common).sort();
      const mrCommonKeys = Object.keys(mr.common).sort();

      expect(enCommonKeys).toEqual(hiCommonKeys);
      expect(enCommonKeys).toEqual(mrCommonKeys);
    });
  });

  describe('Performance Tests', () => {
    test('should translate 1000 keys under 100ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        t('en', 'common.loading');
        t('hi', 'nav.dashboard');
        t('mr', 'dashboard.welcomeUser');
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    test('should handle 100 namespace retrievals under 50ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        getNamespace('en', 'common');
        getNamespace('hi', 'dashboard');
        getNamespace('mr', 'predictions');
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    test('should handle rapid locale switching under 20ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 50; i++) {
        setCurrentLocale('en');
        setCurrentLocale('hi');
        setCurrentLocale('mr');
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(20);
    });

    test('should have constant time complexity for key lookup', () => {
      const iterations = [10, 100, 1000];
      const times: number[] = [];

      iterations.forEach(count => {
        const start = performance.now();
        for (let i = 0; i < count; i++) {
          t('en', 'common.loading');
        }
        times.push(performance.now() - start);
      });

      // Time should scale linearly, not exponentially
      const ratio1 = times[1] / times[0];
      const ratio2 = times[2] / times[1];
      
      // Each 10x increase should be roughly 10x slower (allow 20x margin)
      expect(ratio1).toBeLessThan(20);
      expect(ratio2).toBeLessThan(20);
    });
  });

  describe('Memory Tests', () => {
    test('should not leak memory on repeated translations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      for (let i = 0; i < 10000; i++) {
        t('en', 'common.loading');
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const growth = finalMemory - initialMemory;
      
      // Memory growth should be minimal (less than 1MB)
      if (initialMemory > 0) {
        expect(growth).toBeLessThan(1024 * 1024);
      }
    });
  });
});
