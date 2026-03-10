import { describe, it, expect } from "vitest";
import { BaseFormField } from "../BaseFormField";

class TestInputField extends BaseFormField<HTMLInputElement> {
  protected createFieldElement(): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "text";
    return input;
  }
}

describe("BaseFormField", () => {
  describe("render", () => {
    it("creates a wrapper with form-field class", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      const el = field.render();

      expect(el.classList.contains("form-field")).toBe(true);
    });

    it("creates a label element", () => {
      const field = new TestInputField({ label: "Email", name: "email" });
      const el = field.render();

      const label = el.querySelector("label");
      expect(label).not.toBeNull();
      expect(label?.textContent).toBe("Email");
    });

    it("creates an input element with correct name", () => {
      const field = new TestInputField({ label: "Name", name: "username" });
      const el = field.render();

      const input = el.querySelector("input");
      expect(input).not.toBeNull();
      expect(input?.name).toBe("username");
    });

    it("sets placeholder when provided", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        placeholder: "Enter name",
      });
      const el = field.render();

      const input = el.querySelector("input");
      expect(input?.placeholder).toBe("Enter name");
    });

    it("sets required attribute when required", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        required: true,
      });
      const el = field.render();

      const input = el.querySelector("input");
      expect(input?.required).toBe(true);
      expect(input?.getAttribute("aria-required")).toBe("true");
    });

    it("sets disabled attribute when disabled", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        disabled: true,
      });
      const el = field.render();

      const input = el.querySelector("input");
      expect(input?.disabled).toBe(true);
    });

    it("adds custom className to wrapper", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        className: "custom-field",
      });
      const el = field.render();

      expect(el.classList.contains("custom-field")).toBe(true);
    });

    it("hides label with sr-only class when hideLabel is true", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        hideLabel: true,
      });
      const el = field.render();

      const label = el.querySelector("label");
      expect(label?.classList.contains("sr-only")).toBe(true);
    });

    it("adds icon when provided", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        icon: "<svg>icon</svg>",
      });
      const el = field.render();

      const iconSpan = el.querySelector(".input-icon");
      expect(iconSpan).not.toBeNull();
      expect(iconSpan?.innerHTML).toContain("<svg>icon</svg>");
    });

    it("sets value when provided", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        value: "John",
      });
      const el = field.render();

      const input = el.querySelector("input");
      expect(input?.value).toBe("John");
    });

    it("returns the same element on subsequent calls", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      const el1 = field.render();
      const el2 = field.render();

      expect(el1).toBe(el2);
    });
  });

  describe("getValue", () => {
    it("returns the input value", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      field.render();
      field.setValue("Test Value");

      expect(field.getValue()).toBe("Test Value");
    });
  });

  describe("setValue", () => {
    it("sets the input value", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      field.render();
      field.setValue("New Value");

      expect(field.getFieldElement()?.value).toBe("New Value");
    });
  });

  describe("clear", () => {
    it("clears the input value", () => {
      const field = new TestInputField({
        label: "Name",
        name: "name",
        value: "Initial",
      });
      field.render();
      field.clear();

      expect(field.getValue()).toBe("");
    });
  });

  describe("setError", () => {
    it("adds has-error class and creates error element", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      const el = field.render();

      field.setError("This field is required");

      expect(el.classList.contains("has-error")).toBe(true);
      const errorEl = el.querySelector(".field-error");
      expect(errorEl?.textContent).toBe("This field is required");
    });

    it("sets aria-invalid on the input", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      field.render();

      field.setError("Error");

      expect(field.getFieldElement()?.getAttribute("aria-invalid")).toBe(
        "true",
      );
    });
  });

  describe("clearError", () => {
    it("removes has-error class and error element", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      const el = field.render();

      field.setError("Error");
      field.clearError();

      expect(el.classList.contains("has-error")).toBe(false);
      expect(el.querySelector(".field-error")).toBeNull();
    });

    it("removes aria-invalid from the input", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      field.render();

      field.setError("Error");
      field.clearError();

      expect(
        field.getFieldElement()?.getAttribute("aria-invalid"),
      ).toBeNull();
    });
  });

  describe("setDisabled", () => {
    it("enables and disables the input", () => {
      const field = new TestInputField({ label: "Name", name: "name" });
      field.render();

      field.setDisabled(true);
      expect(field.getFieldElement()?.disabled).toBe(true);

      field.setDisabled(false);
      expect(field.getFieldElement()?.disabled).toBe(false);
    });
  });
});
