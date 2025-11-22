import { test, expect } from "@playwright/test";

test.describe("Embed Mode", () => {
  test("should hide header in embed mode", async ({ page }) => {
    await page.goto("/zonnepanelen?embed=true");

    // Header should not be visible in embed mode
    const header = page.locator("header");
    await expect(header).not.toBeVisible();
  });

  test("should show calculator content in embed mode", async ({ page }) => {
    await page.goto("/zonnepanelen?embed=true");

    // Calculator should still work
    await expect(page.getByLabel(/Jaarlijks stroomverbruik/i)).toBeVisible();
  });
});
