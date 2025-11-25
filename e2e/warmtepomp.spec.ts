import { test, expect } from "@playwright/test";

test.describe("Warmtepomp Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/warmtepomp");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Warmtepomp Calculator/i })).toBeVisible();
    await expect(page.getByLabel(/Jaarlijks gasverbruik/i)).toBeVisible();
  });

  test("should calculate correct power for 1200 m³ gas (should be ~5.8 kW, not 44 kW)", async ({
    page,
  }) => {
    const gasVerbruikInput = page.getByLabel(/Jaarlijks gasverbruik/i);
    await gasVerbruikInput.fill("1200");

    // Wait for results
    await expect(page.getByText(/Benodigd vermogen/i)).toBeVisible({ timeout: 5000 });

    // Check that the power is realistic (should be around 5-7 kW, not 44 kW)
    const vermogenText = await page.getByText(/Benodigd vermogen/i).textContent();
    const vermogenMatch = vermogenText?.match(/(\d+\.?\d*)\s*kW/);
    if (vermogenMatch && vermogenMatch[1]) {
      const vermogen = parseFloat(vermogenMatch[1]);
      expect(vermogen).toBeLessThan(10); // Should be less than 10 kW
      expect(vermogen).toBeGreaterThan(4); // Should be more than 4 kW
    }
  });

  test("should show scenario ranges", async ({ page }) => {
    await page.getByLabel(/Jaarlijks gasverbruik/i).fill("1200");

    await expect(page.getByText(/Scenario's/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Optimistisch/i)).toBeVisible();
    await expect(page.getByText(/Normaal/i)).toBeVisible();
    await expect(page.getByText(/Pessimistisch/i)).toBeVisible();
  });

  test("should allow COP adjustment", async ({ page }) => {
    await expect(page.getByLabel(/COP/i)).toBeVisible();
    await page.getByLabel(/COP/i).fill("5");

    // Results should update
    await expect(page.getByText(/Benodigd vermogen/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show lead form", async ({ page }) => {
    await page.getByLabel(/Jaarlijks gasverbruik/i).fill("1200");
    await page
      .getByRole("heading", { name: /Ontvang een vrijblijvend advies/i })
      .scrollIntoViewIfNeeded();
    await expect(page.getByLabel(/E-mailadres/i)).toBeVisible();
  });
});
