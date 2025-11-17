import { describe, it, expect } from 'vitest'
import { buildFileTree, type ApiFile } from './fileTree'

describe('buildFileTree', () => {
  it('should convert flat file list to tree structure', () => {
    const files: ApiFile[] = [
      { name: 'README.md', path: 'README.md', modified: 123, type: 'markdown' },
      { name: 'intro.md', path: 'docs/intro.md', modified: 124, type: 'markdown' },
      { name: 'guide.md', path: 'docs/guide.md', modified: 125, type: 'markdown' },
    ]

    const tree = buildFileTree(files)

    expect(tree).toHaveLength(2)

    // Root level file
    const readme = tree.find(node => node.name === 'README.md')
    expect(readme).toBeDefined()
    expect(readme?.isFolder).toBe(false)
    expect(readme?.path).toBe('README.md')

    // Folder with children
    const docsFolder = tree.find(node => node.name === 'docs')
    expect(docsFolder).toBeDefined()
    expect(docsFolder?.isFolder).toBe(true)
    expect(docsFolder?.children).toHaveLength(2)
    expect(docsFolder?.children?.map(c => c.name)).toEqual(['guide.md', 'intro.md'])
  })

  it('should handle nested folders', () => {
    const files: ApiFile[] = [
      { name: 'config.md', path: 'docs/api/config.md', modified: 123, type: 'markdown' },
      { name: 'auth.md', path: 'docs/api/auth.md', modified: 124, type: 'markdown' },
      { name: 'setup.md', path: 'docs/setup.md', modified: 125, type: 'markdown' },
    ]

    const tree = buildFileTree(files)

    expect(tree).toHaveLength(1)

    const docsFolder = tree[0]!
    expect(docsFolder.name).toBe('docs')
    expect(docsFolder.isFolder).toBe(true)
    expect(docsFolder.children).toHaveLength(2)

    // Check for 'api' folder and 'setup.md' file
    const apiFolder = docsFolder.children!.find(node => node.name === 'api')!
    const setupFile = docsFolder.children!.find(node => node.name === 'setup.md')!

    expect(apiFolder).toBeDefined()
    expect(apiFolder.isFolder).toBe(true)
    expect(apiFolder.children).toHaveLength(2)
    expect(apiFolder.children!.map(c => c.name)).toEqual(['auth.md', 'config.md'])

    expect(setupFile).toBeDefined()
    expect(setupFile.isFolder).toBe(false)
  })

  it('should handle empty file list', () => {
    const tree = buildFileTree([])
    expect(tree).toEqual([])
  })

  it('should sort files alphabetically within each level', () => {
    const files: ApiFile[] = [
      { name: 'zebra.md', path: 'zebra.md', modified: 123, type: 'markdown' },
      { name: 'alpha.md', path: 'alpha.md', modified: 124, type: 'markdown' },
      { name: 'beta.md', path: 'beta.md', modified: 125, type: 'markdown' },
    ]

    const tree = buildFileTree(files)

    expect(tree.map(n => n.name)).toEqual(['alpha.md', 'beta.md', 'zebra.md'])
  })

  it('should place folders before files at each level', () => {
    const files: ApiFile[] = [
      { name: 'file.md', path: 'file.md', modified: 123, type: 'markdown' },
      { name: 'nested.md', path: 'folder/nested.md', modified: 124, type: 'markdown' },
      { name: 'another.md', path: 'another.md', modified: 125, type: 'markdown' },
    ]

    const tree = buildFileTree(files)

    expect(tree).toHaveLength(3)
    // Folder should come first
    expect(tree[0]!.isFolder).toBe(true)
    expect(tree[0]!.name).toBe('folder')
    // Then files in alphabetical order
    expect(tree[1]!.isFolder).toBe(false)
    expect(tree[1]!.name).toBe('another.md')
    expect(tree[2]!.isFolder).toBe(false)
    expect(tree[2]!.name).toBe('file.md')
  })

  it('should preserve full path for files', () => {
    const files: ApiFile[] = [
      { name: 'deep.md', path: 'a/b/c/deep.md', modified: 123, type: 'markdown' },
    ]

    const tree = buildFileTree(files)

    const folderA = tree[0]!
    const folderB = folderA.children![0]!
    const folderC = folderB.children![0]!
    const file = folderC.children![0]!

    expect(file.path).toBe('a/b/c/deep.md')
    expect(file.isFolder).toBe(false)
  })

  it('should handle single file', () => {
    const files: ApiFile[] = [
      { name: 'single.md', path: 'single.md', modified: 123, type: 'markdown' },
    ]

    const tree = buildFileTree(files)

    expect(tree).toHaveLength(1)
    expect(tree[0]!.name).toBe('single.md')
    expect(tree[0]!.isFolder).toBe(false)
    expect(tree[0]!.path).toBe('single.md')
  })
})
