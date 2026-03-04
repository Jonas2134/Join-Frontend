import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { BasePageController } from "../BasePageController";

vi.mock("../../../core/router", () => ({
  router: { navigate: vi.fn() },
}));

vi.mock("../../../core/ToastManager", () => ({
  toastManager: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { router } from "../../../core/router";
import { toastManager } from "../../../core/ToastManager";

class TestController extends BasePageController {
  public exposeFindClosestElement<T extends HTMLElement>(
    target: EventTarget | null,
    selector: string,
  ): T | null {
    return this.findClosestElement<T>(target, selector);
  }

  public exposeGetDatasetFromClosest(
    element: HTMLElement,
    selector: string,
    dataKey: string,
  ): string | null {
    return this.getDatasetFromClosest(element, selector, dataKey);
  }

  public exposeGetFormValue(form: HTMLFormElement, fieldName: string): string {
    return this.getFormValue(form, fieldName);
  }

  public exposePerformStoreOperation(
    operation: () => Promise<unknown>,
    operationName: string,
  ) {
    return this.performStoreOperation(operation, operationName);
  }

  public exposeRedirectTo(path: string): void {
    this.redirectTo(path);
  }
}

describe("BasePageController", () => {
  let controller: TestController;

  beforeEach(() => {
    controller = new TestController();
    vi.mocked(router.navigate).mockReset();
    vi.mocked(toastManager.success).mockReset();
    vi.mocked(toastManager.error).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // findClosestElement
  // ============================================

  describe("findClosestElement", () => {
    it("finds closest matching HTMLElement", () => {
      const parent = document.createElement("div");
      parent.classList.add("board-row");
      const child = document.createElement("button");
      parent.appendChild(child);

      const result = controller.exposeFindClosestElement(child, ".board-row");

      expect(result).toBe(parent);
    });

    it("returns null for null target", () => {
      const result = controller.exposeFindClosestElement(null, ".board-row");

      expect(result).toBeNull();
    });

    it("returns null when no match found", () => {
      const element = document.createElement("div");

      const result = controller.exposeFindClosestElement(
        element,
        ".nonexistent",
      );

      expect(result).toBeNull();
    });
  });

  // ============================================
  // getDatasetFromClosest
  // ============================================

  describe("getDatasetFromClosest", () => {
    it("returns dataset value from closest element", () => {
      const parent = document.createElement("div");
      parent.classList.add("board-row");
      parent.dataset.boardId = "42";
      const child = document.createElement("button");
      parent.appendChild(child);

      const result = controller.exposeGetDatasetFromClosest(
        child,
        ".board-row",
        "boardId",
      );

      expect(result).toBe("42");
    });

    it("returns null when no matching element found", () => {
      const element = document.createElement("div");

      const result = controller.exposeGetDatasetFromClosest(
        element,
        ".nonexistent",
        "id",
      );

      expect(result).toBeNull();
    });

    it("returns undefined when dataset key does not exist", () => {
      const parent = document.createElement("div");
      parent.classList.add("item");
      const child = document.createElement("span");
      parent.appendChild(child);

      const result = controller.exposeGetDatasetFromClosest(
        child,
        ".item",
        "nonexistentKey",
      );

      expect(result).toBeNull();
    });
  });

  // ============================================
  // getFormValue
  // ============================================

  describe("getFormValue", () => {
    it("extracts value from FormData", () => {
      const form = document.createElement("form");
      const input = document.createElement("input");
      input.name = "title";
      input.value = "My Board";
      form.appendChild(input);

      const result = controller.exposeGetFormValue(form, "title");

      expect(result).toBe("My Board");
    });

    it("returns empty string for missing field", () => {
      const form = document.createElement("form");

      const result = controller.exposeGetFormValue(form, "nonexistent");

      expect(result).toBe("");
    });
  });

  // ============================================
  // performStoreOperation
  // ============================================

  describe("performStoreOperation", () => {
    it("shows success toast on successful operation", async () => {
      const operation = vi.fn().mockResolvedValue(undefined);

      await controller.exposePerformStoreOperation(operation, "Create board");

      expect(operation).toHaveBeenCalled();
      expect(toastManager.success).toHaveBeenCalledWith(
        "Create board success.",
      );
    });

    it("shows error toast with message on failed operation", async () => {
      const operation = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));

      await controller.exposePerformStoreOperation(operation, "Create board");

      expect(toastManager.error).toHaveBeenCalledWith(
        "Create board failed: Network error",
      );
    });

    it("shows 'Unknown error' for non-Error exceptions", async () => {
      const operation = vi.fn().mockRejectedValue("something went wrong");

      await controller.exposePerformStoreOperation(operation, "Delete task");

      expect(toastManager.error).toHaveBeenCalledWith(
        "Delete task failed: Unknown error",
      );
    });
  });

  // ============================================
  // redirectTo
  // ============================================

  describe("redirectTo", () => {
    it("calls router.navigate with the given path", () => {
      controller.exposeRedirectTo("/dashboard");

      expect(router.navigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
