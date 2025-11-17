import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.ts/, // Only match .spec.ts files, not .test.ts or .test.tsx
  testIgnore: /.*\.test\.(ts|tsx)/, // Explicitly ignore vitest test files
  fullyParallel: false, // Run tests serially since they modify shared files
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Only one worker since tests share state
  reporter: 'list',
  timeout: 10000, // Reduce timeout to 10s for faster failures
  use: {
    trace: 'on-first-retry',
    actionTimeout: 5000, // Reduce action timeout too
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
