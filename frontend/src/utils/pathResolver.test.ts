import { describe, it, expect } from 'vitest'
import { resolveRelativePath, isRelativeMarkdownLink } from './pathResolver'

describe('resolveRelativePath', () => {
  describe('parent directory navigation', () => {
    it('should resolve parent directory from nested file', () => {
      expect(resolveRelativePath('folder1/nested.md', '../root.md')).toBe('root.md')
    })

    it('should resolve parent directory from deeply nested file', () => {
      expect(resolveRelativePath('a/b/c/deep.md', '../parent.md')).toBe('a/b/parent.md')
    })
  })

  describe('grandparent directory navigation', () => {
    it('should resolve grandparent directory', () => {
      expect(resolveRelativePath('a/b/c/file.md', '../../grandparent.md')).toBe('a/grandparent.md')
    })

    it('should resolve to root from deeply nested file', () => {
      expect(resolveRelativePath('a/b/c/file.md', '../../../root.md')).toBe('root.md')
    })
  })

  describe('sibling navigation', () => {
    it('should resolve sibling with ./ prefix', () => {
      expect(resolveRelativePath('folder/file1.md', './sibling.md')).toBe('folder/sibling.md')
    })

    it('should resolve sibling without prefix', () => {
      expect(resolveRelativePath('folder/file1.md', 'sibling.md')).toBe('folder/sibling.md')
    })

    it('should resolve sibling in root', () => {
      expect(resolveRelativePath('file1.md', 'sibling.md')).toBe('sibling.md')
    })
  })

  describe('child directory navigation', () => {
    it('should resolve child from root', () => {
      expect(resolveRelativePath('root.md', 'child/file.md')).toBe('child/file.md')
    })

    it('should resolve child from nested directory', () => {
      expect(resolveRelativePath('folder/parent.md', 'child/file.md')).toBe('folder/child/file.md')
    })
  })

  describe('grandchild directory navigation', () => {
    it('should resolve grandchild from root', () => {
      expect(resolveRelativePath('root.md', 'child/grandchild/file.md')).toBe('child/grandchild/file.md')
    })

    it('should resolve grandchild from nested directory', () => {
      expect(resolveRelativePath('a/b.md', 'c/d/file.md')).toBe('a/c/d/file.md')
    })
  })

  describe('complex navigation', () => {
    it('should handle mix of .. and regular paths', () => {
      expect(resolveRelativePath('a/b/c.md', '../d/e.md')).toBe('a/d/e.md')
    })

    it('should handle multiple .. in a row', () => {
      expect(resolveRelativePath('a/b/c/d.md', '../../e.md')).toBe('a/e.md')
    })

    it('should handle . (current directory)', () => {
      expect(resolveRelativePath('folder/file.md', './././sibling.md')).toBe('folder/sibling.md')
    })
  })

  describe('absolute paths', () => {
    it('should handle absolute paths (starting with /)', () => {
      expect(resolveRelativePath('a/b/c.md', '/root.md')).toBe('root.md')
    })
  })

  describe('edge cases', () => {
    it('should handle going up beyond root', () => {
      // If we try to go up beyond root, stay at root
      expect(resolveRelativePath('file.md', '../root.md')).toBe('root.md')
    })

    it('should handle empty relative path parts', () => {
      expect(resolveRelativePath('folder/file.md', 'sibling.md')).toBe('folder/sibling.md')
    })

    it('should handle root-level file to root-level file', () => {
      expect(resolveRelativePath('file1.md', 'file2.md')).toBe('file2.md')
    })
  })
})

describe('isRelativeMarkdownLink', () => {
  it('should return true for relative markdown links', () => {
    expect(isRelativeMarkdownLink('../parent.md')).toBe(true)
    expect(isRelativeMarkdownLink('./sibling.md')).toBe(true)
    expect(isRelativeMarkdownLink('sibling.md')).toBe(true)
    expect(isRelativeMarkdownLink('child/file.md')).toBe(true)
    expect(isRelativeMarkdownLink('/root.md')).toBe(true)
  })

  it('should return true for markdown links with anchors', () => {
    expect(isRelativeMarkdownLink('file.md#section')).toBe(true)
    expect(isRelativeMarkdownLink('../parent.md#top')).toBe(true)
  })

  it('should return true for markdown links with query params', () => {
    expect(isRelativeMarkdownLink('file.md?param=value')).toBe(true)
  })

  it('should return false for absolute URLs', () => {
    expect(isRelativeMarkdownLink('http://example.com/file.md')).toBe(false)
    expect(isRelativeMarkdownLink('https://example.com/file.md')).toBe(false)
    expect(isRelativeMarkdownLink('//example.com/file.md')).toBe(false)
  })

  it('should return false for anchor links', () => {
    expect(isRelativeMarkdownLink('#section')).toBe(false)
    expect(isRelativeMarkdownLink('#top')).toBe(false)
  })

  it('should return false for non-markdown links', () => {
    expect(isRelativeMarkdownLink('image.png')).toBe(false)
    expect(isRelativeMarkdownLink('style.css')).toBe(false)
    expect(isRelativeMarkdownLink('/api/files')).toBe(false)
  })

  it('should return false for empty or null href', () => {
    expect(isRelativeMarkdownLink('')).toBe(false)
    expect(isRelativeMarkdownLink(null as any)).toBe(false)
  })
})
