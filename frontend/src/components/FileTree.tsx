import { memo } from 'react'
import { FileTreeNode } from '../utils/fileTree'
import './FileTree.css'

interface FileTreeProps {
  nodes: FileTreeNode[]
  currentPath: string
  onFileSelect: (path: string) => void
  isExpanded: (path: string) => boolean
  onToggleFolder: (path: string) => void
}

interface FileTreeNodeProps {
  node: FileTreeNode
  currentPath: string
  onFileSelect: (path: string) => void
  isExpanded: (path: string) => boolean
  onToggleFolder: (path: string) => void
}

// Memoized TreeNode - only re-renders if props change
// This prevents re-rendering of collapsed subtrees when files are added/removed elsewhere
const TreeNode = memo(function TreeNode({
  node,
  currentPath,
  onFileSelect,
  isExpanded,
  onToggleFolder,
}: FileTreeNodeProps) {
  if (node.isFolder) {
    const expanded = isExpanded(node.path)

    return (
      <li className="folder-item">
        <button className="folder-header" onClick={() => onToggleFolder(node.path)}>
          <span className={`folder-arrow ${expanded ? 'expanded' : ''}`}>▶</span>
          <span className="folder-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 3h4l1.5 2H14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            </svg>
          </span>
          <span className="folder-name">{node.name}</span>
        </button>
        {expanded && node.children && node.children.length > 0 && (
          <ul className="folder-children">
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                currentPath={currentPath}
                onFileSelect={onFileSelect}
                isExpanded={isExpanded}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li className="file-item">
      <button
        onClick={() => onFileSelect(node.path)}
        className={currentPath === node.path ? 'active' : ''}
      >
        <span className="file-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 2h7l2 2v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
            <path d="M10 2v2h2" />
          </svg>
        </span>
        <span className="file-name">{node.name}</span>
      </button>
    </li>
  )
})

// Memoized FileTree - only re-renders if nodes or other props change
export const FileTree = memo(function FileTree({
  nodes,
  currentPath,
  onFileSelect,
  isExpanded,
  onToggleFolder,
}: FileTreeProps) {
  return (
    <ul className="file-list">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          currentPath={currentPath}
          onFileSelect={onFileSelect}
          isExpanded={isExpanded}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </ul>
  )
})
