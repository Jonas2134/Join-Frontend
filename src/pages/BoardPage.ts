import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";
import { BoardDragAndDrop } from "../core/BoardDragAndDrop";
import { appStore } from "../store/AppStore";
import { CreateTaskDialog } from "../components/CreateTaskDialog";
import { InputField } from "../components/InputField";
import type { Board, Column, Task } from "../interfaces/BoardInterface";

import ToggleIcon from "../assets/icons/ToggleIcon.svg?raw";
import EditIcon from "../assets/icons/edit.svg?raw";
import VerticalDotsIcon from "../assets/icons/menu-vertical.svg?raw";

export class BoardPage extends BasePage {
  id: string;
  dialog: CreateTaskDialog | null = null;

  constructor(params: { id: string }) {
    super(new AppLayout());
    this.id = params.id;
  }

  /* ---------- Layout ---------- */

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

  /* ---------- Header ---------- */

  renderHeaderSummary(board: Board) {
    const summary = document.createElement("summary");
    summary.classList.add("flex", "items-center", "justify-between", "cursor-pointer", "list-none");

    const title = document.createElement("h3");
    title.classList.add("text-(--color-light-blue)", "font-semibold", "underline");
    title.textContent = board.title;

    const toggleIcon = document.createElement("span");
    toggleIcon.innerHTML = ToggleIcon;

    summary.append(title, toggleIcon);
    return summary;
  }

  renderDetailsDescriptionSection(board: Board) {
    const descriptionSection = document.createElement("section");

    const descriptionTitle = document.createElement("h4");
    descriptionTitle.classList.add("text-(--color-placeholder-gray)", "font-semibold", "underline", "mb-1");
    descriptionTitle.textContent = "Description";

    const descriptionText = document.createElement("p");
    descriptionText.classList.add("max-w-2xs");
    descriptionText.textContent = board.description || "No description";

    descriptionSection.append(descriptionTitle, descriptionText);
    return descriptionSection;
  }

  renderDetailsMembersSection(board: Board) {
    const membersSection = document.createElement("section");

    const membersTitle = document.createElement("h4");
    membersTitle.classList.add("text-(--color-placeholder-gray)", "font-semibold", "underline", "mb-1");
    membersTitle.textContent = "Members";

    const membersList = document.createElement("ul");
    membersList.classList.add("list-disc", "list-inside");

    for (const member of board.members) {
      const memberItem = document.createElement("li");
      memberItem.textContent = member.username;
      membersList.appendChild(memberItem);
    }

    membersSection.append(membersTitle, membersList);
    return membersSection;
  }

  renderEditButton() {
    const editButton = document.createElement("button");
    editButton.id = "changeBoardBtn";
    editButton.classList.add("cursor-pointer", "p-2", "rounded");
    editButton.title = "Edit board";
    editButton.innerHTML = EditIcon;
    return editButton;
  }

  renderDetailsContent(board: Board) {
    const detailsContent = document.createElement("main");
    detailsContent.classList.add("flex", "items-start", "justify-between", "mt-4", "px-3");

    const descriptionSection = this.renderDetailsDescriptionSection(board);
    const membersSection = this.renderDetailsMembersSection(board);
    const editBtn = this.renderEditButton();

    detailsContent.append(descriptionSection, membersSection, editBtn);
    return detailsContent;
  }

  renderHeaderContent(header: HTMLElement, board: Board) {
    const details = document.createElement("details");
    details.classList.add("group");

    const summary = this.renderHeaderSummary(board);
    const detailsContent = this.renderDetailsContent(board);

    details.append(summary, detailsContent)
    header.appendChild(details);
  }

  /* ---------- Column ---------- */

  renderColumnHeader(column: Column) {
    const header = document.createElement("header");
    header.classList.add("column-header");

    const title = document.createElement("h4");
    title.classList.add("text-xl", "text-(--color-light-blue)", "underline");
    title.textContent = column.name;

    const verticalDots = document.createElement("button");
    verticalDots.innerHTML = VerticalDotsIcon;
    verticalDots.title = "Column menu";
    verticalDots.type = "button";
    verticalDots.classList.add("column-menu-btn");

    header.append(title, verticalDots);
    return header;
  }

  renderColumnFooter() {
    const footer = document.createElement("footer");
    footer.classList.add("flex", "justify-center");

    const addTaskBtn = document.createElement("button");
    addTaskBtn.classList.add("create-task-btn");
    addTaskBtn.title = "Add Task";
    addTaskBtn.type = "button";
    addTaskBtn.textContent = "+ add Task";

    footer.appendChild(addTaskBtn);
    return footer;
  }

  renderColumnTaskContent(column: Column) {
    const taskList = document.createElement("ol");
    taskList.classList.add("task-list", "scrollbar-hide");

    for (const task of column.tasks) {
      taskList.appendChild(this.renderTask(task));
    }

    return taskList;
  }

  renderColumn(column: Column): HTMLElement {
    const columnItem = document.createElement("li");
    columnItem.classList.add("board-column");
    columnItem.dataset.columnId = String(column.id);

    const columnSection = document.createElement("section");
    columnSection.classList.add("flex", "flex-col", "gap-4");

    const header = this.renderColumnHeader(column);
    const taskList = this.renderColumnTaskContent(column);
    const footer = this.renderColumnFooter();

    columnSection.append(header, taskList, footer);
    columnItem.appendChild(columnSection);
    return columnItem;
  }

  renderAddColumn() {
    const addColumnItem = document.createElement("li");
    addColumnItem.classList.add("add-column-item");
    addColumnItem.appendChild(this.renderAddColumnSection());
    return addColumnItem;
  }

  renderAddColumnSection() {
    const addColumnSection = document.createElement("section");
    addColumnSection.classList.add("add-column");

    const addColumnBtn = document.createElement("button");
    addColumnBtn.classList.add("create-column-btn");
    addColumnBtn.title = "Add Column";
    addColumnBtn.type = "button";
    addColumnBtn.textContent = "+ New Column";

    addColumnSection.appendChild(addColumnBtn);
    return addColumnSection;
  }

  renderAddColumnForm() {
    const form = document.createElement("form");
    form.classList.add("add-column-form", "items-center", "py-4");

    const input = new InputField({
      type: "text",
      placeholder: "Enter column name...",
      name: "columnName",
      required: true,
    });

    const buttonGroup = document.createElement("menu");
    buttonGroup.classList.add("flex", "gap-4");

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("btn-blue");
    submitBtn.title = "Submit new column";
    submitBtn.type = "submit";
    submitBtn.textContent = "+ Add";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-column-btn");
    cancelBtn.title = "Cancel adding column";
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";

    buttonGroup.append(submitBtn, cancelBtn);
    form.append(input.render(), buttonGroup);
    return form;
  }

  /* ---------- Task ---------- */

  renderTask(task: Task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    taskItem.textContent = task.title;
    taskItem.draggable = true;
    taskItem.dataset.taskId = String(task.id);
    return taskItem;
  }

  /* ---------- Board ---------- */

  renderBoardContent(container: HTMLElement, board: Board) {
    const columnsList = document.createElement("ol");
    columnsList.classList.add("board-columns-list");

    for (const column of board.columns) {
      columnsList.appendChild(this.renderColumn(column));
    }

    const addColumnItem = this.renderAddColumn();
    columnsList.appendChild(addColumnItem);
    container.appendChild(columnsList);
  }

  /* ---------- Lifecycle ---------- */

  updateBoardUI(): void {
    const header = document.getElementById("board-header");
    const section = document.getElementById("board-section");
    if (!section || !header) return;

    const board = appStore.singBoard;

    header.innerHTML = "";
    section.innerHTML = "";

    this.renderHeaderContent(header, board);
    this.renderBoardContent(section, board);

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

  openCreateTaskDialog(id: number) {
    this.dialog = new CreateTaskDialog(id);
    document.body.appendChild(this.dialog.render());
    this.dialog?.open();
  }

  async mount() {
    await this.initLoadBoard();

    const boardroot = document.getElementById("board-section");
    if (!boardroot) {
      throw new Error("board-root not found");
    }

    this.registerTaskButtonListener(boardroot);
    this.registerColumnButtonListener(boardroot);
    this.registerColumnCancelButtonListener(boardroot);
    this.registerColumnFormSubmitListener(boardroot);

    this.events.on(window, "task:created", async () => await this.initLoadBoard());
  }

  /* ---------- Eventlistener ---------- */

  private registerTaskButtonListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "click", (e) => {
      const target = e.target as HTMLElement;

      const createTBtn = target.closest<HTMLButtonElement>(".create-task-btn");
      if (!createTBtn) return;

      const column = createTBtn.closest<HTMLElement>(".board-column");
      if (!column) return;

      const columnId = Number(column.dataset.columnId);
      if (Number.isNaN(columnId)) {
        console.error("Invalid column id");
        return;
      }
      this.openCreateTaskDialog(columnId);
    });
  }

  private registerColumnButtonListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "click", (e) => {
      const target = e.target as HTMLElement;

      const createCBtn =
        target.closest<HTMLButtonElement>(".create-column-btn");
      if (createCBtn) {
        console.log("KLICK!!!");
        this.showAddColumnForm();
        return;
      }
    });
  }

  private registerColumnCancelButtonListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "click", (e) => {
      const target = e.target as HTMLElement;

      const cancelBtn = target.closest<HTMLButtonElement>(".cancel-column-btn");
      if (cancelBtn) {
        console.log("GECANCELT!!!!");
        this.hideAddColumnForm();
        return;
      }
    });
  }

  private registerColumnFormSubmitListener(boardroot: HTMLElement) {
    this.events.on(boardroot, "submit", async (e) => {
      const target = e.target as HTMLElement;

      const form = target.closest<HTMLFormElement>(".add-column-form");
      if (!form) return;
      e.preventDefault();

      const formData = new FormData(form);
      const columnName = formData.get("columnName") as string;
      if (columnName) await this.createColumn(columnName);
    });
  }

  private showAddColumnForm() {
    const addColumnItem = document.querySelector(".add-column-item");
    if (!addColumnItem) return;

    const addColumnSection = addColumnItem.querySelector(".add-column");
    addColumnSection?.remove();

    const existingForm = addColumnItem.querySelector(".add-column-form");
    if (!existingForm) {
      const form = this.renderAddColumnForm();
      addColumnItem.appendChild(form);
      const input = form.querySelector("input");
      input?.focus();
    }
  }

  private hideAddColumnForm() {
    const addColumnItem = document.querySelector(".add-column-item");
    if (!addColumnItem) return;

    const form = addColumnItem.querySelector(".add-column-form");
    form?.remove();

    const existingAddColumnSection = addColumnItem.querySelector(".add-column");
    if (!existingAddColumnSection) {
      addColumnItem.appendChild(this.renderAddColumnSection());
    }
  }

  private async createColumn(columnName: string) {
    console.log(columnName);
    try {
      await appStore.createColumn(this.id, columnName);
      await this.initLoadBoard();
    } catch (err: any) {
      alert("Creation is failed: " + err.message);
    }
  }
}
