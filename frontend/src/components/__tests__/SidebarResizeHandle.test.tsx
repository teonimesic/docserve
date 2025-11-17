import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SidebarResizeHandle } from '../SidebarResizeHandle'

describe('SidebarResizeHandle', () => {
  it('renders the resize handle', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    const { container } = render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    const handle = container.querySelector('.sidebar-resize-handle')
    expect(handle).toBeInTheDocument()
  })

  it('calls onResizeStart when mouse down on handle', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    const { container } = render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    const handle = container.querySelector('.sidebar-resize-handle')!
    fireEvent.mouseDown(handle, { clientX: 100 })

    expect(mockStart).toHaveBeenCalledTimes(1)
    expect(document.body.style.cursor).toBe('ew-resize')
    expect(document.body.style.userSelect).toBe('none')
  })

  it('calls onResize during mouse move after mousedown', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    const { container } = render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    const handle = container.querySelector('.sidebar-resize-handle')!

    // Start resizing
    fireEvent.mouseDown(handle, { clientX: 100 })

    // Move mouse
    fireEvent.mouseMove(document, { clientX: 150 })

    expect(mockResize).toHaveBeenCalledWith(50)

    // Move again
    fireEvent.mouseMove(document, { clientX: 120 })
    expect(mockResize).toHaveBeenCalledWith(20)
  })

  it('does not call onResize during mouse move if not resizing', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    // Move mouse without starting resize
    fireEvent.mouseMove(document, { clientX: 150 })

    expect(mockResize).not.toHaveBeenCalled()
  })

  it('calls onResizeEnd and resets state on mouse up', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    const { container } = render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    const handle = container.querySelector('.sidebar-resize-handle')!

    // Start resizing
    fireEvent.mouseDown(handle, { clientX: 100 })
    expect(document.body.style.cursor).toBe('ew-resize')

    // End resizing
    fireEvent.mouseUp(document)

    expect(mockEnd).toHaveBeenCalledTimes(1)
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
  })

  it('does not call onResizeEnd on mouse up if not resizing', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    // Mouse up without starting resize
    fireEvent.mouseUp(document)

    expect(mockEnd).not.toHaveBeenCalled()
  })

  it('handles complete resize interaction', () => {
    const mockResize = vi.fn()
    const mockStart = vi.fn()
    const mockEnd = vi.fn()

    const { container } = render(
      <SidebarResizeHandle
        onResize={mockResize}
        onResizeStart={mockStart}
        onResizeEnd={mockEnd}
      />
    )

    const handle = container.querySelector('.sidebar-resize-handle')!

    // Start
    fireEvent.mouseDown(handle, { clientX: 200 })
    expect(mockStart).toHaveBeenCalledTimes(1)

    // Move multiple times
    fireEvent.mouseMove(document, { clientX: 250 })
    expect(mockResize).toHaveBeenCalledWith(50)

    fireEvent.mouseMove(document, { clientX: 220 })
    expect(mockResize).toHaveBeenCalledWith(20)

    // End
    fireEvent.mouseUp(document)
    expect(mockEnd).toHaveBeenCalledTimes(1)
  })
})
