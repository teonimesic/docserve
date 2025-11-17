import { useEffect, useRef } from 'react'
import './SidebarResizeHandle.css'

interface SidebarResizeHandleProps {
  onResize: (deltaX: number) => void
  onResizeStart: () => void
  onResizeEnd: () => void
}

// Helper to set resize cursor and disable text selection
const setResizeCursor = (enabled: boolean) => {
  document.body.style.cursor = enabled ? 'ew-resize' : ''
  document.body.style.userSelect = enabled ? 'none' : ''
}

export function SidebarResizeHandle({ onResize, onResizeStart, onResizeEnd }: SidebarResizeHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null)
  const isResizingRef = useRef(false)
  const startXRef = useRef(0)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isResizingRef.current = true
      startXRef.current = e.clientX
      onResizeStart()
      handleRef.current?.classList.add('resizing')
      setResizeCursor(true)
      e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return

      const deltaX = e.clientX - startXRef.current
      onResize(deltaX)
    }

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false
        onResizeEnd()
        handleRef.current?.classList.remove('resizing')
        setResizeCursor(false)
        startXRef.current = 0
      }
    }

    const handleElement = handleRef.current
    if (handleElement) {
      handleElement.addEventListener('mousedown', handleMouseDown)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      if (handleElement) {
        handleElement.removeEventListener('mousedown', handleMouseDown)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onResize, onResizeStart, onResizeEnd])

  return <div ref={handleRef} className="sidebar-resize-handle" />
}
