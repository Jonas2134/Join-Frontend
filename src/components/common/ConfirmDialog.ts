import { BaseDialog } from "../bases/BaseDialog";
import { Button } from "./Button";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string;
  onConfirm: () => void | Promise<void>;
}

export class ConfirmDialog extends BaseDialog {
  private options: ConfirmDialogOptions;

  constructor(options: ConfirmDialogOptions) {
    super("confirm-dialog");
    this.options = options;
  }

  protected renderContent(): HTMLElement {
    const container = document.createElement("section");
    container.classList.add("confirm-dialog-content");

    const title = document.createElement("h2");
    title.classList.add("confirm-dialog-title");
    title.textContent = this.options.title;

    const message = document.createElement("p");
    message.classList.add("confirm-dialog-message");
    message.textContent = this.options.message;

    const menu = this.renderMenu();

    container.append(title, message, menu);
    return container;
  }

  private renderMenu(): HTMLElement {
    const menu = document.createElement("menu");
    menu.classList.add("confirm-dialog-menu");

    const cancelBtn = new Button({
      id: "confirm-cancel-btn",
      class: ["btn" ,"btn-white"],
      type: "button",
      text: this.options.cancelText ?? "Cancel",
    }).renderBtn();

    const confirmBtn = new Button({
      id: "confirm-action-btn",
      class: ["btn", `${this.options.confirmClass ?? "btn-danger"}`],
      type: "button",
      text: this.options.confirmText ?? "Delete",
    }).renderBtn();

    menu.append(cancelBtn, confirmBtn);
    return menu;
  }

  protected mount(): void {
    const cancelBtn = this.dialog.querySelector<HTMLButtonElement>("#confirm-cancel-btn");
    const confirmBtn = this.dialog.querySelector<HTMLButtonElement>("#confirm-action-btn");

    cancelBtn?.addEventListener("click", () => this.close());
    confirmBtn?.addEventListener("click", async () => {
      try {
        await this.options.onConfirm();
      } finally {
        this.close();
      }
    });
  }
}
