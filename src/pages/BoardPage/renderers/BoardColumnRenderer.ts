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

    const columnSection = document.createElement("section");
    columnSection.classList.add("flex", "flex-col", "gap-4");

    const header = this.renderColumnHeader(column);
    const taskList = this.renderColumnTaskContent(column);
    const footer = this.renderColumnFooter();

    columnSection.append(header, taskList, footer);
    columnItem.appendChild(columnSection);
    return columnItem;
  }

  renderColumnHeader(column: Column) {
    const header = document.createElement("header");
    header.classList.add("column-header");

    const title = document.createElement("h4");
    title.classList.add("text-xl", "text-(--color-light-blue)", "underline");
    title.textContent = column.name;

    const threeDot = new Button(threeDotBtn).renderBtn();

    header.append(title, threeDot);
    return header;
  }

  renderColumnFooter() {
    const footer = document.createElement("footer");
    footer.classList.add("flex", "justify-center");

    const addTaskBtn = new Button(boardAddTaskBtn).renderBtn();

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
