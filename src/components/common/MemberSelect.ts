import { Avatar } from "./Avatar";
import { Button } from "./Button";
import type { Member } from "../../core/types/board.types";
import type { Contact } from "../../core/types/contact.types";

interface MemberSelectOptions {
  existingMembers: Member[];
  ownerId: string | number;
}

interface SelectableMember {
  id: number;
  username: string;
  isNew: boolean;
}

export class MemberSelect {
  private container: HTMLElement;
  private displayArea: HTMLElement;
  private optionsList: HTMLElement;
  private searchInput: HTMLInputElement;

  private ownerId: number;
  private initialMemberIds: Set<number>;
  private selectedMembers: SelectableMember[] = [];
  private availableOptions: Contact[] = [];

  constructor(options: MemberSelectOptions) {
    this.ownerId = Number(options.ownerId);
    this.initialMemberIds = new Set(options.existingMembers.map(m => Number(m.id)));

    this.selectedMembers = options.existingMembers.map(m => ({
      id: Number(m.id),
      username: m.username,
      isNew: false,
    }));

    this.container = document.createElement("div");
    this.container.classList.add("member-select");

    this.displayArea = document.createElement("div");
    this.displayArea.classList.add("member-select-display");

    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.name = "member-search";
    this.searchInput.id = "member-search";
    this.searchInput.placeholder = "Search users...";
    this.searchInput.classList.add("member-select-search");

    this.optionsList = document.createElement("div");
    this.optionsList.classList.add("member-select-options");
  }

  render(): HTMLElement {
    const label = document.createElement("label");
    label.htmlFor = "member-search";
    label.classList.add("member-select-label");
    label.textContent = "Members:";

    this.container.append(label, this.displayArea, this.searchInput, this.optionsList);
    this.renderDisplay();
    this.renderOptions();
    this.mount();
    return this.container;
  }

  setOptions(contacts: Contact[]): void {
    const selectedIds = new Set(this.selectedMembers.map(m => m.id));
    this.availableOptions = contacts.filter(c => !selectedIds.has(c.id));
    this.renderOptions();
  }
  
  getAddedMemberIds(): number[] {
    return this.selectedMembers
      .filter(m => m.isNew)
      .map(m => m.id);
  }

  getRemovedMemberIds(): number[] {
    const currentIds = new Set(this.selectedMembers.map(m => m.id));
    return [...this.initialMemberIds].filter(id => !currentIds.has(id));
  }

  getAllMemberIds(): number[] {
    return this.selectedMembers.map(m => m.id);
  }

  private renderDisplay(): void {
    this.displayArea.innerHTML = "";

    const sorted = [...this.selectedMembers].sort((a, b) => {
      if (a.id === this.ownerId) return -1;
      if (b.id === this.ownerId) return 1;
      if (a.isNew !== b.isNew) return a.isNew ? 1 : -1;
      return 0;
    });

    for (const member of sorted) {
      const chip = document.createElement("div");
      chip.classList.add("member-select-chip");

      const isOwner = member.id === this.ownerId;

      const avatar = new Avatar({
        size: "lg",
        isOwner,
      }).createAvatar(member.username);

      if (member.isNew) {
        chip.classList.add("member-select-chip-new");
      }

      chip.appendChild(avatar);

      if (!isOwner) {
        const removeBtn = document.createElement("span");
        removeBtn.classList.add("member-select-remove-btn");
        removeBtn.textContent = "✕";
        removeBtn.dataset.removeId = String(member.id);
        chip.appendChild(removeBtn);
      }

      this.displayArea.appendChild(chip);
    }
  }

  private renderOptions(): void {
    this.optionsList.innerHTML = "";

    for (const contact of this.availableOptions) {
      const option = new Button({
        class: "member-select-option",
        type: "button",
        text: contact.username,
        dataset: {
          contactId: String(contact.id),
          contactUsername: contact.username,
        },
      }).renderBtn();
      this.optionsList.appendChild(option);
    }
  }

  private addMember(contact: Contact): void {
    const alreadySelected = this.selectedMembers.some(m => m.id === contact.id);
    if (alreadySelected) return;

    this.selectedMembers.push({
      id: contact.id,
      username: contact.username,
      isNew: !this.initialMemberIds.has(contact.id),
    });

    this.availableOptions = this.availableOptions.filter(c => c.id !== contact.id);
    this.renderDisplay();
    this.renderOptions();
  }

  private removeMember(memberId: number): void {
    const removed = this.selectedMembers.find(m => m.id === memberId);
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== memberId);

    if (removed) {
      this.availableOptions.push({
        id: removed.id,
        username: removed.username,
        email: "",
      });
    }
    
    this.renderDisplay();
    this.renderOptions();
  }

  private mount(): void {
    this.searchInput.addEventListener("input", () => {
      const query = this.searchInput.value.trim();
      this.container.dispatchEvent(
        new CustomEvent("member-select:search", {
          detail: { query },
          bubbles: true,
        })
      );
    });

    this.displayArea.addEventListener("click", (e: Event) => {
      const target = (e.target as HTMLElement).closest("[data-remove-id]") as HTMLElement | null;
      if (!target) return;
      const memberId = Number(target.dataset.removeId);
      this.removeMember(memberId);
    });

    this.optionsList.addEventListener("click", (e: Event) => {
      const target = (e.target as HTMLElement).closest("[data-contact-id]") as HTMLElement | null;
      if (!target) return;
      const contact: Contact = {
        id: Number(target.dataset.contactId),
        username: target.dataset.contactUsername || "",
        email: "",
      };
      this.addMember(contact);
    });
  }
}
