import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MarkdownContent } from '../MarkdownContent'

describe('MarkdownContent - Full markdown-features.md', () => {
  it('renders the complete HTML without crashing', () => {
    // Sample HTML with various markdown features
    const html = `
      <h1>Test Document</h1>
      <p>This is a test paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <h2>Lists</h2>
      <ul>
        <li>Item 1</li>
        <li>Item 2
          <ul>
            <li>Nested item</li>
          </ul>
        </li>
      </ul>
      <h2>Task Lists</h2>
      <ul>
        <li><input type="checkbox" disabled /> Task 1</li>
        <li><input type="checkbox" disabled checked /> Task 2</li>
      </ul>
      <h2>Table</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cell 1</td>
              <td>Cell 2</td>
            </tr>
          </tbody>
        </table>
      </div>
    `

    // This should not throw React error #62
    const { container } = render(<MarkdownContent html={html} filePath="markdown-features.md" />)

    // Basic checks to ensure content rendered
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelectorAll('ul').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBeGreaterThan(0)
  })
})
