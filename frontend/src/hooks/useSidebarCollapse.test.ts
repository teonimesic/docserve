import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSidebarCollapse } from './useSidebarCollapse'

describe('useSidebarCollapse', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with expanded state when localStorage is empty', () => {
    const { result } = renderHook(() => useSidebarCollapse())

    expect(result.current.isCollapsed).toBe(false)
  })

  it('initializes with collapsed state from localStorage', () => {
    localStorage.setItem('sidebar-collapsed', 'true')

    const { result } = renderHook(() => useSidebarCollapse())

    expect(result.current.isCollapsed).toBe(true)
  })

  it('initializes with expanded state from localStorage', () => {
    localStorage.setItem('sidebar-collapsed', 'false')

    const { result } = renderHook(() => useSidebarCollapse())

    expect(result.current.isCollapsed).toBe(false)
  })

  it('toggles from expanded to collapsed', () => {
    const { result } = renderHook(() => useSidebarCollapse())

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isCollapsed).toBe(true)
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true')
  })

  it('toggles from collapsed to expanded', () => {
    localStorage.setItem('sidebar-collapsed', 'true')
    const { result } = renderHook(() => useSidebarCollapse())

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isCollapsed).toBe(false)
    expect(localStorage.getItem('sidebar-collapsed')).toBe('false')
  })

  it('collapses sidebar using collapse method', () => {
    const { result } = renderHook(() => useSidebarCollapse())

    act(() => {
      result.current.collapse()
    })

    expect(result.current.isCollapsed).toBe(true)
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true')
  })

  it('expands sidebar using expand method', () => {
    localStorage.setItem('sidebar-collapsed', 'true')
    const { result } = renderHook(() => useSidebarCollapse())

    act(() => {
      result.current.expand()
    })

    expect(result.current.isCollapsed).toBe(false)
    expect(localStorage.getItem('sidebar-collapsed')).toBe('false')
  })

  it('returns correct collapsed width', () => {
    const { result } = renderHook(() => useSidebarCollapse())

    expect(result.current.collapsedWidth).toBe(48)
  })

  it('multiple toggles work correctly', () => {
    const { result } = renderHook(() => useSidebarCollapse())

    // Start expanded
    expect(result.current.isCollapsed).toBe(false)

    // Toggle to collapsed
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isCollapsed).toBe(true)

    // Toggle back to expanded
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isCollapsed).toBe(false)

    // Toggle to collapsed again
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isCollapsed).toBe(true)
  })
})
