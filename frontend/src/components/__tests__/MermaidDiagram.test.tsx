import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MermaidDiagram } from '../MermaidDiagram'
import mermaid from 'mermaid'

describe('MermaidDiagram', () => {
  const sampleChart = 'graph TD; A-->B;'

  it('renders without error', () => {
    const { container } = render(<MermaidDiagram chart={sampleChart} />)
    expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
  })

  it('accepts theme prop', () => {
    const { container } = render(<MermaidDiagram chart={sampleChart} theme="dark" />)
    expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
  })

  it('renders with default theme when not specified', () => {
    const { container } = render(<MermaidDiagram chart={sampleChart} />)
    expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
  })

  it('handles empty chart gracefully', () => {
    const { container } = render(<MermaidDiagram chart="" />)
    expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
  })

  it('displays error message when rendering fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock mermaid to throw an error
    vi.mocked(mermaid.render).mockRejectedValueOnce(new Error('Invalid syntax'))

    render(<MermaidDiagram chart="invalid mermaid syntax!!!" />)

    await waitFor(() => {
      expect(screen.getByText('Failed to render Mermaid diagram')).toBeInTheDocument()
      expect(screen.getByText('Invalid syntax')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })
})
