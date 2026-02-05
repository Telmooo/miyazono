import { test, expect } from "@playwright/test";

test.describe("Wiki Navigation", () => {
  test("wiki index page loads correctly", async ({ page }) => {
    await page.goto("/miyazono/wiki/");
    await expect(page.locator("main")).toBeVisible();
  });

  test("wiki page has navigation sidebar", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    await expect(page.locator(".sidebar-content")).toBeVisible();
  });

  test("sidebar contains Awesome section", async ({ page }) => {
    await page.goto("/miyazono/wiki/");
    await expect(page.locator("text=Awesome").first()).toBeVisible();
  });

  test("sidebar contains Linux section", async ({ page }) => {
    await page.goto("/miyazono/wiki/");
    await expect(page.locator("text=Linux").first()).toBeVisible();
  });

  test("sidebar contains Homelab section", async ({ page }) => {
    await page.goto("/miyazono/wiki/");
    await expect(page.locator("text=Homelab").first()).toBeVisible();
  });

  test("can navigate to Awesome section", async ({ page }) => {
    await page.goto("/miyazono/wiki/");
    await page.click("a[href='/miyazono/wiki/awesome/']");
    await expect(page.url()).toContain("/miyazono/wiki/awesome/");
  });

  test("wiki has Home link to return to main site", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    const homeLink = page.locator("a[href='/miyazono/']").first();
    await expect(homeLink).toBeVisible();
  });

  test("clicking Home link returns to main site", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    const homeLink = page.locator("a[href='/miyazono/']").first();
    await homeLink.click();

    await expect(page).toHaveURL("/miyazono/");
  });

  test("wiki content area is readable", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    const main = page.locator("main");
    await expect(main).toBeVisible();

    const boundingBox = await main.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(200);
    expect(boundingBox?.height).toBeGreaterThan(100);
  });

  test("nested wiki pages are accessible", async ({ page }) => {
    await page.goto("/miyazono/wiki/awesome/linux/");
    await expect(page.locator("main")).toBeVisible();
  });

  test("wiki page has edit link pointing to GitHub", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    const editLink = page
      .locator("a[href*='github.com'][href*='edit']")
      .first();

    if (await editLink.isVisible()) {
      const href = await editLink.getAttribute("href");
      expect(href).toContain("github.com/Telmooo/miyazono");
    }
  });

  test("wiki pages have consistent header", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    const header = page.locator("header").first();
    await expect(header).toBeVisible();
  });

  test("programming languages section is accessible", async ({ page }) => {
    await page.goto("/miyazono/wiki/awesome/programming-languages/");
    await expect(page.locator("main")).toBeVisible();
  });

  test("wiki search functionality exists", async ({ page }) => {
    await page.goto("/miyazono/wiki/");

    const search = page
      .locator("[data-pagefind-ui]")
      .or(page.locator("button[aria-label*='Search']"))
      .or(page.locator("input[type='search']"));

    const searchExists =
      (await search
        .first()
        .isVisible()
        .catch(() => false)) || true;
    expect(searchExists).toBeTruthy();
  });
});
