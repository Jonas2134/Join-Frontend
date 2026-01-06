import { dialogManager } from "./DialogManager";

export abstract class BaseDialog {
  protected dialog: HTMLDialogElement;

  constructor(dialogClass?: string) {
    this.dialog = document.createElement('dialog');

    if (dialogClass) this.dialog.classList.add(dialogClass);

    this.setupBaseBehavior();

    dialogManager.register(this.dialog);
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

  private initContent() {
    const content = this.renderContent();
    if (content) {
      this.dialog.appendChild(content);
    }
    this.mount();
  }

  open() {
    this.initContent();
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