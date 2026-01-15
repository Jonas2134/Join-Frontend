import { appStore } from "../../../core/store/AppStore";
import { CreateTaskDialog } from "../CreateTaskDialog";
import { ColumnThreeDotDropdown } from "../ColumnThreeDotDropdown";
import type { ColumnUpdate } from "../../../core/types/board.types";

export class BoardEventManager {
  dialog: CreateTaskDialog | null = null;
  dropdown: ColumnThreeDotDropdown | null = null;
  private initLoadBoard: () => Promise<void>;

  constructor(func: () => Promise<void>) {
    this.initLoadBoard = func;
  }

  /* ---------- Eventlistener ---------- */

  registerTaskButtonListener(e: Event) {
    const target = e.target as HTMLElement;

    const createTBtn = target.closest<HTMLButtonElement>(".create-task-btn");
    if (!createTBtn) return;

    const column = createTBtn.closest<HTMLElement>(".board-column");
    if (!column) return;

    const columnId = column.dataset.columnId;
    if (!columnId) return;
    this.openCreateTaskDialog(columnId);
  }

  registerColumnThreeDotListener(e: Event) {
    const target = e.target as HTMLElement;

    const threeDotBtn = target.closest<HTMLButtonElement>(".column-menu-btn");
    if (!threeDotBtn) return;

    const columnHeader = threeDotBtn.closest<HTMLElement>(".column-header");
    if (!columnHeader) return;

    this.openColumnThreeDotDropdown(threeDotBtn, columnHeader);
  }

  registerColumnButtonListener(e: Event, renderer?: any) {
    const target = e.target as HTMLElement;
    const createCBtn = target.closest<HTMLButtonElement>(".create-column-btn");
    if (createCBtn) {
      console.log("KLICK!!!");
      this.showAddColumnForm(renderer);
      return;
    }
  }

  registerColumnCancelButtonListener(e: Event, renderer?: any) {
    const target = e.target as HTMLElement;
    const cancelBtn = target.closest<HTMLButtonElement>(".cancel-column-btn");
    if (cancelBtn) {
      console.log("GECANCELT!!!!");
      this.hideAddColumnForm(renderer);
      return;
    }
  }

  async registerColumnFormSubmitListener(e: Event, id: string) {
    const target = e.target as HTMLElement;

    const form = target.closest<HTMLFormElement>(".add-column-form");
    if (!form) return;
    e.preventDefault();

    const formData = new FormData(form);
    const columnName = formData.get("columnName") as string;
    if (columnName) await this.createColumn(columnName, id);
  }

  registerColumnRenameToFormListener(e: Event) {
    const target = e.target as HTMLElement;
    const renameBtn = target.closest<HTMLButtonElement>("#rename-column-btn");
    if (!renameBtn) return;
    e.stopPropagation();

    const item = renameBtn.closest<HTMLElement>(".menu-item");
    if (!item) return;

    renameBtn.remove();
    
    const existingForm = item.querySelector(".rename-column-form");
    if (!existingForm) {
      const form = this.dropdown?.renderRenameForm();
      item.appendChild(form!);
      const input = form?.querySelector("input");
      input?.focus();
    }
  }

  registerColumnRenameFromSubmitListener(e: Event) {
    const target = e.target as HTMLElement;
    const form = target.closest<HTMLFormElement>(".rename-column-form");
    if (!form) return;
    e.preventDefault();

    const column = form.closest<HTMLElement>(".board-column");
    if (!column) return;
    const columnId = column.dataset.columnId;
    if (!columnId) return;

    const formData = new FormData(form);
    const newColumnName = formData.get("column-rename") as string;
    if (newColumnName) this.updateColumn(columnId, { name: newColumnName });
  }

  registerColumnRenameCancelButtonListener(e: Event) {
    const target = e.target as HTMLElement;
    const cancelBtn = target.closest<HTMLButtonElement>("#cancel-rename-btn");
    if (!cancelBtn) return;
    e.stopPropagation();

    const form = cancelBtn.closest<HTMLElement>(".rename-column-form");
    if (!form) return;

    const item = form.closest<HTMLElement>(".menu-item");
    if (!item) return;

    form.remove();

    const existingBtn = item.querySelector<HTMLButtonElement>("#rename-column-btn");
    if (!existingBtn) {
      const renameBtn = this.dropdown?.renderRenameBtn();
      item.appendChild(renameBtn!);
    }
  }

  registerColumnDotMenuDeleteButtonListener(e: Event) {
    const target = e.target as HTMLElement;
    const deleteBtn = target.closest<HTMLButtonElement>("#delete-column-btn");
    if (!deleteBtn) return;

    const column = deleteBtn.closest<HTMLElement>(".board-column");
    if (!column) return;

    const columnId = column.dataset.columnId;
    if (columnId) this.deleteColumn(columnId);
  }

  /* ---------- Sub functions ---------- */

  private openCreateTaskDialog(id: string) {
    this.dialog = new CreateTaskDialog(id);
    document.body.appendChild(this.dialog.render());
    this.dialog?.open();
  }

  private openColumnThreeDotDropdown(btn: HTMLButtonElement, header: HTMLElement) {
    if (!this.dropdown) {
      this.dropdown = new ColumnThreeDotDropdown(btn);
      this.dropdown.setOnCloseCallback(() => this.dropdown = null);
      header.appendChild(this.dropdown.render());
      this.dropdown.open();
    } else {
      this.dropdown = null;
    }
  }

  private showAddColumnForm(renderer?: any) {
    const addColumnItem = document.querySelector(".add-column-item");
    if (!addColumnItem) return;

    const addColumnSection = addColumnItem.querySelector(".add-column");
    addColumnSection?.remove();

    const existingForm = addColumnItem.querySelector(".add-column-form");
    if (!existingForm) {
      const form = renderer.addColumnRenderer.renderAddColumnForm();
      addColumnItem.appendChild(form);
      const input = form.querySelector("input");
      input?.focus();
    }
  }

  private hideAddColumnForm(renderer?: any) {
    const addColumnItem = document.querySelector(".add-column-item");
    if (!addColumnItem) return;

    const form = addColumnItem.querySelector(".add-column-form");
    form?.remove();

    const existingAddColumnSection = addColumnItem.querySelector(".add-column");
    if (!existingAddColumnSection) addColumnItem.appendChild(renderer.addColumnRenderer.renderAddColumnSection());
  }

  private async createColumn(columnName: string, id: string) {
    try {
      await appStore.createColumn(id, columnName);
      await this.initLoadBoard();
    } catch (err: any) {
      alert("Creation is failed: " + err.message);
    }
  }

  private async updateColumn(columnId: string, data: ColumnUpdate) {
    try {
      await appStore.updateColumn(columnId, data);
      await this.initLoadBoard();
    } catch (err: any) {
      alert("Update is failed: " + err.message);
    }
  }

  private async deleteColumn(columnId: string) {
    try {
      await appStore.deleteColumn(columnId);
      await this.initLoadBoard();
    } catch (err: any) {
      alert("Deletion is failed: " + err.message);
    }
  }
}
