import type { ToastOptions } from "../../core/types/toast.types";
import successIcon from "../../assets/icons/toast-success.svg?raw";
import errorIcon from "../../assets/icons/toast-error.svg?raw";
import infoIcon from "../../assets/icons/toast-info.svg?raw";
import closeIcon from "../../assets/icons/toast-close.svg?raw";

export class Toast {
  private element: HTMLDivElement;
  private options: Required<ToastOptions>;
  private timeoutId: number | null = null;
  private onRemove: () => void;

  constructor(options: ToastOptions, onRemove: () => void) {
    this.options = {
      message: options.message,
      type: options.type,
      duration: options.duration ?? 4000,
    };
    this.onRemove = onRemove;
    this.element = document.createElement("div");
    this.setupElement();
  }

  private setupElement(): void {
    this.element.classList.add("toast", `toast-${this.options.type}`);
    this.element.innerHTML = this.renderContent();

    const closeBtn = this.element.querySelector(".toast-close-btn");
    closeBtn?.addEventListener("click", () => this.dismiss());
  }

  private renderContent(): string {
    const iconMap = {
      success: successIcon,
      error: errorIcon,
      info: infoIcon,
    };

    return /*html*/ `
      <span class="toast-icon">${iconMap[this.options.type]}</span>
      <span class="toast-message">${this.options.message}</span>
      <button class="toast-close-btn" type="button" title="Schließen">
        ${closeIcon}
      </button>
    `;
  }

  show(): void {
    requestAnimationFrame(() => {
      this.element.classList.add("toast-visible");
    });

    this.timeoutId = window.setTimeout(() => {
      this.dismiss();
    }, this.options.duration);
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.element.classList.remove("toast-visible");
    this.element.classList.add("toast-hidden");

    this.element.addEventListener(
      "transitionend",
      () => {
        this.remove();
      },
      { once: true }
    );
  }

  remove(): void {
    this.element.remove();
    this.onRemove();
  }

  render(): HTMLDivElement {
    return this.element;
  }
}
