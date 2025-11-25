import { test, expect } from "@playwright/test";

test.describe("Thuisbatterij Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/thuisbatterij");
  });

  test("should display calculator form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Thuisbatterij/i })).toBeVisible();
  });

  test("should show savings with and without saldering", async ({ page }) => {
    await page.getByLabel(/Zonnepaneel vermogen/i).fill("5");
    await page.getByLabel(/Jaarlijks verbruik/i).fill("3500");

    await expect(page.getByText(/Besparing/i)).toBeVisible({ timeout: 5000 });
  });

  test("should calculate payback time when investment costs provided", async ({ page }) => {
    await page.getByLabel(/Zonnepaneel vermogen/i).fill("5");
    await page.getByLabel(/Investeringskosten/i).fill("8000");

    await expect(page.getByText(/Terugverdientijd/i)).toBeVisible({ timeout: 5000 });
  });
});
