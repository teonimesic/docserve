import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Use jsdom for unit tests by default
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Exclude visual tests and playwright e2e tests from unit test runs
    exclude: ['**/*.visual.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/node_modules/**', '**/e2e/**'],
    // Browser mode configuration for visual/component tests
    browser: {
      provider: playwright({
        launchOptions: {
          headless: true,
        },
      }),
      instances: [
        { browser: 'chromium' },
      ],
      screenshotFailures: true,
      viewport: {
        width: 1280,
        height: 720,
      },
    },
  },
})
