import { useState, useCallback } from 'react'

const COLLAPSED_WIDTH = 48

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  const toggle = useCallback(() => {
    setIsCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', next ? 'true' : 'false')
      return next
    })
  }, [])

  const collapse = useCallback(() => {
    setIsCollapsed(true)
    localStorage.setItem('sidebar-collapsed', 'true')
  }, [])

  const expand = useCallback(() => {
    setIsCollapsed(false)
    localStorage.setItem('sidebar-collapsed', 'false')
  }, [])

  return {
    isCollapsed,
    toggle,
    collapse,
    expand,
    collapsedWidth: COLLAPSED_WIDTH,
  }
}
