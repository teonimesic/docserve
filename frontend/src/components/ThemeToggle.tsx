import './ThemeToggle.css'

interface ThemeToggleProps {
  onClick: () => void
}

export function ThemeToggle({ onClick }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={onClick} aria-label="Toggle theme">
      🎨
    </button>
  )
}
