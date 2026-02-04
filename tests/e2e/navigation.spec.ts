import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("can navigate from homepage to Portfolio", async ({ page }) => {
    await page.goto("/");
    await page.click("a.portal[href='/portfolio/']");
    await expect(page).toHaveURL("/portfolio/");
    await expect(page.locator("h1")).toContainText("Portfolio");
  });

  test("can navigate from homepage to My World", async ({ page }) => {
    await page.goto("/");
    await page.click("a.portal[href='/leisure/']");
    await expect(page).toHaveURL("/leisure/");
    await expect(page.locator("h1")).toContainText("My World");
  });

  test("can navigate from homepage to Wiki", async ({ page }) => {
    await page.goto("/");
    await page.click("a.portal[href='/wiki/']");
    await expect(page.url()).toContain("/wiki/");
  });

  test("can navigate back to homepage from Portfolio", async ({ page }) => {
    await page.goto("/portfolio/");
    await page.click("a[href='/']");
    await expect(page).toHaveURL("/");
  });

  test("can navigate back to homepage from My World", async ({ page }) => {
    await page.goto("/leisure/");
    await page.click("a[href='/']");
    await expect(page).toHaveURL("/");
  });

  test("homepage displays all three portal links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("a.portal[href='/portfolio/']")).toBeVisible();
    await expect(page.locator("a.portal[href='/leisure/']")).toBeVisible();
    await expect(page.locator("a.portal[href='/wiki/']")).toBeVisible();
  });

  test("portal titles are displayed correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".portal-title").nth(0)).toContainText(
      "Portfolio",
    );
    await expect(page.locator(".portal-title").nth(1)).toContainText(
      "My World",
    );
    await expect(page.locator(".portal-title").nth(2)).toContainText("Wiki");
  });
});
