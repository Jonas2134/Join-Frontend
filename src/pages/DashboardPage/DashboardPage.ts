import { AppLayout } from "../../layouts/AppLayout";
import { BasePage } from "../../components/bases/BasePage";
import { BoardRow } from "./renderers/BoardRowRenderer";
import { BoardCard } from "./renderers/BoardCardRenderer";
import { DashboardStatsRenderer } from "./renderers/DashboardStatsRenderer";
import { Button } from "../../components/common/Button";
import { appStore } from "../../core/store/AppStore";
import { DashboardPageController } from "./DashboardPageController";
import { dashboardHeaderBtns } from "../../core/constants/appDashboardBtns.config";

import type { Boards } from "../../core/types/board.types";

import ListViewIcon from "../../assets/icons/list-view.svg?raw";
import GridViewIcon from "../../assets/icons/grid-view.svg?raw";

type DashboardView = "list" | "card";
const STORAGE_KEY = "dashboard-view";

export class DashboardPage extends BasePage {
  private eventManager!: DashboardPageController;
  private statsRenderer = new DashboardStatsRenderer();
  private currentView: DashboardView;

  constructor() {
    super(new AppLayout());
    this.eventManager = new DashboardPageController();
    this.currentView = (localStorage.getItem(STORAGE_KEY) as DashboardView) || "list";
  }

  // ============================================
  // Base render
  // ============================================

  renderHeader() {
    const header = document.createElement("header");
    header.classList.add("flex", "items-center", "justify-between");

    const title = document.createElement("h1");
    title.classList.add("text-(--color-light-blue)", "underline");
    title.textContent = "My Dashboard";

    const controls = document.createElement("div");
    controls.classList.add("flex", "items-center", "gap-3");

    const btns = dashboardHeaderBtns.map((config) =>
      new Button({ ...config }).renderBtn(),
    );

    controls.append(this.renderViewToggle(), ...btns);
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

    const listInput = this.renderRadioInput("dashboard-view", "viewList", "list", "list");
    const listLabel = this.renderInputLabel("viewList", "List view", ListViewIcon);
    const cardInput = this.renderRadioInput("dashboard-view", "viewCard", "card", "card");
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

  renderDashboard() {
    const section = document.createElement("section");
    section.id = "dashboardsection";

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

  private getActiveBoards(boards: Boards[]) {
    return boards.filter((b) => b.is_active === true);
  }

  private renderEmptyState(container: HTMLElement) {
    const empty = document.createElement("div");
    empty.classList.add("px-4", "py-8", "text-center", "text-(--color-blue-gray)");
    empty.textContent = "No active boards yet. Create your first board!";
    container.appendChild(empty);
  }

  renderBoardList(container: HTMLElement, boards: Boards[]) {
    const activeBoards = this.getActiveBoards(boards);

    if (activeBoards.length > 0) {
      activeBoards.forEach((board) => {
        const row = new BoardRow(board);
        container.append(row.render());
      });
    } else {
      this.renderEmptyState(container);
    }
  }

  renderCardGrid(container: HTMLElement, boards: Boards[]) {
    const activeBoards = this.getActiveBoards(boards);

    if (activeBoards.length > 0) {
      activeBoards.forEach((board) => {
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

  updateDashboardUI() {
    const statsContainer = document.getElementById("dashboardStats");
    if (statsContainer) {
      const newStats = this.statsRenderer.renderStats(appStore.boards);
      statsContainer.replaceWith(newStats);
    }

    const oldSection = document.getElementById("dashboardsection");
    if (!oldSection) return;

    const newSection = this.renderDashboard();
    oldSection.replaceWith(newSection);

    if (this.currentView === "list") {
      const container = document.getElementById("boardListContainer");
      if (container) this.renderBoardList(container, appStore.boards);
    } else {
      const container = document.getElementById("boardCardContainer");
      if (container) this.renderCardGrid(container, appStore.boards);
    }
  }

  switchView(view: DashboardView) {
    if (view === this.currentView) return;
    this.currentView = view;
    localStorage.setItem(STORAGE_KEY, view);
    this.updateDashboardUI();
  }

  render() {
    const container = document.createElement("div");
    container.id = "dashboardPage";
    container.classList.add("p-6", "space-y-8");
    container.appendChild(this.renderHeader());
    container.appendChild(this.statsRenderer.renderStats([]));
    container.appendChild(this.renderDashboard());
    return this.wrapWithLayout(container);
  }

  async initLoadDashboard() {
    await appStore.loadDashboard();
    console.log(appStore.boards);
    this.updateDashboardUI();
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  async mount() {
    this.initLoadDashboard();

    const pageroot = document.getElementById("dashboardPage");
    if (!pageroot) throw new Error("Dashboard not found!");

    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerBoardCreateListerner(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerNavigateToArchivedBoardsListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerNavigateToBoardListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerDashboardThreeDotDropdown(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerArchiveBoardListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerDeleteBoardListener(e));
    this.events.on(pageroot, "change", (e: Event) => this.eventManager.registerViewToggleListener(e, (view) => this.switchView(view)));

    const reload = async () => this.initLoadDashboard();
    this.events.on(window, "board:created", reload);
    this.events.on(window, "board:updated", reload);
    this.events.on(window, "board:deleted", reload);
  }
}
