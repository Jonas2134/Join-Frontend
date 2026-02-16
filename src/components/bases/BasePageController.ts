import { router } from "../../core/router";
import { toastManager } from "../../core/ToastManager";
import type { BaseDialog } from "./BaseDialog";

export abstract class BasePageController {

  // ============================================
  // DOM Traversal
  // ============================================

  protected findClosestElement<T extends HTMLElement>(
    target: EventTarget | null,
    selector: string,
  ): T | null {
    if (target instanceof HTMLElement) {
      return target.closest<T>(selector);
    }
    if (target instanceof SVGElement) {
      return (target.closest(selector) as T) || null;
    }
    return null;
  }

  protected getDatasetFromClosest(
    element: HTMLElement,
    selector: string,
    dataKey: string,
  ): string | null {
    const closest = element.closest<HTMLElement>(selector);
    return closest?.dataset[dataKey] ?? null;
  }

  // ============================================
  // Form Utilities
  // ============================================

  protected getFormValue(form: HTMLFormElement, fieldName: string): string {
    const formData = new FormData(form);
    return (formData.get(fieldName) as string) || "";
  }

  // ============================================
  // Menu Item Form Toggling
  // ============================================

  protected toggleFormInMenuItem(
    button: HTMLButtonElement,
    formSelector: string,
    formRenderer: () => HTMLElement | undefined,
  ) {
    const item = button.closest<HTMLElement>(".menu-item");
    if (!item) return;

    button.remove();

    const existingForm = item.querySelector(formSelector);
    if (!existingForm) {
      const form = formRenderer();
      if (form) {
        item.appendChild(form);
        const input = form.querySelector("input");
        input?.focus();
      }
    }
  }

  protected restoreButtonInMenuItem(
    cancelButton: HTMLButtonElement,
    formSelector: string,
    buttonSelector: string,
    buttonRenderer: () => HTMLElement | undefined,
  ) {
    const form = cancelButton.closest<HTMLElement>(formSelector);
    if (!form) return;

    const item = form.closest<HTMLElement>(".menu-item");
    if (!item) return;

    form.remove();

    const existingBtn = item.querySelector<HTMLButtonElement>(buttonSelector);
    if (!existingBtn) {
      const newBtn = buttonRenderer();
      if (newBtn) item.appendChild(newBtn);
    }
  }

  // ============================================
  // Dialog Management
  // ============================================

  protected openDialog(dialog: BaseDialog): void {
    document.body.appendChild(dialog.render());
    dialog.open();
  }

  // ============================================
  // API Operations
  // ============================================

  protected async performStoreOperation(
    operation: () => Promise<unknown>,
    operationName: string,
  ) {
    try {
      await operation();
      toastManager.success(`${operationName} success.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toastManager.error(`${operationName} failed: ${message}`);
    }
  }

  // ============================================
  // Navigation
  // ============================================

  protected redirectTo(path: string): void {
    router.navigate(path);
  }
}
