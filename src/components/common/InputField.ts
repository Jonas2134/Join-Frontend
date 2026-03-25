import { BaseFormField } from "../bases/BaseFormField";
import type { BaseFormFieldOptions } from "../bases/BaseFormField";
import { Button } from "./Button";
import { passwordToggleBtn } from "../../core/constants/inputFieldBtns.config";
import EyeOpen from "../../assets/icons/eye-open.svg?raw";
import EyeClosed from "../../assets/icons/eye-closed.svg?raw";

export interface InputFieldOptions extends BaseFormFieldOptions {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  autocomplete?: AutoFillField;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export class InputField extends BaseFormField<HTMLInputElement>  {
  private inputOptions: InputFieldOptions;
  private isPasswordVisible = false;
  private toggleBtn: HTMLButtonElement | null = null;

  constructor(options: InputFieldOptions) {
    super(options)
    this.inputOptions = options;
  }

  protected createFieldElement(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = this.inputOptions.type || 'text';
    input.classList.add('form-input');

    if (this.inputOptions.autocomplete) {
      input.autocomplete = this.inputOptions.autocomplete;
    }

    if (this.inputOptions.minLength) {
      input.minLength = this.inputOptions.minLength;
    }

    if (this.inputOptions.maxLength) {
      input.maxLength = this.inputOptions.maxLength;
    }

    if (this.inputOptions.pattern) {
      input.pattern = this.inputOptions.pattern;
    }

    return input;
  }

  render(): HTMLElement {
    const element = super.render();

    if (this.inputOptions.type === 'password') {
      this.renderPasswordToggle(element);
      this.mountPasswordToggle();
    }

    return element;
  }

  private renderPasswordToggle(wrapper: HTMLElement): void {
    const inputWrapper = wrapper.querySelector('.flex.gap-1') as HTMLElement;
    if (!inputWrapper) return;

    this.toggleBtn = new Button(passwordToggleBtn).renderBtn();
    this.toggleBtn.setAttribute('aria-label', 'Toggle password visibility');

    inputWrapper.appendChild(this.toggleBtn);
  }

  private mountPasswordToggle(): void {
    if (!this.toggleBtn) return;

    this.toggleBtn.addEventListener('click', () => {
      this.isPasswordVisible = !this.isPasswordVisible;
      const input = this.getFieldElement();
      if (!input || !this.toggleBtn) return;

      input.type = this.isPasswordVisible ? 'text' : 'password';
      this.toggleBtn.innerHTML = this.isPasswordVisible ? EyeOpen : EyeClosed;
    });
  }
}
