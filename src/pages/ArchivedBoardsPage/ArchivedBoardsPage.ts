import { AppLayout } from "../../layouts/AppLayout";
import { BasePage } from "../../components/bases/BasePage";
import { BoardRow } from "../DashboardPage/renderers/BoardRowRenderer";
import { BoardCard } from "../DashboardPage/renderers/BoardCardRenderer";
import { Button } from "../../components/common/Button";
import { appStore } from "../../core/store/AppStore";
import { ArchivedBoardsPageController } from "./ArchivedBoardsPageController";

import type { Boards } from "../../core/types/board.types";

import ListViewIcon from "../../assets/icons/list-view.svg?raw";
import GridViewIcon from "../../assets/icons/grid-view.svg?raw";

type ArchivedView = "list" | "card";
const STORAGE_KEY = "archived-boards-view";

export class ArchivedBoardsPage extends BasePage {
  private eventManager!: ArchivedBoardsPageController;
  private currentView: ArchivedView;

  constructor() {
    super(new AppLayout());
    this.eventManager = new ArchivedBoardsPageController();
    this.currentView = (localStorage.getItem(STORAGE_KEY) as ArchivedView) || "list";
  }

  // ============================================
  // Base render
  // ============================================

  renderHeader() {
    const header = document.createElement("header");
    header.classList.add("flex", "items-center", "justify-between");

    const title = document.createElement("h1");
    title.classList.add("text-(--color-light-blue)", "underline");
    title.textContent = "Archived Boards";

    const controls = document.createElement("div");
    controls.classList.add("flex", "items-center", "gap-3");

    const backBtn = new Button({
      id: "backToDashboardBtn",
      class: ["btn", "btn-white"],
      type: "button",
      title: "Back to Dashboard",
      text: "Back to Dashboard",
    }).renderBtn();

    controls.append(this.renderViewToggle(), backBtn);
    header.append(title, controls);
    return header;
  }

  renderRadioInput(name: string, id: string, value: string, mode: string) {
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = name;
    radioInput.id = id;
    radioInput.value = value;
    radioInput.classList.add("sr-only");
    if (this.currentView === mode) radioInput.checked = true;
    return radioInput;
  }

  renderInputLabel(labelFor: string, labelTitle: string, element: string) {
    const label = document.createElement("label");
    label.htmlFor = labelFor;
    label.title = labelTitle;
    label.classList.add("view-toggle-label");
    label.innerHTML = element;
    return label;
  }

  renderViewToggle() {
    const fieldset = document.createElement("fieldset");
    fieldset.id = "viewToggle";
    fieldset.classList.add("view-toggle");

    const legend = document.createElement("legend");
    legend.classList.add("sr-only");
    legend.textContent = "View mode";

    const listInput = this.renderRadioInput("archived-boards-view", "viewList", "list", "list");
    const listLabel = this.renderInputLabel("viewList", "List view", ListViewIcon);
    const cardInput = this.renderRadioInput("archived-boards-view", "viewCard", "card", "card");
    const cardLabel = this.renderInputLabel("viewCard", "Card view", GridViewIcon);

    fieldset.append(legend, listInput, listLabel, cardInput, cardLabel);
    return fieldset;
  }

  renderListHeader() {
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

  renderBoardSection() {
    const section = document.createElement("section");
    section.id = "archivedBoardsSection";

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

  // ============================================
  // render Board list / card grid
  // ============================================

  private getArchivedBoards(boards: Boards[]) {
    return boards.filter((b) => b.is_active === false);
  }

  private renderEmptyState(container: HTMLElement) {
    const empty = document.createElement("div");
    empty.classList.add("px-4", "py-8", "text-center", "text-(--color-blue-gray)");
    empty.textContent = "No archived boards.";
    container.appendChild(empty);
  }

  renderBoardList(container: HTMLElement, boards: Boards[]) {
    const archivedBoards = this.getArchivedBoards(boards);

    if (archivedBoards.length > 0) {
      archivedBoards.forEach((board) => {
        const row = new BoardRow(board);
        container.append(row.render());
      });
    } else {
      this.renderEmptyState(container);
    }
  }

  renderCardGrid(container: HTMLElement, boards: Boards[]) {
    const archivedBoards = this.getArchivedBoards(boards);

    if (archivedBoards.length > 0) {
      archivedBoards.forEach((board) => {
        const card = new BoardCard(board);
        container.append(card.render());
      });
    } else {
      this.renderEmptyState(container);
    }
  }

  // ============================================
  // Lifecycle
  // ============================================

  updateUI() {
    const oldSection = document.getElementById("archivedBoardsSection");
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

  switchView(view: ArchivedView) {
    if (view === this.currentView) return;
    this.currentView = view;
    localStorage.setItem(STORAGE_KEY, view);
    this.updateUI();
  }

  render() {
    const container = document.createElement("div");
    container.id = "archivedBoardsPage";
    container.classList.add("p-6", "space-y-8");
    container.appendChild(this.renderHeader());
    container.appendChild(this.renderBoardSection());
    return this.wrapWithLayout(container);
  }

  async initLoadBoards() {
    await appStore.loadDashboard();
    this.updateUI();
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  async mount() {
    this.initLoadBoards();

    const pageroot = document.getElementById("archivedBoardsPage");
    if (!pageroot) throw new Error("ArchivedBoardsPage not found!");

    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerNavigateBackListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerNavigateToBoardListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerThreeDotDropdownListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerUnarchiveBoardListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerDeleteBoardListener(e));
    this.events.on(pageroot, "change", (e: Event) => this.eventManager.registerViewToggleListener(e, (view) => this.switchView(view)));

    const reload = async () => this.initLoadBoards();
    this.events.on(window, "board:updated", reload);
    this.events.on(window, "board:deleted", reload);
  }
}
