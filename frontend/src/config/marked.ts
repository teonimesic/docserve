import { marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'

// Use GFM heading ID extension to generate IDs for headings
marked.use(gfmHeadingId())

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
})

export { marked }
