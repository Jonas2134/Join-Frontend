import { BasePageController } from "../../components/bases/BasePageController";
import { contactStore } from "../../core/store/ContactStore";
import { ContactListRenderer } from "./renderers/ContactListRenderer";
import { ContactDetailRenderer } from "./renderers/ContactDetailRenderer";

import type { Contact } from "../../core/types/contact.types";

type Tab = "find" | "my";

export class ContactsPageController extends BasePageController {
  private listRenderer: ContactListRenderer;
  private detailRenderer: ContactDetailRenderer;
  private activeTab: Tab = "find";
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(listRenderer: ContactListRenderer, detailRenderer: ContactDetailRenderer) {
    super();
    this.listRenderer = listRenderer;
    this.detailRenderer = detailRenderer;
  }

  // ============================================
  // Event Listeners
  // ============================================

  registerTabClickListener(e: Event) {
    const findTab = this.findClosestElement<HTMLButtonElement>(e.target, "#findContactsTab");
    const myTab = this.findClosestElement<HTMLButtonElement>(e.target, "#myContactsTab");

    if (findTab && this.activeTab !== "find") {
      this.switchTab("find");
    } else if (myTab && this.activeTab !== "my") {
      this.switchTab("my");
    }
  }

  registerSearchInputListener(e: Event) {
    const input = this.findClosestElement<HTMLInputElement>(e.target, 'input[name="search"]');
    if (!input) return;

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    const query = input.value.trim();

    if (this.activeTab === "find") {
      if (!query) {
        this.updateList([], true, "Search for users to add them");
        return;
      }

      this.debounceTimer = setTimeout(async () => {
        const results = await contactStore.searchUsers(query);
        this.updateList(results, true, "No users found");
      }, 300);
    } else {
      const filtered = contactStore.contacts.filter(c =>
        c.username.toLowerCase().includes(query.toLowerCase())
      );
      this.updateList(filtered, false, "No contacts found");
    }
  }

  async registerToggleSwitchListener(e: Event) {
    const input = this.findClosestElement<HTMLInputElement>(e.target, "input[data-add-user-id]");
    if (!input) return;

    const userId = input.dataset.addUserId;
    if (!userId) return;

    input.disabled = true;

    await this.performStoreOperation(
      () => contactStore.addContact(userId),
      "Add contact",
    );
  }

  async registerContactSelectListener(e: Event) {
    const listItem = this.findClosestElement<HTMLElement>(e.target, ".contacts-list-item");
    if (!listItem) return;

    const toggle = this.findClosestElement<HTMLElement>(e.target, ".contacts-toggle-switch");
    if (toggle) return;

    const removeBtn = this.findClosestElement<HTMLElement>(e.target, "#removeContactBtn");
    if (removeBtn) return;

    const userId = listItem.dataset.userId;
    if (!userId) return;

    this.setActiveListItem(listItem);

    const detailPanel = document.getElementById("contactsDetailPanel");
    if (!detailPanel) return;

    detailPanel.innerHTML = "";

    try {
      const userDetail = await contactStore.getUserDetail(userId);
      const detail = this.detailRenderer.renderDetail(userDetail, this.activeTab === "my");
      detailPanel.append(detail);
    } catch {
      const detail = this.detailRenderer.renderEmptyDetail();
      detail.textContent = "Could not load user details";
      detailPanel.append(detail);
    }
  }

  async registerRemoveContactListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#removeContactBtn");
    if (!btn) return;

    const userId = btn.dataset.removeUserId;
    if (!userId) return;

    await this.performStoreOperation(
      () => contactStore.removeContact(userId),
      "Remove contact",
    );
  }

  // ============================================
  // Tab Management
  // ============================================

  switchTab(tab: Tab) {
    this.activeTab = tab;
    this.updateTabStyles();
    this.clearDetail();
    this.clearSearchbar();

    if (tab === "find") {
      this.renderFindTab();
    } else {
      this.renderMyTab();
    }
  }

  refreshCurrentTab() {
    this.clearDetail();
    this.clearSearchbar();

    if (this.activeTab === "find") {
      this.renderFindTab();
    } else {
      this.renderMyTab();
    }
  }

  renderFindTab() {
    this.updateList([], true, "Search for users to add them");
  }

  private renderMyTab() {
    this.updateList(contactStore.contacts, false, "No contacts yet");
  }

  // ============================================
  // DOM Manipulation
  // ============================================

  private updateTabStyles() {
    const findTab = document.getElementById("findContactsTab");
    const myTab = document.getElementById("myContactsTab");

    if (findTab && myTab) {
      findTab.classList.toggle("contacts-tab-active", this.activeTab === "find");
      myTab.classList.toggle("contacts-tab-active", this.activeTab === "my");
    }
  }

  private updateList(contacts: Contact[], showToggle: boolean, emptyMessage: string) {
    const oldList = document.getElementById("contactsList");
    if (!oldList) return;

    const newList = this.listRenderer.renderList(contacts, showToggle);

    if (contacts.length === 0) {
      const emptyItem = this.listRenderer.renderEmptyList(emptyMessage);
      newList.append(emptyItem);
    }

    oldList.replaceWith(newList);
  }

  private setActiveListItem(activeItem: HTMLElement) {
    const list = document.getElementById("contactsList");
    if (!list) return;

    list.querySelectorAll(".contacts-list-item-active").forEach(item => {
      item.classList.remove("contacts-list-item-active");
    });

    activeItem.classList.add("contacts-list-item-active");
  }

  private clearDetail() {
    const detailPanel = document.getElementById("contactsDetailPanel");
    if (!detailPanel) return;

    detailPanel.innerHTML = "";
    detailPanel.append(this.detailRenderer.renderEmptyDetail());
  }

  private clearSearchbar() {
    const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]');
    if (searchInput) searchInput.value = "";
  }
}
