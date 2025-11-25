import { test, expect } from "@playwright/test";

test.describe("Zonnepanelen Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/zonnepanelen");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Zonnepanelen Calculator/i })).toBeVisible();
    await expect(page.getByLabel(/Jaarlijks stroomverbruik/i)).toBeVisible();
    await expect(page.getByLabel(/Dakoriëntatie/i)).toBeVisible();
  });

  test("should calculate results when inputs change", async ({ page }) => {
    const verbruikInput = page.getByLabel(/Jaarlijks stroomverbruik/i);
    await verbruikInput.fill("4000");

    // Wait for results to appear
    await expect(page.getByText(/Aantal panelen/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Jaarlijkse besparing/i)).toBeVisible();
  });

  test("should show shadow slider and affect results", async ({ page }) => {
    await page.getByLabel(/Jaarlijks stroomverbruik/i).fill("3500");

    // Adjust shadow percentage
    const shadowSlider = page.locator('input[type="range"][name="schaduwPercentage"]');
    await shadowSlider.fill("30");

    // Results should update
    await expect(page.getByText(/Aantal panelen/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show savings with and without saldering", async ({ page }) => {
    await page.getByLabel(/Jaarlijks stroomverbruik/i).fill("3500");
    await page.getByLabel(/Saldering actief/i).uncheck();

    await expect(page.getByText(/Zonder saldering/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show graph chart", async ({ page }) => {
    await page.getByLabel(/Jaarlijks stroomverbruik/i).fill("3500");

    await expect(page.getByText(/Verbruik vs Opwekking per Maand/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show lead form", async ({ page }) => {
    // Scroll to lead form
    await page
      .getByRole("heading", { name: /Ontvang een vrijblijvend advies/i })
      .scrollIntoViewIfNeeded();
    await expect(page.getByLabel(/E-mailadres/i)).toBeVisible();
    await expect(page.getByLabel(/Postcode/i)).toBeVisible();
  });

  test("should have back button", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Terug naar overzicht/i })).toBeVisible();
  });
});
