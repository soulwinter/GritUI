import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4174', channel: 'chrome', viewport: { width: 1440, height: 1100 }, trace: 'retain-on-failure' },
  webServer: { command: 'npm run build:demo && npm run preview -- --port 4174', url: 'http://127.0.0.1:4174', reuseExistingServer: !process.env.CI },
});
