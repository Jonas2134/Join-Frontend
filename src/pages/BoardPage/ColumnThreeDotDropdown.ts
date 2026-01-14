import { BaseDropdownMenu } from "../../components/bases/BaseDropdownMenu";

export class ColumnThreeDotDropdown extends BaseDropdownMenu {
  private onRename: (newName: string) => void;
  private onSetTaskLimit: (limit: string) => void;
  private onDelete: () => void;

  constructor(
    btn: HTMLButtonElement,
    onRename: (newName: string) => void,
    onSetTaskLimit: (limit: string) => void,
    onDelete: () => void
  ) {
    super(btn, "column-dropdown-menu");
    this.onRename = onRename;
    this.onSetTaskLimit = onSetTaskLimit;
    this.onDelete = onDelete;
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;

    const renameSec = this.renderRenameSec();
    const setLimitSec = this.renderLimitSec();
    const deleteSec = this.renderDeleteSec();

    menu.append(renameSec, setLimitSec, deleteSec);
    return menu;
  }

  renderRenameSec(): HTMLElement {
    const renameSec = document.createElement("li");

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "Rename Column";
    renameBtn.type = "button";
    renameBtn.title = "Rename Column";

    renameSec.appendChild(renameBtn)
    return renameSec;
  }

  renderLimitSec(): HTMLElement {
    const setLimitSec = document.createElement("li");

    const setLimitBtn = document.createElement("button");
    setLimitBtn.textContent = "Set Task Limit";
    setLimitBtn.type = "button";
    setLimitBtn.title = "Set Task Limit";

    setLimitSec.appendChild(setLimitBtn);
    return setLimitSec;
  }

  renderDeleteSec(): HTMLElement {
    const deleteSec = document.createElement("li");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Column";
    deleteBtn.type = "button";
    deleteBtn.title = "Delete Column";

    deleteSec.appendChild(deleteBtn);
    return deleteSec;
  }
}
