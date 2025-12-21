import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";
import { appStore } from "../store/AppStore";
import type { Board, Column, Task } from "../interfaces/BoardInterface";

export class BoardPage extends BasePage {
  id: string;

  constructor(params: { id: string }) {
    super(new AppLayout());
    this.id = params.id;
  }

  /* ---------- Layout ---------- */

  renderheader() {
    const header = document.createElement("header");
    header.id = "board-header";
    header.classList.add("flex", "items-center", "justify-between");
    return header;
  }

  renderSection() {
    const section = document.createElement("section");
    section.id = "board-section";
    section.classList.add("h-full", "overflow-x-auto");
    return section;
  }

  /* ---------- Header ---------- */

  renderHeaderContent(header: HTMLElement, board: Board) {
    header.innerHTML = `
      <details class="transition-all">
        <summary class="text-2xl text-(--color-light-blue) underline">${board.title}</summary>
        <p>${board.description}</p>
      </details>
      <button id="changeBoardBtn" class="btn-blue">Change board</button>
    `;
  }

  /* ---------- Drag & drop help elements ---------- */

  renderColumnDropZone(position: number): HTMLElement {
    const zone = document.createElement("li");
    zone.classList.add("column-drop-zone");
    zone.dataset.position = String(position);
    return zone;
  }

  renderTaskDropZone(position: number): HTMLElement {
    const zone = document.createElement("li");
    zone.classList.add("task-drop-zone");
    zone.dataset.position = String(position);
    return zone;
  }

  /* ---------- Column ---------- */

  renderColumnHeader(column: Column) {
    const header = document.createElement("header");
    header.classList.add("column-header");
    const title = document.createElement("h4");
    title.textContent = column.name;
    header.appendChild(title);
    return header;
  }

  renderColumnFooter() {
    const footer = document.createElement("footer");
    footer.classList.add("flex", "justify-center");
    const addTaskBtn = document.createElement("button");
    addTaskBtn.classList.add("btn-blue");
    addTaskBtn.textContent = "+ add Task";
    footer.appendChild(addTaskBtn);
    return footer;
  }

  renderColumnTaskContent(column: Column) {
    const taskList = document.createElement("ol");
    taskList.classList.add("task-list");

    for (const [index, task] of column.tasks.entries()) {
      taskList.appendChild(this.renderTaskDropZone(index + 1));
      taskList.appendChild(this.renderTask(task));
    }

    taskList.appendChild(this.renderTaskDropZone(column.tasks.length + 1));
    return taskList;
  }

  renderColumn(column: Column): HTMLElement {
    const columnItem = document.createElement("li");
    columnItem.classList.add("board-column");
    columnItem.dataset.columnId = String(column.id);

    const columnSection = document.createElement("section");
    columnSection.classList.add("flex", "flex-col", "gap-1");

    const header = this.renderColumnHeader(column);
    const taskList = this.renderColumnTaskContent(column);
    const footer = this.renderColumnFooter();

    columnSection.append(header, taskList, footer);
    columnItem.appendChild(columnSection);
    return columnItem;
  }

  renderAddColumn() {
    const addColumnItem = document.createElement("li");
    addColumnItem.classList.add("board-column");
    const addColumnBtn = document.createElement("button");
    addColumnBtn.classList.add("btn-blue");
    addColumnBtn.textContent = "+ New Column";
    addColumnItem.appendChild(addColumnBtn);
    return addColumnItem;
  }

  /* ---------- Task ---------- */

  renderTask(task: Task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    taskItem.textContent = task.title;
    taskItem.dataset.taskId = String(task.id);
    return taskItem;
  }

  /* ---------- Board ---------- */

  renderBoardContent(container: HTMLElement, board: Board) {
    const columnsList = document.createElement("ol");
    columnsList.classList.add("board-columns-list");

    for (const [index, column] of board.columns.entries()) {
      columnsList.appendChild(this.renderColumnDropZone(index + 1));
      columnsList.appendChild(this.renderColumn(column));
    }

    columnsList.appendChild(
      this.renderColumnDropZone(board.columns.length + 1)
    );

    const addColumnItem = this.renderAddColumn();

    columnsList.appendChild(addColumnItem);
    container.appendChild(columnsList);
  }

  /* ---------- Lifecycle ---------- */

  updateBoardUI() {
    const header = document.getElementById("board-header");
    const section = document.getElementById("board-section");
    if (!section || !header) return;

    const board = appStore.singBoard;
    header.innerHTML = "";
    section.innerHTML = "";

    this.renderHeaderContent(header, board);
    this.renderBoardContent(section, board);
  }

  render() {
    const container = document.createElement("section");
    container.classList.add("flex", "flex-col", "gap-6", "h-full");
    container.append(this.renderheader(), this.renderSection());
    return this.wrapWithLayout(container);
  }

  async mount() {
    await appStore.loadBoard(this.id);
    console.log(appStore.singBoard);
    this.updateBoardUI();
  }
}
