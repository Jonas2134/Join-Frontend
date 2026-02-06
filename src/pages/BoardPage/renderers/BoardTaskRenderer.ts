import { Button } from "../../../components/common/Button";
import { taskThreeDotBtn } from "../../../core/constants/appThreeDot.config";
import type { Task } from "../../../core/types/board.types";

export class BoardTaskRenderer {
  constructor() {}

  renderTask(task: Task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    taskItem.draggable = true;
    taskItem.dataset.taskId = String(task.id);

    const header = this.renderTaskHeader(task);
    taskItem.appendChild(header);

    if (task.description) {
      const description = this.renderTaskDescription(task.description);
      taskItem.appendChild(description);
    }

    if (task.assignee) {
      const assignee = this.renderTaskAssignee(task.assignee);
      taskItem.appendChild(assignee);
    }

    return taskItem;
  }

  private renderTaskHeader(task: Task) {
    const header = document.createElement("header");
    header.classList.add("task-header");

    const title = document.createElement("h5");
    title.classList.add("task-title");
    title.textContent = task.title;

    const threeDotBtn = new Button(taskThreeDotBtn).renderBtn();
    threeDotBtn.dataset.taskId = String(task.id);

    header.append(title, threeDotBtn);
    return header;
  }

  private renderTaskDescription(description: string) {
    const descElement = document.createElement("p");
    descElement.classList.add("task-description");

    const maxLength = 45;
    descElement.textContent =
      description.length > maxLength
        ? description.substring(0, maxLength) + "..."
        : description;

    return descElement;
  }

  private renderTaskAssignee(assignee: string) {
    const assigneeElement = document.createElement("div");
    assigneeElement.classList.add("task-assignee");

    const avatar = document.createElement("span");
    avatar.classList.add("task-assignee-avatar");
    avatar.textContent = assignee.charAt(0).toUpperCase();

    assigneeElement.appendChild(avatar);
    return assigneeElement;
  }
}
