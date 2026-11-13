import { defineConfig, devices } from '@playwright/test';

const WEB_URL = process.env.WEB_URL ?? 'https://practicesoftwaretesting.com';
const API_URL = process.env.API_URL ?? 'https://api.practicesoftwaretesting.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // The demo site is shared and public, so one retry in CI absorbs network blips.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: WEB_URL },
    },
  ],
  metadata: { apiUrl: API_URL },
});
