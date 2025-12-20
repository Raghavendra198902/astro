'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, ThemeName } from '../contexts/ThemeContext';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themeName, setTheme, themes } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleThemeSelect = (newTheme: ThemeName) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${theme.colors.textSecondary} hover:${theme.colors.text} hover:bg-white/5 rounded-lg transition-all group relative`}
        title="Change theme"
      >
        <Palette className="w-5 h-5" />
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.colors.primary} opacity-0 group-hover:opacity-20 rounded-lg transition-opacity`}></div>
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-72 ${theme.colors.overlay} backdrop-blur-xl border ${theme.colors.cardBorder} rounded-2xl ${theme.effects.shadow} z-50 overflow-hidden animate-slideDown`}>
          {/* Header */}
          <div className={`p-4 border-b ${theme.colors.cardBorder} bg-gradient-to-r ${theme.colors.primary} bg-opacity-10`}>
            <div className="flex items-center gap-2">
              <Palette className={`w-5 h-5 text-${theme.colors.accent}`} />
              <h3 className={`text-lg font-bold ${theme.colors.text}`}>
                Choose Theme
              </h3>
            </div>
            <p className={`text-sm ${theme.colors.textSecondary} mt-1`}>
              Select your preferred visual style
            </p>
          </div>

          {/* Theme Options */}
          <div className="p-3 space-y-2">
            {Object.entries(themes).map(([key, themeOption]) => {
              const isSelected = themeName === key;
              return (
                <button
                  key={key}
                  onClick={() => handleThemeSelect(key as ThemeName)}
                  className={`w-full p-4 rounded-xl transition-all duration-300 text-left relative overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-r ${themeOption.colors.primary} ${theme.effects.shadow}`
                      : `${theme.effects.glassmorph} hover:bg-white/10`
                  }`}
                >
                  {/* Theme Preview Gradient */}
                  <div 
                    className={`absolute top-0 right-0 w-24 h-24 opacity-20 blur-2xl ${
                      isSelected ? '' : `bg-gradient-to-br ${themeOption.colors.bg}`
                    }`}
                  ></div>

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-lg font-bold ${isSelected ? 'text-white' : theme.colors.text}`}>
                          {themeOption.label}
                        </span>
                        {isSelected && (
                          <div className="p-1 bg-white/20 rounded-full">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className={`text-sm ${isSelected ? 'text-white/80' : theme.colors.textSecondary}`}>
                        {themeOption.description}
                      </p>
                    </div>

                    {/* Color Preview Dots */}
                    <div className="flex flex-col gap-1">
                      <div className={`w-8 h-2 rounded-full bg-gradient-to-r ${themeOption.colors.primary}`}></div>
                      <div className={`w-8 h-2 rounded-full bg-${themeOption.colors.accent}`}></div>
                      <div className={`w-8 h-2 rounded-full ${themeOption.effects.glow}`}></div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {!isSelected && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${themeOption.colors.primary} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className={`p-3 border-t ${theme.colors.cardBorder} ${theme.effects.glassmorph}`}>
            <p className={`text-xs ${theme.colors.textSecondary} text-center`}>
              💡 Theme preference is saved automatically
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
