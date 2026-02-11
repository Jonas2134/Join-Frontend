import { BoardTaskRenderer } from "./BoardTaskRenderer";
import { Button } from "../../../components/common/Button";
import { threeDotBtn } from "../../../core/constants/appThreeDot.config";
import { boardAddTaskBtn } from "../../../core/constants/appBoardBtns.config";
import type { Column } from "../../../core/types/board.types";

export class BoardColumnRenderer {
  private taskRenderer: BoardTaskRenderer;

  constructor() {
    this.taskRenderer = new BoardTaskRenderer();
  }

  renderColumn(column: Column): HTMLElement {
    const columnItem = document.createElement("li");
    columnItem.classList.add("board-column");
    columnItem.dataset.columnId = String(column.id);

    const columnContainer = document.createElement("div");
    columnContainer.classList.add("flex", "flex-col", "gap-4");

    const header = this.renderColumnHeader(column);
    const taskList = this.renderColumnTaskContent(column);
    const footer = this.renderColumnFooter(column);

    columnContainer.append(header, taskList, footer);
    columnItem.appendChild(columnContainer);
    return columnItem;
  }

  renderColumnHeader(column: Column) {
    const header = document.createElement("header");
    header.classList.add("border-b", "border-b-(--color-light-gray)");

    const headline = document.createElement("div");
    headline.classList.add("column-header");

    const title = document.createElement("h4");
    title.classList.add("column-header-headline");
    title.textContent = column.name;

    const threeDot = new Button(threeDotBtn).renderBtn();

    headline.append(title, threeDot);
    header.append(headline, this.renderColumnProgress(column));
    return header;
  }

  private renderColumnProgress(column: Column): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("column-progress");

    const taskCount = column.tasks.length;
    const wipLimit = column.wip_limit ? parseInt(column.wip_limit) : null;

    if (wipLimit) {
      const ratio = taskCount / wipLimit;
      const percentage = Math.min(ratio * 100, 100);

      const bar = document.createElement("div");
      bar.classList.add("column-progress-bar");

      const fill = document.createElement("div");
      fill.classList.add("column-progress-fill");
      fill.style.width = `${percentage}%`;

      if (ratio >= 1) {
        fill.classList.add("bg-red-500");
      } else if (ratio >= 0.8) {
        fill.classList.add("bg-amber-400");
      } else {
        fill.classList.add("bg-green-500");
      }

      bar.appendChild(fill);

      const text = document.createElement("span");
      text.classList.add("column-progress-text");
      text.textContent = `${taskCount}/${wipLimit}`;

      container.append(bar, text);
    } else {
      const text = document.createElement("span");
      text.classList.add("column-progress-text");
      text.textContent = taskCount === 1 ? "1 Task" : `${taskCount} Tasks`;

      container.appendChild(text);
    }

    return container;
  }

  renderColumnFooter(column: Column) {
    const footer = document.createElement("footer");
    footer.classList.add("flex", "justify-center");

    const addTaskBtn = new Button(boardAddTaskBtn).renderBtn();

    const wipLimit = column.wip_limit ? parseInt(column.wip_limit) : null;
    if (wipLimit && column.tasks.length >= wipLimit) {
      addTaskBtn.disabled = true;
      addTaskBtn.title = "WIP limit reached";
    }

    footer.appendChild(addTaskBtn);
    return footer;
  }

  renderColumnTaskContent(column: Column) {
    const taskList = document.createElement("ol");
    taskList.classList.add("task-list", "scrollbar-hide");

    for (const task of column.tasks) {
      taskList.appendChild(this.taskRenderer.renderTask(task));
    }

    return taskList;
  }
}
