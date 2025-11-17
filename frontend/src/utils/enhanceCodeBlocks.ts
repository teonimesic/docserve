import Prism from 'prismjs'

/**
 * Enhances code blocks in a container with syntax highlighting, copy buttons, and line numbers
 */
export function enhanceCodeBlocks(container: HTMLElement) {
  // Apply Prism syntax highlighting to all code blocks
  const codeElements = container.querySelectorAll('pre code[class*="language-"]')
  codeElements.forEach((codeElement) => {
    Prism.highlightElement(codeElement as HTMLElement)
  })

  // Add copy buttons and line number toggles
  const preElements = container.querySelectorAll('pre:has(> code[class*="language-"]):not(:has(.code-block-header))')
  preElements.forEach((preElement: Element) => {
    const codeElement = preElement.querySelector('code')
    if (!codeElement) return

    const classes = codeElement.className.split(' ')
    const languageClass = classes.find(cls => cls.startsWith('language-'))
    const language = languageClass ? languageClass.replace('language-', '') : 'text'

    // Create wrapper
    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'

    // Create header with controls
    const header = document.createElement('div')
    header.className = 'code-block-header'

    const languageLabel = document.createElement('span')
    languageLabel.className = 'code-block-language'
    languageLabel.textContent = language

    const actions = document.createElement('div')
    actions.className = 'code-block-actions'

    // Line numbers toggle button
    const lineNumbersBtn = document.createElement('button')
    lineNumbersBtn.className = 'code-block-btn'
    lineNumbersBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="3" x2="12" y2="3"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="13" x2="12" y2="13"/><circle cx="1.5" cy="3" r="0.5" fill="currentColor"/><circle cx="1.5" cy="8" r="0.5" fill="currentColor"/><circle cx="1.5" cy="13" r="0.5" fill="currentColor"/></svg>'
    lineNumbersBtn.title = 'Toggle line numbers'

    // Restore line numbers state from sessionStorage
    const lineNumbersEnabled = sessionStorage.getItem('code-line-numbers') === 'true'

    lineNumbersBtn.onclick = () => {
      preElement.classList.toggle('line-numbers')
      const hasLineNumbers = preElement.classList.contains('line-numbers')
      lineNumbersBtn.classList.toggle('active', hasLineNumbers)
      sessionStorage.setItem('code-line-numbers', hasLineNumbers.toString())
      Prism.highlightElement(codeElement as HTMLElement)
    }

    // Copy button
    const copyBtn = document.createElement('button')
    copyBtn.className = 'code-block-btn'
    copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="8" height="10" rx="1"/><path d="M8 4V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2"/></svg>'
    copyBtn.title = 'Copy code'
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(codeElement.textContent || '')
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,8 6,11 13,4"/></svg>'
        copyBtn.classList.add('copied')
        setTimeout(() => {
          copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="8" height="10" rx="1"/><path d="M8 4V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2"/></svg>'
          copyBtn.classList.remove('copied')
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }

    actions.appendChild(lineNumbersBtn)
    actions.appendChild(copyBtn)
    header.appendChild(languageLabel)
    header.appendChild(actions)

    // Wrap the pre element
    preElement.parentNode?.insertBefore(wrapper, preElement)
    wrapper.appendChild(header)
    wrapper.appendChild(preElement)

    // Apply saved line numbers state
    if (lineNumbersEnabled) {
      preElement.classList.add('line-numbers')
      lineNumbersBtn.classList.add('active')
    }
    Prism.highlightElement(codeElement as HTMLElement)
  })
}
