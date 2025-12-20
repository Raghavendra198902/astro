'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { locales, localeNames, localeFlags, Locale } from '@/i18n/config';
import { useI18n } from '@/app/contexts/I18nContext';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export default function LanguageSwitcher({ className = '', showLabel = true }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    
    // Show notification
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('notification', {
        detail: {
          type: 'success',
          message: `Language changed to ${localeNames[newLocale]}`,
          duration: 3000
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 
                 border border-slate-700/50 transition-all duration-200 hover:border-purple-500/30"
        aria-label="Select Language"
      >
        <Globe className="w-5 h-5 text-purple-400" />
        {showLabel && (
          <>
            <span className="text-slate-300 font-medium">
              {localeFlags[locale]} {localeNames[locale]}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-800 border border-slate-700 
                   shadow-xl overflow-hidden z-50 animate-fadeIn"
        >
          <div className="p-2">
            <div className="text-xs uppercase text-slate-400 px-3 py-2 font-semibold">
              Select Language
            </div>
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg 
                         transition-all duration-200 ${
                           locale === loc
                             ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                             : 'text-slate-300 hover:bg-slate-700/50'
                         }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeNames[loc]}</span>
                </div>
                {locale === loc && <Check className="w-4 h-4 text-purple-400" />}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-700 p-2">
            <div className="text-xs text-slate-500 px-3 py-2">
              More languages coming soon
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
