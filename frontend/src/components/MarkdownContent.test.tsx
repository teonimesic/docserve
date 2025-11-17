import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { MarkdownContent } from './MarkdownContent'

describe('MarkdownContent', () => {
  describe('relative markdown link handling', () => {
    it('should call onLinkClick with resolved path for parent directory link', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="../root.md">Link to root</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder1/nested.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      expect(link).toBeTruthy()
      expect(link?.textContent).toBe('Link to root')

      fireEvent.click(link!)

      expect(onLinkClick).toHaveBeenCalledWith('root.md')
    })

    it('should call onLinkClick with resolved path for grandparent directory link', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="../../grandparent.md">Link to grandparent</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="a/b/c/file.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      expect(onLinkClick).toHaveBeenCalledWith('a/grandparent.md')
    })

    it('should call onLinkClick with resolved path for sibling link', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="sibling.md">Link to sibling</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder/file1.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      expect(onLinkClick).toHaveBeenCalledWith('folder/sibling.md')
    })

    it('should call onLinkClick with resolved path for child directory link', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="child/file.md">Link to child</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="root.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      expect(onLinkClick).toHaveBeenCalledWith('child/file.md')
    })

    it('should call onLinkClick with resolved path for grandchild directory link', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="child/grandchild/file.md">Link to grandchild</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="root.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      expect(onLinkClick).toHaveBeenCalledWith('child/grandchild/file.md')
    })

    it('should prevent default navigation when clicking relative markdown links', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="../root.md">Link</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder/nested.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      link?.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should NOT intercept absolute URL links', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="https://example.com/file.md">External link</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder/file.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      // Should not call onLinkClick for absolute URLs
      expect(onLinkClick).not.toHaveBeenCalled()
    })

    it('should NOT intercept anchor links', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="#section">Anchor link</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder/file.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      // Should not call onLinkClick for anchor links
      expect(onLinkClick).not.toHaveBeenCalled()
    })

    it('should NOT intercept non-markdown file links', () => {
      const onLinkClick = vi.fn()
      const html = '<p><a href="image.png">Image link</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder/file.md"
          onLinkClick={onLinkClick}
        />
      )

      const link = container.querySelector('a')
      fireEvent.click(link!)

      // Should not call onLinkClick for non-markdown files
      expect(onLinkClick).not.toHaveBeenCalled()
    })

    it('should render links normally when onLinkClick is not provided', () => {
      const html = '<p><a href="../root.md">Link to root</a></p>'

      const { container } = render(
        <MarkdownContent
          html={html}
          filePath="folder1/nested.md"
        />
      )

      const link = container.querySelector('a')
      expect(link).toBeTruthy()
      expect(link?.getAttribute('href')).toBe('../root.md')
    })
  })
})
