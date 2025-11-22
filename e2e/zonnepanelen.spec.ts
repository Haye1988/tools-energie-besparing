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

  test("should show lead form", async ({ page }) => {
    // Scroll to lead form
    await page.getByRole("heading", { name: /Ontvang een vrijblijvend advies/i }).scrollIntoViewIfNeeded();
    await expect(page.getByLabel(/E-mailadres/i)).toBeVisible();
    await expect(page.getByLabel(/Postcode/i)).toBeVisible();
  });

  test("should have back button", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Terug naar overzicht/i })).toBeVisible();
  });
});

