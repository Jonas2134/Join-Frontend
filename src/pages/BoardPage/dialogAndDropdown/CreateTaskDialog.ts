import { BaseDialog } from "../../../components/bases/BaseDialog";
import { appStore } from "../../../core/store/AppStore";
import { toastManager } from "../../../core/ToastManager";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { createTaskFields } from "../../../core/constants/appBoardFields.config";
import { createTaskDialogBtns } from "../../../core/constants/appDialogBtns.config";

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
    legend.classList.add("base-legend");
    legend.textContent = "Create Task";
    return legend;
  }

  renderFirstFormSection() {
    const firstsec = document.createElement("section");
    firstsec.classList.add("flex", "flex-col", "gap-3");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = createTaskFields.map((field) =>
      new componentMap[field.type](field.config).render(),
    );

    firstsec.append(...fields);
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

    const btns = createTaskDialogBtns.map((config) =>
      new Button({ ...config }).renderBtn()
    );

    menu.append(...btns);
    return menu;
  }

  renderFieldset() {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("fields-wrapper");

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
      try {
        await appStore.createTask(this.columnId, title, description);
        toastManager.success("Task erfolgreich erstellt");
        this.close();
        form.reset();
      } catch (err: any) {
        toastManager.error("Erstellung fehlgeschlagen: " + err.message);
      }
    });
  }
}
