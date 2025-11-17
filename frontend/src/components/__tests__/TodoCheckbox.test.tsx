import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { TodoCheckbox } from '../TodoCheckbox'

describe('TodoCheckbox', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn() as any
  })

  it('renders checked state correctly', () => {
    render(<TodoCheckbox checked={true} index={0} filePath="test.md" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('renders unchecked state correctly', () => {
    render(<TodoCheckbox checked={false} index={0} filePath="test.md" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('sends PATCH request when toggled', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    globalThis.fetch = mockFetch as any

    render(<TodoCheckbox checked={false} index={2} filePath="test.md" />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/todos/test.md',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkbox_index: 2,
            checked: true,
          }),
        })
      )
    })
  })

  it('reverts state on API error', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValue({ ok: false })
    globalThis.fetch = mockFetch as any

    render(<TodoCheckbox checked={false} index={0} filePath="test.md" />)
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    await user.click(checkbox)
    
    // Should revert to unchecked
    await waitFor(() => {
      expect(checkbox.checked).toBe(false)
    })
  })

  it('disables checkbox while updating', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)))
    globalThis.fetch = mockFetch as any

    render(<TodoCheckbox checked={false} index={0} filePath="test.md" />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    // Should be disabled during update
    expect(checkbox).toBeDisabled()
  })

  it('handles network errors and logs them', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const networkError = new Error('Network error')
    const mockFetch = vi.fn().mockRejectedValue(networkError)
    globalThis.fetch = mockFetch as any

    render(<TodoCheckbox checked={false} index={0} filePath="test.md" />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    await user.click(checkbox)

    // Should revert to unchecked
    await waitFor(() => {
      expect(checkbox.checked).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update todo:', networkError)
    })

    consoleErrorSpy.mockRestore()
  })
})
