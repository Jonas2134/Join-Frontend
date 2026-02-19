import { AppLayout } from "../../../layouts/AppLayout";
import { BaseBoardListPage } from "../shared/BaseBoardListPage";
import { DashboardStatsRenderer } from "./renderers/DashboardStatsRenderer";
import { Button } from "../../../components/common/Button";
import { appStore } from "../../../core/store/AppStore";
import { DashboardPageController } from "./DashboardPageController";
import { dashboardHeaderBtns } from "../../../core/constants/appDashboardBtns.config";

import type { Boards } from "../../../core/types/board.types";

export class DashboardPage extends BaseBoardListPage {
  private eventManager: DashboardPageController;
  private statsRenderer = new DashboardStatsRenderer();

  protected storageKey = "dashboard-view";
  protected sectionId = "dashboardsection";
  protected radioName = "dashboard-view";
  protected emptyStateMessage = "No active boards yet. Create your first board!";

  constructor() {
    super(new AppLayout());
    this.eventManager = new DashboardPageController();
    this.initCurrentView();
  }

  protected filterBoards(boards: Boards[]) {
    return boards.filter((b) => b.is_active === true);
  }

  // ============================================
  // Page-specific render
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

  // ============================================
  // Lifecycle
  // ============================================

  updateDashboardUI() {
    const statsContainer = document.getElementById("dashboardStats");
    if (statsContainer) {
      const newStats = this.statsRenderer.renderStats(appStore.boards);
      statsContainer.replaceWith(newStats);
    }

    this.updateBoardSectionUI();
  }

  render() {
    const container = document.createElement("div");
    container.id = "dashboardPage";
    container.classList.add("p-6", "space-y-8");
    container.appendChild(this.renderHeader());
    container.appendChild(this.statsRenderer.renderStats([]));
    container.appendChild(this.renderBoardSection());
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
