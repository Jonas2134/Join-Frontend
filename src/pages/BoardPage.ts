import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";
import { appStore } from "../store/AppStore";

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
      <h1 class="text-(--color-light-blue) underline">Board Nummer ${this.id}</h1>
      <button id="changeBoardBtn" class="btn-blue">Change board</button>
    `;
    return header;
  }

  renderBoard() {
    const section = document.createElement("section");
    section.id = "boardSection";
    section.classList.add("space-y-8");
    return section;
  }

  updateBoardUI() {}

  render() {
    const container = document.createElement('section');
    container.classList.add("p-6", "space-y-8");
    container.append(this.renderheader(), this.renderBoard());
    return this.wrapWithLayout(container);
  }

  async mount() {
    await appStore.loadBoard(this.id);
    console.log(appStore.singBoard);
  }
}
