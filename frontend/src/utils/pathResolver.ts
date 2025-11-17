/**
 * Resolves a relative path based on the current file path
 * @param currentPath - The current file path (e.g., "folder1/nested.md")
 * @param relativePath - The relative path to resolve (e.g., "../root.md")
 * @returns The resolved absolute path (e.g., "root.md")
 */
export function resolveRelativePath(currentPath: string, relativePath: string): string {
  // If the relative path is absolute (starts with /), return it as-is (without the leading /)
  if (relativePath.startsWith('/')) {
    return relativePath.slice(1)
  }

  // Get the directory of the current file
  const currentDir = currentPath.includes('/')
    ? currentPath.substring(0, currentPath.lastIndexOf('/'))
    : ''

  // Split the relative path into parts
  const parts = relativePath.split('/')
  const currentParts = currentDir ? currentDir.split('/') : []

  // Process each part of the relative path
  for (const part of parts) {
    if (part === '..') {
      // Go up one directory
      if (currentParts.length > 0) {
        currentParts.pop()
      }
    } else if (part === '.') {
      // Current directory - do nothing
      continue
    } else if (part) {
      // Regular path component - add it
      currentParts.push(part)
    }
  }

  // Join the parts back together
  return currentParts.join('/')
}

/**
 * Checks if a link href is a relative markdown link
 * @param href - The href attribute value
 * @returns true if it's a relative markdown link
 */
export function isRelativeMarkdownLink(href: string): boolean {
  if (!href) return false

  // Exclude absolute URLs (http://, https://, //)
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
    return false
  }

  // Exclude absolute paths (starting with /)
  if (href.startsWith('/')) {
    // But allow /something.md (absolute path to file in root)
    return href.endsWith('.md')
  }

  // Exclude anchors (starting with #)
  if (href.startsWith('#')) {
    return false
  }

  // Check if it's a markdown file
  return href.endsWith('.md') || href.includes('.md#') || href.includes('.md?')
}
