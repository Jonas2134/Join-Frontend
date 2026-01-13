import { BaseDialog } from "../../components/bases/BaseDialog";
import { appStore } from "../../core/store/AppStore";
import { InputField } from "../../components/common/InputField";
import { Textarea } from "../../components/common/textarea";

import User from "../../assets/icons/user.svg?raw";
import Textareaicon from "../../assets/icons/textarea.svg?raw";

export class BoardCreateDialog extends BaseDialog {
  constructor() {
    super("board-dialog");
  }

  protected renderContent() {
    const form = document.createElement("form");
    form.id = "cform";
    form.classList.add("p-6");

    const fieldset = document.createElement("fieldset");
    fieldset.classList.add('flex', 'flex-col', 'items-center', 'w-full');

    const legend = document.createElement("legend");
    legend.classList.add('auth-legend');
    legend.textContent = 'Create Board';

    const titleField = new InputField({
      type: 'text',
      placeholder: 'Title',
      icon: User,
      name: 'title',
      required: true,
    });


    const descriptionTextfield = new Textarea({
      nameId: 'description',
      placeholder: 'Write your description.',
      icon: Textareaicon,
    });

    const menu = document.createElement("menu");
    menu.classList.add('flex', 'gap-6');
    menu.innerHTML = `
      <button class="btn-blue" type="submit">Create</button>
      <button class="btn-blue" type="button" id="cancel-btn">Cancel</button>
    `;

    fieldset.append(legend, titleField.render(), descriptionTextfield.render(), menu);
    form.appendChild(fieldset);
    return form;
  }

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
