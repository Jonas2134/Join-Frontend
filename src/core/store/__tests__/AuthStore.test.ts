import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createAuthStatusResponse, createAuthUser } from "../../../../tests/helpers/factories";

vi.mock("../../api/HttpClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
  },
}));

vi.mock("../../router", () => ({
  router: { navigate: vi.fn() },
}));

import { AuthStore } from "../AuthStore";
import { http } from "../../api/HttpClient";
import { router } from "../../router";

describe("AuthStore", () => {
  let store: AuthStore;

  beforeEach(() => {
    store = new AuthStore();
    vi.mocked(http.get).mockReset();
    vi.mocked(http.post).mockReset();
    vi.mocked(router.navigate).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // register
  // ============================================

  describe("register", () => {
    it("calls http.post with registration data", async () => {
      vi.mocked(http.post).mockResolvedValue(undefined);

      await store.register("user1", "user1@test.com", "pass123", "pass123");

      expect(http.post).toHaveBeenCalledWith("/register/", {
        username: "user1",
        email: "user1@test.com",
        password: "pass123",
        repeated_password: "pass123",
      });
    });
  });

  // ============================================
  // login
  // ============================================

  describe("login", () => {
    it("posts credentials and checks auth status", async () => {
      vi.mocked(http.post).mockResolvedValue(undefined);
      const authResponse = createAuthStatusResponse();
      vi.mocked(http.get).mockResolvedValue(authResponse);

      await store.login("testuser", "password", true);

      expect(http.post).toHaveBeenCalledWith("/login/", {
        username: "testuser",
        password: "password",
        remember_me: true,
      });
      expect(http.get).toHaveBeenCalledWith("/auth/status/");
      expect(store.currentUser).toEqual(authResponse.user);
      expect(store.isGuest).toBe(false);
    });
  });

  // ============================================
  // guestLogin
  // ============================================

  describe("guestLogin", () => {
    it("posts to guest login and checks auth status", async () => {
      vi.mocked(http.post).mockResolvedValue(undefined);
      const guestUser = createAuthUser({ is_guest: true, username: "guest" });
      vi.mocked(http.get).mockResolvedValue(
        createAuthStatusResponse({ user: guestUser }),
      );

      await store.guestLogin();

      expect(http.post).toHaveBeenCalledWith("/guest-login/");
      expect(store.currentUser).toEqual(guestUser);
      expect(store.isGuest).toBe(true);
    });
  });

  // ============================================
  // logout
  // ============================================

  describe("logout", () => {
    it("posts to logout and clears user state", async () => {
      store.currentUser = createAuthUser();
      store.isGuest = false;
      vi.mocked(http.post).mockResolvedValue(undefined);

      await store.logout();

      expect(http.post).toHaveBeenCalledWith("/logout/");
      expect(store.currentUser).toBeNull();
      expect(store.isGuest).toBe(false);
    });
  });

  // ============================================
  // checkAuthStatus
  // ============================================

  describe("checkAuthStatus", () => {
    it("returns true and sets user on success", async () => {
      const authResponse = createAuthStatusResponse();
      vi.mocked(http.get).mockResolvedValue(authResponse);

      const result = await store.checkAuthStatus();

      expect(result).toBe(true);
      expect(store.currentUser).toEqual(authResponse.user);
      expect(store.isGuest).toBe(false);
    });

    it("returns false and clears user on failure", async () => {
      store.currentUser = createAuthUser();
      vi.mocked(http.get).mockRejectedValue(new Error("Network error"));

      const result = await store.checkAuthStatus();

      expect(result).toBe(false);
      expect(store.currentUser).toBeNull();
    });

    it("sets isGuest to true for guest users", async () => {
      const guestUser = createAuthUser({ is_guest: true });
      vi.mocked(http.get).mockResolvedValue(
        createAuthStatusResponse({ user: guestUser }),
      );

      await store.checkAuthStatus();

      expect(store.isGuest).toBe(true);
    });
  });

  // ============================================
  // changePassword
  // ============================================

  describe("changePassword", () => {
    it("posts password change data", async () => {
      vi.mocked(http.post).mockResolvedValue(undefined);

      await store.changePassword("oldpass", "newpass", "newpass");

      expect(http.post).toHaveBeenCalledWith("/password/change/", {
        old_password: "oldpass",
        new_password: "newpass",
        repeated_new_password: "newpass",
      });
    });
  });

  // ============================================
  // refresh
  // ============================================

  describe("refresh", () => {
    it("calls native fetch with POST to refresh endpoint", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      vi.stubGlobal("fetch", fetchMock);

      await store.refresh();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/token/refresh/"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });

    it("throws error when refresh fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 401 }),
      );

      await expect(store.refresh()).rejects.toThrow("Refresh failed: 401");
    });
  });

  // ============================================
  // handleUnauthorized (tested via setUnauthorizedHandler)
  // ============================================

  describe("handleUnauthorized", () => {
    it("sets unauthorized handler on the http client", () => {
      expect(http.setUnauthorizedHandler).toHaveBeenCalled();
    });

    it("navigates to /login on refresh failure for protected routes", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 401 }),
      );

      window.history.pushState({}, "", "/dashboard");

      // Get the handler that was set on http
      const handlerCall = vi.mocked(http.setUnauthorizedHandler).mock.calls;
      const handler = handlerCall[handlerCall.length - 1][0];

      await expect(handler()).rejects.toThrow("Session expired");
      expect(store.currentUser).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith("/login");
    });

    it("does not navigate when on a public route", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 401 }),
      );

      window.history.pushState({}, "", "/login");

      const handlerCall = vi.mocked(http.setUnauthorizedHandler).mock.calls;
      const handler = handlerCall[handlerCall.length - 1][0];

      await expect(handler()).rejects.toThrow("Session expired");
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("deduplicates concurrent refresh calls", async () => {
      let resolveRefresh: () => void;
      const fetchMock = vi.fn().mockImplementation(
        () =>
          new Promise<{ ok: boolean; status: number }>((resolve) => {
            resolveRefresh = () => resolve({ ok: true, status: 200 });
          }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const handlerCall = vi.mocked(http.setUnauthorizedHandler).mock.calls;
      const handler = handlerCall[handlerCall.length - 1][0];

      const promise1 = handler();
      const promise2 = handler();

      resolveRefresh!();

      await Promise.all([promise1, promise2]);

      // fetch should only have been called once (deduplication)
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
