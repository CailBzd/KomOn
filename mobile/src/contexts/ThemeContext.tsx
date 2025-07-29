import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  colors: typeof lightColors | typeof darkColors;
}

const lightColors = {
  primary: '#FF6B35',
  background: '#f7fafc',
  surface: '#ffffff',
  text: '#2d3748',
  textSecondary: '#718096',
  textTertiary: '#a0aec0',
  border: '#e2e8f0',
  borderLight: '#f7fafc',
  shadow: '#000000',
  success: '#38a169',
  error: '#e53e3e',
  warning: '#d69e2e',
  info: '#3182ce',
};

const darkColors = {
  primary: '#FF6B35',
  background: '#1a202c',
  surface: '#2d3748',
  text: '#f7fafc',
  textSecondary: '#e2e8f0',
  textTertiary: '#a0aec0',
  border: '#4a5568',
  borderLight: '#2d3748',
  shadow: '#000000',
  success: '#48bb78',
  error: '#f56565',
  warning: '#ed8936',
  info: '#4299e1',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');

  const currentTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;
  const colors = currentTheme === 'dark' ? darkColors : lightColors;

  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    // Ici vous pourriez sauvegarder la préférence dans AsyncStorage
  };

  const value: ThemeContextType = {
    theme,
    currentTheme,
    setTheme: handleSetTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 