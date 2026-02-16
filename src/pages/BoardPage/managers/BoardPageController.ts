import { BasePageController } from "../../../components/bases/BasePageController";
import { appStore } from "../../../core/store/AppStore";
import { CreateTaskDialog } from "../dialogAndDropdown/CreateTaskDialog";
import { EditBoardDialog } from "../dialogAndDropdown/EditBoardDialog";
import { ColumnThreeDotDropdown } from "../dialogAndDropdown/ColumnThreeDotDropdown";
import { TaskThreeDotDropdown } from "../dialogAndDropdown/TaskThreeDotDropdown";
import { TaskDetailDialog } from "../dialogAndDropdown/TaskDetailDialog";
import type { TaskDetailMode } from "../dialogAndDropdown/TaskDetailDialog";
import type { Board, Column, ColumnUpdate, Task } from "../../../core/types/board.types";

export class BoardPageController extends BasePageController {
  dialog: CreateTaskDialog | EditBoardDialog | TaskDetailDialog | null = null;
  dropdown: ColumnThreeDotDropdown | null = null;
  taskDropdown: TaskThreeDotDropdown | null = null;

  // ============================================
  // Public Event Listeners
  // ============================================

  registerEditBoardDialog(board: Board) {
    this.dialog = new EditBoardDialog(board);
    this.openDialog(this.dialog);
  }

  registerTaskButtonListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".create-task-btn");
    if (!btn) return;

    const columnId = this.getDatasetFromClosest(btn, ".board-column", "columnId");
    if (columnId) {
      this.dialog = new CreateTaskDialog(columnId);
      this.openDialog(this.dialog);
    }
  }

  registerColumnButtonListener(e: Event, renderer?: any) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".create-column-btn");
    if (btn) this.showAddColumnForm(renderer);
  }

  registerColumnCancelButtonListener(e: Event, renderer?: any) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".cancel-column-btn");
    if (btn) this.hideAddColumnForm(renderer);
  }

  async registerColumnFormSubmitListener(e: Event, id: string) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, ".add-column-form");
    if (!form) return;

    e.preventDefault();
    const columnName = this.getFormValue(form, "columnName");
    if (columnName) {
      await this.performStoreOperation(
        () => appStore.createColumn(id, columnName),
        "Creation",
      );
    }
  }

  registerColumnThreeDotListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".column-menu-btn");
    if (!btn) return;

    const header = this.findClosestElement<HTMLElement>(btn, ".column-header");
    if (!header) return;

    const columnId = this.getDatasetFromClosest(btn, ".board-column", "columnId");
    const column = appStore.singleBoard?.columns.find(
      (c) => String(c.id) === columnId,
    );
    if (!column) return;

    e.stopPropagation();
    this.openColumnThreeDotDropdown(btn, header, column);
  }

  registerColumnRenameToFormListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#rename-column-btn");
    if (!btn) return;

    e.stopPropagation();
    this.toggleFormInMenuItem(btn, ".rename-column-form", () => this.dropdown?.renderRenameForm());
  }

  async registerColumnRenameFromSubmitListener(e: Event) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, ".rename-column-form");
    if (!form) return;

    e.preventDefault();
    const columnId = this.getDatasetFromClosest(form, ".board-column", "columnId");
    const newName = this.getFormValue(form, "column-rename");

    if (columnId && newName) {
      await this.performStoreOperation(
        () => appStore.updateColumn(columnId, { name: newName } as ColumnUpdate),
        "Update",
      );
    }
  }

  registerColumnRenameCancelButtonListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#cancel-rename-btn");
    if (!btn) return;

    e.stopPropagation();
    this.restoreButtonInMenuItem(btn, ".rename-column-form", "#rename-column-btn", () =>
      this.dropdown?.renderMenuBtn(this.dropdown.renameConfig)
    );
  }

  registerColumnSetLimitToFormListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#set-task-limit-btn");
    if (!btn) return;

    e.stopPropagation();
    this.toggleFormInMenuItem(btn, ".set-limit-form", () => this.dropdown?.renderSetLimitForm());
  }

  registerColumnSetLimitFormSubmitListener(e: Event) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, ".set-limit-form");
    if (!form) return;

    e.preventDefault();
    const columnId = this.getDatasetFromClosest(form, ".board-column", "columnId");
    const newLimit = this.getFormValue(form, "task-limit");

    if (columnId && newLimit) {
      this.performStoreOperation(
        () => appStore.updateColumn(columnId, { wip_limit: newLimit } as ColumnUpdate),
        "Update",
      );
    }
  }

  registerColumnSetLimitCancelButtonListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#cancel-limit-btn");
    if (!btn) return;

    e.stopPropagation();
    this.restoreButtonInMenuItem(btn, ".set-limit-form", "#set-task-limit-btn", () =>
      this.dropdown?.renderMenuBtn(this.dropdown.limitConfig)
    );
  }

  registerColumnDotMenuDeleteButtonListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#delete-column-btn");
    if (!btn) return;

    const columnId = this.getDatasetFromClosest(btn, ".board-column", "columnId");
    if (columnId) {
      this.performStoreOperation(
        () => appStore.deleteColumn(columnId),
        "Deletion",
      );
    }
  }

  // ============================================
  // Task Dropdown Listeners
  // ============================================

  registerTaskThreeDotListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".task-menu-btn");
    if (!btn) return;

    const task = this.findClosestElement<HTMLElement>(btn, ".task");
    if (!task) return;

    e.stopPropagation();
    this.openTaskThreeDotDropdown(btn, task);
  }

  registerTaskViewDetailsListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#view-task-btn");
    if (!btn) return;

    const taskId = this.getDatasetFromClosest(btn, ".task", "taskId");
    if (!taskId) return;

    const task = this.findTaskById(taskId);
    if (task) {
      this.taskDropdown?.close();
      this.openTaskDetailDialog(task);
    }
  }

  registerTaskDeleteListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#delete-task-btn");
    if (!btn) return;

    const taskId = this.getDatasetFromClosest(btn, ".task", "taskId");
    if (taskId) {
      this.performStoreOperation(
        () => appStore.deleteTask(taskId),
        "Task deletion",
      );
    }
  }

  registerTaskEditListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#edit-task-btn");
    if (!btn) return;

    const taskId = this.getDatasetFromClosest(btn, ".task", "taskId");
    if (!taskId) return;

    const task = this.findTaskById(taskId);
    if (task) {
      this.taskDropdown?.close();
      this.openTaskDetailDialog(task, "edit");
    }
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private findTaskById(taskId: string): Task | null {
    const board = appStore.singleBoard;
    if (!board) return null;

    for (const column of board.columns) {
      const task = column.tasks.find(t => String(t.id) === taskId);
      if (task) return task;
    }
    return null;
  }

  // ============================================
  // Dialog & Dropdown Management
  // ============================================

  private openColumnThreeDotDropdown(
    btn: HTMLButtonElement,
    header: HTMLElement,
    column: Column,
  ) {
    if (!this.dropdown) {
      this.dropdown = new ColumnThreeDotDropdown(btn, column);
      this.dropdown.setOnCloseCallback(() => { this.dropdown = null; });
      header.appendChild(this.dropdown.render());
      this.dropdown.open();
    } else {
      this.dropdown.close();
    }
  }

  private openTaskThreeDotDropdown(btn: HTMLButtonElement, task: HTMLElement) {
    const taskId = task.dataset.taskId;
    if (!taskId) return;

    if (!this.taskDropdown) {
      this.taskDropdown = new TaskThreeDotDropdown(btn, taskId);
      this.taskDropdown.setOnCloseCallback(() => { this.taskDropdown = null; });
      task.appendChild(this.taskDropdown.render());
      this.taskDropdown.open();
    } else {
      this.taskDropdown.close();
    }
  }

  private openTaskDetailDialog(task: Task, mode: TaskDetailMode = "view") {
    this.dialog = new TaskDetailDialog(task, mode);
    this.openDialog(this.dialog);
  }

  // ============================================
  // Add Column Form Management
  // ============================================

  private showAddColumnForm(renderer?: any) {
    const addColumnItem = document.querySelector(".add-column-item");
    if (!addColumnItem) return;

    addColumnItem.querySelector(".add-column")?.remove();

    const existingForm = addColumnItem.querySelector(".add-column-form");
    if (!existingForm && renderer) {
      const form = renderer.addColumnRenderer.renderAddColumnForm();
      addColumnItem.appendChild(form);
      form.querySelector("input")?.focus();
    }
  }

  private hideAddColumnForm(renderer?: any) {
    const addColumnItem = document.querySelector(".add-column-item");
    if (!addColumnItem) return;

    addColumnItem.querySelector(".add-column-form")?.remove();

    const existingSection = addColumnItem.querySelector(".add-column");
    if (!existingSection && renderer) {
      addColumnItem.appendChild(
        renderer.addColumnRenderer.renderAddColumnSection(),
      );
    }
  }
}
