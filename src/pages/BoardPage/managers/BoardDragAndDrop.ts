import { appStore } from "../../../core/store/AppStore";
import { toastManager } from "../../../core/ToastManager";
import type { Column } from "../../../core/types/board.types";

interface DragPayload {
  taskId: number;
  taskPosition: number;
  columnId: number;
}

interface DropPayload {
  targetColumnId: number;
  targetPosition: number;
}

export class BoardDragAndDrop {
  private onUpdate: () => void;
  private dragged: DragPayload | null = null;
  private droped: DropPayload | null = null;

  constructor(func: () => void) {
    this.onUpdate = func;
  }

  init(root: HTMLElement): void {
    this.initTaskDnD(root);
  }

  private initTaskDnD(root: HTMLElement): void {
    const draggables = root.querySelectorAll<HTMLElement>(".task");
    const droppables = root.querySelectorAll<HTMLElement>(".task-list");

    draggables.forEach((task) => {
      task.addEventListener("dragstart", () => this.onTaskDragstart(task));
      task.addEventListener("dragend", () => this.onTaskDragend(task));
    });

    droppables.forEach((zone) => {
      zone.addEventListener("dragover", (e) => this.onTaskDragover(e, zone, root));
    });
  }

  private onTaskDragstart(task: HTMLElement): void {
    const column = task.closest<HTMLElement>(".board-column");
    const list = task.closest<HTMLElement>(".task-list");

    if (!column || !list) return;

    this.dragged = {
      taskId: Number(task.dataset.taskId),
      taskPosition: Array.from(list.querySelectorAll<HTMLElement>(".task")).indexOf(task) + 1,
      columnId: Number(column.dataset.columnId),
    };
    this.droped = null;
    task.classList.add("is-dragging");
  }

  private isWipLimitReached(targetColumn: Column): boolean {
    if (targetColumn.wip_limit == null) return false;

    const limit = Number(targetColumn.wip_limit);
    return targetColumn.tasks.length >= limit;
  }

  private async onTaskDragend(task: HTMLElement): Promise<void> {
    task.classList.remove("is-dragging");

    if (!this.dragged || !this.droped) return;

    const hasChanged = this.dragged.columnId !== this.droped.targetColumnId
      || this.dragged.taskPosition !== this.droped.targetPosition;

    if (hasChanged) {
      await this.moveTask(this.dragged, this.droped);
    }

    this.resetDragState();
  }

  private async moveTask(dragged: DragPayload, droped: DropPayload): Promise<void> {
    const isColumnChange = dragged.columnId !== droped.targetColumnId;

    if (isColumnChange && this.exceedsWipLimit(droped.targetColumnId)) {
      return;
    }

    try {
      await appStore.updateTask(String(dragged.taskId), {
        column: droped.targetColumnId,
        position: droped.targetPosition,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toastManager.error("Task move failed: " + message);
    }

    this.onUpdate();
  }

  private exceedsWipLimit(targetColumnId: number): boolean {
    const targetColumn = appStore.singleBoard?.columns.find(
      (c) => Number(c.id) === targetColumnId,
    );

    if (targetColumn && this.isWipLimitReached(targetColumn)) {
      toastManager.error(
        `Column "${targetColumn.name}" has reached its WIP limit of ${targetColumn.wip_limit}.`,
      );
      this.onUpdate();
      return true;
    }

    return false;
  }

  private resetDragState(): void {
    this.dragged = null;
    this.droped = null;
  }

  private insertAboveTask(
    zone: HTMLElement,
    mouseY: number
  ): HTMLElement | null {
    const els = zone.querySelectorAll<HTMLElement>(".task:not(.is-dragging)");

    let closestTask: HTMLElement | null = null;
    let closetstOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
      const { top } = task.getBoundingClientRect();
      const offset = mouseY - top;

      if (offset < 0 && offset > closetstOffset) {
        closetstOffset = offset;
        closestTask = task;
      }
    });
    return closestTask;
  }

  private onTaskDragover(
    e: DragEvent,
    zone: HTMLElement,
    root: HTMLElement
  ): void {
    e.preventDefault();

    const curTask = root.querySelector<HTMLElement>(".is-dragging");
    if (!curTask) return;

    const bottomTask = this.insertAboveTask(zone, e.clientY);
    if (!bottomTask) {
      if (zone.lastElementChild !== curTask) zone.appendChild(curTask);
    } else if (bottomTask.previousElementSibling !== curTask) {
      zone.insertBefore(curTask, bottomTask);
    }

    const column = zone.closest<HTMLElement>(".board-column");
    if (!column) return;
    const tasks = Array.from(zone.querySelectorAll<HTMLElement>(".task"));

    this.droped = {
      targetColumnId: Number(column.dataset.columnId),
      targetPosition: tasks.indexOf(curTask) + 1,
    };
  }
}
