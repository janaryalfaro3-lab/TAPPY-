import React, { createContext, useContext, useEffect } from 'react';

export type ThemeVariant = 'professional';

interface ThemeContextType {
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  toggleThemeVariant: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeVariant: ThemeVariant = 'professional';

  useEffect(() => {
    const root = document.documentElement;
    // Cleanly purge any legacy dark midnight classes
    root.classList.remove('theme-deep-midnight', 'theme-soft-slate');
    document.body.classList.remove('theme-deep-midnight', 'theme-soft-slate');
    root.classList.add('theme-professional');
    document.body.classList.add('theme-professional');
    try {
      localStorage.removeItem('tappynfc_dark_variant');
    } catch {
      // safe ignore
    }
  }, []);

  const setThemeVariant = () => {};
  const toggleThemeVariant = () => {};

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
