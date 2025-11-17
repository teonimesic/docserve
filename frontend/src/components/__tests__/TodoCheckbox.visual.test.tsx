import { describe, it, expect, afterEach, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '@testing-library/react'
import { TodoCheckbox } from '../TodoCheckbox'
import '../../App.css'

describe('TodoCheckbox Visual Tests', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.innerHTML = ''
  })

  describe('Unchecked state (all themes)', () => {
    it('renders unchecked in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={false} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
            <li>
              <TodoCheckbox checked={false} index={2} filePath="test.md" />
              {' '}Task 3: Review pull request
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders unchecked in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={false} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
            <li>
              <TodoCheckbox checked={false} index={2} filePath="test.md" />
              {' '}Task 3: Review pull request
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders unchecked in catppuccin-latte theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-latte')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={false} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders unchecked in catppuccin-macchiato theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-macchiato')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={false} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders unchecked in catppuccin-mocha theme', async () => {
      document.documentElement.setAttribute('data-theme', 'catppuccin-mocha')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={false} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })
  })

  describe('Checked state', () => {
    it('renders checked items in light theme', async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={true} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
            <li>
              <TodoCheckbox checked={true} index={2} filePath="test.md" />
              {' '}Task 3: Review pull request
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })

    it('renders checked items in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      globalThis.fetch = vi.fn() as any

      render(
        <div style={{ padding: '20px' }}>
          <ul>
            <li>
              <TodoCheckbox checked={true} index={0} filePath="test.md" />
              {' '}Task 1: Complete documentation
            </li>
            <li>
              <TodoCheckbox checked={false} index={1} filePath="test.md" />
              {' '}Task 2: Write unit tests
            </li>
            <li>
              <TodoCheckbox checked={true} index={2} filePath="test.md" />
              {' '}Task 3: Review pull request
            </li>
          </ul>
        </div>
      )

      await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
      await page.screenshot()
    })
  })
})
