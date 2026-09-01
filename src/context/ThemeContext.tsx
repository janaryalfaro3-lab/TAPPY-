import React, { createContext, useContext, useState, useEffect } from 'react';

export type DarkVariant = 'deep-midnight' | 'soft-slate';

interface ThemeContextType {
  themeVariant: DarkVariant;
  setThemeVariant: (variant: DarkVariant) => void;
  toggleThemeVariant: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tappynfc_dark_variant';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeVariant, setThemeVariantState] = useState<DarkVariant>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'soft-slate' || saved === 'deep-midnight') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'deep-midnight';
  });

  const setThemeVariant = (variant: DarkVariant) => {
    setThemeVariantState(variant);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, variant);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const toggleThemeVariant = () => {
    setThemeVariant(themeVariant === 'deep-midnight' ? 'soft-slate' : 'deep-midnight');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeVariant === 'soft-slate') {
      root.classList.add('theme-soft-slate');
      root.classList.remove('theme-deep-midnight');
      document.body.classList.add('theme-soft-slate');
      document.body.classList.remove('theme-deep-midnight');
    } else {
      root.classList.add('theme-deep-midnight');
      root.classList.remove('theme-soft-slate');
      document.body.classList.add('theme-deep-midnight');
      document.body.classList.remove('theme-soft-slate');
    }
  }, [themeVariant]);

  return (
    <ThemeContext.Provider value={{ themeVariant, setThemeVariant, toggleThemeVariant }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
