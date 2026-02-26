import { InputField } from "../../../components/common/InputField";
import { Avatar } from "../../../components/common/Avatar";
import { contactSearchField } from "../../../core/constants/contactsFields.config";

import type { Contact } from "../../../core/types/contact.types";

export class ContactListRenderer {

  renderListPanel(): HTMLElement {
    const panel = document.createElement("div");
    panel.id = "contactsListPanel";
    panel.classList.add("contacts-list-panel");

    const searchbar = this.renderSearchbar();
    const list = document.createElement("ul");
    list.id = "contactsList";
    list.classList.add("contacts-list");

    panel.append(searchbar, list);
    return panel;
  }

  renderSearchbar(): HTMLElement {
    return new InputField(contactSearchField).render();
  }

  renderList(contacts: Contact[], showToggle: boolean): HTMLElement {
    const list = document.createElement("ul");
    list.id = "contactsList";
    list.classList.add("contacts-list");

    const items = contacts.map(contact => this.renderListItem(contact, showToggle));
    list.append(...items);
    return list;
  }

  renderListItem(contact: Contact, showToggle: boolean): HTMLElement {
    const li = document.createElement("li");
    li.classList.add("contacts-list-item");
    li.dataset.userId = String(contact.id);

    const info = document.createElement("div");
    info.classList.add("contacts-list-item-info");

    const avatar = new Avatar({ size: "sm" }).createAvatar(contact.username);
    avatar.tabIndex = -1;

    const name = document.createElement("span");
    name.classList.add("contacts-list-item-name");
    name.textContent = contact.username;

    info.append(avatar, name);
    li.append(info);

    if (showToggle) {
      const toggle = this.renderToggleSwitch(contact.id);
      li.append(toggle);
    }

    return li;
  }

  renderToggleSwitch(userId: number): HTMLElement {
    const label = document.createElement("label");
    label.classList.add("contacts-toggle-switch");
    label.title = "Add contact";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("contacts-toggle-input");
    input.dataset.addUserId = String(userId);

    const slider = document.createElement("span");
    slider.classList.add("contacts-toggle-slider");

    label.append(input, slider);
    return label;
  }

  renderEmptyList(message: string): HTMLElement {
    const empty = document.createElement("li");
    empty.classList.add("contacts-empty-state");
    empty.textContent = message;
    return empty;
  }
}
