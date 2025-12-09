import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";
import { appStore } from "../store/AppStore";
import type { Board } from "../interfaces/BoardInterface";

export class BoardPage extends BasePage {
  id: string;

  constructor(params: { id: string }) {
    super(new AppLayout());
    this.id = params.id;
  }

  renderheader() {
    const header = document.createElement("header");
    header.classList.add("flex", "items-center", "justify-between");
    header.innerHTML = `
      <h1 class="text-(--color-light-blue) underline">Board No. ${this.id}</h1>
      <button id="changeBoardBtn" class="btn-blue">Change board</button>
    `;
    return header;
  }

  renderSection() {
    const section = document.createElement("section");
    section.id = "boardSection";
    section.classList.add("space-y-8");
    return section;
  }

  renderBoard(container: HTMLElement, board: Board) {
    const ol = document.createElement("ol");
    ol.innerHTML = `
      <li>${board.description}</li>
    `;

    container.appendChild(ol);
  }

  updateBoardUI() {
    const container = document.getElementById("boardSection");
    if (!container) return;

    container.innerHTML = "";
    const board = appStore.singBoard;

    this.renderBoard(container, board);
  }

  render() {
    const container = document.createElement('section');
    container.classList.add("p-6", "space-y-8");
    container.append(this.renderheader(), this.renderSection());
    return this.wrapWithLayout(container);
  }

  async mount() {
    await appStore.loadBoard(this.id);
    console.log(appStore.singBoard);
    this.updateBoardUI();
  }
}
