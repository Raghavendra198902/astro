'use client';

import { useI18n } from '@/app/contexts/I18nContext';

/**
 * Hook for translations
 * @returns Object with translation functions and current locale
 */
export function useTranslations() {
  const { locale, t, getNamespace } = useI18n();

  return {
    locale,
    t,
    getNamespace,
    // Convenience methods for common namespaces
    common: getNamespace('common'),
    nav: getNamespace('nav'),
    dashboard: getNamespace('dashboard'),
    charts: getNamespace('charts'),
    panchang: getNamespace('panchang'),
    predictions: getNamespace('predictions'),
    compatibility: getNamespace('compatibility'),
    numerology: getNamespace('numerology'),
    consultations: getNamespace('consultations'),
    lifeEvents: getNamespace('lifeEvents'),
    faceReading: getNamespace('faceReading'),
    learning: getNamespace('learning'),
    settings: getNamespace('settings'),
    profile: getNamespace('profile'),
    notifications: getNamespace('notifications'),
    errors: getNamespace('errors'),
    landing: getNamespace('landing'),
  };
}
