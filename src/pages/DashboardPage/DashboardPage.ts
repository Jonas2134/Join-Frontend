import { AppLayout } from "../../layouts/AppLayout";
import { BasePage } from "../../components/bases/BasePage";
import { BoardRow } from "./renderers/BoardRowRenderer";
import { BoardCard } from "./renderers/BoardCardRenderer";
import { DashboardStatsRenderer } from "./renderers/DashboardStatsRenderer";
import { appStore } from "../../core/store/AppStore";
import { DashboardPageController } from "./DashboardPageController";
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

    controls.appendChild(this.renderViewToggle());

    const archivedBtn = document.createElement("button");
    archivedBtn.id = "archivedBoardsBtn";
    archivedBtn.classList.add("btn", "btn-white");
    archivedBtn.textContent = "Archived Boards";

    const createBtn = document.createElement("button");
    createBtn.id = "createBoardBtn";
    createBtn.classList.add("btn", "btn-blue");
    createBtn.textContent = "+ Create Board";

    controls.append(archivedBtn, createBtn);
    header.append(title, controls);
    return header;
  }

  renderViewToggle() {
    const toggle = document.createElement("div");
    toggle.id = "viewToggle";
    toggle.classList.add("view-toggle");

    const listBtn = document.createElement("button");
    listBtn.type = "button";
    listBtn.dataset.view = "list";
    listBtn.title = "List view";
    listBtn.classList.add("view-toggle-btn");
    if (this.currentView === "list") listBtn.classList.add("view-toggle-btn--active");
    listBtn.innerHTML = ListViewIcon;

    const cardBtn = document.createElement("button");
    cardBtn.type = "button";
    cardBtn.dataset.view = "card";
    cardBtn.title = "Card view";
    cardBtn.classList.add("view-toggle-btn");
    if (this.currentView === "card") cardBtn.classList.add("view-toggle-btn--active");
    cardBtn.innerHTML = GridViewIcon;

    toggle.append(listBtn, cardBtn);
    return toggle;
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
      section.appendChild(this.renderListHeader());
      const listContainer = document.createElement("ol");
      listContainer.id = "boardListContainer";
      section.appendChild(listContainer);
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
    this.updateViewToggleUI();
    this.updateDashboardUI();
  }

  private updateViewToggleUI() {
    const toggle = document.getElementById("viewToggle");
    if (!toggle) return;

    toggle.querySelectorAll(".view-toggle-btn").forEach((btn) => {
      const el = btn as HTMLButtonElement;
      if (el.dataset.view === this.currentView) {
        el.classList.add("view-toggle-btn--active");
      } else {
        el.classList.remove("view-toggle-btn--active");
      }
    });
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
    this.events.on(pageroot, "click", (e: Event) => this.eventManager.registerViewToggleListener(e, (view) => this.switchView(view)));

    const reload = async () => this.initLoadDashboard();
    this.events.on(window, "board:created", reload);
    this.events.on(window, "board:updated", reload);
    this.events.on(window, "board:deleted", reload);
  }
}
