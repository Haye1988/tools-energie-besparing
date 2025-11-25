import { test, expect } from "@playwright/test";

test.describe("Laadpaal Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/laadpaal");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Laadpaal/i })).toBeVisible();
  });

  test("should show onboard charger warning for EV model", async ({ page }) => {
    await page.getByLabel(/EV model/i).fill("Nissan Leaf");
    await page.getByLabel(/Accucapaciteit/i).fill("40");
    
    // Should show warning about max onboard charger (6.6 kW for Leaf)
    await expect(page.getByText(/6\.6.*kW/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show monthly costs", async ({ page }) => {
    await page.getByLabel(/Accucapaciteit/i).fill("60");
    
    await expect(page.getByText(/Maandelijkse kosten/i)).toBeVisible({ timeout: 5000 });
  });
});

