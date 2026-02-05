import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("homepage portal layout", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("portfolio page", async ({ page }) => {
    await page.goto("/miyazono/portfolio/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("portfolio.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("leisure page", async ({ page }) => {
    await page.goto("/miyazono/leisure/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("leisure.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("wiki index", async ({ page }) => {
    await page.goto("/miyazono/wiki/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("wiki.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("404 page", async ({ page }) => {
    await page.goto("/miyazono/nonexistent-page");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("404.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
});
