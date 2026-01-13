export interface TextareaOptions {
  nameId: string;
  placeholder: string;
  icon?: string;
  rows?: number;
  cols?: number;
}

export class Textarea {
  private element!: HTMLElement;
  private textarea!: HTMLTextAreaElement;
  private options: TextareaOptions;

  constructor(options: TextareaOptions) {
    this.options = options;
  }

  private createElement(): HTMLElement {
    const wrapper = document.createElement('label');
    wrapper.classList.add('input-field');

    const textarea = document.createElement('textarea');
    textarea.id = this.options.nameId;
    textarea.name = this.options.nameId;
    textarea.placeholder = this.options.placeholder;
    if (this.options.rows) textarea.rows = this.options.rows;
    if (this.options.cols) textarea.cols = this.options.cols;

    if (this.options.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.innerHTML = this.options.icon;
      wrapper.appendChild(iconSpan);
    }

    wrapper.appendChild(textarea);

    this.textarea = textarea;
    this.element = wrapper;

    return wrapper;
  }

  render(): HTMLElement {
    if (!this.element) {
      this.createElement();
    }
    return this.element;
  }

  setValue(value: string): void {
    if (this.textarea) this.textarea.value = value;
  }

  clear(): void {
    if (this.textarea) this.textarea.value = '';
  }
}
