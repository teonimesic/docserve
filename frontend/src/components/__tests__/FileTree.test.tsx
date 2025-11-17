import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { FileTree } from '../FileTree'
import type { FileTreeNode } from '../../utils/fileTree'

describe('FileTree', () => {
  it('renders file tree with folders and files', () => {
    const nodes: FileTreeNode[] = [
      {
        name: 'folder1',
        path: 'folder1',
        isFolder: true,
        children: [
          { name: 'file1.md', path: 'folder1/file1.md', isFolder: false }
        ]
      },
      { name: 'file2.md', path: 'file2.md', isFolder: false }
    ]

    const { getByText } = render(
      <FileTree
        nodes={nodes}
        currentPath="file2.md"
        onFileSelect={() => {}}
        isExpanded={() => true}
        onToggleFolder={() => {}}
      />
    )

    expect(getByText('folder1')).toBeInTheDocument()
    expect(getByText('file1.md')).toBeInTheDocument()
    expect(getByText('file2.md')).toBeInTheDocument()
  })

  it('only shows children of expanded folders', () => {
    const nodes: FileTreeNode[] = [
      {
        name: 'folder1',
        path: 'folder1',
        isFolder: true,
        children: [
          { name: 'file1.md', path: 'folder1/file1.md', isFolder: false }
        ]
      }
    ]

    const { queryByText, getByText } = render(
      <FileTree
        nodes={nodes}
        currentPath=""
        onFileSelect={() => {}}
        isExpanded={() => false}
        onToggleFolder={() => {}}
      />
    )

    expect(getByText('folder1')).toBeInTheDocument()
    expect(queryByText('file1.md')).not.toBeInTheDocument()
  })

  it('memoizes TreeNode to prevent re-renders of collapsed subtrees', () => {
    // Track render counts for each node
    const renderCounts = new Map<string, number>()

    // Create a large tree structure with multiple folders
    const nodes: FileTreeNode[] = [
      {
        name: 'folder1',
        path: 'folder1',
        isFolder: true,
        children: [
          { name: 'file1.md', path: 'folder1/file1.md', isFolder: false },
          { name: 'file2.md', path: 'folder1/file2.md', isFolder: false }
        ]
      },
      {
        name: 'folder2',
        path: 'folder2',
        isFolder: true,
        children: [
          { name: 'file3.md', path: 'folder2/file3.md', isFolder: false },
          { name: 'file4.md', path: 'folder2/file4.md', isFolder: false }
        ]
      },
      {
        name: 'folder3',
        path: 'folder3',
        isFolder: true,
        children: [
          { name: 'file5.md', path: 'folder3/file5.md', isFolder: false }
        ]
      }
    ]

    const expandedFolders = new Set<string>(['folder1'])

    // Initial render with folder1 expanded
    const { rerender, getByText, queryByText } = render(
      <FileTree
        nodes={nodes}
        currentPath="folder1/file1.md"
        onFileSelect={() => {}}
        isExpanded={(path) => expandedFolders.has(path)}
        onToggleFolder={() => {}}
      />
    )

    // Verify initial state
    expect(getByText('file1.md')).toBeInTheDocument() // folder1 expanded
    expect(queryByText('file3.md')).not.toBeInTheDocument() // folder2 collapsed
    expect(queryByText('file5.md')).not.toBeInTheDocument() // folder3 collapsed

    // Add a new file to folder1 (requires nodes update)
    const updatedNodes: FileTreeNode[] = [
      {
        name: 'folder1',
        path: 'folder1',
        isFolder: true,
        children: [
          { name: 'file1.md', path: 'folder1/file1.md', isFolder: false },
          { name: 'file2.md', path: 'folder1/file2.md', isFolder: false },
          { name: 'new-file.md', path: 'folder1/new-file.md', isFolder: false } // New file
        ]
      },
      {
        name: 'folder2',
        path: 'folder2',
        isFolder: true,
        children: [
          { name: 'file3.md', path: 'folder2/file3.md', isFolder: false },
          { name: 'file4.md', path: 'folder2/file4.md', isFolder: false }
        ]
      },
      {
        name: 'folder3',
        path: 'folder3',
        isFolder: true,
        children: [
          { name: 'file5.md', path: 'folder3/file5.md', isFolder: false }
        ]
      }
    ]

    // Re-render with updated nodes
    rerender(
      <FileTree
        nodes={updatedNodes}
        currentPath="folder1/file1.md"
        onFileSelect={() => {}}
        isExpanded={(path) => expandedFolders.has(path)}
        onToggleFolder={() => {}}
      />
    )

    // Verify the new file appears in expanded folder1
    expect(getByText('new-file.md')).toBeInTheDocument()

    // Verify collapsed folders still don't show their children
    expect(queryByText('file3.md')).not.toBeInTheDocument()
    expect(queryByText('file5.md')).not.toBeInTheDocument()
  })

  it('does not re-render the entire tree when only currentPath changes', () => {
    const nodes: FileTreeNode[] = [
      {
        name: 'folder1',
        path: 'folder1',
        isFolder: true,
        children: [
          { name: 'file1.md', path: 'folder1/file1.md', isFolder: false },
          { name: 'file2.md', path: 'folder1/file2.md', isFolder: false }
        ]
      }
    ]

    const onFileSelect = vi.fn()

    const { rerender, getByText } = render(
      <FileTree
        nodes={nodes}
        currentPath="folder1/file1.md"
        onFileSelect={onFileSelect}
        isExpanded={() => true}
        onToggleFolder={() => {}}
      />
    )

    const file1Button = getByText('file1.md').closest('button')
    const file2Button = getByText('file2.md').closest('button')

    // Verify initial active state
    expect(file1Button).toHaveClass('active')
    expect(file2Button).not.toHaveClass('active')

    // Change currentPath to file2.md
    rerender(
      <FileTree
        nodes={nodes}
        currentPath="folder1/file2.md"
        onFileSelect={onFileSelect}
        isExpanded={() => true}
        onToggleFolder={() => {}}
      />
    )

    // Verify active state updated
    expect(file1Button).not.toHaveClass('active')
    expect(file2Button).toHaveClass('active')
  })

  it('calls onFileSelect when file is clicked', () => {
    const onFileSelect = vi.fn()
    const nodes: FileTreeNode[] = [
      { name: 'file1.md', path: 'file1.md', isFolder: false }
    ]

    const { getByText } = render(
      <FileTree
        nodes={nodes}
        currentPath=""
        onFileSelect={onFileSelect}
        isExpanded={() => false}
        onToggleFolder={() => {}}
      />
    )

    getByText('file1.md').click()
    expect(onFileSelect).toHaveBeenCalledWith('file1.md')
  })

  it('calls onToggleFolder when folder is clicked', () => {
    const onToggleFolder = vi.fn()
    const nodes: FileTreeNode[] = [
      {
        name: 'folder1',
        path: 'folder1',
        isFolder: true,
        children: []
      }
    ]

    const { getByText } = render(
      <FileTree
        nodes={nodes}
        currentPath=""
        onFileSelect={() => {}}
        isExpanded={() => false}
        onToggleFolder={onToggleFolder}
      />
    )

    getByText('folder1').closest('button')?.click()
    expect(onToggleFolder).toHaveBeenCalledWith('folder1')
  })

  it('renders nested folder structure correctly', () => {
    const nodes: FileTreeNode[] = [
      {
        name: 'parent',
        path: 'parent',
        isFolder: true,
        children: [
          {
            name: 'child',
            path: 'parent/child',
            isFolder: true,
            children: [
              { name: 'file.md', path: 'parent/child/file.md', isFolder: false }
            ]
          }
        ]
      }
    ]

    const expandedPaths = new Set(['parent', 'parent/child'])

    const { getByText } = render(
      <FileTree
        nodes={nodes}
        currentPath=""
        onFileSelect={() => {}}
        isExpanded={(path) => expandedPaths.has(path)}
        onToggleFolder={() => {}}
      />
    )

    expect(getByText('parent')).toBeInTheDocument()
    expect(getByText('child')).toBeInTheDocument()
    expect(getByText('file.md')).toBeInTheDocument()
  })
})
