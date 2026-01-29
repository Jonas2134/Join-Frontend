export interface ButtonOptions {
  id?: string;
  class?: string | string[];
  type?: 'button' | 'submit';
  title?: string;
  text?: string;
  icon?: string;
}

export class Button {
  btnElement: HTMLButtonElement;
  btnOptions: ButtonOptions;

  constructor(options: ButtonOptions) {
    this.btnElement = document.createElement("button");
    this.btnOptions = options;
  }

  renderBtn(): HTMLButtonElement {
    if (this.btnOptions.id) this.btnElement.id = this.btnOptions.id;

    if(Array.isArray(this.btnOptions.class)) {
      this.btnElement.classList.add(...this.btnOptions.class);
    } else if (this.btnOptions.class) {
      this.btnElement.classList.add(this.btnOptions.class);
    }

    if (this.btnOptions.type) this.btnElement.type = this.btnOptions.type;

    if (this.btnOptions.title) this.btnElement.title = this.btnOptions.title;

    if (this.btnOptions.text) this.btnElement.textContent = this.btnOptions.text;

    if (this.btnOptions.icon) this.btnElement.innerHTML = this.btnOptions.icon;

    return this.btnElement;
  }
}
