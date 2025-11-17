import { describe, it, expect, afterEach, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '@testing-library/react'
import { MarkdownContent } from '../MarkdownContent'
import '../../App.css'

describe('MarkdownContent Visual Tests', () => {
  const complexMarkdown = `
    <h1>Documentation</h1>
    <h2>Getting Started</h2>
    <p>Welcome to the <strong>markdown viewer</strong>. This supports various features:</p>

    <h3>Code Blocks</h3>
    <pre><code class="language-javascript">function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}</code></pre>

    <h3>Task Lists</h3>
    <ul>
      <li>[x] Completed task</li>
      <li>[ ] Pending task</li>
      <li>[x] Another completed task</li>
    </ul>

    <h3>Mermaid Diagram</h3>
    <pre><code class="language-mermaid">graph LR
    A[Start] --> B[Process]
    B --> C[End]</code></pre>

    <h3>Lists and Links</h3>
    <ul>
      <li>Item 1</li>
      <li>Item 2 with <a href="https://example.com">a link</a></li>
      <li>Item 3</li>
    </ul>

    <blockquote>
      <p>This is a blockquote with <em>emphasis</em></p>
    </blockquote>
  `

  const simpleMarkdown = `
    <h1>Simple Document</h1>
    <p>This is a paragraph with <code>inline code</code> and <strong>bold text</strong>.</p>
    <pre><code class="language-python">def hello():
    print("Hello, World!")
    return 42</code></pre>
  `

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('Complex content (all themes)', () => {
    it('renders complex markdown in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={complexMarkdown} filePath="test.md" theme="default" />
        </div>
      )

      await expect.element(page.getByText('Documentation')).toBeVisible()
      await page.screenshot()
    })

    it('renders complex markdown in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={complexMarkdown} filePath="test.md" theme="dark" />
        </div>
      )

      await expect.element(page.getByText('Documentation')).toBeVisible()
      await page.screenshot()
    })

    it('renders complex markdown in catppuccin-latte theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-latte')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={complexMarkdown} filePath="test.md" theme="base" />
        </div>
      )

      await expect.element(page.getByText('Documentation')).toBeVisible()
      await page.screenshot()
    })

    it('renders complex markdown in catppuccin-macchiato theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-macchiato')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={complexMarkdown} filePath="test.md" theme="dark" />
        </div>
      )

      await expect.element(page.getByText('Documentation')).toBeVisible()
      await page.screenshot()
    })

    it('renders complex markdown in catppuccin-mocha theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-mocha')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={complexMarkdown} filePath="test.md" theme="dark" />
        </div>
      )

      await expect.element(page.getByText('Documentation')).toBeVisible()
      await page.screenshot()
    })
  })

  describe('Simple content', () => {
    it('renders simple markdown in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={simpleMarkdown} filePath="simple.md" theme="default" />
        </div>
      )

      await expect.element(page.getByText('Simple Document')).toBeVisible()
      await page.screenshot()
    })

    it('renders simple markdown in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={simpleMarkdown} filePath="simple.md" theme="dark" />
        </div>
      )

      await expect.element(page.getByText('Simple Document')).toBeVisible()
      await page.screenshot()
    })
  })

  describe('Code-heavy content', () => {
    const codeHeavyMarkdown = `
      <h2>API Examples</h2>
      <pre><code class="language-typescript">interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number): Promise&lt;User&gt; {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}</code></pre>

      <pre><code class="language-rust">fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}</code></pre>
    `

    it('renders code-heavy content in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={codeHeavyMarkdown} filePath="code.md" theme="default" />
        </div>
      )

      await expect.element(page.getByText('API Examples')).toBeVisible()
      await page.screenshot()
    })

    it('renders code-heavy content in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')

      render(
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <MarkdownContent html={codeHeavyMarkdown} filePath="code.md" theme="dark" />
        </div>
      )

      await expect.element(page.getByText('API Examples')).toBeVisible()
      await page.screenshot()
    })
  })
})
