import { test, expect } from "@playwright/test";
import { mockAuthenticatedAPI, mockUnauthenticatedAPI, mockLoginFailure } from "./helpers/apiMocks";

test.describe("Authentication", () => {
  test("login with valid credentials redirects to dashboard", async ({ page }) => {
    await mockAuthenticatedAPI(page);

    await page.goto("/login");
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("login with invalid credentials shows error toast", async ({ page }) => {
    await mockLoginFailure(page);

    await page.goto("/login");
    await page.fill('input[name="username"]', "wronguser");
    await page.fill('input[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    await expect(page.locator(".toast-error")).toBeVisible();
  });

  test("guest login redirects to dashboard", async ({ page }) => {
    await mockAuthenticatedAPI(page);

    await page.goto("/login");
    await page.click("#guestLoginBtn");

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("public routes are accessible without auth", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/login");
    await expect(page.locator("#loginForm")).toBeVisible();

    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/legal");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("unauthenticated user on protected route redirects to login", async ({ page }) => {
    await mockUnauthenticatedAPI(page);

    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
  });
});
