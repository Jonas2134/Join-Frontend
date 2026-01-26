import { BaseDialog } from "../../../components/bases/BaseDialog";
import { appStore } from "../../../core/store/AppStore";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/textarea";

export class CreateTaskDialog extends BaseDialog {
  columnId: string;

  constructor(id: string) {
    super("create-task-dialog");
    this.columnId = id;
  }

  // ============================================
  // render HTML excerpts
  // ============================================

  renderLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("auth-legend");
    legend.textContent = "Create Task";
    return legend;
  }

  renderFirstFormSection() {
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
    return firstsec;
  }

  renderSecondFormSection() {
    const secontsec = document.createElement("section");
    secontsec.innerHTML = `
      <label for="assignee">Choose an assignee:</label>
      <br>
      <select name="assignee" id="assignee">
        <option value="">--Please choose the assignee--</option>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
      </select>
    `;
    return secontsec;
  }

  renderMainSection() {
    const main = document.createElement("main");
    main.classList.add("w-full", "grid", "grid-cols-2", "gap-4");

    const firstsec = this.renderFirstFormSection();
    const secontsec = this.renderSecondFormSection();

    main.append(firstsec, secontsec);
    return main;
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
    fieldset.classList.add("flex", "flex-col", "items-center", "w-full");

    const legend = this.renderLegend();
    const main = this.renderMainSection();
    const menu = this.renderMenu();

    fieldset.append(legend, main, menu);
    return fieldset;
  }

  // ============================================
  // render Dialog Content
  // ============================================

  protected renderContent(): HTMLElement {
    const form = document.createElement("form");
    form.id = "tform";
    form.classList.add("p-6");    
    form.appendChild(this.renderFieldset());
    return form;
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount(): void {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    const form = this.dialog.querySelector("#tform") as HTMLFormElement;

    cancelBtn.addEventListener("click", () => this.close());

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formDate = new FormData(form);
      const title = formDate.get("title") as string;
      const description = formDate.get("description") as string;
      //const assignee = formDate.get("assignee") as string;
      console.log(formDate);
      try {
        await appStore.createTask(this.columnId, title, description);
        this.close();
        form.reset();
      } catch (err: any) {
        alert("Creation is failed: " + err.message);
      }
    });
  }
}
