import { dialogManager } from "./DialogManager";

export abstract class BaseDialog {
  protected dialog: HTMLDialogElement;

  constructor(dialogId?: string, dialogClass?: string) {
    this.dialog = document.createElement('dialog');

    if (dialogId) this.dialog.id = dialogId;
    if (dialogClass) this.dialog.classList.add(dialogClass);

    this.setupBaseBehavior();
    
    const content = this.renderContent();
    if (content) {
      this.dialog.appendChild(content);
    }

    dialogManager.register(this.dialog);

    this.mount();
  }

  protected abstract renderContent(): HTMLElement;

  protected mount(): void {}

  private setupBaseBehavior() {
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.close();
      }
    });

    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.close();
    });
  }

  open() {
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
    this.remove();
  }

  remove() {
    dialogManager.unregister(this.dialog);
  }

  render() {
    return this.dialog;
  }
}