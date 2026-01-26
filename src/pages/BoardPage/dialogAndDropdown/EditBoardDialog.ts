import { BaseDialog } from "../../../components/bases/BaseDialog";

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
    legend.classList.add("auth-legend");
    legend.textContent = "Edit Board";
    return legend;
  }

  renderMainSection() {
    const main = document.createElement("main");
    main.classList.add("w-full", "grid", "grid-cols-2", "gap-4");
    
    // TODO: add Inputfields

    return main;
  }

  renderMenu() {
    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");
    menu.innerHTML = `
      <button class="btn btn-blue" type="submit">Edit</button>
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
    form.id = "eform";
    form.classList.add("p-6");
    form.appendChild(this.renderFieldset());
    return form;
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount(): void {
    
  }
}
