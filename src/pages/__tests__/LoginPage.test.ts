import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../../core/store/AuthStore", () => ({
  authStore: {
    login: vi.fn(),
    guestLogin: vi.fn(),
    currentUser: null,
    isGuest: false,
  },
}));

vi.mock("../../core/router", () => ({
  router: { navigate: vi.fn() },
}));

vi.mock("../../core/ToastManager", () => ({
  toastManager: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { LoginPage } from "../LoginPage";
import { authStore } from "../../core/store/AuthStore";
import { router } from "../../core/router";
import { toastManager } from "../../core/ToastManager";

describe("LoginPage", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "app";
    document.body.appendChild(root);

    vi.mocked(authStore.login).mockReset();
    vi.mocked(authStore.guestLogin).mockReset();
    vi.mocked(router.navigate).mockReset();
    vi.mocked(toastManager.error).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a login form", () => {
    const page = new LoginPage();
    page.attachTo(root);

    const form = root.querySelector("#loginForm");
    expect(form).not.toBeNull();
  });

  it("renders username and password inputs", () => {
    const page = new LoginPage();
    page.attachTo(root);

    const usernameInput = root.querySelector('input[name="username"]');
    const passwordInput = root.querySelector('input[name="password"]');
    expect(usernameInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();
  });

  it("renders login and guest login buttons", () => {
    const page = new LoginPage();
    page.attachTo(root);

    const submitBtn = root.querySelector('button[type="submit"]');
    const guestBtn = root.querySelector("#guestLoginBtn");
    expect(submitBtn).not.toBeNull();
    expect(guestBtn).not.toBeNull();
  });

  it("navigates to dashboard on successful login", async () => {
    vi.mocked(authStore.login).mockResolvedValue(undefined);

    const page = new LoginPage();
    page.attachTo(root);

    const usernameInput = root.querySelector(
      'input[name="username"]',
    ) as HTMLInputElement;
    const passwordInput = root.querySelector(
      'input[name="password"]',
    ) as HTMLInputElement;

    usernameInput.value = "testuser";
    passwordInput.value = "password123";

    const form = root.querySelector("#loginForm") as HTMLFormElement;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    // Wait for async handlers to resolve
    await vi.waitFor(() => {
      expect(authStore.login).toHaveBeenCalledWith("testuser", "password123", false);
      expect(router.navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error toast on failed login", async () => {
    vi.mocked(authStore.login).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    const page = new LoginPage();
    page.attachTo(root);

    const usernameInput = root.querySelector(
      'input[name="username"]',
    ) as HTMLInputElement;
    const passwordInput = root.querySelector(
      'input[name="password"]',
    ) as HTMLInputElement;

    usernameInput.value = "wronguser";
    passwordInput.value = "wrongpass";

    const form = root.querySelector("#loginForm") as HTMLFormElement;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(toastManager.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid credentials"),
      );
    });
  });

  it("navigates to dashboard on successful guest login", async () => {
    vi.mocked(authStore.guestLogin).mockResolvedValue(undefined);

    const page = new LoginPage();
    page.attachTo(root);

    const guestBtn = root.querySelector("#guestLoginBtn") as HTMLButtonElement;
    guestBtn.click();

    await vi.waitFor(() => {
      expect(authStore.guestLogin).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error toast on failed guest login", async () => {
    vi.mocked(authStore.guestLogin).mockRejectedValue(
      new Error("Guest login unavailable"),
    );

    const page = new LoginPage();
    page.attachTo(root);

    const guestBtn = root.querySelector("#guestLoginBtn") as HTMLButtonElement;
    guestBtn.click();

    await vi.waitFor(() => {
      expect(toastManager.error).toHaveBeenCalledWith(
        expect.stringContaining("Guest login unavailable"),
      );
    });
  });

  it("cleans up event listeners on unmount", () => {
    const page = new LoginPage();
    page.attachTo(root);
    page.unmount();

    // Verify no errors on double unmount
    expect(() => page.unmount()).not.toThrow();
  });
});
