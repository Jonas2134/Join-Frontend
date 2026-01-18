import { BaseDropdownMenu } from "../../components/bases/BaseDropdownMenu";
import { InputField } from "../../components/common/InputField";

import Editicon from "../../assets/icons/edit.svg?raw";

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

  renderRenameForm(): HTMLElement {
    const form = document.createElement("form");
    form.classList.add("rename-column-form");

    const renameInput = new InputField({
      type: "text",
      placeholder: "New column name",
      name: "column-rename",
      class: "rename-input",
      required: true
    });

    const menu = document.createElement("menu");
    menu.classList.add("rename-form-menu");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.classList.add("three-dot-btn");
    submitBtn.innerHTML = Editicon;
    submitBtn.title = "Rename Column";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.classList.add("three-dot-btn");
    cancelBtn.id = "cancel-rename-btn";
    cancelBtn.innerHTML = "X";
    cancelBtn.title = "Cancel Renameing";

    menu.append(submitBtn, cancelBtn);
    form.append(renameInput.render(), menu);
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

    const limitInput = new InputField({
      type: "number",
      placeholder: "Task limit",
      name: "task-limit",
      class: "limit-input",
      required: true
    });

    const menu = document.createElement("menu");
    menu.classList.add("limit-form-menu");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.classList.add("three-dot-btn");
    submitBtn.innerHTML = Editicon;
    submitBtn.title = "Set Task Limit";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.classList.add("three-dot-btn");
    cancelBtn.id = "cancel-limit-btn";
    cancelBtn.innerHTML = "X";
    cancelBtn.title = "Cancel Setting Limit";
    
    menu.append(submitBtn, cancelBtn);
    form.append(limitInput.render(), menu);
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
