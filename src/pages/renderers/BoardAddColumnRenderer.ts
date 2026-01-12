import { InputField } from "../../components/InputField";

export class BoardAddColumnRenderer {
  constructor() {}

  renderAddColumn() {
    const addColumnItem = document.createElement("li");
    addColumnItem.classList.add("add-column-item");
    addColumnItem.appendChild(this.renderAddColumnSection());
    return addColumnItem;
  }

  renderAddColumnSection() {
    const addColumnSection = document.createElement("section");
    addColumnSection.classList.add("add-column");

    const addColumnBtn = document.createElement("button");
    addColumnBtn.classList.add("create-column-btn");
    addColumnBtn.title = "Add Column";
    addColumnBtn.type = "button";
    addColumnBtn.textContent = "+ New Column";

    addColumnSection.appendChild(addColumnBtn);
    return addColumnSection;
  }

  renderAddColumnForm() {
    const form = document.createElement("form");
    form.classList.add("add-column-form", "items-center", "py-4");

    const input = new InputField({
      type: "text",
      placeholder: "Enter column name...",
      name: "columnName",
      required: true,
    });

    const buttonGroup = document.createElement("menu");
    buttonGroup.classList.add("flex", "gap-4");

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("btn-blue");
    submitBtn.title = "Submit new column";
    submitBtn.type = "submit";
    submitBtn.textContent = "+ Add";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-column-btn");
    cancelBtn.title = "Cancel adding column";
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";

    buttonGroup.append(submitBtn, cancelBtn);
    form.append(input.render(), buttonGroup);
    return form;
  }
}
