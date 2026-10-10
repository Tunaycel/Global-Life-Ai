import { expect, test } from "@playwright/test";

test("the landing page loads and shows the sign-in link", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  // By link target, not text: the label depends on the visitor's locale. This is the desktop navbar
  // link (hidden below the lg breakpoint), so the test runs at Desktop Chrome's width.
  await expect(page.locator('nav a[href="/auth/login"]')).toBeVisible();
});
