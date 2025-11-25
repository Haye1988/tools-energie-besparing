import { test, expect } from "@playwright/test";

test.describe("Isolatie Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/isolatie");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Isolatie Calculator/i })).toBeVisible();
    await expect(page.getByLabel(/Woningtype/i)).toBeVisible();
  });

  test("should calculate realistic savings for spouwmuur isolation (hoekwoning ~400 m³)", async ({
    page,
  }) => {
    await page.getByLabel(/Woningtype/i).selectOption("hoekwoning");
    await page.getByLabel(/Jaarlijks gasverbruik/i).fill("1200");

    // Select spouwmuur isolatie
    await page.getByLabel(/Spouwmuur/i).check();

    // Wait for results
    await expect(page.getByText(/Totaal gasbesparing/i)).toBeVisible({ timeout: 5000 });

    // Check that savings are realistic (should be around 300-500 m³ for hoekwoning spouw)
    const besparingText = await page.getByText(/Totaal gasbesparing/i).textContent();
    const besparingMatch = besparingText?.match(/(\d+)\s*m³/);
    if (besparingMatch && besparingMatch[1]) {
      const besparing = parseInt(besparingMatch[1], 10);
      expect(besparing).toBeGreaterThan(200); // Should be significant
    }
  });

  test("should show priority advice when multiple measures selected", async ({ page }) => {
    await page.getByLabel(/Woningtype/i).selectOption("tussenwoning");
    await page.getByLabel(/Jaarlijks gasverbruik/i).fill("1200");
    await page.getByLabel(/Dak/i).check();
    await page.getByLabel(/Spouwmuur/i).check();
    await page.getByLabel(/Vloer/i).check();

    await expect(page.getByText(/Prioriteit advies/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Beste keuze/i)).toBeVisible();
  });

  test("should show combination effect warning", async ({ page }) => {
    await page.getByLabel(/Dak/i).check();
    await page.getByLabel(/Spouwmuur/i).check();

    await expect(page.getByText(/combinatie-effect/i)).toBeVisible({ timeout: 5000 });
  });
});
