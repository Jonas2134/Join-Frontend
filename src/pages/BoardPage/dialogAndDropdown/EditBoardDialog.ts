import { BaseDialog } from "../../../components/bases/BaseDialog";
import { boardStore } from "../../../core/store/BoardStore";
import { contactStore } from "../../../core/store/ContactStore";
import { toastManager } from "../../../core/ToastManager";
import { Button } from "../../../components/common/Button";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { MemberSelect } from "../../../components/common/MemberSelect";
import { editBoardDialogBtns } from "../../../core/constants/appDialogBtns.config";
import { editBoardDialogFields } from "../../../core/constants/appDialogFields.config";
import { isGuest } from "../../../core/store/AuthStore";
import type { Board } from "../../../core/types/board.types";

export class EditBoardDialog extends BaseDialog {
  board: Board;
  private memberSelect: MemberSelect | null = null;

  constructor(board: Board) {
    super("edit-board-dialog");
    this.board = board;
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

  renderFieldSection(): HTMLElement {
    const container = document.createElement("div");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = editBoardDialogFields.map(field =>{
      const fieldValue = this.board[field.value];
      return new componentMap[field.type]({
        ...field.config,
        value: fieldValue || undefined
      }).render()
    });

    container.append(...fields);
    return container;
  }

  renderMemberSection(): HTMLElement {
    this.memberSelect = new MemberSelect({
      existingMembers: this.board.members,
      ownerId: this.board.owner,
    });

    return this.memberSelect.render();
  }

  private renderGuestMemberHint(): HTMLElement {
    const section = document.createElement("div");
    section.classList.add("guest-member-hint");
    section.textContent = "Guest users cannot manage members.";
    return section;
  }

  renderMainSection() {
    const main = document.createElement("main");
    main.classList.add("w-full", "grid", "grid-cols-1", "lg:grid-cols-2", "gap-4");

    const firstSection = this.renderFieldSection();
    const secondSection = isGuest()
      ? this.renderGuestMemberHint()
      : this.renderMemberSection();

    main.append(firstSection, secondSection);
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
  // Data Loading
  // ============================================

  private async loadContacts(): Promise<void> {
    try {
      const contacts = await contactStore.loadContacts();
      const memberIds = new Set(this.board.members.map(m => Number(m.id)));
      const filtered = contacts.filter(c => !memberIds.has(c.id));
      this.memberSelect?.setOptions(filtered);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toastManager.error("Kontakte konnten nicht geladen werden: " + message);
    }
  }

  private async handleSearch(query: string): Promise<void> {
    if (!query) {
      const contacts = contactStore.contacts;
      const selectedIds = new Set(this.memberSelect?.getAllMemberIds() ?? []);
      this.memberSelect?.setOptions(contacts.filter(c => !selectedIds.has(c.id)));
      return;
    }

    try {
      const results = await contactStore.searchUsers(query);
      const selectedIds = new Set(this.memberSelect?.getAllMemberIds() ?? []);
      this.memberSelect?.setOptions(results.filter(r => !selectedIds.has(r.id)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toastManager.error("Suche fehlgeschlagen: " + message);
    }
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount(): void {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    const form = this.dialog.querySelector("#eform") as HTMLFormElement;

    cancelBtn.addEventListener("click", () => this.close());

    if (!isGuest()) {
      this.dialog.addEventListener("member-select:search", ((e: CustomEvent) => {
        this.handleSearch(e.detail.query);
      }) as EventListener);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const members = isGuest() ? undefined : this.memberSelect?.getAllMemberIds();
      try {
        await boardStore.updateBoard(this.board.id, title, description, members);
        toastManager.success("Board erfolgreich aktualisiert");
        this.close();
        form.reset();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toastManager.error("Update fehlgeschlagen: " + message);
      }
    });

    if (!isGuest()) {
      this.loadContacts();
    }
  }
}
