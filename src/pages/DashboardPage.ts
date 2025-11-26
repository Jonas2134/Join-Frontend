import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";
import { BoardCard } from "../components/BoardCard";
import { appStore } from "../store/AppStore";
import { router } from "../core/router";

export class DashboardPage extends BasePage {
  constructor() {
    super(new AppLayout());
  }

  renderheader() {
    const header = document.createElement('div');
    header.classList.add('flex', 'items-center', 'justify-between');
    header.innerHTML = `
      <h1 class="text-(--color-light-blue) underline">My Boards</h1>
      <button id="createBoardBtn" class="btn-blue">+ Create Board</button>
    `;
    return header;
  }

  renderDashboard() {
    const section = document.createElement('section');
    section.id = "dashboardsection";
    section.classList.add("space-y-8");
    return section;
  }

  updateDashboardUI() {
    const container = document.getElementById("dashboardsection");
    if (!container) return;

    container.innerHTML = "";
    const boards = appStore.boards;

    const openBoards = boards.filter(b => b.is_active === true);
    console.log(openBoards);
    const openSection = document.createElement("section");
    openSection.innerHTML = `<h2 class="mb-4 underline text-(--color-light-blue)">Open Boards</h2>`;
    if (openBoards) {
      const openGrid = document.createElement("div");
      openGrid.classList.add("grid", "grid-cols-3", "gap-4");
      openBoards.forEach(board => {
        const card = new BoardCard(board, () => {
          router.navigate(`/board/${board.id}`);
        });
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

    const closedBoards = boards.filter(b => b.is_active === false);
    console.log(closedBoards);
    const closedSection = document.createElement("section");
    closedSection.innerHTML = `<h2 class="mb-4 underline text-(--color-light-blue)">Closed Boards</h2>`;
    if (closedBoards) {
      const closedGrid = document.createElement("div");
      closedGrid.classList.add("grid", "grid-cols-3", "gap-4");
      closedBoards.forEach(board => {
        const card = new BoardCard(board, () => {
          router.navigate(`/board/${board.id}`);
        });
        closedGrid.appendChild(card.render());
      });
      closedSection.appendChild(closedGrid);
      container.appendChild(closedSection);
    } else {
      const noBoards = document.createElement("div");
      noBoards.innerHTML = `<h2>No Boards</h2>`;
      closedSection.appendChild(noBoards);
      container.appendChild(closedSection);
    }
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('p-6', 'space-y-8');

    container.appendChild(this.renderheader());
    container.appendChild(this.renderDashboard());

    return this.wrapWithLayout(container);
  }

  async mount() {
    await appStore.loadDashboard();

    this.updateDashboardUI();

    document.getElementById('createBoardBtn')?.addEventListener('click', () => {
      router.navigate('/board/create');
    });
  }
}
