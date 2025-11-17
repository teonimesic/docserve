import './SidebarToggle.css'

interface SidebarToggleProps {
  isCollapsed: boolean
  onClick: () => void
}

export function SidebarToggle({ isCollapsed, onClick }: SidebarToggleProps) {
  return (
    <button
      className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`}
      onClick={onClick}
      aria-label="Toggle sidebar"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
      </svg>
    </button>
  )
}
