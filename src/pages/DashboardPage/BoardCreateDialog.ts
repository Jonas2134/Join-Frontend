import { BaseDialog } from "../../components/bases/BaseDialog";
import { appStore } from "../../core/store/AppStore";
import { InputField } from "../../components/common/InputField";
import { Textarea } from "../../components/common/Textarea";
import { dashboardFields } from "../../core/constants/appDashboardFields.config";

export class BoardCreateDialog extends BaseDialog {
  constructor() {
    super("board-dialog");
  }

  // ============================================
  // render HTML excerpts
  // ============================================

  renderLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("base-legend");
    legend.textContent = "Create Board";
    return legend;
  }

  renderBoardCreateFieldsWrapper() {
    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = dashboardFields.map(field =>
      new componentMap[field.type](field.config).render()
    );

    fieldsWrapper.append(...fields);
    return fieldsWrapper;
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
    const fieldsWrapper = this.renderBoardCreateFieldsWrapper();
    const menu = this.renderMenu();

    fieldset.append(legend, fieldsWrapper, menu);
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
