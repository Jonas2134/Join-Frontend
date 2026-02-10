import { BaseDialog } from "../../../components/bases/BaseDialog";
import { appStore } from "../../../core/store/AppStore";
import { toastManager } from "../../../core/ToastManager";
import { Button } from "../../../components/common/Button";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { taskDetailEditBtn } from "../../../core/constants/appThreeDot.config";
import { editTaskDialogFields } from "../../../core/constants/appDialogFields.config";
import { editTaskDialogBtns } from "../../../core/constants/appDialogBtns.config";
import type { Task } from "../../../core/types/board.types";

export type TaskDetailMode = "view" | "edit";

export class TaskDetailDialog extends BaseDialog {
  task: Task;
  private mode: TaskDetailMode;
  private container!: HTMLElement;

  constructor(task: Task, mode: TaskDetailMode = "view") {
    super("task-detail-dialog");
    this.task = task;
    this.mode = mode;
  }

  // ============================================
  // Core Rendering
  // ============================================

  protected renderContent(): HTMLElement {
    this.container = document.createElement("div");
    this.container.classList.add("p-6");
    this.renderCurrentMode();
    return this.container;
  }

  private renderCurrentMode(): void {
    this.container.innerHTML = "";

    if (this.mode === "view") {
      this.renderViewMode();
    } else {
      this.renderEditMode();
    }
  }

  private switchMode(newMode: TaskDetailMode): void {
    this.mode = newMode;
    this.renderCurrentMode();
    this.mountCurrentMode();
  }

  // ============================================
  // View Mode
  // ============================================

  private renderViewMode(): void {
    const wrapper = document.createElement("div");
    wrapper.classList.add("flex", "flex-col", "gap-2");

    const header = this.renderViewHeader();
    const title = this.renderViewTitle();
    const description = this.renderViewDescription();
    const assignee = this.renderViewAssignee();
    const footer = this.renderViewFooter();

    wrapper.append(header, title, description, assignee, footer);
    this.container.appendChild(wrapper);
  }

  private renderViewHeader(): HTMLElement {
    const header = document.createElement("header");
    header.classList.add("base-legend");
    header.textContent = "Task Detail";
    return header;
  }

  private renderViewTitle(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("input-b-border");

    const label = document.createElement("h4");
    label.classList.add("input-label");
    label.textContent = "Title:";

    const content = document.createElement("p");
    content.classList.add("task-detail-text");
    content.textContent = this.task.title || "No title";

    section.append(label, content);
    return section;
  }

  private renderViewDescription(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("input-b-border");

    const label = document.createElement("h4");
    label.classList.add("input-label");
    label.textContent = "Description:";

    const content = document.createElement("p");
    content.classList.add("task-detail-text");
    content.textContent = this.task.description || "No description";

    section.append(label, content);
    return section;
  }

  private renderViewAssignee(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("input-b-border");

    const label = document.createElement("h4");
    label.classList.add("input-label");
    label.textContent = "Assignee:";

    const content = document.createElement("p");
    content.classList.add("task-detail-text");
    content.textContent = this.task.assignee || "Unassigned";

    section.append(label, content);
    return section;
  }

  private renderViewMetadata(): HTMLElement {
    const section = document.createElement("div");
    section.classList.add("flex", "gap-4");

    const createdAt = document.createElement("span");
    createdAt.classList.add("task-detail-meta-item");
    createdAt.textContent = `Created: ${new Date(this.task.created_at).toLocaleDateString()}`;

    const updatedAt = document.createElement("span");
    updatedAt.classList.add("task-detail-meta-item");
    updatedAt.textContent = `Updated: ${new Date(this.task.updated_at).toLocaleDateString()}`;

    section.append(createdAt, updatedAt);
    return section;
  }

  private renderViewFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.classList.add("flex", "justify-between", "items-end");

    const metadata = this.renderViewMetadata();
    const editBtn = new Button(taskDetailEditBtn).renderBtn();

    footer.append(metadata, editBtn);
    return footer;
  }

  // ============================================
  // Edit Mode
  // ============================================

  private renderEditMode(): void {
    const form = document.createElement("form");
    form.id = "edit-task-form";

    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("fields-wrapper");

    const legend = document.createElement("legend");
    legend.classList.add("base-legend");
    legend.textContent = "Edit Task";

    const main = this.renderEditMainSection();
    const menu = this.renderEditMenu();

    fieldset.append(legend, main, menu);
    form.appendChild(fieldset);
    this.container.appendChild(form);
  }

  private renderEditMainSection(): HTMLElement {
    const main = document.createElement("main");
    main.classList.add("edit-task-main");

    const firstSection = this.renderEditFields();
    const secondSection = this.renderEditAssigneeSection();

    main.append(firstSection, secondSection);
    return main;
  }

  private renderEditFields(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("edit-task-fields");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = editTaskDialogFields.map((field) => {
      const fieldValue = this.task[field.value];
      return new componentMap[field.type]({
        ...field.config,
        value: fieldValue || undefined,
      }).render();
    });

    section.append(...fields);
    return section;
  }

  private renderEditAssigneeSection(): HTMLElement {
    const section = document.createElement("section");
    section.innerHTML = `
      <label for="assignee">Choose an assignee:</label>
      <br>
      <select name="assignee" id="assignee">
        <option value="">--Please choose the assignee--</option>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
      </select>
    `;
    return section;
  }

  private renderEditMenu(): HTMLElement {
    const menu = document.createElement("menu");
    menu.classList.add("edit-task-menu");

    const btns = editTaskDialogBtns.map((config) =>
      new Button({ ...config }).renderBtn()
    );

    menu.append(...btns);
    return menu;
  }

  // ============================================
  // Event Binding
  // ============================================

  protected override mount(): void {
    this.mountCurrentMode();
  }

  private mountCurrentMode(): void {
    if (this.mode === "view") {
      this.mountViewMode();
    } else {
      this.mountEditMode();
    }
  }

  private mountViewMode(): void {
    const editBtn = this.dialog.querySelector("#edit-mode-btn");
    editBtn?.addEventListener("click", () => this.switchMode("edit"));
  }

  private mountEditMode(): void {
    const form = this.dialog.querySelector("#edit-task-form") as HTMLFormElement;
    const cancelBtn = this.dialog.querySelector("#cancel-edit-btn");
    const switchBtn = this.dialog.querySelector("#switch-to-view-btn");

    cancelBtn?.addEventListener("click", () => this.close());

    switchBtn?.addEventListener("click", () => this.switchMode("view"));

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;

      try {
        await appStore.updateTask(String(this.task.id), {
          title: title,
          description: description || null,
        });

        toastManager.success("Task erfolgreich aktualisiert");
        this.close();
        form.reset();
      } catch (err: any) {
        toastManager.error("Update fehlgeschlagen: " + err.message);
      }
    });
  }
}
