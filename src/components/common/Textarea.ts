import { BaseFormField } from "../bases/BaseFormField";
import type { BaseFormFieldOptions } from "../bases/BaseFormField";

export interface TextareaOptions extends BaseFormFieldOptions {
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export class Textarea extends BaseFormField<HTMLTextAreaElement> {
  private textareaOptions: TextareaOptions;

  constructor(options: TextareaOptions) {
    super(options)
    this.textareaOptions = options;
  }

  protected createFieldElement(): HTMLTextAreaElement {
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-textarea');

    if (this.textareaOptions.rows) {
      textarea.rows = this.textareaOptions.rows;
    }

    if (this.textareaOptions.cols) {
      textarea.cols = this.textareaOptions.cols;
    }

    if (this.textareaOptions.maxLength) {
      textarea.maxLength = this.textareaOptions.maxLength;
    }

    if (this.textareaOptions.minLength) {
      textarea.minLength = this.textareaOptions.minLength;
    }

    if (this.textareaOptions.resize) {
      textarea.style.resize = this.textareaOptions.resize;
    }

    return textarea;
  }
}
