import { AppLayout } from "../../layouts/AppLayout";
import { BasePage } from "../../components/bases/BasePage";
import { BoardHeaderRenderer } from "./renderers/BoardHeaderRenderer";
import { BoardContentRenderer } from "./renderers/BoardContentRenderer";
import { BoardDragAndDrop } from "./managers/BoardDragAndDrop";
import { BoardEventManager } from "./managers/BoardEventManager";
import { appStore } from "../../core/store/AppStore";

export class BoardPage extends BasePage {
  id: string;
  private headerRenderer: BoardHeaderRenderer;
  private contentRenderer: BoardContentRenderer;
  private eventManager: BoardEventManager;

  constructor(params: { id: string }) {
    super(new AppLayout());
    this.id = params.id;
    this.headerRenderer = new BoardHeaderRenderer();
    this.contentRenderer = new BoardContentRenderer();
    this.eventManager = new BoardEventManager(this.initLoadBoard.bind(this));
  }

  /* ---------- Base render ---------- */

  renderheader() {
    const header = document.createElement("header");
    header.id = "board-header";
    header.classList.add("border-b", "border-(--color-light-gray)", "pb-4");
    return header;
  }

  renderSection() {
    const section = document.createElement("section");
    section.id = "board-section";
    section.classList.add("h-full", "overflow-x-auto");
    return section;
  }

  /* ---------- Lifecycle ---------- */

  updateBoardUI(): void {
    const header = document.getElementById("board-header");
    const section = document.getElementById("board-section");
    if (!section || !header) return;

    const board = appStore.singBoard;

    header.innerHTML = "";
    section.innerHTML = "";

    this.headerRenderer.renderHeaderContent(header, board);
    this.contentRenderer.renderBoardContent(section, board);

    const dnd = new BoardDragAndDrop(this.initLoadBoard.bind(this));
    dnd.init(section);
  }

  render() {
    const container = document.createElement("section");
    container.classList.add("flex", "flex-col", "gap-6", "h-full");
    container.append(this.renderheader(), this.renderSection());
    return this.wrapWithLayout(container);
  }

  async initLoadBoard() {
    await appStore.loadBoard(this.id);
    console.log(appStore.singBoard);
    this.updateBoardUI();
  }

  async mount() {
    await this.initLoadBoard();

    const boardroot = document.getElementById("board-section");
    if (!boardroot) {
      throw new Error("board-root not found");
    }

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerTaskButtonListener(e));
    this.events.on(window, "task:created", async () => await this.initLoadBoard());

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnButtonListener(e, this.contentRenderer));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnCancelButtonListener(e, this.contentRenderer));
    this.events.on(boardroot, "submit", async (e: Event) => this.eventManager.registerColumnFormSubmitListener(e, this.id));

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnThreeDotListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnRenameToFormListener(e));
    this.events.on(boardroot, "submit", async (e: Event) => this.eventManager.registerColumnRenameFromSubmitListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnRenameCancelButtonListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnDotMenuDeleteButtonListener(e));
  }
}
