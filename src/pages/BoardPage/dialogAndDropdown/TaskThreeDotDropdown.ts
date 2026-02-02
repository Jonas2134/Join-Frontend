import { BaseDropdownMenu } from "../../../components/bases/BaseDropdownMenu";
import { Button } from "../../../components/common/Button";
import {
  taskViewDetailsBtn,
  taskEditBtn,
  taskDeleteBtn,
} from "../../../core/constants/appThreeDot.config";

import type { ButtonOptions } from "../../../components/common/Button";

export class TaskThreeDotDropdown extends BaseDropdownMenu {
  taskId: string;

  constructor(btn: HTMLButtonElement, taskId: string) {
    super(btn, "task-dropdown-menu");
    this.taskId = taskId;
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;

    const viewItem = this.renderMenuListItem(taskViewDetailsBtn);
    const editItem = this.renderMenuListItem(taskEditBtn);
    const deleteItem = this.renderMenuListItem(taskDeleteBtn);

    menu.append(viewItem, editItem, deleteItem);
    return menu;
  }

  renderMenuListItem(btnConfig: ButtonOptions) {
    const item = document.createElement("li");
    item.classList.add("menu-item");
    const btn = this.renderMenuBtn(btnConfig);
    item.appendChild(btn);
    return item;
  }

  renderMenuBtn(btnConfig: ButtonOptions) {
    return new Button(btnConfig).renderBtn();
  }
}
