export interface ButtonOptions {
  id?: string;
  class?: string | string[];
  type?: 'button' | 'submit';
  title?: string;
  text?: string;
  shortText?: string;
  icon?: string;
  dataset?: Record<string, string>
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

    if (this.btnOptions.text && this.btnOptions.shortText) {
      const full = document.createElement("span");
      full.classList.add("btn-text-full");
      full.textContent = this.btnOptions.text;

      const short = document.createElement("span");
      short.classList.add("btn-text-short");
      short.textContent = this.btnOptions.shortText;

      this.btnElement.append(full, short);
    } else if (this.btnOptions.text) {
      this.btnElement.textContent = this.btnOptions.text;
    }

    if (this.btnOptions.icon) this.btnElement.innerHTML = this.btnOptions.icon;

    if (this.btnOptions.dataset) {
      for (const [key, value] of Object.entries(this.btnOptions.dataset)) {
        this.btnElement.dataset[key] = value;
      }
    }

    return this.btnElement;
  }
}
