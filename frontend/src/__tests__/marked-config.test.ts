import { describe, it, expect } from 'vitest'
import { marked } from '../config/marked'

describe('Marked configuration', () => {
  it('converts line breaks (\\n) to <br> tags', () => {
    const markdown = 'Line one\nLine two\nLine three'
    const html = marked.parse(markdown) as string

    // Check that line breaks are converted to <br> tags
    expect(html).toContain('<br>')
    expect(html).toContain('Line one')
    expect(html).toContain('Line two')
    expect(html).toContain('Line three')
  })

  it('preserves paragraph breaks (double line breaks)', () => {
    const markdown = 'Paragraph one\n\nParagraph two'
    const html = marked.parse(markdown) as string

    // Double line breaks should create separate paragraphs
    expect(html).toContain('<p>Paragraph one</p>')
    expect(html).toContain('<p>Paragraph two</p>')
  })

  it('handles line breaks within paragraphs', () => {
    const markdown = 'First line\nSecond line in same paragraph\n\nNew paragraph'
    const html = marked.parse(markdown) as string

    // First paragraph should have a <br> for the single line break
    expect(html).toMatch(/First line<br>\s*Second line in same paragraph/)
    // New paragraph should be separate
    expect(html).toContain('<p>New paragraph</p>')
  })
})
