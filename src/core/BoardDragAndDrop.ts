import { appStore } from "../store/AppStore";

type DragType = "column" | "task";

interface DragPayload {
  type: DragType;
  id: number;
  fromColumnId?: number;
  fromPosition?: number;
  fromColumnPosition?: number;
}

export class BoardDragAndDrop {
  private dragged: DragPayload | null = null;
  private boardId: string;
  private onUpdate: () => void;

  constructor(boardId: string, func: () => void) {
    this.boardId = boardId;
    this.onUpdate = func;
  }

  init(root: HTMLElement): void {
    this.initColumnDnD(root);
    this.initTaskDnD(root);
    this.initTaskDropTargets(root);
    this.initColumnDropTargets(root);
  }

  private initColumnDnD(root: HTMLElement): void {
    const columns = Array.from(root.querySelectorAll<HTMLElement>(".board-column"));

    columns.forEach((columnEl, index) => {
      columnEl.draggable = true;

      columnEl.addEventListener("dragstart", () => {
        this.dragged = {
          type: "column",
          id: Number(columnEl.dataset.columnId),
          fromPosition: index + 1,
        };
      });
    });
  }

  private initColumnDropTargets(root: HTMLElement): void {
    const columns = Array.from(root.querySelectorAll<HTMLElement>(".board-column"));

    columns.forEach((col, index) => {
      col.addEventListener("dragover", (e) => {
        if (this.dragged?.type === "column") {
          e.preventDefault();
        }
      });

      col.addEventListener("drop", async () => {
        if (!this.dragged || this.dragged.type !== "column") return;

        const toPosition = index + 1;

        if (this.dragged.fromColumnPosition === toPosition) return;

        await appStore.updateColumn(this.dragged.id.toString(), { position: toPosition });
        await appStore.loadBoard(this.boardId);
        this.onUpdate();
      });
    });
  }

  private initTaskDnD(root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>(".task").forEach((taskEl) => {
      taskEl.draggable = true;

      taskEl.addEventListener("dragstart", (e) => {
        e.stopPropagation();
        this.setColumnsDraggable(root, false);

        const columnEl = taskEl.closest<HTMLElement>(".board-column");
        if (!columnEl) return;
        const tasks = Array.from(columnEl.querySelectorAll<HTMLElement>(".task"));

        this.dragged = {
          type: "task",
          id: Number(taskEl.dataset.taskId),
          fromColumnId: Number(columnEl?.dataset.columnId),
          fromPosition: tasks.indexOf(taskEl),
        };
      });

      taskEl.addEventListener("dragend", () => {
        this.setColumnsDraggable(root, true);
        this.dragged = null;
      });
    });
  }

  private initTaskDropTargets(root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>("task-list").forEach((list) => {
      list.addEventListener("dragover", (e) => {
        if (this.dragged?.type === "task") {
          e.preventDefault();
        }
      });

      list.addEventListener("drop", async (e) => {
        if (!this.dragged || this.dragged.type !== "task") return;

        const columnEl = list.closest<HTMLElement>(".board-column");
        if (!columnEl) return;

        const toColumnId = Number(columnEl.dataset.columnId);
        const tasks = Array.from(list.querySelectorAll<HTMLElement>(".task"));

        let toPosition = tasks.length + 1;
        for (let i = 0; i < tasks.length; i++) {
          const rect = tasks[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            toPosition = i + 1;
            break;
          }
        }

        if (this.dragged.fromColumnId === toColumnId && this.dragged.fromColumnPosition === toPosition) return;

        await appStore.updateTask(this.dragged.id.toString(), { column: toColumnId, position: toPosition });
        await appStore.loadBoard(this.boardId);
        this.onUpdate();
      });
    });
  }

  private setColumnsDraggable(root: HTMLElement, value: boolean): void {
    root.querySelectorAll<HTMLElement>(".board-column").forEach((col) => {
      col.draggable = value;
    });
  }
}
