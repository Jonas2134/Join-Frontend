import { BaseDropdownMenu } from "../../../components/bases/BaseDropdownMenu";
import { InputField } from "../../../components/common/InputField";
import { columnRenameField, columnLimitField } from "../../../core/constants/appBoardFields.config";
import { Button } from "../../../components/common/Button";
import { threeDotFormBtns, threeDotRenameBtn, threeDotLimitBtn, threeDotDelBtn } from "../../../core/constants/appBoardBtns.config";

import type { ButtonOptions } from "../../../components/common/Button";

export class ColumnThreeDotDropdown extends BaseDropdownMenu {
  renameConfig = threeDotRenameBtn;
  limitConfig = threeDotLimitBtn;

  constructor(btn: HTMLButtonElement) {
    super(btn, "column-dropdown-menu");
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;

    const renameItem = this.renderMenuListItem(this.renameConfig);
    const setLimitItem = this.renderMenuListItem(this.limitConfig);
    const deleteItem = this.renderMenuListItem(threeDotDelBtn);

    menu.append(renameItem, setLimitItem, deleteItem);
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

  renderFormMenu(menuClass: string, menuType: string): HTMLElement {
    const menuElement = document.createElement("menu");
    menuElement.classList.add(menuClass);

    const menuConfig = threeDotFormBtns.find((btn) => btn.menu === menuType);

    if (!menuConfig) return menuElement;

    const btns = menuConfig.config.map((btnConfig) =>
      new Button(btnConfig).renderBtn(),
    );

    menuElement.append(...btns);
    return menuElement;
  }

  renderRenameForm(): HTMLElement {
    const form = document.createElement("form");
    form.classList.add("rename-column-form");

    const renameInput = new InputField(columnRenameField).render();
    const menu = this.renderFormMenu("rename-form-menu", "rename");

    form.append(renameInput, menu);
    return form;
  }

  renderSetLimitForm(): HTMLElement {
    const form = document.createElement("form");
    form.classList.add("set-limit-form");

    const limitInput = new InputField(columnLimitField).render();
    const menu = this.renderFormMenu("limit-form-menu", "limit");

    form.append(limitInput, menu);
    return form;
  }
}
