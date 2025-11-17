import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MarkdownContent } from '../MarkdownContent'
import { readFileSync } from 'fs'

describe('MarkdownContent - Full markdown-features.md', () => {
  it('renders the complete HTML without crashing', () => {
    // Read the actual rendered HTML from tmp
    const html = readFileSync('/tmp/html-only.txt', 'utf-8')

    // This should not throw React error #62
    const { container } = render(<MarkdownContent html={html} filePath="markdown-features.md" />)

    // Basic checks to ensure content rendered
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelectorAll('ul').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBeGreaterThan(0)
  })
})
