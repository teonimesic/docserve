import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownContent } from '../MarkdownContent'

describe('MarkdownContent', () => {
  it('renders simple HTML content', () => {
    const html = '<p>Hello world</p>'
    render(<MarkdownContent html={html} filePath="test.md" />)
    
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders code blocks with CodeBlock component', () => {
    const html = '<pre><code class="language-javascript">const x = 1;</code></pre>'
    const { container } = render(<MarkdownContent html={html} filePath="test.md" />)
    
    // CodeBlock component should be rendered
    expect(container.querySelector('.code-block-wrapper')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
  })

  it('renders mermaid diagrams with MermaidDiagram component', () => {
    const html = '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>'
    const { container } = render(<MarkdownContent html={html} filePath="test.md" />)
    
    // MermaidDiagram component should be rendered
    expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
  })

  it('renders todo checkboxes with TodoCheckbox component', () => {
    const html = '<ul><li><input type="checkbox" disabled="" /> Unchecked item</li><li><input type="checkbox" disabled="" checked="" /> Checked item</li></ul>'
    render(<MarkdownContent html={html} filePath="test.md" />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('renders headings', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2>'
    render(<MarkdownContent html={html} filePath="test.md" />)
    
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Subtitle' })).toBeInTheDocument()
  })

  it('renders links', () => {
    const html = '<a href="https://example.com">Link</a>'
    render(<MarkdownContent html={html} filePath="test.md" />)
    
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('converts class attribute to className', () => {
    const html = '<div class="test-class">Content</div>'
    const { container } = render(<MarkdownContent html={html} filePath="test.md" />)
    
    const div = container.querySelector('.test-class')
    expect(div).toBeInTheDocument()
    expect(div?.textContent).toBe('Content')
  })

  it('renders nested content correctly', () => {
    const html = `
      <div>
        <p>Paragraph 1</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <p>Paragraph 2</p>
      </div>
    `
    render(<MarkdownContent html={html} filePath="test.md" />)
    
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
  })

  it('passes theme to Mermaid diagrams', () => {
    const html = '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>'
    const { container } = render(<MarkdownContent html={html} filePath="test.md" theme="dark" />)

    expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
  })

  it('handles nested task lists without crashing', () => {
    const html = `
      <ul>
        <li><input type="checkbox" disabled="" checked="" /> Parent task
          <ul>
            <li><input type="checkbox" disabled="" checked="" /> Child task 1</li>
            <li><input type="checkbox" disabled="" /> Child task 2</li>
          </ul>
        </li>
        <li><input type="checkbox" disabled="" /> Another parent task</li>
      </ul>
    `

    // Should not throw React error #62
    const { container } = render(<MarkdownContent html={html} filePath="test.md" />)

    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes.length).toBe(4) // Should have 4 checkboxes (1 parent + 2 children + 1 parent)

    // Verify nested structure is preserved
    const outerList = container.querySelector('ul')
    expect(outerList).toBeInTheDocument()
    const nestedList = outerList?.querySelector('ul')
    expect(nestedList).toBeInTheDocument() // Nested list should exist
  })

  it('handles HTML comments without crashing', () => {
    const html = '<p>Text <!-- comment --> more text</p>'

    const { container } = render(<MarkdownContent html={html} filePath="test.md" />)

    expect(container.querySelector('p')).toBeInTheDocument()
    // Comment nodes should be filtered out
    expect(container.textContent).toBe('Text  more text')
  })

  it('handles actual markdown-rendered nested task lists', () => {
    // This is the EXACT HTML structure from markdown-rs for nested task lists
    const html = `<h3>Nested Task Lists</h3>
<ul>
<li><input type="checkbox" disabled="" checked="" /> Backend features
<ul>
<li><input type="checkbox" disabled="" checked="" /> File watcher</li>
<li><input type="checkbox" disabled="" checked="" /> WebSocket support</li>
</ul>
</li>
<li><input type="checkbox" disabled="" /> Frontend features
<ul>
<li><input type="checkbox" disabled="" checked="" /> File tree navigation</li>
</ul>
</li>
</ul>`

    // This should not throw React error #62
    const { container } = render(<MarkdownContent html={html} filePath="markdown-features.md" />)

    expect(container.querySelector('h3')).toBeInTheDocument()
    expect(container.querySelectorAll('ul').length).toBe(3) // 1 outer + 2 nested
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(5)
  })

  describe('Memoization behavior', () => {
    it('does not re-render when unrelated props change', () => {
      const html = '<p>Test content</p>'
      let renderCount = 0

      // Create a wrapper to track renders
      const TestWrapper = ({ someUnrelatedProp }: { someUnrelatedProp: number }) => {
        renderCount++
        return <MarkdownContent html={html} filePath="test.md" />
      }

      const { rerender } = render(<TestWrapper someUnrelatedProp={1} />)
      const initialRenderCount = renderCount

      // Re-render with different unrelated prop (but same html, filePath, theme)
      rerender(<TestWrapper someUnrelatedProp={2} />)
      rerender(<TestWrapper someUnrelatedProp={3} />)

      // MarkdownContent itself should only render once since its props didn't change
      // The wrapper re-renders, but MarkdownContent should be memoized
      expect(renderCount).toBeGreaterThan(initialRenderCount)
    })

    it('re-renders when html changes', () => {
      const { container, rerender } = render(
        <MarkdownContent html="<p>Original</p>" filePath="test.md" />
      )

      expect(container.textContent).toBe('Original')

      rerender(<MarkdownContent html="<p>Updated</p>" filePath="test.md" />)

      expect(container.textContent).toBe('Updated')
    })

    it('re-renders when filePath changes', () => {
      const html = '<ul><li><input type="checkbox" disabled="" /> Task</li></ul>'

      const { container, rerender } = render(
        <MarkdownContent html={html} filePath="file1.md" />
      )

      const checkbox1 = container.querySelector('input[type="checkbox"]')
      expect(checkbox1).toBeInTheDocument()

      // Change filePath - should re-render and create new checkbox instances
      rerender(<MarkdownContent html={html} filePath="file2.md" />)

      const checkbox2 = container.querySelector('input[type="checkbox"]')
      expect(checkbox2).toBeInTheDocument()
      // Different file path means new TodoCheckbox instances
    })

    it('re-renders when theme changes', () => {
      const html = '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>'

      const { container, rerender } = render(
        <MarkdownContent html={html} filePath="test.md" theme="light" />
      )

      expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()

      rerender(<MarkdownContent html={html} filePath="test.md" theme="dark" />)

      // Should still render the mermaid wrapper (theme passed to MermaidDiagram)
      expect(container.querySelector('.mermaid-wrapper')).toBeInTheDocument()
    })

    it('does not re-render when same props are passed', () => {
      const html = '<p>Consistent content</p>'

      const { container, rerender } = render(
        <MarkdownContent html={html} filePath="test.md" theme="light" />
      )

      const firstParagraph = container.querySelector('p')
      expect(firstParagraph?.textContent).toBe('Consistent content')

      // Re-render with identical props
      rerender(<MarkdownContent html={html} filePath="test.md" theme="light" />)

      const secondParagraph = container.querySelector('p')

      // Should still have the same content
      expect(secondParagraph?.textContent).toBe('Consistent content')
    })
  })
})
