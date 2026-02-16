import { Button } from "../../../components/common/Button";
import { dashboardThreeDotBtn } from "../../../core/constants/appThreeDot.config";
import type { Boards } from "../../../core/types/board.types";

export class BoardRow {
  private element: HTMLLIElement;
  private board: Boards;

  constructor(board: Boards) {
    this.board = board;
    this.element = document.createElement("li");
    this.element.classList.add("board-row");
    this.element.dataset.boardId = String(this.board.id);
    this.element.dataset.isOwner = String(this.board.is_user_owner);
    this.element.dataset.boardTitle = this.board.title;
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
    span.textContent = String(this.board.member_count);
    return span;
  }

  renderRoleSpan() {
    const span = document.createElement("span");
    span.classList.add("board-row-role");
    span.textContent = this.board.is_user_owner ? "Owner" : "Member";
    if (this.board.is_user_owner) {
      span.classList.add("board-row-role--owner");
    }
    return span;
  }

  renderDateSpan(dateStr?: string) {
    const span = document.createElement("span");
    span.classList.add("board-row-date");
    if (dateStr) {
      const date = new Date(dateStr);
      span.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      span.textContent = "-";
    }
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
    this.element.append(
      this.renderTitleSpan(),
      this.renderMemberCountSpan(),
      this.renderRoleSpan(),
      this.renderDateSpan(this.board.created_at),
      this.renderDateSpan(this.board.updated_at),
      this.renderMenuRow(),
    );
    return this.element;
  }
}
