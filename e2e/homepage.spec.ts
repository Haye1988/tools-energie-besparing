import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display all 11 tools", async ({ page }) => {
    await page.goto("/");

    // Check for main title
    await expect(page.getByRole("heading", { name: /Energie Besparing Tools/i })).toBeVisible();

    // Check for all 11 tools
    const tools = [
      "Zonnepanelen",
      "Warmtepomp",
      "Airconditioning",
      "Thuisbatterij",
      "Isolatie",
      "CV-Ketel",
      "Laadpaal",
      "Energiecontract",
      "Kozijnen",
      "Energielabel",
      "Boilers",
    ];

    for (const tool of tools) {
      await expect(page.getByRole("link", { name: new RegExp(tool, "i") })).toBeVisible();
    }
  });

  test("should navigate to zonnepanelen tool", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Zonnepanelen/i }).click();
    await expect(page).toHaveURL(/.*zonnepanelen/);
    await expect(page.getByRole("heading", { name: /Zonnepanelen Calculator/i })).toBeVisible();
  });
});

