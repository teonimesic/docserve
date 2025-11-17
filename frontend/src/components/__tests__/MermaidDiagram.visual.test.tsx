import { describe, it, expect, afterEach } from 'vitest'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'
import { MermaidDiagram } from '../MermaidDiagram'
import '../../App.css'

describe('MermaidDiagram Visual Tests', () => {
  const flowchartCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> A`

  const sequenceDiagramCode = `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Alice->>Bob: Great to hear!`

  const ganttChartCode = `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research           :a1, 2024-01-01, 30d
    Design             :a2, after a1, 20d
    section Development
    Backend            :a3, after a2, 40d
    Frontend           :a4, after a2, 35d`

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.innerHTML = ''
  })

  describe('Flowchart (all themes)', () => {
    it('renders in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const { container } = render(<MermaidDiagram chart={flowchartCode} theme="default" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })

    it('renders in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      const { container } = render(<MermaidDiagram chart={flowchartCode} theme="dark" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })

    it('renders in catppuccin-latte theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-latte')
      const { container } = render(<MermaidDiagram chart={flowchartCode} theme="base" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })

    it('renders in catppuccin-macchiato theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-macchiato')
      const { container } = render(<MermaidDiagram chart={flowchartCode} theme="dark" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })

    it('renders in catppuccin-mocha theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-mocha')
      const { container } = render(<MermaidDiagram chart={flowchartCode} theme="dark" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })
  })

  describe('Sequence diagram', () => {
    it('renders sequence diagram in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const { container } = render(<MermaidDiagram chart={sequenceDiagramCode} theme="default" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })

    it('renders sequence diagram in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      const { container } = render(<MermaidDiagram chart={sequenceDiagramCode} theme="dark" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })
  })

  describe('Gantt chart', () => {
    it('renders gantt chart in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const { container } = render(<MermaidDiagram chart={ganttChartCode} theme="default" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })

    it('renders gantt chart in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      const { container } = render(<MermaidDiagram chart={ganttChartCode} theme="dark" />)

      await waitFor(() => {
        expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
      })
      await page.screenshot()
    })
  })
})
