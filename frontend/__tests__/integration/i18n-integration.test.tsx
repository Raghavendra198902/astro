/**
 * Integration Tests for i18n System
 * Tests the complete flow from context provider to component rendering
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nProvider, useI18n } from '@/app/contexts/I18nContext';

// Test component that uses i18n
const TestComponent = () => {
  const { locale, setLocale, t, getNamespace } = useI18n();
  const common = getNamespace('common');
  
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="loading">{t('common.loading', 'Default Loading')}</div>
      <div data-testid="namespace-loading">{common.loading}</div>
      <button onClick={() => setLocale('hi')}>Switch to Hindi</button>
      <button onClick={() => setLocale('mr')}>Switch to Marathi</button>
      <button onClick={() => setLocale('en')}>Switch to English</button>
    </div>
  );
};

describe('i18n Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Happy Path - Full Flow', () => {
    test('should provide default locale', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const locale = screen.getByTestId('locale');
      expect(locale).toHaveTextContent('en');
    });

    test('should translate text correctly', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const loading = screen.getByTestId('loading');
      expect(loading).toHaveTextContent('Loading...');
    });

    test('should switch language to Hindi', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const hindiButton = screen.getByText('Switch to Hindi');
      fireEvent.click(hindiButton);
      
      await waitFor(() => {
        const locale = screen.getByTestId('locale');
        expect(locale).toHaveTextContent('hi');
      });
    });

    test('should switch language to Marathi', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const marathiButton = screen.getByText('Switch to Marathi');
      fireEvent.click(marathiButton);
      
      await waitFor(() => {
        const locale = screen.getByTestId('locale');
        expect(locale).toHaveTextContent('mr');
      });
    });

    test('should persist locale in localStorage', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const hindiButton = screen.getByText('Switch to Hindi');
      fireEvent.click(hindiButton);
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('locale', 'hi');
      });
    });

    test('should update translations after locale change', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const hindiButton = screen.getByText('Switch to Hindi');
      fireEvent.click(hindiButton);
      
      await waitFor(() => {
        const loading = screen.getByTestId('loading');
        expect(loading).toHaveTextContent('लोड हो रहा है...');
      });
    });
  });

  describe('Negative Tests', () => {
    test('should handle missing translation gracefully', () => {
      const MissingTransComponent = () => {
        const { t } = useI18n();
        return <div data-testid="missing">{t('missing.key', 'Fallback')}</div>;
      };
      
      render(
        <I18nProvider>
          <MissingTransComponent />
        </I18nProvider>
      );
      
      const missing = screen.getByTestId('missing');
      expect(missing).toHaveTextContent('Fallback');
    });

    test('should handle rapid locale switching', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const hindiButton = screen.getByText('Switch to Hindi');
      const marathiButton = screen.getByText('Switch to Marathi');
      const englishButton = screen.getByText('Switch to English');
      
      fireEvent.click(hindiButton);
      fireEvent.click(marathiButton);
      fireEvent.click(englishButton);
      fireEvent.click(hindiButton);
      
      await waitFor(() => {
        const locale = screen.getByTestId('locale');
        expect(locale).toHaveTextContent('hi');
      });
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple components efficiently', () => {
      const MultiComponent = () => (
        <>
          <TestComponent />
          <TestComponent />
          <TestComponent />
          <TestComponent />
          <TestComponent />
        </>
      );
      
      const start = performance.now();
      render(
        <I18nProvider>
          <MultiComponent />
        </I18nProvider>
      );
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(200);
    });

    test('should re-render efficiently on locale change', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      
      const start = performance.now();
      const hindiButton = screen.getByText('Switch to Hindi');
      fireEvent.click(hindiButton);
      
      await waitFor(() => {
        const locale = screen.getByTestId('locale');
        expect(locale).toHaveTextContent('hi');
      });
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
