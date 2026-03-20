import { boardStore } from "../../../core/store/BoardStore";
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

  private touchActive = false;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private touchGhost: HTMLElement | null = null;
  private autoScrollFrame: number | null = null;

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

      task.addEventListener("touchstart", (e) => this.onTouchStart(e, task), { passive: true });
      task.addEventListener("touchmove", (e) => this.onTouchMove(e, root), { passive: false });
      task.addEventListener("touchend", () => this.onTouchEnd(task));
    });

    droppables.forEach((zone) => {
      zone.addEventListener("dragover", (e) => this.onTaskDragover(e, zone, root));
    });
  }

  // ============================================
  // Mouse Drag Events
  // ============================================

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
    this.stopAutoScroll();
    task.classList.remove("is-dragging");

    if (!this.dragged || !this.droped) return;

    const hasChanged = this.dragged.columnId !== this.droped.targetColumnId
      || this.dragged.taskPosition !== this.droped.targetPosition;

    if (hasChanged) {
      await this.moveTask(this.dragged, this.droped);
    }

    this.resetDragState();
  }

  private onTaskDragover(
    e: DragEvent,
    zone: HTMLElement,
    root: HTMLElement
  ): void {
    e.preventDefault();

    const curTask = root.querySelector<HTMLElement>(".is-dragging");
    if (!curTask) return;

    this.reorderInZone(zone, curTask, e.clientY);
    this.handleAutoScroll(root, e.clientX);
  }

  // ============================================
  // Touch Events
  // ============================================

  private onTouchStart(e: TouchEvent, task: HTMLElement): void {
    const touch = e.touches[0];
    this.longPressTimer = setTimeout(() => {
      this.touchActive = true;
      this.onTaskDragstart(task);
      task.style.opacity = "0.4";
      this.createTouchGhost(task, touch.clientX, touch.clientY);
    }, 300);
  }

  private onTouchMove(e: TouchEvent, root: HTMLElement): void {
    if (!this.touchActive) {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
      return;
    }

    e.preventDefault();

    const touch = e.touches[0];
    this.moveTouchGhost(touch.clientX, touch.clientY);

    const curTask = root.querySelector<HTMLElement>(".is-dragging");
    if (!curTask) return;

    this.handleAutoScroll(root, touch.clientX);

    curTask.hidden = true;
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    curTask.hidden = false;

    let zone = elementBelow?.closest<HTMLElement>(".task-list");
    if (!zone) {
      const column = elementBelow?.closest<HTMLElement>(".board-column");
      zone = column?.querySelector<HTMLElement>(".task-list") ?? null;
    }
    if (!zone) return;

    this.reorderInZone(zone, curTask, touch.clientY);
  }

  private onTouchEnd(task: HTMLElement): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (this.touchActive) {
      this.touchActive = false;
      task.style.opacity = "";
      this.removeTouchGhost();
      this.onTaskDragend(task);
    }
  }

  private createTouchGhost(task: HTMLElement, x: number, y: number): void {
    const ghost = task.cloneNode(true) as HTMLElement;
    const rect = task.getBoundingClientRect();

    ghost.style.position = "fixed";
    ghost.style.width = `${rect.width}px`;
    ghost.style.left = `${x - rect.width / 2}px`;
    ghost.style.top = `${y - 20}px`;
    ghost.style.opacity = "0.85";
    ghost.style.pointerEvents = "none";
    ghost.style.zIndex = "1000";
    ghost.style.transform = "rotate(2deg) scale(1.05)";
    ghost.classList.remove("is-dragging");

    document.body.appendChild(ghost);
    this.touchGhost = ghost;
  }

  private moveTouchGhost(x: number, y: number): void {
    if (!this.touchGhost) return;
    const width = this.touchGhost.offsetWidth;
    this.touchGhost.style.left = `${x - width / 2}px`;
    this.touchGhost.style.top = `${y - 20}px`;
  }

  private removeTouchGhost(): void {
    this.touchGhost?.remove();
    this.touchGhost = null;
  }

  // ============================================
  // Shared Logic
  // ============================================

  private reorderInZone(zone: HTMLElement, curTask: HTMLElement, clientY: number): void {
    const bottomTask = this.insertAboveTask(zone, clientY);
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

  private isWipLimitReached(targetColumn: Column): boolean {
    if (targetColumn.wip_limit == null) return false;

    const limit = Number(targetColumn.wip_limit);
    return targetColumn.tasks.length >= limit;
  }

  private async moveTask(dragged: DragPayload, droped: DropPayload): Promise<void> {
    const isColumnChange = dragged.columnId !== droped.targetColumnId;

    if (isColumnChange && this.exceedsWipLimit(droped.targetColumnId)) {
      return;
    }

    try {
      await boardStore.updateTask(String(dragged.taskId), {
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
    const targetColumn = boardStore.singleBoard?.columns.find(
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
    let closestDistance = Number.POSITIVE_INFINITY;

    els.forEach((task) => {
      const rect = task.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      if (mouseY < midpoint) {
        const distance = midpoint - mouseY;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestTask = task;
        }
      }
    });
    return closestTask;
  }

  private handleAutoScroll(root: HTMLElement, clientX: number): void {
    this.stopAutoScroll();

    const scrollContainer = (root.firstElementChild as HTMLElement) ?? root;
    if (!scrollContainer || scrollContainer.scrollWidth <= scrollContainer.clientWidth) return;

    const rect = scrollContainer.getBoundingClientRect();
    const edgeThreshold = 50;
    const scrollSpeed = 8;

    let scrollDir = 0;
    if (clientX < rect.left + edgeThreshold) {
      scrollDir = -scrollSpeed;
    } else if (clientX > rect.right - edgeThreshold) {
      scrollDir = scrollSpeed;
    }

    if (scrollDir !== 0) {
      const scroll = () => {
        scrollContainer.scrollLeft += scrollDir;
        this.autoScrollFrame = requestAnimationFrame(scroll);
      };
      this.autoScrollFrame = requestAnimationFrame(scroll);
    }
  }

  private stopAutoScroll(): void {
    if (this.autoScrollFrame) {
      cancelAnimationFrame(this.autoScrollFrame);
      this.autoScrollFrame = null;
    }
  }
}
