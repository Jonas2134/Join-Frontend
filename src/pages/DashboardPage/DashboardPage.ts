import { AppLayout } from "../../layouts/AppLayout";
import { BasePage } from "../../components/bases/BasePage";
import { BoardRow } from "./renderers/BoardRowRenderer";
import { appStore } from "../../core/store/AppStore";
import { DashboardEventManager } from "./DashboardEventManager";
import type { Board } from "../../core/types/board.types";

export class DashboardPage extends BasePage {
  private eventManager!: DashboardEventManager;

  constructor() {
    super(new AppLayout());
    this.eventManager = new DashboardEventManager();
  }

  // ============================================
  // Base render
  // ============================================

  renderHeader() {
    const header = document.createElement("header");
    header.classList.add("flex", "items-center", "justify-between");
    header.innerHTML = `
      <h1 class="text-(--color-light-blue) underline">My Boards</h1>
      <div class="flex items-center gap-3">
        <button id="archivedBoardsBtn" class="btn btn-white">Archived Boards</button>
        <button id="createBoardBtn" class="btn btn-blue">+ Create Board</button>
      </div>
    `;
    return header;
  }

  renderListHeader() {
    const row = document.createElement("header");
    row.classList.add("board-list-header");
    row.innerHTML = `
      <span>Title</span>
      <span class="text-center">Members</span>
      <span></span>
    `;
    return row;
  }

  renderDashboard() {
    const section = document.createElement("section");
    section.id = "dashboardsection";

    section.appendChild(this.renderListHeader());

    const listContainer = document.createElement("main");
    listContainer.id = "boardListContainer";
    section.appendChild(listContainer);

    return section;
  }

  // ============================================
  // render Board list
  // ============================================

  renderBoardList(container: HTMLElement, boards: Board[]) {
    const activeBoards = boards.filter((b) => b.is_active === true);

    if (activeBoards.length > 0) {
      activeBoards.forEach((board) => {
        const row = new BoardRow(board);
        container.append(row.render());
      });
    } else {
      const empty = document.createElement("div");
      empty.classList.add("px-4", "py-8", "text-center", "text-(--color-blue-gray)");
      empty.textContent = "No active boards yet. Create your first board!";
      container.appendChild(empty);
    }
  }

  // ============================================
  // Lifecycle
  // ============================================

  updateDashboardUI() {
    const container = document.getElementById("boardListContainer");
    if (!container) return;

    container.innerHTML = "";
    this.renderBoardList(container, appStore.boards);
  }

  render() {
    const container = document.createElement("div");
    container.id = "dashboardPage";
    container.classList.add("p-6", "space-y-8");
    container.appendChild(this.renderHeader());
    container.appendChild(this.renderDashboard());
    return this.wrapWithLayout(container);
  }

  async initLoadDashboard() {
    await appStore.loadDashboard();
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

    this.events.on(window, "dashboard:reload", async () => this.initLoadDashboard());
  }
}
