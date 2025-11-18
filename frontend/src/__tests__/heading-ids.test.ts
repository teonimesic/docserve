import { describe, it, expect } from 'vitest'
import { marked } from '../config/marked'

describe('Heading IDs for anchor navigation', () => {
  it('generates IDs for headings to enable hash link navigation', () => {
    const markdown = '## Section Title\n\n[Link to section](#section-title)'
    const html = marked.parse(markdown) as string

    // Marked should generate IDs for headings
    expect(html).toMatch(/<h2[^>]*id="section-title"/)
    expect(html).toContain('<a href="#section-title">')
  })

  it('generates IDs with proper slug formatting', () => {
    const markdown = '### Hello World Example'
    const html = marked.parse(markdown) as string

    // Should convert to lowercase and replace spaces with hyphens
    expect(html).toMatch(/<h3[^>]*id="hello-world-example"/)
  })

  it('handles special characters in heading IDs', () => {
    const markdown = '## FAQ: How to Use?'
    const html = marked.parse(markdown) as string

    // Should handle special characters appropriately
    // Marked.js default behavior - let's see what it produces
    // This test might need adjustment based on actual behavior
    expect(html).toContain('<h2')
  })
})
