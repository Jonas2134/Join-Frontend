import { describe, it, expect } from "vitest";
import { Button } from "../Button";

describe("Button", () => {
  it("creates a button element", () => {
    const btn = new Button({});
    const el = btn.renderBtn();

    expect(el.tagName).toBe("BUTTON");
  });

  it("sets id when provided", () => {
    const btn = new Button({ id: "my-btn" });
    const el = btn.renderBtn();

    expect(el.id).toBe("my-btn");
  });

  it("sets single class string", () => {
    const btn = new Button({ class: "btn-primary" });
    const el = btn.renderBtn();

    expect(el.classList.contains("btn-primary")).toBe(true);
  });

  it("sets array of classes", () => {
    const btn = new Button({ class: ["btn-primary", "btn-large"] });
    const el = btn.renderBtn();

    expect(el.classList.contains("btn-primary")).toBe(true);
    expect(el.classList.contains("btn-large")).toBe(true);
  });

  it("sets type attribute", () => {
    const btn = new Button({ type: "submit" });
    const el = btn.renderBtn();

    expect(el.type).toBe("submit");
  });

  it("sets title attribute", () => {
    const btn = new Button({ title: "Click me" });
    const el = btn.renderBtn();

    expect(el.title).toBe("Click me");
  });

  it("sets textContent when text provided", () => {
    const btn = new Button({ text: "Submit" });
    const el = btn.renderBtn();

    expect(el.textContent).toBe("Submit");
  });

  it("sets innerHTML when icon provided", () => {
    const btn = new Button({ icon: "<svg>icon</svg>" });
    const el = btn.renderBtn();

    expect(el.innerHTML).toContain("<svg>icon</svg>");
  });

  it("sets dataset attributes", () => {
    const btn = new Button({ dataset: { boardId: "42", action: "delete" } });
    const el = btn.renderBtn();

    expect(el.dataset.boardId).toBe("42");
    expect(el.dataset.action).toBe("delete");
  });

  it("works with minimal options (empty object)", () => {
    const btn = new Button({});
    const el = btn.renderBtn();

    expect(el.tagName).toBe("BUTTON");
    expect(el.id).toBe("");
    expect(el.textContent).toBe("");
  });

  it("returns the same button element", () => {
    const btn = new Button({ id: "test" });
    const el = btn.renderBtn();

    expect(el).toBe(btn.btnElement);
  });
});
