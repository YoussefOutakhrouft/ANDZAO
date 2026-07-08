import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Colors as LightColors } from '@/constants/theme';

// Define dark palette (customizable)
const DarkColors = {
  text: '#E0E0E0',
  background: '#121212',
  backgroundElement: '#1E1E1E',
  backgroundSelected: '#2C2C2C',
  textSecondary: '#B0B0B0',
  primary: '#90CAF9', // light blue
  secondary: '#FFCC80', // light orange
  accent: '#FFAB91', // light coral
  border: '#333333',
  cardBackground: '#1E1E1E',
  success: '#81C784',
} as const;

type Theme = 'light' | 'dark';

type ThemeColors = typeof LightColors;

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const colors = theme === 'light' ? LightColors : DarkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
