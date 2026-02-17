import { Button } from "../../../components/common/Button";
import { dashboardThreeDotBtn } from "../../../core/constants/appThreeDot.config";
import type { Boards } from "../../../core/types/board.types";

export class BoardCard {
  private element: HTMLDivElement;
  private board: Boards;

  constructor(board: Boards) {
    this.board = board;
    this.element = document.createElement("div");
    this.element.classList.add("board-card");
    this.element.dataset.boardId = String(this.board.id);
    this.element.dataset.isOwner = String(this.board.is_user_owner);
    this.element.dataset.boardTitle = this.board.title;
  }

  private renderHeader() {
    const header = document.createElement("div");
    header.classList.add("board-card-header");

    const title = document.createElement("h3");
    title.classList.add("board-card-title");
    title.textContent = this.board.title;

    const menu = document.createElement("menu");
    menu.classList.add("board-card-menu");
    menu.appendChild(new Button(dashboardThreeDotBtn).renderBtn());

    header.append(title, menu);
    return header;
  }

  private renderBadge() {
    const badge = document.createElement("span");
    badge.classList.add("board-card-badge");
    if (this.board.is_user_owner) {
      badge.classList.add("board-card-badge--owner");
      badge.textContent = "Owner";
    } else {
      badge.classList.add("board-card-badge--member");
      badge.textContent = "Member";
    }
    return badge;
  }

  private renderMeta() {
    const meta = document.createElement("div");
    meta.classList.add("board-card-meta");

    const members = document.createElement("span");
    members.classList.add("board-card-meta-item");
    members.textContent = `${this.board.member_count} Member${this.board.member_count !== 1 ? "s" : ""}`;

    meta.appendChild(members);

    if (this.board.created_at) {
      const created = document.createElement("span");
      created.classList.add("board-card-meta-item");
      const date = new Date(this.board.created_at);
      created.textContent = `Created: ${date.toLocaleDateString()}`;
      meta.appendChild(created);
    }

    if (this.board.updated_at) {
      const updated = document.createElement("span");
      updated.classList.add("board-card-meta-item");
      const date = new Date(this.board.updated_at);
      updated.textContent = `Updated: ${date.toLocaleDateString()}`;
      meta.appendChild(updated);
    }

    return meta;
  }

  render() {
    this.element.append(
      this.renderHeader(),
      this.renderBadge(),
      this.renderMeta(),
    );
    return this.element;
  }
}
