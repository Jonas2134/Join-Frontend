import { BaseDialog } from "../core/BaseDialog";
// import { appStore } from "../store/AppStore";

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
    fieldset.classList.add('flex', 'flex-col', 'items-center', 'w-full');

    const legend = document.createElement("legend");
    legend.classList.add('auth-legend');
    legend.textContent = 'Create Task';

    const section = document.createElement("section");
    section.textContent = `${this.columnId}`;


    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");
    menu.innerHTML = `
      <button class="btn-blue" type="submit">Create</button>
      <button class="btn-blue" type="button" id="cancel-btn">Cancel</button>
    `;

    fieldset.append(legend, section, menu);
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