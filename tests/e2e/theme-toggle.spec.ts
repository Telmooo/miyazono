import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("theme toggle button is visible", async ({ page }) => {
    await page.goto("/miyazono/");
    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toBeVisible();
  });

  test("theme toggle button has accessible label", async ({ page }) => {
    await page.goto("/miyazono/");
    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toHaveAttribute("aria-label", "Toggle dark mode");
  });

  test("clicking theme toggle switches theme", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    const html = page.locator("html");
    const toggle = page.locator("#theme-toggle");

    const initialTheme = await html.getAttribute("data-theme");

    await toggle.click();

    const newTheme = await html.getAttribute("data-theme");
    expect(newTheme).not.toBe(initialTheme);
  });

  test("clicking theme toggle twice returns to original theme", async ({
    page,
  }) => {
    await page.goto("/miyazono/");
    const html = page.locator("html");
    const toggle = page.locator("#theme-toggle");

    const initialTheme = await html.getAttribute("data-theme");

    await toggle.click();
    await toggle.click();

    const finalTheme = await html.getAttribute("data-theme");
    expect(finalTheme).toBe(initialTheme);
  });

  test("theme preference persists in localStorage", async ({ page }) => {
    await page.goto("/miyazono/");
    const toggle = page.locator("#theme-toggle");

    await page.evaluate(() => localStorage.setItem("theme", "dark"));
    await page.reload();

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await toggle.click();

    const savedTheme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(savedTheme).toBe("light");
  });

  test("respects system dark mode preference when no saved theme", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/miyazono/");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");
  });

  test("respects system light mode preference when no saved theme", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/miyazono/");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("theme toggle shows correct icon for light mode", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();

    const sunIcon = page.locator("#theme-toggle .sun-icon");
    const moonIcon = page.locator("#theme-toggle .moon-icon");

    const sunOpacity = await sunIcon.evaluate(
      (el) => getComputedStyle(el).opacity,
    );
    expect(parseFloat(sunOpacity)).toBe(1);

    const moonOpacity = await moonIcon.evaluate(
      (el) => getComputedStyle(el).opacity,
    );
    expect(parseFloat(moonOpacity)).toBe(0);
  });

  test("theme toggle shows correct icon for dark mode", async ({ page }) => {
    await page.goto("/miyazono/");
    await page.evaluate(() => localStorage.setItem("theme", "dark"));
    await page.reload();

    const sunIcon = page.locator("#theme-toggle .sun-icon");
    const moonIcon = page.locator("#theme-toggle .moon-icon");

    const moonOpacity = await moonIcon.evaluate(
      (el) => getComputedStyle(el).opacity,
    );
    expect(parseFloat(moonOpacity)).toBe(1);

    const sunOpacity = await sunIcon.evaluate(
      (el) => getComputedStyle(el).opacity,
    );
    expect(parseFloat(sunOpacity)).toBe(0);
  });
});
