import { test, expect } from "@playwright/test";
import { mockAuthenticatedAPI, mockUnauthenticatedAPI } from "./helpers/apiMocks";

test.describe("Navigation", () => {
  test("start page is accessible at root", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("login page is accessible", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/login");
    await expect(page.locator("#loginForm")).toBeVisible();
  });

  test("signup page is accessible", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/signup");
    await expect(page.locator("form")).toBeVisible();
  });

  test("privacy page is accessible", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("legal page is accessible", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/legal");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("unknown route shows 404", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/nonexistent-page");
    await expect(page.locator("h1")).toContainText("404");
  });

  test("authenticated user can navigate to profile", async ({ page }) => {
    await mockAuthenticatedAPI(page);

    await page.goto("/profile");
    await expect(page).toHaveURL(/\/profile/);
  });

  test("authenticated user can navigate to contacts", async ({ page }) => {
    await mockAuthenticatedAPI(page);

    await page.goto("/contacts");
    await expect(page).toHaveURL(/\/contacts/);
  });
});
