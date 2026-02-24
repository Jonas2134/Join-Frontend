import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { profileInfoFields, profileEmailField, profileBioField } from "../../../core/constants/profileFields.config";
import { editProfileBtn, saveProfileBtn, cancelProfileBtn, showChangePasswordBtn } from "../../../core/constants/profileBtns.config";

export class ProfileInfoRenderer {

  renderProfileHeader(username: string, email: string): HTMLElement {
    const header = document.createElement("div");
    header.id = "profileHeader";
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

    const changePasswordBtn = new Button({ ...showChangePasswordBtn }).renderBtn();

    info.append(nameEl, emailEl);
    header.append(avatar, info, changePasswordBtn);
    return header;
  }

  updateProfileHeader(username: string, email: string) {
    const header = document.getElementById("profileHeader");
    if (!header) return;

    const avatar = header.querySelector(".profile-avatar");
    if (avatar) avatar.textContent = this.getInitials(username);

    const nameEl = header.querySelector(".profile-username");
    if (nameEl) nameEl.textContent = username;

    const emailEl = header.querySelector(".profile-email");
    if (emailEl) emailEl.textContent = email;
  }

  renderProfileForm(): HTMLElement {
    const section = document.createElement("section");
    section.id = "profileInfoSection";
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

    const emailField = new InputField({
      ...profileEmailField,
      className: "input-b-border",
    }).render();
    emailField.classList.add("hidden");
    emailField.id = "emailFieldWrapper";

    fieldsWrapper.append(
      emailField,
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
