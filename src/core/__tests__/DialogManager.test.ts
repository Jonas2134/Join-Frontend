import { describe, it, expect, beforeEach } from "vitest";
import { dialogManager } from "../DialogManager";

describe("DialogManager", () => {
  beforeEach(() => {
    dialogManager.removeAll();
  });

  it("registers a dialog", () => {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialogManager.register(dialog);

    // Verify it's tracked by calling removeAll and checking DOM
    dialogManager.removeAll();
    expect(document.body.contains(dialog)).toBe(false);
  });

  it("unregister removes dialog from DOM and tracking", () => {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialogManager.register(dialog);
    dialogManager.unregister(dialog);

    expect(document.body.contains(dialog)).toBe(false);
  });

  it("removeAll removes all dialogs from DOM", () => {
    const dialog1 = document.createElement("dialog");
    const dialog2 = document.createElement("dialog");
    document.body.appendChild(dialog1);
    document.body.appendChild(dialog2);

    dialogManager.register(dialog1);
    dialogManager.register(dialog2);

    dialogManager.removeAll();

    expect(document.body.contains(dialog1)).toBe(false);
    expect(document.body.contains(dialog2)).toBe(false);
  });

  it("removeAll clears the internal set", () => {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialogManager.register(dialog);
    dialogManager.removeAll();

    // Re-append and re-register to verify clean state
    document.body.appendChild(dialog);
    dialogManager.register(dialog);
    dialogManager.removeAll();

    expect(document.body.contains(dialog)).toBe(false);
  });
});
