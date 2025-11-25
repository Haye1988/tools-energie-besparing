import { test, expect } from "@playwright/test";

test.describe("Energielabel Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/energielabel");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Energielabel/i })).toBeVisible();
  });

  test("should show heat loss per component", async ({ page }) => {
    await page.getByLabel(/Bouwjaar/i).fill("1980");
    
    await expect(page.getByText(/Warmteverlies/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show label improvement per measure", async ({ page }) => {
    await page.getByLabel(/Isolatie dak/i).selectOption("geen");
    
    await expect(page.getByText(/Label na maatregel/i)).toBeVisible({ timeout: 5000 });
  });
});

