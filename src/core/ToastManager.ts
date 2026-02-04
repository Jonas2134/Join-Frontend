import { Toast } from "../components/common/Toast";
import type { ToastType } from "./types/toast.types";

class ToastManager {
  private container: HTMLDivElement | null = null;
  private toasts: Set<Toast> = new Set();
  private readonly MAX_TOASTS = 5;

  private getContainer(): HTMLDivElement {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.classList.add("toast-container");
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  private show(message: string, type: ToastType, duration?: number): void {
    if (this.toasts.size >= this.MAX_TOASTS) {
      const oldest = this.toasts.values().next().value;
      if (oldest) {
        oldest.dismiss();
      }
    }

    const toast = new Toast({ message, type, duration }, () =>
      this.toasts.delete(toast)
    );

    this.toasts.add(toast);
    this.getContainer().appendChild(toast.render());
    toast.show();
  }

  success(message: string, duration?: number): void {
    this.show(message, "success", duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, "error", duration);
  }

  clearAll(): void {
    this.toasts.forEach((toast) => toast.dismiss());
    this.toasts.clear();
  }
}

export const toastManager = new ToastManager();
