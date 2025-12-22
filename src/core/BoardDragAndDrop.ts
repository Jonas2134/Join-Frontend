type DragType = "column" | "task";

interface DragPayload {
  type: DragType;
  id: number;
  fromColumnId?: number;
  fromPosition: number;
}

export class BoardDragAndDrop {
  private dragged: DragPayload | null = null;

  init(root: HTMLElement): void {
    this.initDraggebles(root);
    this.initDropZones(root);
  }

  /* ---------- Draggables ---------- */

  private initDraggebles(root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>(".board-column").forEach((el, index) => {
      el.draggable = true;

      el.addEventListener("dragstart", () => {
        this.dragged = {
          type: "column",
          id: Number(el.dataset.id!),
          fromPosition: index + 1,
        };
      });
    });

    root.querySelectorAll<HTMLElement>(".task").forEach((el) => {
      el.draggable = true;

      el.addEventListener("dragstart", () => {
        const columnEl = el.closest<HTMLElement>(".board-column");
        this.dragged = {
          type: "task",
          id: Number(el.dataset.taskId),
          fromColumnId: Number(columnEl?.dataset.columnId),
          fromPosition: this.getTaskPosition(el),
        };
      });
    });
  }

  /* ---------- Drop Zones ---------- */

  private initDropZones(root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>(".column-drop-zone").forEach((zone) => {
      zone.addEventListener("dragover", (e) => e.preventDefault());

      zone.addEventListener("drop", () => {
        if (!this.dragged || this.dragged.type !== "column") return;

        const toPosition = Number(zone.dataset.position);

        this.onColumnDrop(
          this.dragged.id,
          this.dragged.fromPosition,
          toPosition
        );

        this.dragged = null;
      });
    });

    root.querySelectorAll<HTMLElement>("task-drop-zone").forEach((zone) => {
      zone.addEventListener("dragover", (e) => e.preventDefault());

      zone.addEventListener("drop", () => {
        if (!this.dragged || this.dragged.type !== "task") return;

        const columnEl = zone.closest<HTMLElement>(".board-column");
        const toColumnId = Number(columnEl?.dataset.columnId);
        const toPosition = Number(zone.dataset.position);

        this.onTaskDrop(
          this.dragged.id,
          this.dragged.fromColumnId!,
          toColumnId,
          this.dragged.fromPosition,
          toPosition
        );

        this.dragged = null;
      });
    });
  }

  /* ---------- Helpers ---------- */

  private getTaskPosition(taskEl: HTMLElement): number {
    const list = taskEl.parentElement;
    if (!list) return 1;
    const tasks = Array.from(list.querySelectorAll(".task"));
    return tasks.indexOf(taskEl) + 1;
  }

  /* ---------- Hooks (Backend / Store) ---------- */

  protected onColumnDrop(
    columnId: number,
    from: number,
    to: number
  ): void {
    console.log("COLUMN MOVE", { columnId, from, to });
  }

  protected onTaskDrop(
    taskId: number,
    fromColumn: number,
    toColumn: number,
    from: number,
    to: number
  ): void {
    console.log("TASK MOVE", { taskId, fromColumn, toColumn, from, to });
  }
}
