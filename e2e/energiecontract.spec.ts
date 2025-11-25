import { test, expect } from "@playwright/test";

test.describe("Energiecontract Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/energiecontract");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Energiecontract/i })).toBeVisible();
  });

  test("should show total costs including fixed costs", async ({ page }) => {
    await page.getByLabel(/Huidig stroomprijs/i).fill("0.35");
    await page.getByLabel(/Nieuw stroomprijs/i).fill("0.27");
    
    await expect(page.getByText(/Totale kosten/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show savings over multiple years", async ({ page }) => {
    await page.getByLabel(/Contracttype/i).selectOption("dynamisch");
    
    await expect(page.getByText(/Besparing.*jaar/i)).toBeVisible({ timeout: 5000 });
  });
});

