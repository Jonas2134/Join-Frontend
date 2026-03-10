import { describe, it, expect, vi } from "vitest";
import { EventManager } from "../EventManager";

describe("EventManager", () => {
  it("registers a listener that fires on event", () => {
    const manager = new EventManager();
    const handler = vi.fn();
    const element = document.createElement("div");

    manager.on(element, "click", handler);
    element.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("clearAll removes all registered listeners", () => {
    const manager = new EventManager();
    const handler = vi.fn();
    const element = document.createElement("div");

    manager.on(element, "click", handler);
    manager.clearAll();
    element.click();

    expect(handler).not.toHaveBeenCalled();
  });

  it("supports multiple listeners on different elements", () => {
    const manager = new EventManager();
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const el1 = document.createElement("div");
    const el2 = document.createElement("button");

    manager.on(el1, "click", handler1);
    manager.on(el2, "click", handler2);

    el1.click();
    el2.click();

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("clearAll removes all listeners from multiple elements", () => {
    const manager = new EventManager();
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const el1 = document.createElement("div");
    const el2 = document.createElement("button");

    manager.on(el1, "click", handler1);
    manager.on(el2, "click", handler2);
    manager.clearAll();

    el1.click();
    el2.click();

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it("supports window as event target", () => {
    const manager = new EventManager();
    const handler = vi.fn();

    manager.on(window, "custom-event", handler);
    window.dispatchEvent(new Event("custom-event"));

    expect(handler).toHaveBeenCalledTimes(1);

    manager.clearAll();
    window.dispatchEvent(new Event("custom-event"));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("supports document as event target", () => {
    const manager = new EventManager();
    const handler = vi.fn();

    manager.on(document, "click", handler);
    document.dispatchEvent(new Event("click"));

    expect(handler).toHaveBeenCalledTimes(1);

    manager.clearAll();
    document.dispatchEvent(new Event("click"));

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
