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

  renderOpenBoardsSection() {
    const openBoardsSection = document.createElement('section');
    openBoardsSection.innerHTML = `<h2 class="mb-4 underline text-(--color-light-blue)">Open Boards</h2>`;
    const openBoardsGrid = document.createElement('div');
    openBoardsGrid.classList.add('grid', 'grid-cols-3', 'gap-4');
    const openBoards = appStore.getBoardsByStatus('open');
    openBoards.forEach((board) => {
      const card = new BoardCard(board, () => {
        router.navigate(`/board/${board.id}`);
      });
      openBoardsGrid.appendChild(card.render());
    });
    openBoardsSection.appendChild(openBoardsGrid);
    return openBoardsSection;
  }

  renderClosedBoardsSection() {
    const closedBoardsSection = document.createElement('section');
    closedBoardsSection.innerHTML = `<h2 class="mb-4 underline text-(--color-light-blue)">Closed Boards</h2>`;
    const closedBoardsGrid = document.createElement('div');
    closedBoardsGrid.classList.add('grid', 'grid-cols-3', 'gap-4');

    const closedBoards = appStore.getBoardsByStatus('closed');
    closedBoards.forEach((board) => {
      const card = new BoardCard(board, () => {
        router.navigate(`/board/${board.id}`);
      });
      closedBoardsGrid.appendChild(card.render());
    });

    closedBoardsSection.appendChild(closedBoardsGrid);
    return closedBoardsSection;
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('p-6', 'space-y-8');

    const header = this.renderheader();
    const openBoardsSection = this.renderOpenBoardsSection();
    const closedBoardsSection = this.renderClosedBoardsSection();

    container.appendChild(header);
    container.appendChild(openBoardsSection);
    container.appendChild(closedBoardsSection);

    return this.wrapWithLayout(container);
  }

  mount(): void {
    document.getElementById('createBoardBtn')?.addEventListener('click', () => {
      router.navigate('/board/create');
    });
  }
}
