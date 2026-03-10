import { BaseDropdownMenu } from "../bases/BaseDropdownMenu";
import { Button } from "../common/Button";
import { burgerMenuListBtns } from "../../core/constants/appLayoutBtns.config";

import type { ButtonOptions } from "../common/Button";

export class BurgerMenuDropdown extends BaseDropdownMenu {
  constructor(btn: HTMLButtonElement) {
    super(btn, "burger-dropdown-menu");
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;
    menu.innerHTML = "";

    const listItems = burgerMenuListBtns.map((config) =>
      this.renderMenuListItem(config),
    );

    menu.append(...listItems);
    return menu;
  }

  private renderMenuListItem(btnConfig: ButtonOptions): HTMLLIElement {
    const item = document.createElement("li");
    item.classList.add("menu-item");
    item.appendChild(new Button(btnConfig).renderBtn());
    return item;
  }
}
