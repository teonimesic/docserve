import { describe, it, expect, afterEach } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '@testing-library/react'
import { CodeBlock } from '../CodeBlock'
import '../../App.css'

describe('CodeBlock Visual Tests', () => {
  const sampleCode = `const config = {
  theme: "tomorrow-night",
  languages: ["javascript", "python", "rust", "typescript"],
  plugins: ["line-numbers", "copy-to-clipboard"]
};`

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.innerHTML = ''
  })

  describe('Default rendering (all themes)', () => {
    it('renders in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      render(<CodeBlock code={sampleCode} language="javascript" />)

      await expect.element(page.getByRole('button', { name: 'Toggle line numbers' })).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      render(<CodeBlock code={sampleCode} language="javascript" />)

      await expect.element(page.getByRole('button', { name: 'Toggle line numbers' })).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders in catppuccin-latte theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-latte')
      render(<CodeBlock code={sampleCode} language="javascript" />)

      await expect.element(page.getByRole('button', { name: 'Toggle line numbers' })).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders in catppuccin-macchiato theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-macchiato')
      render(<CodeBlock code={sampleCode} language="javascript" />)

      await expect.element(page.getByRole('button', { name: 'Toggle line numbers' })).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders in catppuccin-mocha theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-mocha')
      render(<CodeBlock code={sampleCode} language="javascript" />)

      await expect.element(page.getByRole('button', { name: 'Toggle line numbers' })).toBeInTheDocument()
      await page.screenshot()
    })
  })
})
