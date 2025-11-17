import { Theme } from '../hooks/useTheme'
import './ThemeModal.css'

interface ThemeModalProps {
  isOpen: boolean
  currentTheme: Theme
  onClose: () => void
  onSelectTheme: (theme: Theme) => void
}

interface ThemeInfo {
  id: Theme
  name: string
  icon: string
  colors: string[]
  description: string
}

const THEMES: ThemeInfo[] = [
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    icon: '☕',
    colors: ['#eff1f5', '#4c4f69', '#1e66f5'],
    description: 'Warm light theme',
  },
  {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    icon: '🥛',
    colors: ['#24273a', '#cad3f5', '#8aadf4'],
    description: 'Medium contrast',
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    icon: '🐱',
    colors: ['#1e1e2e', '#cdd6f4', '#89b4fa'],
    description: 'Dark and cozy',
  },
  {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    colors: ['#fff', '#333', '#0366d6'],
    description: 'Classic bright',
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    colors: ['#0d1117', '#e6edf3', '#58a6ff'],
    description: 'Classic dark',
  },
]

export function ThemeModal({ isOpen, currentTheme, onClose, onSelectTheme }: ThemeModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="theme-modal" onClick={handleBackdropClick}>
      <div className="theme-modal-content">
        <h3>Choose Theme</h3>
        <div className="theme-grid">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className={`theme-card ${currentTheme === theme.id ? 'selected' : ''}`}
              data-theme={theme.id}
              onClick={() => onSelectTheme(theme.id)}
            >
              <div className="theme-card-icon">{theme.icon}</div>
              <div className="theme-card-name">{theme.name}</div>
              <div className="theme-card-preview">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="theme-color-swatch"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="theme-card-sample">{theme.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
