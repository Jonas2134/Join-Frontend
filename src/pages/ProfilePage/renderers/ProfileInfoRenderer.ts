import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { profileInfoFields, profileBioField } from "../../../core/constants/profileFields.config";
import { editProfileBtn, saveProfileBtn, cancelProfileBtn } from "../../../core/constants/profileBtns.config";

export class ProfileInfoRenderer {

  renderProfileHeader(username: string, email: string): HTMLElement {
    const header = document.createElement("div");
    header.classList.add("profile-header");

    const avatar = document.createElement("div");
    avatar.classList.add("profile-avatar");
    avatar.textContent = this.getInitials(username);

    const info = document.createElement("div");
    info.classList.add("profile-user-info");

    const nameEl = document.createElement("span");
    nameEl.classList.add("profile-username");
    nameEl.textContent = username;

    const emailEl = document.createElement("span");
    emailEl.classList.add("profile-email");
    emailEl.textContent = email;

    info.append(nameEl, emailEl);
    header.append(avatar, info);
    return header;
  }

  renderProfileForm(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("profile-section");

    const title = document.createElement("h2");
    title.classList.add("profile-section-title");
    title.textContent = "Profile Information";

    const form = document.createElement("form");
    form.id = "profileForm";

    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    fieldsWrapper.append(
      ...profileInfoFields.map(config =>
        new InputField({
          ...config,
          className: "input-b-border",
          disabled: true,
        }).render()
      )
    );

    fieldsWrapper.appendChild(
      new Textarea({
        ...profileBioField,
        className: "input-b-border",
        disabled: true,
      }).render()
    );

    const actions = this.renderActions();
    fieldset.append(fieldsWrapper, actions);
    form.appendChild(fieldset);
    section.append(title, form);
    return section;
  }

  private renderActions(): HTMLElement {
    const actions = document.createElement("menu");
    actions.classList.add("profile-actions");

    const editBtn = new Button({ ...editProfileBtn }).renderBtn();

    const saveBtn = new Button({ ...saveProfileBtn }).renderBtn();
    saveBtn.classList.add("hidden");

    const cancelBtn = new Button({ ...cancelProfileBtn }).renderBtn();
    cancelBtn.classList.add("hidden");

    actions.append(editBtn, saveBtn, cancelBtn);
    return actions;
  }

  private getInitials(username: string): string {
    return username
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}
