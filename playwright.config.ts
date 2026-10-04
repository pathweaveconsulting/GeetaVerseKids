import { defineConfig } from '@playwright/test';

// QC run: plays through the whole app at phone, tablet and laptop widths.
// Screenshots and findings are written to qc-report/.
export default defineConfig({
  testDir: './qc',
  // Fail fast if something hangs; the full playthrough sets its own longer limit
  timeout: 3 * 60 * 1000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off'
  },
  projects: [
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true } },
    { name: 'laptop', use: { viewport: { width: 1280, height: 800 } } }
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 60 * 1000
    },
    {
      // The production build, for the privacy checks (always rebuilt fresh)
      command: 'npm run build && npx vite preview --port 4181 --strictPort',
      url: 'http://localhost:4181',
      reuseExistingServer: false,
      timeout: 120 * 1000
    }
  ]
});
