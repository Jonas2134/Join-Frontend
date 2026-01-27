import { BaseDialog } from "../../components/bases/BaseDialog";
import { appStore } from "../../core/store/AppStore";
import { InputField } from "../../components/common/InputField";
import { Textarea } from "../../components/common/Textarea";

import User from "../../assets/icons/user.svg?raw";
import Textareaicon from "../../assets/icons/textarea.svg?raw";

export class BoardCreateDialog extends BaseDialog {
  constructor() {
    super("board-dialog");
  }

  // ============================================
  // render HTML excerpts
  // ============================================

  renderLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("auth-legend");
    legend.textContent = "Create Board";
    return legend;
  }

  renderInputField() {
    const titleField = new InputField({
      label: "Board Title:",
      name: "title",
      type: "text",
      placeholder: "Title",
      className: "input-b-border",
      icon: User,
      required: true
    });
    return titleField;
  }

  renderTextarea() {
    const descriptionTextfield = new Textarea({
      label: "Board description:",
      name: "description",
      placeholder: "Write your description.",
      icon: Textareaicon,
      className: "input-b-border",
      rows: 5,
      maxLength: 500,
      required: true
    });
    return descriptionTextfield;
  }

  renderMenu() {
    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");
    menu.innerHTML = `
      <button class="btn btn-blue" type="submit">Create</button>
      <button class="btn btn-white" type="button" id="cancel-btn">Cancel</button>
    `;
    return menu;
  }

  renderFieldset() {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const legend = this.renderLegend();
    const titleField = this.renderInputField();
    const descriptionTextfield = this.renderTextarea();
    const menu = this.renderMenu();

    fieldset.append(legend, titleField.render(), descriptionTextfield.render(), menu);
    return fieldset;
  }

  // ============================================
  // render Dialog Content
  // ============================================

  protected renderContent() {
    const form = document.createElement("form");
    form.id = "cform";
    form.classList.add("p-6");
    form.appendChild(this.renderFieldset());
    return form;
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount() {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    const form = this.dialog.querySelector("#cform") as HTMLFormElement;

    cancelBtn.addEventListener("click", () => this.close());

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formDate = new FormData(form);
      console.log(formDate);
      try {
        await appStore.createBoard(
          formDate.get("title") as string,
          formDate.get("description") as string
        );
        this.close();
        form.reset();
      } catch (err: any) {
        alert("Creation is failed: " + err.message);
      }
    });
  }
}
