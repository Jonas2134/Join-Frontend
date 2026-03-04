import { test, expect } from "@playwright/test";
import { mockAuthenticatedAPI } from "./helpers/apiMocks";

test.describe("Contacts", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedAPI(page);
  });

  test("contacts page loads", async ({ page }) => {
    await page.goto("/contacts");

    await expect(page).toHaveURL(/\/contacts/);
  });

  test("contacts page shows contact tabs", async ({ page }) => {
    await page.goto("/contacts");

    // Should have tab navigation
    await expect(page.locator("text=Find Contacts").or(page.locator("text=My Contacts"))).toBeVisible();
  });
});
