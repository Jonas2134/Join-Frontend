import { Button } from "../../../components/common/Button";
import { dashboardThreeDotBtn } from "../../../core/constants/appThreeDot.config";
import type { Board } from "../../../core/types/board.types";

export class BoardRow {
  private element: HTMLDivElement;
  private board: Board;

  constructor(board: Board) {
    this.board = board;
    this.element = document.createElement("div");
    this.element.classList.add("board-row");
    this.element.dataset.boardId = String(this.board.id);
  }

  renderTitleSpan() {
    const span = document.createElement("span");
    span.classList.add("board-row-title");
    span.textContent = this.board.title;
    return span;
  }

  renderMemberCountSpan() {
    const span = document.createElement("span");
    span.classList.add("board-row-members");
    span.textContent = String(this.board.members?.length ?? 0);
    return span;
  }

  renderMenuRow() {
    const menu = document.createElement("menu");
    menu.classList.add("board-row-menu");

    const threeDotBtn = new Button(dashboardThreeDotBtn).renderBtn();

    menu.appendChild(threeDotBtn);
    return menu
  }

  render() {
    const titleSpan = this.renderTitleSpan();
    const memberSpan = this.renderMemberCountSpan();
    const rowMenu = this.renderMenuRow();
    
    this.element.append(titleSpan, memberSpan, rowMenu);
    return this.element;
  }
}
