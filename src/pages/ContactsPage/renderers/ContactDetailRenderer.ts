import { Avatar } from "../../../components/common/Avatar";
import { Button } from "../../../components/common/Button";
import { removeContactBtn } from "../../../core/constants/contactsBtns.config";

import type { Contact, UserDetail } from "../../../core/types/contact.types";

export class ContactDetailRenderer {

  renderDetailPanel(): HTMLElement {
    const panel = document.createElement("div");
    panel.id = "contactsDetailPanel";
    panel.classList.add("contacts-detail-panel");

    panel.append(this.renderEmptyDetail());
    return panel;
  }

  renderEmptyDetail(): HTMLElement {
    const empty = document.createElement("div");
    empty.classList.add("contacts-empty-state");
    empty.textContent = "Select a contact to view details";
    return empty;
  }

  renderDetail(user: UserDetail | Contact, showRemoveBtn: boolean): HTMLElement {
    const wrapper = document.createElement("div");

    const header = this.renderDetailHeader(user);
    wrapper.append(header);

    const fields = this.renderDetailFields(user);
    wrapper.append(fields);

    if (showRemoveBtn) {
      const actions = document.createElement("div");
      actions.classList.add("contacts-detail-actions");

      const btn = new Button(removeContactBtn).renderBtn();
      btn.dataset.removeUserId = String(user.id);
      actions.append(btn);
      wrapper.append(actions);
    }

    return wrapper;
  }

  private renderDetailHeader(user: UserDetail | Contact): HTMLElement {
    const header = document.createElement("div");
    header.classList.add("contacts-detail-header");

    const avatar = new Avatar({ size: "lg" }).createAvatar(user.username);
    avatar.tabIndex = -1;

    const info = document.createElement("div");

    const username = document.createElement("span");
    username.classList.add("contacts-detail-username");
    username.textContent = user.username;

    const email = document.createElement("span");
    email.classList.add("contacts-detail-email");
    email.textContent = user.email;

    info.append(username, email);
    header.append(avatar, info);
    return header;
  }

  private renderDetailFields(user: UserDetail | Contact): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("contacts-detail-fields");

    const detailUser = user as UserDetail;
    const fields: { label: string; value: string }[] = [];

    if (detailUser.first_name) {
      fields.push({ label: "First Name", value: detailUser.first_name });
    }

    if (detailUser.last_name) {
      fields.push({ label: "Last Name", value: detailUser.last_name });
    }

    if (detailUser.tele_number) {
      fields.push({ label: "Phone", value: detailUser.tele_number });
    }

    if (detailUser.bio) {
      fields.push({ label: "Bio", value: detailUser.bio });
    }

    if (fields.length === 0) {
      const noInfo = document.createElement("p");
      noInfo.classList.add("contacts-empty-state");
      noInfo.textContent = "No additional information available";
      container.append(noInfo);
      return container;
    }

    for (const field of fields) {
      const fieldEl = document.createElement("div");
      fieldEl.classList.add("contacts-detail-field");

      const label = document.createElement("span");
      label.classList.add("contacts-detail-label");
      label.textContent = field.label;

      const value = document.createElement("span");
      value.classList.add("contacts-detail-value");
      value.textContent = field.value;

      fieldEl.append(label, value);
      container.append(fieldEl);
    }

    return container;
  }
}
