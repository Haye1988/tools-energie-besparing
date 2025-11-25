import { test, expect } from "@playwright/test";

test.describe("Boilers Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/boilers");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Boilers/i })).toBeVisible();
  });

  test("should calculate based on shower habits", async ({ page }) => {
    await page.getByLabel(/Douche minuten per dag/i).fill("10");
    await page.getByLabel(/Aantal baden per week/i).fill("2");
    
    await expect(page.getByText(/Aanbevolen volume/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show comparison between systems", async ({ page }) => {
    await page.getByLabel(/Aantal personen/i).fill("4");
    
    await expect(page.getByText(/Vergelijking/i)).toBeVisible({ timeout: 5000 });
  });
});

