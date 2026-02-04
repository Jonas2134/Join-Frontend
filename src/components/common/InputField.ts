import { BaseFormField } from "../bases/BaseFormField";
import type { BaseFormFieldOptions } from "../bases/BaseFormField";

export interface InputFieldOptions extends BaseFormFieldOptions {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  autocomplete?: AutoFillField;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export class InputField extends BaseFormField<HTMLInputElement>  {
  private inputOptions: InputFieldOptions;

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
}
