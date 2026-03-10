import { InputField } from "../../../components/common/InputField";
import { Textarea } from "../../../components/common/Textarea";
import { Button } from "../../../components/common/Button";
import { profileInfoFields, profileEmailField } from "../../../core/constants/profileFields.config";
import { editProfileBtn, profileMenuBtns } from "../../../core/constants/profileBtns.config";

import type { Profile } from "../../../core/types/profile.types";

export class ProfileInfoRenderer {

  renderProfileForm(section: HTMLElement, profile: Profile): HTMLElement {
    const form = document.createElement("form");
    form.id = "profileForm";

    const fieldset = this.renderFormFieldset(profile);
    
    form.appendChild(fieldset);
    section.append(form);
    return section;
  }

  private renderFormFieldset(profile: Profile): HTMLElement {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const legend = document.createElement("legend");
    legend.classList.add("profile-section-title");
    legend.textContent = "Profile Information";

    const fieldsWrapper = this.renderFieldsWrapper(profile);

    const menu = this.renderMenu();
    fieldset.append(legend, fieldsWrapper, menu);
    return fieldset;
  }

  renderFieldsWrapper(profile: Profile) {
    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    const componentMap = {
      input: InputField,
      textarea: Textarea,
    };

    const fields = profileInfoFields.map(field => {
      const fieldValue = profile[field.value];
      return new componentMap[field.type]({
        ...field.config,
        disabled: true,
        value: fieldValue || undefined,
      }).render()
    });

    fieldsWrapper.append(...fields);
    return fieldsWrapper;
  }

  renderEmailField(value?: string): HTMLElement {
    const emailField = new InputField({
      ...profileEmailField,
      value,
    }).render();
    emailField.id = "emailFieldWrapper";
    return emailField;
  }

  renderEditBtn(): HTMLButtonElement {
    const btn = new Button(editProfileBtn).renderBtn();
    return btn;
  }

  renderSubmitBtnMenu() {
    const btns = profileMenuBtns.map((config) =>
      new Button({ ...config }).renderBtn()
    );
    return btns;
  }

  private renderMenu(): HTMLElement {
    const actions = document.createElement("menu");
    actions.classList.add("profile-actions");

    const editBtn = this.renderEditBtn();

    actions.append(editBtn);
    return actions;
  }
}
