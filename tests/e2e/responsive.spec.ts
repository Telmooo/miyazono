import { test, expect } from "@playwright/test";

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
} as const;

test.describe("Responsive Behavior", () => {
  for (const [name, viewport] of Object.entries(viewports)) {
    test.describe(`${name} viewport (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
      });

      test("homepage renders correctly", async ({ page }) => {
        await page.goto("/miyazono/");
        await expect(page.locator(".portal-hub").first()).toBeVisible();
        await expect(
          page.locator(".portals-container").first().locator(".portal"),
        ).toHaveCount(3);
      });

      test("all portals are visible", async ({ page }) => {
        await page.goto("/miyazono/");
        const portals = page.locator(".portal");
        for (let i = 0; i < 3; i++) {
          await expect(portals.nth(i)).toBeVisible();
        }
      });

      test("theme toggle is visible", async ({ page }) => {
        await page.goto("/miyazono/");
        await expect(page.locator("#theme-toggle")).toBeVisible();
      });

      test("portals are clickable", async ({ page }) => {
        await page.goto("/miyazono/");
        const portfolio = page.locator("a.portal[href='/miyazono/portfolio/']");
        await expect(portfolio).toBeEnabled();
      });

      test("hub name is visible", async ({ page }) => {
        await page.goto("/miyazono/");
        await expect(page.locator(".hub-name").first()).toBeVisible();
        await expect(page.locator(".name-english").first()).toContainText(
          "Telmo Baptista",
        );
      });
    });
  }

  test("portal layout is single column on mobile", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/miyazono/");

    const container = page.locator(".portals-container").first();
    const gridColumns = await container.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns,
    );

    // On mobile (max-width: 768px), should be single column (1fr)
    expect(gridColumns).toMatch(/^\d+(\.\d+)?px$/);
  });

  test("portal layout is 3 columns on desktop", async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto("/miyazono/");

    const container = page.locator(".portals-container").first();
    const gridColumns = await container.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns,
    );

    // On desktop, should be 3 columns (three values)
    const columns = gridColumns.split(" ").filter((v) => v.trim());
    expect(columns.length).toBe(3);
  });

  test("portal size reduces on smaller screens", async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto("/miyazono/");

    const portal = page
      .locator(".portals-container")
      .first()
      .locator(".portal")
      .first();
    const desktopWidth = await portal.evaluate(
      (el) => getComputedStyle(el).width,
    );

    await page.setViewportSize(viewports.mobile);

    const mobileWidth = await portal.evaluate(
      (el) => getComputedStyle(el).width,
    );

    // Portal should be smaller on mobile
    expect(parseFloat(mobileWidth)).toBeLessThan(parseFloat(desktopWidth));
  });

  test("font sizes adjust on mobile", async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto("/miyazono/");

    const nameEnglish = page.locator(".name-english").first();
    const desktopFontSize = await nameEnglish.evaluate(
      (el) => getComputedStyle(el).fontSize,
    );

    await page.setViewportSize(viewports.mobile);

    const mobileFontSize = await nameEnglish.evaluate(
      (el) => getComputedStyle(el).fontSize,
    );

    // Font should be smaller on mobile
    expect(parseFloat(mobileFontSize)).toBeLessThan(
      parseFloat(desktopFontSize),
    );
  });
});
