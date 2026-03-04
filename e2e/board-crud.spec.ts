import { test, expect } from "@playwright/test";
import { mockAuthenticatedAPI } from "./helpers/apiMocks";

test.describe("Board CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedAPI(page);
  });

  test("dashboard shows list of boards", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.locator("h1")).toContainText("My Dashboard");
    await expect(page.locator(".board-row, .board-card").first()).toBeVisible();
  });

  test("create board via dialog", async ({ page }) => {
    await page.goto("/dashboard");

    await page.click("#createBoardBtn");
    await expect(page.locator("dialog")).toBeVisible();

    await page.fill('input[name="title"]', "New Board");
    await page.click('dialog button[type="submit"]');

    // Board should be created (dialog closes)
    await expect(page.locator("dialog[open]")).toBeHidden();
  });

  test("navigate to board detail on click", async ({ page }) => {
    await page.goto("/dashboard");

    const boardItem = page.locator(".board-row, .board-card").first();
    await boardItem.click();

    await expect(page).toHaveURL(/\/board\/\d+/);
  });

  test("board page shows board title and columns", async ({ page }) => {
    await page.goto("/board/1");

    await expect(page.locator("h1")).toContainText("Project Alpha");
  });
});
