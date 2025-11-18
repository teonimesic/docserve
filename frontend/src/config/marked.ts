import { marked } from 'marked'

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
})

export { marked }
