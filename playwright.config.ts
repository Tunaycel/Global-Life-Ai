import { randomBytes } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);

// Smoke tests against the production build: run `npm run build` first. Locally an already running
// server on the port is reused; in CI Playwright starts `next start` itself.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // NextAuth refuses to answer /api/auth/session without a secret and logs NO_SECRET on every page.
    // A random one per run is enough for signed-out pages; a real NEXTAUTH_SECRET in the environment wins.
    env: { NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? randomBytes(32).toString("hex") },
  },
});
