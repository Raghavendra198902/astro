'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale } from '@/i18n/config';
import { t, getNamespace, getCurrentLocale, setCurrentLocale as setStoredLocale } from '@/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  getNamespace: (namespace: string) => Record<string, any>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Load locale from localStorage on mount
    const savedLocale = getCurrentLocale();
    setLocaleState(savedLocale);
  }, []);

  useEffect(() => {
    // Listen for locale changes
    const handleLocaleChange = (e: CustomEvent) => {
      setLocaleState(e.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener);
    };
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  };

  const translate = (key: string, fallback?: string) => {
    return t(locale, key, fallback);
  };

  const getNamespaceTranslations = (namespace: string) => {
    return getNamespace(locale, namespace);
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translate,
    getNamespace: getNamespaceTranslations
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
