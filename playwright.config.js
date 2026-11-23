// Test automatici (Playwright). Avvio: npm test
// Le animazioni sono servite in /animazioni/, come su GitHub Pages: un percorso assoluto si rompe anche nei test.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4174/animazioni/',
    ...devices['iPhone 13'],
    browserName: 'chromium',
    deviceScaleFactor: 1,
    trace: 'off'
  },
  webServer: {
    command: 'mkdir -p .site && ln -sfn .. .site/animazioni && python3 -m http.server 4174 -d .site',
    url: 'http://localhost:4174/animazioni/',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'ignore'
  }
});
