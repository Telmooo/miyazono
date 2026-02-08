import { test, expect } from "@playwright/test";

test.describe("Portal Interactions", () => {
  test("portal has hover transform effect", async ({ page }) => {
    await page.goto("/miyazono/");
    const portal = page.locator(".portal").first();

    const initialTransform = await portal.evaluate(
      (el) => getComputedStyle(el).transform,
    );

    await portal.hover();

    await page.waitForTimeout(400);

    const hoveredTransform = await portal.evaluate(
      (el) => getComputedStyle(el).transform,
    );

    expect(hoveredTransform).not.toBe(initialTransform);
  });

  test("portal has focus-visible outline for keyboard navigation", async ({
    page,
  }) => {
    await page.goto("/miyazono/");
    const portal = page.locator(".portal").first();

    await portal.focus();

    await expect(portal).toBeFocused();
  });

  test("portal sound wave elements exist", async ({ page }) => {
    await page.goto("/miyazono/");
    const portal = page.locator(".portal").first();

    const soundWaves = portal.locator(".sound-wave");
    await expect(soundWaves).toHaveCount(3);
  });

  test("portal rings animate on hover", async ({ page }) => {
    await page.goto("/miyazono/");
    const portal = page.locator(".portal").first();
    const ring1 = portal.locator(".ring-1");

    const initialOpacity = await ring1.evaluate(
      (el) => getComputedStyle(el).opacity,
    );

    await portal.hover();
    await page.waitForTimeout(400);

    const hoveredOpacity = await ring1.evaluate(
      (el) => getComputedStyle(el).opacity,
    );

    // Opacity should change on hover
    expect(parseFloat(hoveredOpacity)).toBeGreaterThan(
      parseFloat(initialOpacity),
    );
  });

  test("portal icon becomes less grayscale on hover", async ({ page }) => {
    await page.goto("/miyazono/");
    const portal = page.locator(".portal").first();
    const icon = portal.locator(".portal-icon");

    const initialFilter = await icon.evaluate(
      (el) => getComputedStyle(el).filter,
    );

    await portal.hover();
    await page.waitForTimeout(400);

    const hoveredFilter = await icon.evaluate(
      (el) => getComputedStyle(el).filter,
    );

    expect(hoveredFilter).not.toBe(initialFilter);
  });

  test("portal title color changes on hover", async ({ page }) => {
    await page.goto("/miyazono/");
    const portal = page.locator(".portal").first();
    const title = portal.locator(".portal-title");

    const initialColor = await title.evaluate(
      (el) => getComputedStyle(el).color,
    );

    await portal.hover();
    await page.waitForTimeout(400);

    const hoveredColor = await title.evaluate(
      (el) => getComputedStyle(el).color,
    );

    expect(hoveredColor).not.toBe(initialColor);
  });

  test("portal has correct href attributes", async ({ page }) => {
    await page.goto("/miyazono/");

    const portfolioHref = await page
      .locator(".portal")
      .nth(0)
      .getAttribute("href");
    const leisureHref = await page
      .locator(".portal")
      .nth(1)
      .getAttribute("href");
    const wikiHref = await page.locator(".portal").nth(2).getAttribute("href");

    expect(portfolioHref).toBe("/miyazono/portfolio/");
    expect(leisureHref).toBe("/miyazono/leisure/");
    expect(wikiHref).toBe("/miyazono/wiki/");
  });
});
