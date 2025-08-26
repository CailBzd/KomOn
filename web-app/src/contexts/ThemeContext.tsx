import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeColors {
  primary: string
  surface: string
  text: string
  textSecondary: string
  textTertiary: string
  background: string
  border: string
}

interface ThemeContextType {
  isDark: boolean
  colors: ThemeColors
  toggleTheme: () => void
}

const lightColors: ThemeColors = {
  primary: '#3B82F6',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  background: '#F9FAFB',
  border: '#E5E7EB',
}

const darkColors: ThemeColors = {
  primary: '#60A5FA',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  background: '#111827',
  border: '#374151',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const colors = isDark ? darkColors : lightColors

  const value: ThemeContextType = {
    isDark,
    colors,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 