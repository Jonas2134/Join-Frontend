import { appStore } from "../store/AppStore";
import { InputField } from "./InputField";
import { Textarea } from "./textarea";

import User from "../assets/icons/user.svg?raw";
import Textareaicon from "../assets/icons/textarea.svg?raw";

export class BoardCreateDialog {
  dialog: HTMLDialogElement;
  form: HTMLFormElement;

  constructor() {
    this.dialog = document.createElement("dialog");
    this.dialog.id = "board-dialog";
    this.dialog.classList.add('board-dialog');

    this.form = document.createElement("form");
    this.form.id = "form";
    this.form.method = "dialog";

    this.createFormDialog();
    this.dialog.appendChild(this.form);

    this.attachEvents();
  }

  createFormDialog() {
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
    menu.classList.add('flex', 'gap-6')
    menu.innerHTML = `
      <button class="btn-blue transition-all" type="submit">Create</button>
      <button class="btn-blue transition-all" type="button" id="cancel-btn">Cancel</button>
    `;

    fieldset.append(legend, titleField.render(), descriptionTextfield.render(), menu);
    this.form.appendChild(fieldset);
  }

  attachEvents() {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    
    cancelBtn.addEventListener("click", () => {
      this.dialog.close();
    });

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formDate = new FormData(this.form);
      const title = formDate.get("title") as string;
      const description = formDate.get("description") as string;
      try {
        await appStore.createBoard(title, description);
        this.dialog.close();
        this.form.reset();
      } catch (err: any) {
        alert("Creation is failed: " + err.message);
      }
    });
  }

  open() {
    this.dialog.showModal();
  }

  render() {
    return this.dialog;
  }
}
