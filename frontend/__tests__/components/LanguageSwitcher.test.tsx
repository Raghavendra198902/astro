/**
 * Component Tests for LanguageSwitcher
 * Covers: Rendering, user interactions, state management
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { I18nProvider } from '@/app/contexts/I18nContext';

// Mock the useI18n hook
jest.mock('@/app/contexts/I18nContext', () => ({
  ...jest.requireActual('@/app/contexts/I18nContext'),
  useI18n: jest.fn(),
}));

const mockSetLocale = jest.fn();
const mockUseI18n = require('@/app/contexts/I18nContext').useI18n;

describe('LanguageSwitcher Component Tests', () => {
  beforeEach(() => {
    mockSetLocale.mockClear();
    mockUseI18n.mockReturnValue({
      locale: 'en',
      setLocale: mockSetLocale,
      t: (key: string) => key,
      getNamespace: () => ({}),
    });
  });

  describe('Happy Path - Rendering', () => {
    test('should render language switcher button', () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('should display current language flag', () => {
      render(<LanguageSwitcher />);
      
      // English flag should be visible
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    });

    test('should display language label when showLabel is true', () => {
      render(<LanguageSwitcher showLabel={true} />);
      
      expect(screen.getByText(/English/i)).toBeInTheDocument();
    });

    test('should not display language label when showLabel is false', () => {
      render(<LanguageSwitcher showLabel={false} />);
      
      expect(screen.queryByText(/English/i)).not.toBeInTheDocument();
    });

    test('should open dropdown on click', () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Should show all language options
      expect(screen.getByText(/English/i)).toBeInTheDocument();
      expect(screen.getByText(/हिंदी/i)).toBeInTheDocument();
      expect(screen.getByText(/मराठी/i)).toBeInTheDocument();
    });
  });

  describe('Happy Path - Language Selection', () => {
    test('should change language to Hindi', async () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const hindiOption = screen.getByText(/हिंदी/i);
      fireEvent.click(hindiOption);
      
      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith('hi');
      });
    });

    test('should change language to Marathi', async () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const marathiOption = screen.getByText(/मराठी/i);
      fireEvent.click(marathiOption);
      
      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith('mr');
      });
    });

    test('should close dropdown after selection', async () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const hindiOption = screen.getByText(/हिंदी/i);
      fireEvent.click(hindiOption);
      
      await waitFor(() => {
        // Dropdown should be closed (only button text visible, not all options)
        expect(screen.queryByText(/मराठी/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Negative Tests', () => {
    test('should handle click outside to close dropdown', () => {
      render(
        <div>
          <LanguageSwitcher />
          <div data-testid="outside">Outside</div>
        </div>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Dropdown should be open
      expect(screen.getByText(/हिंदी/i)).toBeInTheDocument();
      
      // Click outside
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);
      
      // Dropdown should be closed
      expect(screen.queryByText(/हिंदी/i)).not.toBeInTheDocument();
    });

    test('should handle rapid clicking', () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      
      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      // Should toggle correctly
      expect(screen.queryByText(/हिंदी/i)).not.toBeInTheDocument();
    });

    test('should not throw error when setLocale is undefined', () => {
      mockUseI18n.mockReturnValue({
        locale: 'en',
        setLocale: undefined,
        t: (key: string) => key,
        getNamespace: () => ({}),
      });
      
      expect(() => render(<LanguageSwitcher />)).not.toThrow();
    });

    test('should handle invalid locale gracefully', () => {
      mockUseI18n.mockReturnValue({
        locale: 'invalid',
        setLocale: mockSetLocale,
        t: (key: string) => key,
        getNamespace: () => ({}),
      });
      
      render(<LanguageSwitcher />);
      
      // Should still render
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should apply custom className', () => {
      const { container } = render(<LanguageSwitcher className="custom-class" />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    test('should handle keyboard navigation', () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      
      // Open with Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(screen.getByText(/हिंदी/i)).toBeInTheDocument();
      
      // Close with Escape key
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(screen.queryByText(/हिंदी/i)).not.toBeInTheDocument();
    });

    test('should maintain accessibility attributes', () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    test('should update when locale changes externally', () => {
      const { rerender } = render(<LanguageSwitcher />);
      
      // Change locale externally
      mockUseI18n.mockReturnValue({
        locale: 'hi',
        setLocale: mockSetLocale,
        t: (key: string) => key,
        getNamespace: () => ({}),
      });
      
      rerender(<LanguageSwitcher />);
      
      // Should show Hindi flag
      expect(screen.getByText('🇮🇳')).toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    test('should render within acceptable time', () => {
      const start = performance.now();
      render(<LanguageSwitcher />);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(100); // Should render in less than 100ms
    });

    test('should handle multiple rapid re-renders', () => {
      const { rerender } = render(<LanguageSwitcher />);
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        rerender(<LanguageSwitcher />);
      }
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(1000); // 100 re-renders in less than 1s
    });
  });
});
