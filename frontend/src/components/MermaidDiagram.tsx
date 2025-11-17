import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import './MermaidDiagram.css'

interface MermaidDiagramProps {
  chart: string
  theme?: string
}

let mermaidInitialized = false

export function MermaidDiagram({ chart, theme = 'default' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [diagramId] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' || theme.includes('mocha') || theme.includes('macchiato') ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
        },
        sequence: {
          useMaxWidth: true,
        },
        gantt: {
          useMaxWidth: true,
        },
      })
      mermaidInitialized = true
    }
  }, [theme])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !chart) return

      try {
        setError(null)

        // Clear the container
        containerRef.current.innerHTML = ''

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, chart)

        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart, diagramId, theme])

  if (error) {
    return (
      <div className="mermaid-error">
        <div className="mermaid-error-title">Failed to render Mermaid diagram</div>
        <pre className="mermaid-error-message">{error}</pre>
        <details className="mermaid-error-details">
          <summary>Show diagram source</summary>
          <pre><code>{chart}</code></pre>
        </details>
      </div>
    )
  }

  return (
    <div className="mermaid-wrapper">
      <div ref={containerRef} className="mermaid-container" />
    </div>
  )
}
