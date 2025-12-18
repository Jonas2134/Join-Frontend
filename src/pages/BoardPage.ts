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
    header.id = "board-header";
    header.classList.add("flex", "items-center", "justify-between");
    return header;
  }

  renderSection() {
    const section = document.createElement("section");
    section.id = "board-section";
    return section;
  }

  renderHeaderContent(header: HTMLElement, board: Board) {
    header.innerHTML = `
      <details class="transition-all">
        <summary class="text-2xl text-(--color-light-blue) underline">${board.title}</summary>
        <p>${board.description}</p>
      </details>
      <button id="changeBoardBtn" class="btn-blue">Change board</button>
    `;
  }

  renderBoardContent(container: HTMLElement, board: Board) {
    const columnsList = document.createElement("ol");
    columnsList.classList.add("flex", "gap-4")
    
    for (const column of board.columns) {
      const columnItem = document.createElement("li");
      columnItem.classList.add("p-1", "border", "border-(--color-light-gray)", "rounded-lg");
      columnItem.dataset.columnId = String(column.id);

      const columnSection = document.createElement("section");
      columnSection.classList.add("flex", "flex-col", "gap-1")

      const header = document.createElement("header");
      header.classList.add("py-2", "px-4", "bg-(--color-dark-blue)", "rounded-lg")
      const title = document.createElement("h3");
      title.classList.add("text-white")
      title.textContent = column.name;
      header.appendChild(title);

      const taskList = document.createElement("ol");
      taskList.classList.add("flex", "flex-col", "items-center");

      for (const task of column.tasks) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task");
        taskItem.textContent = task.title;
        taskItem.dataset.taskId = String(task.id);
        taskList.appendChild(taskItem);
      }

      const footer = document.createElement("footer");
      footer.classList.add("flex", "justify-center")
      const addTaskBtn = document.createElement("button");
      addTaskBtn.classList.add("btn-blue")
      addTaskBtn.textContent = "+ add Task";
      footer.appendChild(addTaskBtn);

      columnSection.append(header, taskList, footer);
      columnItem.appendChild(columnSection);
      columnsList.appendChild(columnItem);
    }

    const addColumnItem = document.createElement("li");
    addColumnItem.classList.add("p-1", "border", "border-(--color-light-gray)", "rounded-lg");

    const addColumnBtn = document.createElement("button");
    addColumnBtn.classList.add("btn-blue")
    addColumnBtn.textContent = "+ New Column";
    addColumnItem.appendChild(addColumnBtn);

    columnsList.appendChild(addColumnItem);
    container.appendChild(columnsList);
  }

  updateBoardUI() {
    const header = document.getElementById("board-header");
    const container = document.getElementById("board-section");
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
