import { Locale, defaultLocale } from './config';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import mrTranslations from './locales/mr.json';

// Load translation files
const translations: Record<Locale, any> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations
};

/**
 * Get translation for a key path
 * @param locale - The locale to use
 * @param key - Dot-notation key path (e.g., 'common.loading')
 * @param fallback - Optional fallback text if key not found
 */
export function t(locale: Locale, key: string, fallback?: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations[defaultLocale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof value === 'string' ? value : fallback || key;
}

/**
 * Get all translations for a namespace
 * @param locale - The locale to use
 * @param namespace - The namespace (e.g., 'common', 'nav')
 */
export function getNamespace(locale: Locale, namespace: string): Record<string, any> {
  const translation = translations[locale] || translations[defaultLocale];
  return translation[namespace] || {};
}

/**
 * Get current locale from localStorage
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const stored = localStorage.getItem('locale');
  if (stored && (stored === 'en' || stored === 'hi' || stored === 'mr')) {
    return stored as Locale;
  }
  
  return defaultLocale;
}

/**
 * Set current locale in localStorage
 */
export function setCurrentLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
  
  // Dispatch event for components to update
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
}

/**
 * Format date according to locale
 */
export function formatDate(locale: Locale, date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    mr: 'mr-IN'
  };
  
  return new Intl.DateTimeFormat(localeMap[locale], options).format(dateObj);
}

/**
 * Format number according to locale
 */
export function formatNumber(locale: Locale, num: number, options?: Intl.NumberFormatOptions): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    mr: 'mr-IN'
  };
  
  return new Intl.NumberFormat(localeMap[locale], options).format(num);
}

export default translations;
