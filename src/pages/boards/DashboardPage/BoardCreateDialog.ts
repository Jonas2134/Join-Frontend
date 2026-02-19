import { BaseDialog } from "../../../components/bases/BaseDialog";
import { appStore } from "../../../core/store/AppStore";
import { contactStore } from "../../../core/store/ContactStore";
import { authStore } from "../../../core/store/AuthStore";
import { toastManager } from "../../../core/ToastManager";
import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { MemberSelect } from "../../../components/common/MemberSelect";
import { dashboardFields } from "../../../core/constants/appDashboardFields.config";
import type { Member } from "../../../core/types/board.types";

export class BoardCreateDialog extends BaseDialog {
  private memberSelect!: MemberSelect;

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

  renderFieldSection() {
    const section = document.createElement("div");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = dashboardFields.map(field =>
      new componentMap[field.type](field.config).render()
    );

    section.append(...fields);
    return section;
  }

  renderMemberSection(): HTMLElement {
    const currentUser = authStore.currentUser;
    const ownerAsMember: Member = {
      id: String(currentUser?.id ?? 0),
      username: currentUser?.username ?? "",
      first_name: "",
      last_name: "",
    };

    this.memberSelect = new MemberSelect({
      existingMembers: [ownerAsMember],
      ownerId: currentUser?.id ?? 0,
      multiple: true,
      showSearch: true,
      label: "Members:",
    });

    return this.memberSelect.render();
  }

  renderMainSection() {
    const main = document.createElement("main");
    main.classList.add("w-full", "grid", "grid-cols-2", "gap-4");

    const firstSection = this.renderFieldSection();
    const secondSection = this.renderMemberSection();

    main.append(firstSection, secondSection);
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

  protected renderContent() {
    const form = document.createElement("form");
    form.id = "cform";
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
      this.memberSelect.setOptions(contacts);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toastManager.error("Kontakte konnten nicht geladen werden: " + message);
    }
  }

  private async handleSearch(query: string): Promise<void> {
    if (!query) {
      const contacts = contactStore.contacts;
      const selectedIds = new Set(this.memberSelect.getAllMemberIds());
      this.memberSelect.setOptions(contacts.filter(c => !selectedIds.has(c.id)));
      return;
    }

    try {
      const results = await contactStore.searchUsers(query);
      const selectedIds = new Set(this.memberSelect.getAllMemberIds());
      this.memberSelect.setOptions(results.filter(r => !selectedIds.has(r.id)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toastManager.error("Suche fehlgeschlagen: " + message);
    }
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  protected override mount() {
    const cancelBtn = this.dialog.querySelector("#cancel-btn") as HTMLFormElement;
    const form = this.dialog.querySelector("#cform") as HTMLFormElement;

    cancelBtn.addEventListener("click", () => this.close());

    this.dialog.addEventListener("member-select:search", ((e: CustomEvent) => {
      this.handleSearch(e.detail.query);
    }) as EventListener);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formDate = new FormData(form);
      const members = this.memberSelect.getAllMemberIds();
      try {
        await appStore.createBoard(
          formDate.get("title") as string,
          formDate.get("description") as string,
          members,
        );
        toastManager.success("Board erfolgreich erstellt");
        this.close();
        form.reset();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toastManager.error("Erstellung fehlgeschlagen: " + message);
      }
    });

    this.loadContacts();
  }
}
