import { InputField } from "../../../components/common/InputField";
import { Button } from "../../../components/common/Button";
import { boardAddColumnBtn, boardAddColumnFormBtns } from "../../../core/constants/appBoardBtns.config";
import { addColumnField } from "../../../core/constants/appBoardFields.config";
import type { ButtonOptions } from "../../../components/common/Button";

export class BoardAddColumnRenderer {
  constructor() {}

  renderAddColumn() {
    const addColumnItem = document.createElement("li");
    addColumnItem.classList.add("add-column-item");
    addColumnItem.appendChild(this.renderAddColumnSection());
    return addColumnItem;
  }

  renderBtn(btnConfig: ButtonOptions) {
    return new Button(btnConfig).renderBtn();
  }

  renderAddColumnSection() {
    const addColumnSection = document.createElement("section");
    addColumnSection.classList.add("add-column");

    const addColumnBtn = this.renderBtn(boardAddColumnBtn);

    addColumnSection.appendChild(addColumnBtn);
    return addColumnSection;
  }

  renderAddColumnForm() {
    const form = document.createElement("form");
    form.classList.add("add-column-form", "items-center", "gap-4", "py-4");

    const input = new InputField(addColumnField).render();
    const menu = this.renderAddColumnFormMenu();

    form.append(input, menu);
    return form;
  }

  renderAddColumnFormMenu() {
    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-4");

    const btns = boardAddColumnFormBtns.map((btn) => this.renderBtn(btn));

    menu.append(...btns);
    return menu;
  }
}
