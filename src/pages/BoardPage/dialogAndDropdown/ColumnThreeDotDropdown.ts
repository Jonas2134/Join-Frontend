import { BaseDropdownMenu } from "../../../components/bases/BaseDropdownMenu";
import { InputField } from "../../../components/common/InputField";
import { columnRenameField, columnLimitField } from "../../../core/constants/appBoardFields.config";

import Editicon from "../../../assets/icons/edit.svg?raw";

export class ColumnThreeDotDropdown extends BaseDropdownMenu {
  constructor(btn: HTMLButtonElement) {
    super(btn, "column-dropdown-menu");
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;

    const renameSec = document.createElement("li");
    renameSec.classList.add("menu-item");
    const renameBtn = this.renderRenameBtn();
    renameSec.appendChild(renameBtn);

    const setLimitSec = document.createElement("li");
    setLimitSec.classList.add("menu-item");
    const setLimitBtn = this.renderLimitBtn();
    setLimitSec.appendChild(setLimitBtn);

    const deleteSec = this.renderDeleteSec();

    menu.append(renameSec, setLimitSec, deleteSec);
    return menu;
  }

  renderRenameBtn(): HTMLElement {
    const renameBtn = document.createElement("button");
    renameBtn.classList.add("dropdown-btn");
    renameBtn.id = "rename-column-btn";
    renameBtn.textContent = "Rename Column";
    renameBtn.type = "button";
    renameBtn.title = "Rename Column";
    return renameBtn;
  }

  renderFormMenu(
    menuClass: string,
    subTitle: string,
    cancelId: string,
    cancelTitle: string,
  ): HTMLElement {
    const menu = document.createElement("menu");
    menu.classList.add(menuClass);

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.classList.add("three-dot-btn");
    submitBtn.innerHTML = Editicon;
    submitBtn.title = subTitle;

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.classList.add("three-dot-btn");
    cancelBtn.id = cancelId;
    cancelBtn.innerHTML = "X";
    cancelBtn.title = cancelTitle;

    menu.append(submitBtn, cancelBtn);
    return menu;
  }

  renderRenameForm(): HTMLElement {
    const form = document.createElement("form");
    form.classList.add("rename-column-form");

    const renameInput = new InputField(columnRenameField).render();

    const menu = this.renderFormMenu(
      "rename-form-menu",
      "Rename Column",
      "cancel-rename-btn",
      "Cancel Renameing",
    );

    form.append(renameInput, menu);
    return form;
  }

  renderLimitBtn(): HTMLElement {
    const setLimitBtn = document.createElement("button");
    setLimitBtn.classList.add("dropdown-btn");
    setLimitBtn.id = "set-task-limit-btn";
    setLimitBtn.textContent = "Set Task Limit";
    setLimitBtn.type = "button";
    setLimitBtn.title = "Set Task Limit";
    return setLimitBtn;
  }

  renderSetLimitForm(): HTMLElement {
    const form = document.createElement("form");
    form.classList.add("set-limit-form");

    const limitInput = new InputField(columnLimitField).render();

    const menu = this.renderFormMenu(
      "limit-form-menu",
      "Set Task Limit",
      "cancel-limit-btn",
      "Cancel Setting Limit",
    );

    form.append(limitInput, menu);
    return form;
  }

  renderDeleteSec(): HTMLElement {
    const deleteSec = document.createElement("li");
    deleteSec.classList.add("menu-item");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("dropdown-btn");
    deleteBtn.id = "delete-column-btn";
    deleteBtn.textContent = "Delete Column";
    deleteBtn.type = "button";
    deleteBtn.title = "Delete Column";

    deleteSec.appendChild(deleteBtn);
    return deleteSec;
  }
}
