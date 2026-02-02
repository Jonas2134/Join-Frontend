import type { ToastOptions } from "../../core/types/toast.types";

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
    const icon =
      this.options.type === "success"
        ? this.getSuccessIcon()
        : this.getErrorIcon();

    return /*html*/ `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${this.options.message}</span>
      <button class="toast-close-btn" type="button" title="Schließen">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;
  }

  private getSuccessIcon(): string {
    return /*html*/ `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    `;
  }

  private getErrorIcon(): string {
    return /*html*/ `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
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
