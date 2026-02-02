import { BaseDialog } from "../../../components/bases/BaseDialog";
import { appStore } from "../../../core/store/AppStore";
import { Button } from "../../../components/common/Button";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { editBoardDialogBtns } from "../../../core/constants/appDialogBtns.config";
import { editBoardDialogFields } from "../../../core/constants/appDialogFields.config";

export class EditBoardDialog extends BaseDialog {
  boardId: string;

  constructor(Id: string) {
    super("edit-board-dialog");
    this.boardId = Id;
  }

  // ============================================
  // render HTML excerpts
  // ============================================

  renderLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("base-legend");
    legend.textContent = "Edit Board";
    return legend;
  }

  renderMainSection() {
    const main = document.createElement("main");
    main.classList.add("w-full", "grid", "grid-cols-2", "gap-4");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = editBoardDialogFields.map(field =>
      new componentMap[field.type](field.config).render()
    );

    main.append(...fields);
    return main;
  }

  renderMenu() {
    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");

    const btns = editBoardDialogBtns.map((config) =>
      new Button({ ...config }).renderBtn(),
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
    form.id = "eform";
    form.classList.add("p-6");
    form.appendChild(this.renderFieldset());
    return form;
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount(): void {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    const form = this.dialog.querySelector("#eform") as HTMLFormElement;

    cancelBtn.addEventListener("click", () => this.close());

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formDate = new FormData(form);
      const title = formDate.get("title") as string;
      const description = formDate.get("description") as string;
      console.log(formDate, title, description);
      try {
        await appStore.updateBoard(this.boardId, title, description);
        this.close();
        form.reset();
      } catch (err: any) {
        alert("Updating is failed: " + err.message);
      }
    });
  }
}
