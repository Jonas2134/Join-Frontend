import { BaseDropdownMenu } from "../../components/bases/BaseDropdownMenu";
import { Button } from "../../components/common/Button";
import {
  unarchiveBoardBtn,
  dashboardDeleteBtn,
  dashboardLeaveBtn,
} from "../../core/constants/appThreeDot.config";

import type { ButtonOptions } from "../../components/common/Button";

export class ArchivedBoardsDropdown extends BaseDropdownMenu {
  private isOwner: boolean;

  constructor(
    btn: HTMLButtonElement,
    isOwner: boolean,
  ) {
    super(btn, "archived-boards-dropdown-menu");
    this.isOwner = isOwner;
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;
    menu.innerHTML = "";

    if (this.isOwner) {
      menu.append(
        this.renderMenuListItem(unarchiveBoardBtn),
        this.renderMenuListItem(dashboardDeleteBtn),
      );
    } else {
      menu.append(this.renderDisabledListItem(dashboardLeaveBtn));
    }

    return menu;
  }

  private renderMenuListItem(btnConfig: ButtonOptions): HTMLLIElement {
    const item = document.createElement("li");
    item.classList.add("menu-item");
    item.appendChild(new Button(btnConfig).renderBtn());
    return item;
  }

  private renderDisabledListItem(btnConfig: ButtonOptions): HTMLLIElement {
    const item = document.createElement("li");
    item.classList.add("menu-item");

    const btn = new Button({
      ...btnConfig,
      class: ["dropdown-btn", "btn-disabled"],
    }).renderBtn();
    btn.disabled = true;
    btn.title = "Coming soon";

    item.appendChild(btn);
    return item;
  }
}
