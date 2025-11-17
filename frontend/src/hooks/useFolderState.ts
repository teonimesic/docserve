import { useState, useCallback } from 'react'

// Helper to save expanded folders set to localStorage
const saveExpandedFolders = (folders: Set<string>) => {
  localStorage.setItem('expandedFolders', JSON.stringify(Array.from(folders)))
}

export function useFolderState() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    // Load expanded state from localStorage
    const saved = localStorage.getItem('expandedFolders')
    return saved ? new Set(JSON.parse(saved)) : new Set()
  })

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
        localStorage.removeItem(`folder-${path}`)
      } else {
        next.add(path)
        localStorage.setItem(`folder-${path}`, 'expanded')
      }
      saveExpandedFolders(next)
      return next
    })
  }, [])

  const expandFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      if (prev.has(path)) return prev
      const next = new Set(prev)
      next.add(path)
      localStorage.setItem(`folder-${path}`, 'expanded')
      saveExpandedFolders(next)
      return next
    })
  }, [])

  const isExpanded = useCallback((path: string) => {
    return expandedFolders.has(path)
  }, [expandedFolders])

  return {
    isExpanded,
    toggleFolder,
    expandFolder,
  }
}
