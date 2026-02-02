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

  // ============================================
  // Base render
  // ============================================

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

  render() {
    const container = document.createElement("section");
    container.classList.add("flex", "flex-col", "gap-6", "h-full");
    container.append(this.renderheader(), this.renderSection());
    return this.wrapWithLayout(container);
  }

  // ============================================
  // Lifecycle
  // ============================================

  updateBoardUI(): void {
    const header = document.getElementById("board-header");
    const section = document.getElementById("board-section");
    const board = appStore.singleBoard;
    if (!section || !header || !board) return;

    header.innerHTML = "";
    section.innerHTML = "";

    this.headerRenderer.renderHeaderContent(header, board);
    this.contentRenderer.renderBoardContent(section, board);

    const dnd = new BoardDragAndDrop(this.initLoadBoard.bind(this));
    dnd.init(section);
  }

  async initLoadBoard() {
    await appStore.loadBoard(this.id);
    console.log(appStore.singleBoard);
    this.updateBoardUI();
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  async mount() {
    await this.initLoadBoard();

    const boardEdit = document.getElementById("editBoardBtn");
    if (!boardEdit) {
      throw new Error("Edit Board button nor found!");
    }
    this.events.on(boardEdit, "click", () => this.eventManager.registerEditBoardDialog(this.id));
    this.events.on(window, "board:updated", async () => await this.initLoadBoard());

    const boardroot = document.getElementById("board-section");
    if (!boardroot) {
      throw new Error("board-root not found");
    }

    this.mountThreeDotListener(boardroot);
    this.mountAddColumnListener(boardroot);
    this.mountTaskListener(boardroot);
  }

  mountThreeDotListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnThreeDotListener(e));

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnRenameToFormListener(e));
    this.events.on(boardroot, "submit", async (e: Event) => this.eventManager.registerColumnRenameFromSubmitListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnRenameCancelButtonListener(e));

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnSetLimitToFormListener(e));
    this.events.on(boardroot, "submit", async (e: Event) => this.eventManager.registerColumnSetLimitFormSubmitListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnSetLimitCancelButtonListener(e));

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnDotMenuDeleteButtonListener(e));
  }

  mountAddColumnListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnButtonListener(e, this.contentRenderer));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerColumnCancelButtonListener(e, this.contentRenderer));
    this.events.on(boardroot, "submit", async (e: Event) => this.eventManager.registerColumnFormSubmitListener(e, this.id));
  }

  mountTaskListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerTaskButtonListener(e));
    this.events.on(window, "task:created", async () => await this.initLoadBoard());
    this.events.on(window, "task:deleted", async () => await this.initLoadBoard());
    this.events.on(window, "task:updated", async () => await this.initLoadBoard());

    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerTaskThreeDotListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerTaskViewDetailsListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerTaskEditListener(e));
    this.events.on(boardroot, "click", (e: Event) => this.eventManager.registerTaskDeleteListener(e));
  }
}
