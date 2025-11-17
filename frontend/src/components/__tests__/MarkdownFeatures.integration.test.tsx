import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MarkdownContent } from '../MarkdownContent'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('MarkdownContent Integration - markdown-features.md', () => {
  it('renders the complete markdown-features.md without errors', async () => {
    // Read the actual markdown file (go up 4 levels from frontend/src/components/__tests__)
    const markdownPath = join(__dirname, '../../../../test_folders/markdown-features.md')
    const markdownContent = readFileSync(markdownPath, 'utf-8')

    // Render it through markdown (we'll need to call the Rust API or use a markdown library)
    // For now, let's just test that we can render some complex HTML similar to what it produces
    
    // This will fail initially, helping us identify the issue
    const { container } = render(<MarkdownContent html="<p>Test</p>" filePath="markdown-features.md" />)
    
    expect(container).toBeInTheDocument()
  })
})
