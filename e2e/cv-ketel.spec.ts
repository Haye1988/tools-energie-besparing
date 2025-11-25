import { test, expect } from "@playwright/test";

test.describe("CV-Ketel Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv-ketel");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /CV-Ketel/i })).toBeVisible();
  });

  test("should show replacement advice for old boiler (>15 years)", async ({ page }) => {
    await page.getByLabel(/Ketelleeftijd/i).fill("20");

    await expect(page.getByText(/vervanging/i)).toBeVisible({ timeout: 5000 });
  });

  test("should calculate payback time", async ({ page }) => {
    await page.getByLabel(/Installatiekosten/i).fill("2500");

    await expect(page.getByText(/Terugverdientijd/i)).toBeVisible({ timeout: 5000 });
  });
});
