import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Mock Prism globally for all tests
// Use globalThis which works in both Node and browser environments
;(globalThis as any).Prism = {
  highlightElement: vi.fn(),
  highlightAll: vi.fn(),
  languages: {},
}

// Mock Mermaid globally for all tests
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg>test diagram</svg>' }),
    run: vi.fn(),
  },
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})
