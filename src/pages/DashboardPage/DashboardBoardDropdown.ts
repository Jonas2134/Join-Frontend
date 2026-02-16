import { BaseDropdownMenu } from "../../components/bases/BaseDropdownMenu";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { appStore } from "../../core/store/AppStore";
import { toastManager } from "../../core/ToastManager";
import {
  dashboardArchiveBtn,
  dashboardDeleteBtn,
  dashboardLeaveBtn,
} from "../../core/constants/appThreeDot.config";

import type { ButtonOptions } from "../../components/common/Button";

export class DashboardBoardDropdown extends BaseDropdownMenu {
  private boardId: string;
  private isOwner: boolean;
  private boardTitle: string;

  constructor(
    btn: HTMLButtonElement,
    boardId: string,
    isOwner: boolean,
    boardTitle: string,
  ) {
    super(btn, "dashboard-dropdown-menu");
    this.boardId = boardId;
    this.isOwner = isOwner;
    this.boardTitle = boardTitle;
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;
    menu.innerHTML = "";

    if (this.isOwner) {
      const archiveItem = this.renderMenuListItem(dashboardArchiveBtn);
      const deleteItem = this.renderMenuListItem(dashboardDeleteBtn);
      menu.append(archiveItem, deleteItem);
    } else {
      const leaveItem = this.renderDisabledListItem(dashboardLeaveBtn);
      menu.append(leaveItem);
    }

    return menu;
  }

  private renderMenuListItem(btnConfig: ButtonOptions): HTMLLIElement {
    const item = document.createElement("li");
    item.classList.add("menu-item");

    const btn = new Button(btnConfig).renderBtn();
    btn.addEventListener("click", () => this.handleAction(btnConfig));

    item.appendChild(btn);
    return item;
  }

  private renderDisabledListItem(btnConfig: ButtonOptions): HTMLLIElement {
    const item = document.createElement("li");
    item.classList.add("menu-item");

    const btn = new Button({
      ...btnConfig,
      class: ["dropdown-btn" ,"btn-disabled"],
    }).renderBtn();
    btn.disabled = true;
    btn.title = "Coming soon";

    item.appendChild(btn);
    return item;
  }

  private handleAction(btnConfig: ButtonOptions) {
    this.close();

    if (btnConfig === dashboardArchiveBtn) {
      this.handleArchive();
    } else if (btnConfig === dashboardDeleteBtn) {
      this.handleDelete();
    }
  }

  private async handleArchive() {
    try {
      await appStore.archiveBoard(this.boardId, false);
      toastManager.success("Board archived");
    } catch {
      toastManager.error("Failed to archive board");
    }
  }

  private handleDelete() {
    const dialog = new ConfirmDialog({
      title: "Delete Board",
      message: `Are you sure you want to delete "${this.boardTitle}"? All columns and tasks will be permanently deleted.`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await appStore.deleteBoard(this.boardId);
          toastManager.success("Board deleted");
        } catch {
          toastManager.error("Failed to delete board");
        }
      },
    });
    document.body.appendChild(dialog.render());
    dialog.open();
  }
}
