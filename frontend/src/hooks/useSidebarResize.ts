import { useState, useCallback, useRef } from 'react'

const MIN_WIDTH = 150
const MAX_WIDTH = 600
const DEFAULT_WIDTH = 250

export function useSidebarResize() {
  const [width, setWidthState] = useState<number>(() => {
    const saved = localStorage.getItem('sidebarWidth')
    const parsedWidth = saved ? parseInt(saved) : DEFAULT_WIDTH
    return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsedWidth))
  })

  const [isResizing, setIsResizing] = useState(false)
  const widthBeforeSaveRef = useRef<number>(width)

  const setWidth = useCallback((newWidth: number, saveImmediately = true) => {
    const constrainedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))
    setWidthState(constrainedWidth)
    widthBeforeSaveRef.current = constrainedWidth

    if (saveImmediately && !isResizing) {
      localStorage.setItem('sidebarWidth', constrainedWidth.toString())
    }
  }, [isResizing])

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
    // Save width to localStorage when resizing stops
    localStorage.setItem('sidebarWidth', widthBeforeSaveRef.current.toString())
  }, [])

  return {
    width,
    setWidth,
    isResizing,
    startResizing,
    stopResizing,
  }
}
