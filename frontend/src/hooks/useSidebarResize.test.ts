import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSidebarResize } from './useSidebarResize'

describe('useSidebarResize', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default width of 250px', () => {
    const { result } = renderHook(() => useSidebarResize())
    expect(result.current.width).toBe(250)
  })

  it('should initialize with saved width from localStorage', () => {
    localStorage.setItem('sidebarWidth', '350')
    const { result } = renderHook(() => useSidebarResize())
    expect(result.current.width).toBe(350)
  })

  it('should update width when setWidth is called', () => {
    const { result } = renderHook(() => useSidebarResize())

    act(() => {
      result.current.setWidth(400)
    })

    expect(result.current.width).toBe(400)
    expect(localStorage.getItem('sidebarWidth')).toBe('400')
  })

  it('should enforce minimum width constraint of 150px', () => {
    const { result } = renderHook(() => useSidebarResize())

    act(() => {
      result.current.setWidth(100)
    })

    expect(result.current.width).toBe(150)
  })

  it('should enforce maximum width constraint of 600px', () => {
    const { result } = renderHook(() => useSidebarResize())

    act(() => {
      result.current.setWidth(700)
    })

    expect(result.current.width).toBe(600)
  })

  it('should handle isResizing state', () => {
    const { result } = renderHook(() => useSidebarResize())

    expect(result.current.isResizing).toBe(false)

    act(() => {
      result.current.startResizing()
    })

    expect(result.current.isResizing).toBe(true)

    act(() => {
      result.current.stopResizing()
    })

    expect(result.current.isResizing).toBe(false)
  })

  it('should save width to localStorage only when stopResizing is called', () => {
    const { result } = renderHook(() => useSidebarResize())

    localStorage.removeItem('sidebarWidth')

    act(() => {
      result.current.startResizing()
    })

    act(() => {
      result.current.setWidth(300)
    })

    // Width should be updated but not saved yet
    expect(result.current.width).toBe(300)
    expect(localStorage.getItem('sidebarWidth')).toBeNull()

    act(() => {
      result.current.stopResizing()
    })

    // Now it should be saved
    expect(localStorage.getItem('sidebarWidth')).toBe('300')
  })
})
