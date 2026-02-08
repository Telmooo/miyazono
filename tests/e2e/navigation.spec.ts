import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("can navigate from homepage to Portfolio", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.click("a.portal[href='/miyazono/portfolio/']");
    await expect(page).toHaveURL("/miyazono/portfolio/");
    await expect(page.locator("h1")).toContainText("Portfolio");
  });

  test("can navigate from homepage to My World", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.click("a.portal[href='/miyazono/leisure/']");
    await expect(page).toHaveURL("/miyazono/leisure/");
    await expect(page.locator("h1")).toContainText("My World");
  });

  test("can navigate from homepage to Wiki", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.click("a.portal[href='/miyazono/wiki/']");
    expect(page.url()).toContain("/miyazono/wiki/");
  });

  test("can navigate back to homepage from Portfolio", async ({ page }) => {
    await page.goto("/miyazono/portfolio/");
    await page.click("a[href='/miyazono/']");
    await expect(page).toHaveURL("/miyazono/");
  });

  test("can navigate back to homepage from My World", async ({ page }) => {
    await page.goto("/miyazono/leisure/");
    await page.click("a[href='/miyazono/']");
    await expect(page).toHaveURL("/miyazono/");
  });

  test("homepage displays all three portal links", async ({ page }) => {
    await page.goto("/miyazono/");
    await expect(page.locator("a.portal[href='/miyazono/portfolio/']")).toBeVisible();
    await expect(page.locator("a.portal[href='/miyazono/leisure/']")).toBeVisible();
    await expect(page.locator("a.portal[href='/miyazono/wiki/']")).toBeVisible();
  });

  test("portal titles are displayed correctly", async ({ page }) => {
    await page.goto("/miyazono/");
    await expect(page.locator(".portal-title").nth(0)).toContainText(
      "Portfolio",
    );
    await expect(page.locator(".portal-title").nth(1)).toContainText(
      "My World",
    );
    await expect(page.locator(".portal-title").nth(2)).toContainText("Wiki");
  });
});
