import { BaseDialog } from "../../../components/bases/BaseDialog";
import { appStore } from "../../../core/store/AppStore";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { editTaskDialogFields } from "../../../core/constants/appDialogFields.config";
import { editTaskDialogBtns } from "../../../core/constants/appDialogBtns.config";
import type { Task } from "../../../core/types/board.types";

export class EditTaskDialog extends BaseDialog {
  task: Task;

  constructor(task: Task) {
    super("edit-task-dialog");
    this.task = task;
  }

  // ============================================
  // render HTML excerpts
  // ============================================

  private renderLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("base-legend");
    legend.textContent = "Edit Task";
    return legend;
  }

  private renderFirstFormSection() {
    const section = document.createElement("section");
    section.classList.add("flex", "flex-col", "gap-3");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = editTaskDialogFields.map(field =>{
      const fieldValue = this.task[field.value];
      return new componentMap[field.type]({
        ...field.config,
        value: fieldValue || undefined
      }).render()
    });

    section.append(...fields);
    return section;
  }

  private renderSecondFormSection() {
    const section = document.createElement("section");
    section.innerHTML = `
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
    return section;
  }

  private renderMainSection() {
    const main = document.createElement("main");
    main.classList.add("w-full", "grid", "grid-cols-2", "gap-4");

    const firstSection = this.renderFirstFormSection();
    const secondSection = this.renderSecondFormSection();

    main.append(firstSection, secondSection);
    return main;
  }

  private renderMenu() {
    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");

    const btns = editTaskDialogBtns.map((config) =>
      new Button({ ...config }).renderBtn()
    );

    menu.append(...btns);
    return menu;
  }

  private renderFieldset() {
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
    form.id = "edit-task-form";
    form.classList.add("p-6");
    form.appendChild(this.renderFieldset());
    return form;
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount(): void {
    const cancelBtn = this.dialog.querySelector("#cancel-btn");
    const form = this.dialog.querySelector("#edit-task-form") as HTMLFormElement;

    cancelBtn?.addEventListener("click", () => this.close());

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;

      try {
        await appStore.updateTask(String(this.task.id), {
          title,
          description: description || null,
        });
        window.dispatchEvent(new CustomEvent("task:updated"));
        this.close();
      } catch (err: any) {
        alert("Update failed: " + err.message);
      }
    });
  }
}
