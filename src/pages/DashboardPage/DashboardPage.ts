import { AppLayout } from "../../layouts/AppLayout";
import { BasePage } from "../../components/bases/BasePage";
import { BoardCard } from "./renderers/BoardCardRenderer";
import { appStore } from "../../core/store/AppStore";
import { router } from "../../core/router";
import { BoardCreateDialog } from "./BoardCreateDialog";
import type { Board } from "../../core/types/board.types";

export class DashboardPage extends BasePage {
  dialog: BoardCreateDialog | null = null;

  constructor() {
    super(new AppLayout());
  }

  /* ---------- Layout ---------- */

  renderheader() {
    const header = document.createElement("header");
    header.classList.add("flex", "items-center", "justify-between");
    header.innerHTML = `
      <h1 class="text-(--color-light-blue) underline">My Boards</h1>
      <button id="createBoardBtn" class="btn-blue">+ Create Board</button>
    `;
    return header;
  }

  renderDashboard() {
    const section = document.createElement("section");
    section.id = "dashboardsection";
    section.classList.add("space-y-8");
    return section;
  }

  /* ---------- open Board section ---------- */

  renderOpenBoardsSection(container: HTMLElement, boards: Board[]) {
    const openBoards = boards.filter((b) => b.is_active === true);
    const openSection = document.createElement("section");
    openSection.innerHTML = `<h2 class="mb-4 underline text-(--color-light-blue)">Open Boards</h2>`;
    if (openBoards.length > 0) {
      const openGrid = document.createElement("div");
      openGrid.classList.add("grid", "grid-cols-3", "gap-4");
      openBoards.forEach((board) => {
        const card = new BoardCard(board, () => router.navigate(`/board/${board.id}`));
        openGrid.appendChild(card.render());
      });
      openSection.appendChild(openGrid);
      container.appendChild(openSection);
    } else {
      const noBoards = document.createElement("div");
      noBoards.innerHTML = `<h2>No Boards</h2>`;
      openSection.appendChild(noBoards);
      container.appendChild(openSection);
    }
  }

  /* ---------- closed Board section ---------- */

  renderClosedBoardsSection(container: HTMLElement, boards: Board[]) {
    const closedBoards = boards.filter((b) => b.is_active === false);
    if (closedBoards.length > 0) {
      const closedSection = document.createElement("section");
      closedSection.innerHTML = `<h2 class="mb-4 underline text-(--color-light-blue)">Closed Boards</h2>`;
      const closedGrid = document.createElement("div");
      closedGrid.classList.add("grid", "grid-cols-3", "gap-4");
      closedBoards.forEach((board) => {
        const card = new BoardCard(board, () => router.navigate(`/board/${board.id}`));
        closedGrid.appendChild(card.render());
      });
      closedSection.appendChild(closedGrid);
      container.appendChild(closedSection);
    }
  }

  /* ---------- Lifecycle ---------- */

  updateDashboardUI() {
    const container = document.getElementById("dashboardsection");
    if (!container) return;

    container.innerHTML = "";
    const boards = appStore.boards;

    this.renderOpenBoardsSection(container, boards);
    this.renderClosedBoardsSection(container, boards);
  }

  render() {
    const container = document.createElement("section");
    container.classList.add("p-6", "space-y-8");
    container.appendChild(this.renderheader());
    container.appendChild(this.renderDashboard());
    return this.wrapWithLayout(container);
  }

  async initLoadDashboard() {
    await appStore.loadDashboard();
    this.updateDashboardUI();
  }

  async mount() {
    this.initLoadDashboard();

    const createBoardBtn = document.getElementById("createBoardBtn");
    if (!createBoardBtn) return;

    this.events.on(createBoardBtn, "click", () => {
      this.dialog = new BoardCreateDialog();
      document.body.appendChild(this.dialog.render());
      this.dialog?.open();
    });

    this.events.on(window, "board:created", async () => this.initLoadDashboard());
  }
}
