import { BaseDialog } from "../../../components/bases/BaseDialog";
import { Button } from "../../../components/common/Button";
import { taskDetailCloseBtn } from "../../../core/constants/appThreeDot.config";
import type { Task } from "../../../core/types/board.types";

export class TaskDetailDialog extends BaseDialog {
  task: Task;

  constructor(task: Task) {
    super("task-detail-dialog");
    this.task = task;
  }

  private renderHeader() {
    const header = document.createElement("header");
    header.classList.add("task-detail-header");

    const title = document.createElement("h2");
    title.classList.add("task-detail-title");
    title.textContent = this.task.title;

    const closeBtn = new Button(taskDetailCloseBtn).renderBtn();

    header.append(title, closeBtn);
    return header;
  }

  private renderDescription() {
    const section = document.createElement("section");
    section.classList.add("task-detail-section");

    const label = document.createElement("h4");
    label.classList.add("task-detail-label");
    label.textContent = "Description:";

    const content = document.createElement("p");
    content.classList.add("task-detail-text");
    content.textContent = this.task.description || "No description";

    section.append(label, content);
    return section;
  }

  private renderAssignee() {
    const section = document.createElement("section");
    section.classList.add("task-detail-section");

    const label = document.createElement("h4");
    label.classList.add("task-detail-label");
    label.textContent = "Assignee:";

    const content = document.createElement("p");
    content.classList.add("task-detail-text");
    content.textContent = this.task.assignee || "Unassigned";

    section.append(label, content);
    return section;
  }

  private renderMetadata() {
    const section = document.createElement("section");
    section.classList.add("task-detail-section", "task-detail-metadata");

    const createdAt = document.createElement("span");
    createdAt.classList.add("task-detail-meta-item");
    createdAt.textContent = `Created: ${new Date(this.task.created_at).toLocaleDateString()}`;

    const updatedAt = document.createElement("span");
    updatedAt.classList.add("task-detail-meta-item");
    updatedAt.textContent = `Updated: ${new Date(this.task.updated_at).toLocaleDateString()}`;

    section.append(createdAt, updatedAt);
    return section;
  }

  protected renderContent(): HTMLElement {
    const container = document.createElement("article");
    container.classList.add("p-6");

    const header = this.renderHeader();
    const description = this.renderDescription();
    const assignee = this.renderAssignee();
    const metadata = this.renderMetadata();

    container.append(header, description, assignee, metadata);
    return container;
  }

  protected override mount(): void {
    const closeBtn = this.dialog.querySelector("#close-detail-btn");
    closeBtn?.addEventListener("click", () => this.close());
  }
}
