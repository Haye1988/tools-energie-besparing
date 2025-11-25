import { test, expect } from "@playwright/test";

test.describe("Kozijnen Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kozijnen");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Kozijnen Calculator/i })).toBeVisible();
    await expect(page.getByLabel(/Oppervlakte ramen/i)).toBeVisible();
  });

  test("should calculate realistic savings for hoekwoning enkel→HR++ (~260 m³ for 20 m²)", async ({
    page,
  }) => {
    await page.getByLabel(/Woningtype/i).selectOption("hoekwoning");
    await page.getByLabel(/Oppervlakte ramen/i).fill("20");
    await page.getByLabel(/Huidig glastype/i).selectOption("enkel");

    await expect(page.getByText(/Gasbesparing/i)).toBeVisible({ timeout: 5000 });

    // Check that savings are realistic (should be around 200-300 m³ for hoekwoning enkel→HR++)
    const besparingText = await page.getByText(/Gasbesparing/i).textContent();
    const besparingMatch = besparingText?.match(/(\d+)\s*m³/);
    if (besparingMatch && besparingMatch[1]) {
      const besparing = parseInt(besparingMatch[1], 10);
      expect(besparing).toBeGreaterThan(150); // Should be significant, not 17 m³
      expect(besparing).toBeLessThan(350);
    }
  });

  test("should show investment costs and payback time", async ({ page }) => {
    await page.getByLabel(/Oppervlakte ramen/i).fill("20");
    await page.getByLabel(/Investeringskosten/i).fill("5000");

    await expect(page.getByText(/Terugverdientijd/i)).toBeVisible({ timeout: 5000 });
  });
});
