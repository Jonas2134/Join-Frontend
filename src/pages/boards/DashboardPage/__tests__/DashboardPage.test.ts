import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createBoards } from "../../../../../tests/helpers/factories";

vi.mock("../../../../core/store/BoardStore", () => ({
  boardStore: {
    boards: [],
    singleBoard: null,
    columns: {},
    tasks: {},
    loadDashboard: vi.fn(),
    createBoard: vi.fn(),
    deleteBoard: vi.fn(),
    archiveBoard: vi.fn(),
  },
}));

vi.mock("../../../../core/store/AuthStore", () => ({
  isGuest: vi.fn(() => false),
  getCurrentUser: vi.fn(() => ({ id: 1, username: "testuser", email: "test@test.com", is_guest: false })),
}));

vi.mock("../../../../core/router", () => ({
  router: { navigate: vi.fn() },
}));

vi.mock("../../../../core/ToastManager", () => ({
  toastManager: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { DashboardPage } from "../DashboardPage";
import { boardStore } from "../../../../core/store/BoardStore";
import { isGuest } from "../../../../core/store/AuthStore";
import { toastManager } from "../../../../core/ToastManager";

describe("DashboardPage", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "app";
    document.body.appendChild(root);

    vi.mocked(boardStore.loadDashboard).mockReset();
    vi.mocked(boardStore.loadDashboard).mockResolvedValue([]);
    vi.mocked(toastManager.info).mockReset();
    vi.mocked(toastManager.error).mockReset();
    vi.mocked(toastManager.success).mockReset();
    boardStore.boards = [];
    vi.mocked(isGuest).mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the dashboard page with title", () => {
    const page = new DashboardPage();
    page.attachTo(root);

    const title = root.querySelector("h1");
    expect(title?.textContent).toBe("My Dashboard");
  });

  it("renders the dashboard page element", () => {
    const page = new DashboardPage();
    page.attachTo(root);

    const dashboardPage = root.querySelector("#dashboardPage");
    expect(dashboardPage).not.toBeNull();
  });

  it("loads dashboard data on mount", async () => {
    const mockBoards = [
      createBoards({ id: "1", title: "Active Board" }),
    ];
    vi.mocked(boardStore.loadDashboard).mockResolvedValue(mockBoards);

    const page = new DashboardPage();
    page.attachTo(root);

    await vi.waitFor(() => {
      expect(boardStore.loadDashboard).toHaveBeenCalled();
    });
  });

  it("shows guest info toast when user is guest", () => {
    vi.mocked(isGuest).mockReturnValue(true);

    const page = new DashboardPage();
    page.attachTo(root);

    expect(toastManager.info).toHaveBeenCalledWith(
      expect.stringContaining("guest"),
    );
  });

  it("does not show guest toast for normal users", () => {

    const page = new DashboardPage();
    page.attachTo(root);

    expect(toastManager.info).not.toHaveBeenCalled();
  });

  it("renders empty state when no boards", () => {
    const page = new DashboardPage();
    page.attachTo(root);

    const section = root.querySelector("#dashboardsection");
    expect(section).not.toBeNull();
  });

  it("filters to show only active boards", () => {
    const page = new DashboardPage();

    const allBoards = [
      createBoards({ id: "1", title: "Active", is_active: true }),
      createBoards({ id: "2", title: "Archived", is_active: false }),
    ];

    const filtered = (page as any).filterBoards(allBoards);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Active");
  });

  it("cleans up on unmount", () => {
    const page = new DashboardPage();
    page.attachTo(root);

    expect(() => page.unmount()).not.toThrow();
  });
});
