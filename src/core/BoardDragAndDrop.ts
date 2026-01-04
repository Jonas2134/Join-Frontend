import { appStore } from "../store/AppStore";

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
      task.addEventListener("dragstart", this.onTaskDragstart.bind(this, task));
      task.addEventListener("dragend", this.onTaskDragend.bind(this, task));
    });

    droppables.forEach((zone) => {
      zone.addEventListener("dragover", e => this.onTaskDragover(e, zone, root));
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

  private async onTaskDragend(task: HTMLElement): Promise<void> {
    task.classList.remove("is-dragging");

    if (!this.dragged || !this.droped) return;

    const sameColumn = this.dragged.columnId === this.droped.targetColumnId;
    const samePosition = this.dragged.taskPosition === this.droped.targetPosition;

    if (sameColumn && samePosition) {
      this.dragged = null;
      this.droped = null;
      return;
    }

    await appStore.updateTask(String(this.dragged.taskId), {
      column: this.droped.targetColumnId,
      position: this.droped.targetPosition,
    });

    this.dragged = null;
    this.droped = null;
    this.onUpdate();
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
      if (zone.lastElementChild !== curTask) {
        zone.appendChild(curTask);
      }
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
