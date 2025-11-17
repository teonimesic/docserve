import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('should initialize with catppuccin-mocha theme by default', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('catppuccin-mocha')
  })

  it('should initialize with theme from localStorage if available', () => {
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('should update document.documentElement data-theme attribute on mount', () => {
    renderHook(() => useTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('catppuccin-mocha')
  })

  it('should change theme when setTheme is called', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('should support all 5 themes', () => {
    const themes: Array<'light' | 'dark' | 'catppuccin-latte' | 'catppuccin-macchiato' | 'catppuccin-mocha'> = ['light', 'dark', 'catppuccin-latte', 'catppuccin-macchiato', 'catppuccin-mocha']
    const { result } = renderHook(() => useTheme())

    themes.forEach(theme => {
      act(() => {
        result.current.setTheme(theme)
      })
      expect(result.current.theme).toBe(theme)
      expect(document.documentElement.getAttribute('data-theme')).toBe(theme)
      expect(localStorage.getItem('theme')).toBe(theme)
    })
  })

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('catppuccin-latte')
    })

    expect(localStorage.getItem('theme')).toBe('catppuccin-latte')
  })

  it('should handle theme modal visibility', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.isThemeModalOpen).toBe(false)

    act(() => {
      result.current.openThemeModal()
    })

    expect(result.current.isThemeModalOpen).toBe(true)

    act(() => {
      result.current.closeThemeModal()
    })

    expect(result.current.isThemeModalOpen).toBe(false)
  })

  it('should close modal when theme is selected', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.openThemeModal()
    })

    expect(result.current.isThemeModalOpen).toBe(true)

    act(() => {
      result.current.setTheme('light')
    })

    expect(result.current.isThemeModalOpen).toBe(false)
  })
})
