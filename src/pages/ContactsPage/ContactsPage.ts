import { BasePage } from "../../components/bases/BasePage";
import { AppLayout } from "../../layouts/AppLayout";
import { contactStore } from "../../core/store/ContactStore";
import { ContactsPageController } from "./ContactsPageController";
import { ContactTabsRenderer } from "./renderers/ContactTabsRenderer";
import { ContactListRenderer } from "./renderers/ContactListRenderer";
import { ContactDetailRenderer } from "./renderers/ContactDetailRenderer";

export class ContactsPage extends BasePage {
  private eventController: ContactsPageController;
  private tabsRenderer = new ContactTabsRenderer();
  private listRenderer = new ContactListRenderer();
  private detailRenderer = new ContactDetailRenderer();

  constructor() {
    super(new AppLayout());
    this.eventController = new ContactsPageController(
      this.listRenderer,
      this.detailRenderer,
    );
  }

  // ============================================
  // Base render
  // ============================================

  render() {
    const container = document.createElement("div");
    container.id = "contactsPage";
    container.classList.add("contacts-page");

    container.append(
      this.tabsRenderer.renderTabs(),
      this.renderContentArea(),
    );

    return this.wrapWithLayout(container);
  }

  private renderContentArea(): HTMLElement {
    const content = document.createElement("div");
    content.id = "contactsContent";
    content.classList.add("contacts-split");

    content.append(
      this.listRenderer.renderListPanel(),
      this.detailRenderer.renderDetailPanel(),
    );

    return content;
  }

  // ============================================
  // Lifecycle
  // ============================================

  private async initLoadContacts() {
    await contactStore.loadContacts();
    this.eventController.renderFindTab();
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  mount() {
    this.initLoadContacts();

    const pageroot = document.getElementById("contactsPage");
    if (!pageroot) throw new Error("ContactsPage not found!");

    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerTabClickListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerContactSelectListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerRemoveContactListener(e));
    this.events.on(pageroot, "input", (e: Event) => this.eventController.registerSearchInputListener(e));
    this.events.on(pageroot, "change", (e: Event) => this.eventController.registerToggleSwitchListener(e));

    this.events.on(window, "contact:added", () => this.handleContactChanged());
    this.events.on(window, "contact:removed", () => this.handleContactChanged());
  }

  private async handleContactChanged() {
    await contactStore.loadContacts();
    this.eventController.refreshCurrentTab();
  }
}
