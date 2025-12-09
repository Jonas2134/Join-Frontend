class DialogManager {
  private dialogs = new Set<HTMLDialogElement>();

  register(dialog: HTMLDialogElement) {
    this.dialogs.add(dialog);
  }

  unregister(dialog: HTMLDialogElement) {
    dialog.remove();
    this.dialogs.delete(dialog);
  }

  removeAll() {
    this.dialogs.forEach(dialog => dialog.remove());
    this.dialogs.clear();
  }
}

export const dialogManager = new DialogManager();