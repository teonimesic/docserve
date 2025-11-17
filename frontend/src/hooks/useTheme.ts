import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'catppuccin-latte' | 'catppuccin-macchiato' | 'catppuccin-mocha'

const DEFAULT_THEME: Theme = 'catppuccin-mocha'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme')
    return (savedTheme as Theme) || DEFAULT_THEME
  })

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    setIsThemeModalOpen(false)
  }

  const openThemeModal = () => {
    setIsThemeModalOpen(true)
  }

  const closeThemeModal = () => {
    setIsThemeModalOpen(false)
  }

  return {
    theme,
    setTheme,
    isThemeModalOpen,
    openThemeModal,
    closeThemeModal,
  }
}
