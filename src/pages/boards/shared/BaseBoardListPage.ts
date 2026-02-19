import { BasePage, type Layout } from "../../../components/bases/BasePage";
import { BoardRow } from "./renderers/BoardRowRenderer";
import { BoardCard } from "./renderers/BoardCardRenderer";
import { Button } from "../../../components/common/Button";
import { ViewToggle, type ViewMode } from "../../../components/common/ViewToggle";
import { appStore } from "../../../core/store/AppStore";
import EmptyBoardIcon from "../../../assets/icons/empty-board.svg?raw";

import type { Boards } from "../../../core/types/board.types";

export abstract class BaseBoardListPage extends BasePage {
  protected currentView: ViewMode;

  protected abstract storageKey: string;
  protected abstract sectionId: string;
  protected abstract radioName: string;
  protected abstract emptyStateMessage: string;

  protected emptyStateCTAText?: string;
  protected emptyStateCTAId?: string;

  protected abstract filterBoards(boards: Boards[]): Boards[];

  constructor(layout?: Layout) {
    super(layout);
    this.currentView = "list";
  }

  protected initCurrentView() {
    this.currentView = (localStorage.getItem(this.storageKey) as ViewMode) || "list";
  }

  // ============================================
  // Shared render methods
  // ============================================

  protected renderViewToggle() {
    const toggle = new ViewToggle({
      name: this.radioName,
      currentView: this.currentView,
    });
    return toggle.render();
  }

  protected renderListHeader() {
    const row = document.createElement("header");
    row.classList.add("board-list-header");
    row.innerHTML = `
      <span>Title</span>
      <span class="text-center">Members</span>
      <span class="text-center">Role</span>
      <span class="text-center">Created</span>
      <span class="text-center">Updated</span>
      <span></span>
    `;
    return row;
  }

  protected renderBoardSection() {
    const section = document.createElement("section");
    section.id = this.sectionId;

    if (this.currentView === "list") {
      const listContainer = document.createElement("ol");
      listContainer.id = "boardListContainer";
      section.append(this.renderListHeader(), listContainer);
    } else {
      const cardContainer = document.createElement("div");
      cardContainer.id = "boardCardContainer";
      cardContainer.classList.add("board-card-grid");
      section.appendChild(cardContainer);
    }

    return section;
  }

  protected renderEmptyState(container: HTMLElement) {
    const empty = document.createElement("div");
    empty.classList.add("empty-state");

    const iconWrapper = document.createElement("div");
    iconWrapper.innerHTML = EmptyBoardIcon;
    empty.appendChild(iconWrapper);

    const text = document.createElement("p");
    text.classList.add("empty-state-text");
    text.textContent = this.emptyStateMessage;
    empty.appendChild(text);

    if (this.emptyStateCTAText && this.emptyStateCTAId) {
      const cta = new Button({
        id: this.emptyStateCTAId,
        class: ["btn", "btn-blue"],
        type: "button",
        title: this.emptyStateCTAText,
        text: this.emptyStateCTAText,
      }).renderBtn();
      empty.appendChild(cta);
    }

    container.appendChild(empty);
  }

  protected renderBoardList(container: HTMLElement, boards: Boards[]) {
    const filtered = this.filterBoards(boards);

    if (filtered.length > 0) {
      filtered.forEach((board) => {
        const row = new BoardRow(board);
        container.append(row.render());
      });
    } else {
      this.renderEmptyState(container);
    }
  }

  protected renderCardGrid(container: HTMLElement, boards: Boards[]) {
    const filtered = this.filterBoards(boards);

    if (filtered.length > 0) {
      filtered.forEach((board) => {
        const card = new BoardCard(board);
        container.append(card.render());
      });
    } else {
      container.classList.remove("board-card-grid");
      this.renderEmptyState(container);
    }
  }

  // ============================================
  // Shared lifecycle methods
  // ============================================

  protected switchView(view: ViewMode) {
    if (view === this.currentView) return;
    this.currentView = view;
    localStorage.setItem(this.storageKey, view);
    this.updateBoardSectionUI();
  }

  protected updateBoardSectionUI() {
    const oldSection = document.getElementById(this.sectionId);
    if (!oldSection) return;

    const newSection = this.renderBoardSection();
    oldSection.replaceWith(newSection);

    if (this.currentView === "list") {
      const container = document.getElementById("boardListContainer");
      if (container) this.renderBoardList(container, appStore.boards);
    } else {
      const container = document.getElementById("boardCardContainer");
      if (container) this.renderCardGrid(container, appStore.boards);
    }
  }
}
