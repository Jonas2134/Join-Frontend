import { router } from "../core/router";

interface SummaryButtonOptions {
  label: string;
  image: string;
  route: string;
  query?: Record<string, string>;
  classes?: string;
}

export class SummaryButton {
  private element!: HTMLButtonElement;
  private options: SummaryButtonOptions;

  constructor(options: SummaryButtonOptions) {
    this.options = options;
  }

  private createElement(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `summary-button ${this.options.classes ?? ""}`.trim();

    button.innerHTML = /*html*/ `
      <div class="flex flex-col items-center justify-center p-4 rounded-xl shadow-md bg-(--color-bg-secondary) hover:bg-(--color-bg-hover) transition-all">
        <img src="${this.options.image}" alt="${this.options.label}" class="w-10 h-10 mb-2" />
        <span class="text-sm font-medium text-center">${this.options.label}</span>
      </div>
    `;

    button.addEventListener("click", () => {
      const queryString = this.options.query
        ? "?" +
          new URLSearchParams(this.options.query).toString()
        : "";

			console.log(queryString);
      router.navigate(`${this.options.route}${queryString}`);
    });

    this.element = button;
    return button;
  }

  render(): HTMLButtonElement {
    if (!this.element) this.createElement();
    return this.element;
  }
}
