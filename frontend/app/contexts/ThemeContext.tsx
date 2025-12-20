'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'dark' | 'light' | 'cosmic' | 'minimal';

interface Theme {
  name: ThemeName;
  label: string;
  description: string;
  colors: {
    bg: string;
    bgGradient: string;
    card: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    overlay: string;
  };
  effects: {
    glassmorph: string;
    shadow: string;
    glow: string;
  };
}

const themes: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    label: '🌙 Dark Mode',
    description: 'Classic dark theme with purple accents',
    colors: {
      bg: 'from-slate-950 via-purple-950/30 to-slate-950',
      bgGradient: 'bg-gradient-to-br',
      card: 'from-slate-800/60 to-slate-900/60',
      cardBorder: 'border-slate-700/50',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      primary: 'from-purple-600 to-pink-600',
      primaryHover: 'from-purple-700 to-pink-700',
      accent: 'purple-500',
      success: 'green-500',
      warning: 'yellow-500',
      error: 'red-500',
      overlay: 'bg-slate-900/95',
    },
    effects: {
      glassmorph: 'backdrop-blur-xl bg-white/5',
      shadow: 'shadow-2xl shadow-purple-500/10',
      glow: 'bg-purple-600/15 via-pink-600/10 to-violet-600/15',
    },
  },
  light: {
    name: 'light',
    label: '☀️ Light Mode',
    description: 'Clean light theme for daytime',
    colors: {
      bg: 'from-slate-50 via-purple-50 to-slate-100',
      bgGradient: 'bg-gradient-to-br',
      card: 'from-white/90 to-slate-50/90',
      cardBorder: 'border-slate-200',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      primary: 'from-purple-500 to-pink-500',
      primaryHover: 'from-purple-600 to-pink-600',
      accent: 'purple-600',
      success: 'green-600',
      warning: 'yellow-600',
      error: 'red-600',
      overlay: 'bg-white/95',
    },
    effects: {
      glassmorph: 'backdrop-blur-xl bg-white/80',
      shadow: 'shadow-xl shadow-purple-200/50',
      glow: 'bg-purple-200/30 via-pink-200/20 to-violet-200/30',
    },
  },
  cosmic: {
    name: 'cosmic',
    label: '✨ Cosmic',
    description: 'Vibrant cosmic theme with nebula effects',
    colors: {
      bg: 'from-indigo-950 via-purple-900 to-pink-950',
      bgGradient: 'bg-gradient-to-br',
      card: 'from-indigo-800/60 to-purple-900/60',
      cardBorder: 'border-purple-500/50',
      text: 'text-purple-50',
      textSecondary: 'text-purple-200',
      primary: 'from-indigo-500 to-purple-600',
      primaryHover: 'from-indigo-600 to-purple-700',
      accent: 'indigo-400',
      success: 'emerald-400',
      warning: 'amber-400',
      error: 'rose-400',
      overlay: 'bg-indigo-950/95',
    },
    effects: {
      glassmorph: 'backdrop-blur-xl bg-purple-500/10',
      shadow: 'shadow-2xl shadow-purple-600/30',
      glow: 'bg-indigo-600/25 via-purple-600/20 to-pink-600/25',
    },
  },
  minimal: {
    name: 'minimal',
    label: '⚪ Minimal',
    description: 'Clean minimal design with subtle colors',
    colors: {
      bg: 'from-gray-100 via-gray-50 to-gray-100',
      bgGradient: 'bg-gradient-to-br',
      card: 'from-white to-gray-50',
      cardBorder: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-500',
      primary: 'from-gray-800 to-gray-900',
      primaryHover: 'from-gray-900 to-black',
      accent: 'gray-700',
      success: 'green-500',
      warning: 'orange-500',
      error: 'red-500',
      overlay: 'bg-white/98',
    },
    effects: {
      glassmorph: 'backdrop-blur-sm bg-white/90',
      shadow: 'shadow-lg shadow-gray-200/50',
      glow: 'bg-gray-200/50',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('theme') as ThemeName;
    if (saved && themes[saved]) {
      setThemeName(saved);
    }
  }, []);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    localStorage.setItem('theme', name);
    
    // Send notification about theme change
    const event = new CustomEvent('newNotification', {
      detail: {
        type: 'system',
        title: '🎨 Theme Changed',
        message: `Switched to ${themes[name].label}`,
      },
    });
    window.dispatchEvent(event);
  };

  const value: ThemeContextType = {
    theme: themes[themeName],
    themeName,
    setTheme,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`${themes[themeName].colors.bgGradient} ${themes[themeName].colors.bg} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook to get theme-aware classes
export function useThemeClasses() {
  const { theme } = useTheme();
  
  return {
    // Backgrounds
    bg: theme.colors.bg,
    card: `bg-gradient-to-br ${theme.colors.card}`,
    cardBorder: theme.colors.cardBorder,
    overlay: theme.colors.overlay,
    
    // Text
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    
    // Buttons
    primaryButton: `bg-gradient-to-r ${theme.colors.primary} hover:${theme.colors.primaryHover}`,
    
    // Effects
    glass: theme.effects.glassmorph,
    shadow: theme.effects.shadow,
    glow: theme.effects.glow,
    
    // Status colors
    success: `text-${theme.colors.success}`,
    warning: `text-${theme.colors.warning}`,
    error: `text-${theme.colors.error}`,
  };
}
