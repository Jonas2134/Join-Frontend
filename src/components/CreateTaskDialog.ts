import { BaseDialog } from "../core/BaseDialog";
// import { appStore } from "../store/AppStore";
import { InputField } from "./InputField";
import { Textarea } from "./textarea";

export class CreateTaskDialog extends BaseDialog {
  columnId: number;

  constructor(id: number) {
    super("create-task-dialog");
    this.columnId = id;
  }

  protected renderContent(): HTMLElement {
    const form = document.createElement("form");
    form.id = "tform";
    form.classList.add("p-6");

    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("flex", "flex-col", "items-center", "w-full");

    const legend = document.createElement("legend");
    legend.classList.add("auth-legend");
    legend.textContent = "Create Task";

    const main = document.createElement("main");
    main.classList.add("grid", "grid-cols-2");

    const firstsec = document.createElement("section");
    firstsec.classList.add("flex", "flex-col", "gap-3");

    const titleField = new InputField({
      type: 'text',
      placeholder: 'Title',
      name: 'title',
      required: true,
    });

    const descriptionTextfield = new Textarea({
      nameId: 'description',
      placeholder: 'Write your description.'
    });

    firstsec.append(titleField.render(), descriptionTextfield.render());

    const secontsec = document.createElement("section");
    secontsec.innerHTML = `
      <label for="assignee">Choose an assignee:</label
      <br>
      <select name="assignee" id="assignee">
        <option value="">--Please choose the assignee--</option>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
      </select>
    `;

    main.append(firstsec, secontsec);

    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");
    menu.innerHTML = `
      <button class="btn-blue" type="submit">Create</button>
      <button class="btn-blue" type="button" id="cancel-btn">Cancel</button>
    `;

    fieldset.append(legend, main, menu);
    form.appendChild(fieldset);
    return form;
  }

  protected override mount(): void {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    const form = this.dialog.querySelector("#tform") as HTMLFormElement;

    cancelBtn.addEventListener("click", () => this.close());

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formDate = new FormData(form);
      console.log(formDate);
    });
  }
}
