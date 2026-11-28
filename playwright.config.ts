import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  retries: 0,
  updateSnapshots: 'none',
  timeout: 30000,
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {
    baseURL: 'http://127.0.0.1:4291',
    browserName: 'chromium',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 900}}},
    {name: 'mobile', use: {viewport: {width: 390, height: 844}}},
  ],
  webServer: {
    command: 'node scripts/preview-server.mjs',
    env: {PORT: '4291'},
    url: 'http://127.0.0.1:4291',
    reuseExistingServer: false,
  },
});
