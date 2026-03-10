import { describe, it, expect, vi } from "vitest";
import { BasePage, type Layout } from "../BasePage";

class TestPage extends BasePage {
  public renderCalled = false;

  constructor(layout?: Layout) {
    super(layout);
  }

  render(): HTMLElement {
    this.renderCalled = true;
    const div = document.createElement("div");
    div.textContent = "Test Page Content";
    return this.wrapWithLayout(div);
  }

  mount(): void {
    // Test mount
  }
}

class TestPageWithoutMount extends BasePage {
  render(): HTMLElement {
    const div = document.createElement("div");
    div.textContent = "No mount";
    return div;
  }
}

describe("BasePage", () => {
  describe("attachTo", () => {
    it("calls render and appends to root", () => {
      const root = document.createElement("div");
      const page = new TestPage();

      page.attachTo(root);

      expect(page.renderCalled).toBe(true);
      expect(root.textContent).toBe("Test Page Content");
    });

    it("clears root innerHTML before appending", () => {
      const root = document.createElement("div");
      root.innerHTML = "<p>Old content</p>";

      const page = new TestPage();
      page.attachTo(root);

      expect(root.textContent).toBe("Test Page Content");
      expect(root.querySelector("p")).toBeNull();
    });

    it("calls mount after appending", () => {
      const root = document.createElement("div");
      const page = new TestPage();
      const mountSpy = vi.spyOn(page, "mount");

      page.attachTo(root);

      expect(mountSpy).toHaveBeenCalled();
    });

    it("works without mount method defined", () => {
      const root = document.createElement("div");
      const page = new TestPageWithoutMount();

      expect(() => page.attachTo(root)).not.toThrow();
      expect(root.textContent).toBe("No mount");
    });

    it("calls unmount if already mounted", () => {
      const root = document.createElement("div");
      const page = new TestPage();
      const unmountSpy = vi.spyOn(page, "unmount");

      page.attachTo(root);
      page.attachTo(root);

      expect(unmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("unmount", () => {
    it("clears all event listeners via EventManager", () => {
      const page = new TestPage();
      const root = document.createElement("div");
      page.attachTo(root);

      const handler = vi.fn();
      (page as any).events.on(window, "test", handler);

      page.unmount();
      window.dispatchEvent(new Event("test"));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("wrapWithLayout", () => {
    it("wraps content with layout when layout is provided", () => {
      const layoutEl = document.createElement("div");
      layoutEl.classList.add("layout");

      const mockLayout: Layout = {
        render: () => layoutEl,
        setContent: (content) => {
          layoutEl.appendChild(content);
        },
      };

      const page = new TestPage(mockLayout);
      const root = document.createElement("div");
      page.attachTo(root);

      expect(root.querySelector(".layout")).not.toBeNull();
      expect(root.textContent).toContain("Test Page Content");
    });

    it("returns content directly when no layout", () => {
      const page = new TestPage();
      const root = document.createElement("div");
      page.attachTo(root);

      expect(root.querySelector(".layout")).toBeNull();
      expect(root.textContent).toBe("Test Page Content");
    });
  });
});
