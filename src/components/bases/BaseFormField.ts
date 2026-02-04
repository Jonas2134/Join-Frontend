export interface BaseFormFieldOptions {
  label: string;
  name: string;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hideLabel?: boolean;
  ariaDescribedBy?: string;
  value?: string;
}

export abstract class BaseFormField<T extends HTMLInputElement | HTMLTextAreaElement> {
  protected element!: HTMLElement;
  protected fieldElement!: T;
  protected options: BaseFormFieldOptions;
  private fieldId: string;

  constructor(options: BaseFormFieldOptions) {
    this.options = options;
    this.fieldId = `field-${options.name}-${Math.random().toString(36)}`;
  }

  protected abstract createFieldElement(): T;

  private createElement(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("form-field");
    if (this.options.className) {
      wrapper.classList.add(this.options.className);
    }

    const label = document.createElement("label");
    label.classList.add("input-label");
    label.htmlFor = this.fieldId;
    label.textContent = this.options.label;

    if (this.options.hideLabel) {
      label.classList.add("sr-only");
    }

    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("input-wrapper");

    if (this.options.icon) {
      const iconSpan = document.createElement("span");
      iconSpan.classList.add("input-icon");
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.innerHTML = this.options.icon;
      inputWrapper.appendChild(iconSpan);
    }

    const field = this.createFieldElement();
    field.id = this.fieldId;
    field.name = this.options.name;

    if (this.options.placeholder) {
      field.placeholder = this.options.placeholder;
    }

    if (this.options.required) {
      field.required = true;
      field.setAttribute("aria-required", "true");
    }

    if (this.options.disabled) {
      field.disabled = true;
    }

    if (this.options.ariaDescribedBy) {
      field.setAttribute("aria-describedby", this.options.ariaDescribedBy);
    }

    if (this.options.value) {
      field.value = this.options.value;
    }

    inputWrapper.appendChild(field);
    wrapper.appendChild(label);
    wrapper.appendChild(inputWrapper);

    this.fieldElement = field;
    this.element = wrapper;

    return wrapper;
  }

  render(): HTMLElement {
    if (!this.element) {
      this.createElement();
    }
    return this.element;
  }

  getValue(): string {
    return this.fieldElement?.value ?? "";
  }

  setValue(value: string): void {
    if (this.fieldElement) {
      this.fieldElement.value = value;
    }
  }

  focus(): void {
    this.fieldElement?.focus();
  }

  clear(): void {
    if (this.fieldElement) {
      this.fieldElement.value = "";
    }
  }

  getFieldElement(): T | null {
    return this.fieldElement ?? null;
  }

  setError(message: string): void {
    this.element?.classList.add("has-error");

    let errorEl = this.element?.querySelector(".field-error") as HTMLElement;
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.classList.add("field-error");
      errorEl.id = `${this.fieldId}-error`;
      this.element?.appendChild(errorEl);
      this.fieldElement?.setAttribute("aria-describedby", errorEl.id);
    }
    errorEl.textContent = message;
    this.fieldElement?.setAttribute("aria-invalid", "true");
  }

  clearError(): void {
    this.element?.classList.remove("has-error");
    const errorEl = this.element?.querySelector(".field-error");
    if (errorEl) {
      errorEl.remove();
      this.fieldElement?.removeAttribute("aria-invalid");
    }
  }

  setDisabled(disabled: boolean): void {
    if (this.fieldElement) {
      this.fieldElement.disabled = disabled;
    }
  }
}
