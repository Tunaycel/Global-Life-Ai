import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests live next to the code as *.test.ts(x); browser tests are in e2e/ and run with Playwright.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
