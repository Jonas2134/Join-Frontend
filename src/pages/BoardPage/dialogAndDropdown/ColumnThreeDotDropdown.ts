import { BaseDropdownMenu } from "../../../components/bases/BaseDropdownMenu";
import { InputField } from "../../../components/common/InputField";
import {
  columnRenameField,
  columnLimitField,
} from "../../../core/constants/appBoardFields.config";
import { Button } from "../../../components/common/Button";
import {
  threeDotFormBtns,
  threeDotRenameBtn,
  threeDotLimitBtn,
  threeDotDelBtn,
} from "../../../core/constants/appThreeDot.config";

import type { ButtonOptions } from "../../../components/common/Button";
import type { InputFieldOptions } from "../../../components/common/InputField";
import type { Column } from "../../../core/types/board.types";

interface ColumnFieldConfig {
  value: keyof Column;
  config: InputFieldOptions;
}

export class ColumnThreeDotDropdown extends BaseDropdownMenu {
  renameConfig = threeDotRenameBtn;
  limitConfig = threeDotLimitBtn;
  private column: Column;

  constructor(btn: HTMLButtonElement, column: Column) {
    super(btn, "column-dropdown-menu");
    this.column = column;
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

    const btns = menuConfig.config.map((btnConfig) => this.renderMenuBtn(btnConfig));

    menuElement.append(...btns);
    return menuElement;
  }

  renderRenameForm(): HTMLElement {
    return this.renderEditForm(
      "rename-column-form",
      columnRenameField,
      "rename-form-menu",
      "rename"
    );
  }

  renderSetLimitForm(): HTMLElement {
    return this.renderEditForm(
      "set-limit-form",
      columnLimitField,
      "limit-form-menu",
      "limit"
    );
  }

  renderEditForm(
    formClass: string,
    inputConfig: ColumnFieldConfig,
    menuClass: string,
    menuType: string
  ): HTMLElement {
    const form = document.createElement("form");
    form.classList.add(formClass);

    const fieldValue = this.column[inputConfig.value];
    const input = new InputField({
      ...inputConfig.config,
      value: fieldValue != null ? String(fieldValue) : undefined,
    }).render();
    const menu = this.renderFormMenu(menuClass, menuType);

    form.append(input, menu);
    return form;
  }
}
