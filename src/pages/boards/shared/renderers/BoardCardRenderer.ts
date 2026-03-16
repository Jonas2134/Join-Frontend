import { Button } from "../../../../components/common/Button";
import { dashboardThreeDotBtn } from "../../../../core/constants/appThreeDot.config";
import type { Boards } from "../../../../core/types/board.types";

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
    header.classList.add("flex", "items-start", "justify-between", "gap-2");

    const title = document.createElement("h3");
    title.classList.add("text-lg", "font-semibold", "text-gray-800", "truncate");
    title.textContent = this.board.title;

    const menu = document.createElement("menu");
    menu.classList.add("flex", "items-center", "shrink-0");
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
    members.classList.add("truncate");
    members.textContent = `${this.board.member_count} Member${this.board.member_count !== 1 ? "s" : ""}`;

    const created = document.createElement("span");
    created.classList.add("truncate");
    const createDate = new Date(this.board.created_at);
    created.textContent = `Created: ${createDate.toLocaleDateString()}`;

    const updated = document.createElement("span");
    updated.classList.add("truncate");
    const updateDate = new Date(this.board.updated_at);
    updated.textContent = `Updated: ${updateDate.toLocaleDateString()}`;

    meta.append(members, created, updated);
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
