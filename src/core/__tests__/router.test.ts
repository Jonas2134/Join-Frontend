import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Router, initRouter } from "../router";
import { BasePage } from "../../components/bases/BasePage";

class MockPage extends BasePage {
  public receivedParams: Record<string, string> | undefined;
  public mountCalled = false;
  public unmountCalled = false;

  constructor(params?: Record<string, string>) {
    super();
    this.receivedParams = params;
  }

  render(): HTMLElement {
    const div = document.createElement("div");
    div.textContent = "MockPage";
    return div;
  }

  mount(): void {
    this.mountCalled = true;
  }

  unmount(): void {
    super.unmount();
    this.unmountCalled = true;
  }
}

class AnotherMockPage extends BasePage {
  constructor(_params?: Record<string, string>) {
    super();
  }

  render(): HTMLElement {
    const div = document.createElement("div");
    div.textContent = "AnotherPage";
    return div;
  }
}

describe("Router", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "app";
    document.body.appendChild(root);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // initRouter
  // ============================================

  describe("initRouter", () => {
    it("compiles path patterns into regex", () => {
      window.history.pushState({}, "", "/dashboard");

      const router = initRouter(root, [
        { path: "/dashboard", component: MockPage },
        { path: "/board/:id", component: MockPage },
      ]);

      expect(router).toBeInstanceOf(Router);
    });

    it("renders the current route on initialization", () => {
      window.history.pushState({}, "", "/dashboard");

      initRouter(root, [
        { path: "/dashboard", component: MockPage },
      ]);

      expect(root.textContent).toBe("MockPage");
    });
  });

  // ============================================
  // navigate
  // ============================================

  describe("navigate", () => {
    it("pushes state and renders the new route", () => {
      window.history.pushState({}, "", "/dashboard");

      const router = initRouter(root, [
        { path: "/dashboard", component: MockPage },
        { path: "/profile", component: AnotherMockPage },
      ]);

      router.navigate("/profile");

      expect(location.pathname).toBe("/profile");
      expect(root.textContent).toBe("AnotherPage");
    });
  });

  // ============================================
  // render
  // ============================================

  describe("render", () => {
    it("matches route and instantiates the correct component", () => {
      window.history.pushState({}, "", "/dashboard");

      initRouter(root, [
        { path: "/dashboard", component: MockPage },
        { path: "/profile", component: AnotherMockPage },
      ]);

      expect(root.textContent).toBe("MockPage");
    });

    it("extracts params from dynamic routes", () => {
      window.history.pushState({}, "", "/board/42");

      let capturedParams: Record<string, string> | undefined;
      class ParamCapturePage extends BasePage {
        constructor(params?: Record<string, string>) {
          super();
          capturedParams = params;
        }
        render(): HTMLElement {
          return document.createElement("div");
        }
      }

      initRouter(root, [
        { path: "/board/:id", component: ParamCapturePage },
      ]);

      expect(capturedParams).toEqual({ id: "42" });
    });

    it("shows 404 for unmatched routes", () => {
      window.history.pushState({}, "", "/unknown-route");

      initRouter(root, [
        { path: "/dashboard", component: MockPage },
      ]);

      expect(root.innerHTML).toContain("404");
    });

    it("calls unmount on previous page before rendering new one", () => {
      window.history.pushState({}, "", "/dashboard");

      const unmountSpy = vi.spyOn(MockPage.prototype, "unmount");

      const router = initRouter(root, [
        { path: "/dashboard", component: MockPage },
        { path: "/profile", component: AnotherMockPage },
      ]);

      router.navigate("/profile");

      expect(unmountSpy).toHaveBeenCalled();
    });

    it("handles multiple path parameters", () => {
      window.history.pushState({}, "", "/board/1/task/5");

      let capturedParams: Record<string, string> | undefined;
      class MultiParamPage extends BasePage {
        constructor(params?: Record<string, string>) {
          super();
          capturedParams = params;
        }
        render(): HTMLElement {
          return document.createElement("div");
        }
      }

      initRouter(root, [
        { path: "/board/:boardId/task/:taskId", component: MultiParamPage },
      ]);

      expect(capturedParams).toEqual({ boardId: "1", taskId: "5" });
    });
  });
});
