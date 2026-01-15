export interface InputFieldOptions {
  type: string;
  placeholder: string;
  icon?: string;
  name?: string;
  class?:string;
  required?: boolean;
}

export class InputField {
  private element!: HTMLElement;
  private input!: HTMLInputElement;
  private options: InputFieldOptions;

  constructor(options: InputFieldOptions) {
    this.options = options;
  }

  private createElement(): HTMLElement {
    const wrapper = document.createElement('label');
    if (this.options.class) wrapper.classList.add(this.options.class);
    else wrapper.classList.add("input-field");

    const input = document.createElement('input');
    input.type = this.options.type;
    input.placeholder = this.options.placeholder;
    if (this.options.name) input.name = this.options.name;
    if (this.options.required) input.required = true;

    if (this.options.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.innerHTML = this.options.icon;
      wrapper.appendChild(iconSpan);
    }

    wrapper.appendChild(input);

    this.input = input;
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
    return this.input?.value ?? '';
  }

  setValue(value: string): void {
    if (this.input) this.input.value = value;
  }

  focus(): void {
    this.input?.focus();
  }

  clear(): void {
    if (this.input) this.input.value = '';
  }

  getInputElement(): HTMLInputElement | null {
    return this.input ?? null;
  }
}
