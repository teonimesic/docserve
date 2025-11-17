import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFolderState } from './useFolderState'

describe('useFolderState', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with empty state when localStorage is empty', () => {
    const { result } = renderHook(() => useFolderState())

    expect(result.current.isExpanded('test-folder')).toBe(false)
  })

  it('loads expanded folders from localStorage on initialization', () => {
    localStorage.setItem('expandedFolders', JSON.stringify(['folder1', 'folder2']))

    const { result } = renderHook(() => useFolderState())

    expect(result.current.isExpanded('folder1')).toBe(true)
    expect(result.current.isExpanded('folder2')).toBe(true)
    expect(result.current.isExpanded('folder3')).toBe(false)
  })

  it('expands a folder when toggled from collapsed state', () => {
    const { result } = renderHook(() => useFolderState())

    act(() => {
      result.current.toggleFolder('test-folder')
    })

    expect(result.current.isExpanded('test-folder')).toBe(true)
    expect(localStorage.getItem('folder-test-folder')).toBe('expanded')
    expect(JSON.parse(localStorage.getItem('expandedFolders') || '[]')).toContain('test-folder')
  })

  it('collapses a folder when toggled from expanded state', () => {
    const { result } = renderHook(() => useFolderState())

    // First expand
    act(() => {
      result.current.toggleFolder('test-folder')
    })

    // Then collapse
    act(() => {
      result.current.toggleFolder('test-folder')
    })

    expect(result.current.isExpanded('test-folder')).toBe(false)
    expect(localStorage.getItem('folder-test-folder')).toBeNull()
    expect(JSON.parse(localStorage.getItem('expandedFolders') || '[]')).not.toContain('test-folder')
  })

  it('expands a folder using expandFolder', () => {
    const { result } = renderHook(() => useFolderState())

    act(() => {
      result.current.expandFolder('new-folder')
    })

    expect(result.current.isExpanded('new-folder')).toBe(true)
    expect(localStorage.getItem('folder-new-folder')).toBe('expanded')
    expect(JSON.parse(localStorage.getItem('expandedFolders') || '[]')).toContain('new-folder')
  })

  it('does not change state when expandFolder is called on already expanded folder', () => {
    const { result } = renderHook(() => useFolderState())

    // Expand first time
    act(() => {
      result.current.expandFolder('test-folder')
    })

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    // Try to expand again
    act(() => {
      result.current.expandFolder('test-folder')
    })

    // setItem should not be called again
    expect(setItemSpy).not.toHaveBeenCalled()
    expect(result.current.isExpanded('test-folder')).toBe(true)

    setItemSpy.mockRestore()
  })

  it('persists multiple folders in localStorage', () => {
    const { result } = renderHook(() => useFolderState())

    act(() => {
      result.current.toggleFolder('folder1')
      result.current.toggleFolder('folder2')
      result.current.expandFolder('folder3')
    })

    const saved = JSON.parse(localStorage.getItem('expandedFolders') || '[]')
    expect(saved).toHaveLength(3)
    expect(saved).toContain('folder1')
    expect(saved).toContain('folder2')
    expect(saved).toContain('folder3')
  })

  it('correctly reports expanded state through isExpanded', () => {
    const { result } = renderHook(() => useFolderState())

    expect(result.current.isExpanded('folder1')).toBe(false)

    act(() => {
      result.current.toggleFolder('folder1')
    })

    expect(result.current.isExpanded('folder1')).toBe(true)
    expect(result.current.isExpanded('folder2')).toBe(false)
  })
})
