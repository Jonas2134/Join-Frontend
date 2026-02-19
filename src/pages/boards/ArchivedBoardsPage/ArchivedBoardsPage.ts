import { AppLayout } from "../../../layouts/AppLayout";
import { BaseBoardListPage } from "../shared/BaseBoardListPage";
import { Button } from "../../../components/common/Button";
import { appStore } from "../../../core/store/AppStore";
import { ArchivedBoardsPageController } from "./ArchivedBoardsPageController";

import type { Boards } from "../../../core/types/board.types";

export class ArchivedBoardsPage extends BaseBoardListPage {
  private eventManager: ArchivedBoardsPageController;

  protected storageKey = "archived-boards-view";
  protected sectionId = "archivedBoardsSection";
  protected radioName = "archived-boards-view";
  protected emptyStateMessage = "No archived boards.";

  constructor() {
    super(new AppLayout());
    this.eventManager = new ArchivedBoardsPageController();
    this.initCurrentView();
  }

  protected filterBoards(boards: Boards[]) {
    return boards.filter((b) => b.is_active === false);
  }

  // ============================================
  // Page-specific render
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

  // ============================================
  // Lifecycle
  // ============================================

  updateUI() {
    this.updateBoardSectionUI();
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
