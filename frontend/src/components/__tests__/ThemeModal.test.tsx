import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ThemeModal } from '../ThemeModal'
import type { Theme } from '../../hooks/useTheme'

describe('ThemeModal', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <ThemeModal
        isOpen={false}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders modal when open', () => {
    const { getByText } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    expect(getByText('Choose Theme')).toBeInTheDocument()
  })

  it('renders all theme options', () => {
    const { getByText } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    expect(getByText('Catppuccin Latte')).toBeInTheDocument()
    expect(getByText('Catppuccin Macchiato')).toBeInTheDocument()
    expect(getByText('Catppuccin Mocha')).toBeInTheDocument()
    expect(getByText('Light')).toBeInTheDocument()
    expect(getByText('Dark')).toBeInTheDocument()
  })

  it('marks current theme as selected', () => {
    const { container } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="catppuccin-mocha"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    const selectedCard = container.querySelector('[data-theme="catppuccin-mocha"]')
    expect(selectedCard).toHaveClass('selected')

    const notSelectedCard = container.querySelector('[data-theme="dark"]')
    expect(notSelectedCard).not.toHaveClass('selected')
  })

  it('calls onSelectTheme when clicking a theme', () => {
    const mockSelectTheme = vi.fn()

    const { getByText } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={mockSelectTheme}
      />
    )

    const latteTheme = getByText('Catppuccin Latte').closest('.theme-card')!
    fireEvent.click(latteTheme)

    expect(mockSelectTheme).toHaveBeenCalledWith('catppuccin-latte')
  })

  it('calls onClose when clicking backdrop', () => {
    const mockClose = vi.fn()

    const { container } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={mockClose}
        onSelectTheme={vi.fn()}
      />
    )

    const backdrop = container.querySelector('.theme-modal')!
    fireEvent.click(backdrop)

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking modal content', () => {
    const mockClose = vi.fn()

    const { container } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={mockClose}
        onSelectTheme={vi.fn()}
      />
    )

    const content = container.querySelector('.theme-modal-content')!
    fireEvent.click(content)

    expect(mockClose).not.toHaveBeenCalled()
  })

  it('renders theme icons', () => {
    const { getByText } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    expect(getByText('☕')).toBeInTheDocument() // Latte
    expect(getByText('🥛')).toBeInTheDocument() // Macchiato
    expect(getByText('🐱')).toBeInTheDocument() // Mocha
    expect(getByText('☀️')).toBeInTheDocument() // Light
    expect(getByText('🌙')).toBeInTheDocument() // Dark
  })

  it('renders theme descriptions', () => {
    const { getByText } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    expect(getByText('Warm light theme')).toBeInTheDocument()
    expect(getByText('Medium contrast')).toBeInTheDocument()
    expect(getByText('Dark and cozy')).toBeInTheDocument()
    expect(getByText('Classic bright')).toBeInTheDocument()
    expect(getByText('Classic dark')).toBeInTheDocument()
  })

  it('renders color swatches for each theme', () => {
    const { container } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    const colorSwatches = container.querySelectorAll('.theme-color-swatch')
    // 5 themes × 3 colors each = 15 swatches
    expect(colorSwatches.length).toBe(15)
  })

  it('applies correct colors to theme swatches', () => {
    const { container } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={vi.fn()}
      />
    )

    // Check latte theme swatches
    const latteCard = container.querySelector('[data-theme="catppuccin-latte"]')!
    const latteSwatches = latteCard.querySelectorAll('.theme-color-swatch')

    expect(latteSwatches[0]).toHaveStyle({ background: '#eff1f5' })
    expect(latteSwatches[1]).toHaveStyle({ background: '#4c4f69' })
    expect(latteSwatches[2]).toHaveStyle({ background: '#1e66f5' })
  })

  it('allows selecting different themes', () => {
    const mockSelectTheme = vi.fn()

    const { getByText } = render(
      <ThemeModal
        isOpen={true}
        currentTheme="dark"
        onClose={vi.fn()}
        onSelectTheme={mockSelectTheme}
      />
    )

    // Select multiple themes
    const themes: Array<{ name: string; id: Theme }> = [
      { name: 'Catppuccin Latte', id: 'catppuccin-latte' },
      { name: 'Catppuccin Mocha', id: 'catppuccin-mocha' },
      { name: 'Light', id: 'light' },
    ]

    themes.forEach((theme) => {
      const themeCard = getByText(theme.name).closest('.theme-card')!
      fireEvent.click(themeCard)
      expect(mockSelectTheme).toHaveBeenCalledWith(theme.id)
    })

    expect(mockSelectTheme).toHaveBeenCalledTimes(3)
  })
})
