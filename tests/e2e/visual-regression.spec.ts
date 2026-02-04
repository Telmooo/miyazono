import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("homepage portal layout", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("portfolio page", async ({ page }) => {
    await page.goto("/portfolio/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("portfolio.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("leisure page", async ({ page }) => {
    await page.goto("/leisure/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("leisure.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("wiki index", async ({ page }) => {
    await page.goto("/wiki/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("wiki.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("404 page", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("404.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
