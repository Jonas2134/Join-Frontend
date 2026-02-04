import { BoardColumnRenderer } from "./BoardColumnRenderer";
import { BoardAddColumnRenderer } from "./BoardAddColumnRenderer";
import type { Board } from "../../../core/types/board.types";

export class BoardContentRenderer {
  private columnRenderer: BoardColumnRenderer;
  addColumnRenderer: BoardAddColumnRenderer;

  constructor() {
    this.columnRenderer = new BoardColumnRenderer();
    this.addColumnRenderer = new BoardAddColumnRenderer();
  }

  renderBoardContent(container: HTMLElement, board: Board) {
    const columnsList = document.createElement("ol");
    columnsList.classList.add("board-columns-list");

    for (const column of board.columns) {
      columnsList.appendChild(this.columnRenderer.renderColumn(column));
    }

    const addColumnItem = this.addColumnRenderer.renderAddColumn();
    columnsList.appendChild(addColumnItem);
    container.appendChild(columnsList);
  }
}
