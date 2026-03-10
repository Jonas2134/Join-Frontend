import { test, expect } from "@playwright/test";
import { mockAuthenticatedAPI } from "./helpers/apiMocks";

test.describe("Profile", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedAPI(page);
  });

  test("profile page loads user data", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.locator("text=testuser")).toBeVisible();
  });

  test("profile page shows user email", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.locator("text=test@example.com")).toBeVisible();
  });
});
