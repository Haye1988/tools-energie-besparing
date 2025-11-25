import { test, expect } from "@playwright/test";

test.describe("Airco Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/airco");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Airconditioning/i })).toBeVisible();
  });

  test("should calculate cooling capacity with additional factors", async ({ page }) => {
    await page.getByLabel(/Oppervlakte/i).fill("30");
    await page.getByLabel(/Aantal personen/i).fill("4");
    await page.getByLabel(/Zoninstraling/i).selectOption("veel");
    
    await expect(page.getByText(/Benodigd vermogen/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show multi-split advice for multiple rooms", async ({ page }) => {
    await page.getByLabel(/Aantal ruimtes/i).fill("3");
    
    await expect(page.getByText(/multi-split/i)).toBeVisible({ timeout: 5000 });
  });
});

