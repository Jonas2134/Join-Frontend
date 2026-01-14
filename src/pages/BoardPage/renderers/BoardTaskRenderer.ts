import type { Task } from "../../interfaces/BoardInterface";

export class BoardTaskRenderer {
  constructor() {}

  renderTask(task: Task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    taskItem.textContent = task.title;
    taskItem.draggable = true;
    taskItem.dataset.taskId = String(task.id);
    return taskItem;
  }
}
