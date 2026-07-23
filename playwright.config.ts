import { defineConfig, devices } from '@playwright/test';

const localBrowser = process.env.CI ? {} : { channel: 'msedge' as const };

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4321/guyue-mingli-blog/' },
  webServer: {
    command: 'pnpm build && pnpm preview --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'mobile-chrome', use: { ...devices['Pixel 7'], ...localBrowser } }],
});
