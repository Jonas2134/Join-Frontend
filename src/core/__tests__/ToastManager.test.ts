import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const mockToastInstances: Array<{
  render: ReturnType<typeof vi.fn>;
  show: ReturnType<typeof vi.fn>;
  dismiss: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("../../components/common/Toast", () => {
  return {
    Toast: vi.fn().mockImplementation(function (
      this: any,
      _options: any,
      onRemove: () => void,
    ) {
      const element = document.createElement("div");
      element.classList.add("toast");
      this.render = vi.fn(() => element);
      this.show = vi.fn();
      this.dismiss = vi.fn(() => {
        onRemove();
      });
      mockToastInstances.push(this);
    }),
  };
});

import { toastManager } from "../ToastManager";

describe("ToastManager", () => {
  beforeEach(() => {
    toastManager.clearAll();
    const container = document.getElementById("toast-container");
    if (container) container.remove();
    (toastManager as any).container = null;
    (toastManager as any).toasts = new Set();
    mockToastInstances.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a container in the DOM on first toast", () => {
    toastManager.success("Test message");

    const container = document.getElementById("toast-container");
    expect(container).not.toBeNull();
    expect(container?.classList.contains("toast-container")).toBe(true);
  });

  it("success adds a toast to the container", () => {
    toastManager.success("Success message");

    const container = document.getElementById("toast-container");
    expect(container?.children.length).toBe(1);
  });

  it("error adds a toast to the container", () => {
    toastManager.error("Error message");

    const container = document.getElementById("toast-container");
    expect(container?.children.length).toBe(1);
  });

  it("info adds a toast to the container", () => {
    toastManager.info("Info message");

    const container = document.getElementById("toast-container");
    expect(container?.children.length).toBe(1);
  });

  it("reuses the same container for multiple toasts", () => {
    toastManager.success("First");
    toastManager.error("Second");
    toastManager.info("Third");

    const containers = document.querySelectorAll("#toast-container");
    expect(containers.length).toBe(1);
    expect(containers[0].children.length).toBe(3);
  });

  it("dismisses oldest toast when MAX_TOASTS (5) exceeded", () => {
    for (let i = 0; i < 6; i++) {
      toastManager.success(`Toast ${i}`);
    }

    expect(mockToastInstances[0].dismiss).toHaveBeenCalled();
  });

  it("clearAll dismisses all active toasts", () => {
    toastManager.success("First");
    toastManager.success("Second");

    toastManager.clearAll();

    expect(mockToastInstances[0].dismiss).toHaveBeenCalled();
    expect(mockToastInstances[1].dismiss).toHaveBeenCalled();
  });
});
