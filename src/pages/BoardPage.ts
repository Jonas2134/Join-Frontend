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
    header.id = "boardHeader";
    header.classList.add("flex", "items-center", "justify-between");
    // header.innerHTML = `
    //   <h1 class="text-(--color-light-blue) underline">${this.title}</h1>
    //   <button id="changeBoardBtn" class="btn-blue">Change board</button>
    // `;
    return header;
  }

  renderSection() {
    const section = document.createElement("section");
    section.id = "boardSection";
    return section;
  }

  renderHeaderContent(header: HTMLElement, board: Board) {
    header.innerHTML = `
      <h1 class="text-(--color-light-blue) underline">${board.title}</h1>
      <button id="changeBoardBtn" class="btn-blue">Change board</button>
    `;
  }

  renderBoardContent(container: HTMLElement, board: Board) {
    const ol = document.createElement("ol");
    ol.innerHTML = `
      <li>${board.description}</li>
    `;

    container.appendChild(ol);
  }

  updateBoardUI() {
    const header = document.getElementById("boardHeader");
    const container = document.getElementById("boardSection");
    if (!container || !header) return;

    const board = appStore.singBoard;
    header.innerHTML = "";
    container.innerHTML = "";

    this.renderHeaderContent(header, board)
    this.renderBoardContent(container, board);
  }

  render() {
    const container = document.createElement('section');
    container.classList.add("flex", "flex-col", "gap-6");
    container.append(this.renderheader(), this.renderSection());
    return this.wrapWithLayout(container);
  }

  async mount() {
    await appStore.loadBoard(this.id);
    console.log(appStore.singBoard);
    this.updateBoardUI();
  }
}
