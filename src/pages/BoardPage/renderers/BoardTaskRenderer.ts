import { Button } from "../../../components/common/Button";
import { Avatar } from "../../../components/common/Avatar";
import { boardStore } from "../../../core/store/BoardStore";
import { taskThreeDotBtn } from "../../../core/constants/appThreeDot.config";
import type { Task } from "../../../core/types/board.types";

export class BoardTaskRenderer {
  private readonly: boolean;

  constructor(readonly = false) {
    this.readonly = readonly;
  }

  renderTask(task: Task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    taskItem.draggable = !this.readonly;
    taskItem.dataset.taskId = String(task.id);

    const header = this.renderTaskHeader(task);
    taskItem.appendChild(header);

    if (task.description) {
      const description = this.renderTaskDescription(task.description);
      taskItem.appendChild(description);
    }

    if (task.assignee != null) {
      const assignee = this.renderTaskAssignee(task.assignee);
      taskItem.appendChild(assignee);
    }

    return taskItem;
  }

  private renderTaskHeader(task: Task) {
    const header = document.createElement("header");
    header.classList.add("flex", "justify-between", "items-start", "gap-2");

    const title = document.createElement("h5");
    title.classList.add("flex-1");
    title.textContent = task.title;

    header.append(title);

    if (!this.readonly) {
      const threeDotBtn = new Button(taskThreeDotBtn).renderBtn();
      threeDotBtn.dataset.taskId = String(task.id);
      header.append(threeDotBtn);
    }

    return header;
  }

  private renderTaskDescription(description: string) {
    const descElement = document.createElement("p");
    descElement.classList.add("text-xs", "text-gray-500", "mt-1");

    const maxLength = 45;
    descElement.textContent =
      description.length > maxLength
        ? description.substring(0, maxLength) + "..."
        : description;

    return descElement;
  }

  private renderTaskAssignee(assigneeId: number) {
    const assigneeElement = document.createElement("div");
    assigneeElement.classList.add("flex", "justify-end", "mt-2");

    const member = boardStore.singleBoard?.members.find(
      m => Number(m.id) === assigneeId
    );
    const username = member?.username ?? "?";

    const avatar = new Avatar({ size: "sm" }).createAvatar(username);
    assigneeElement.appendChild(avatar);
    return assigneeElement;
  }
}
