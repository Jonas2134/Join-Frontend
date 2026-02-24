import { InputField } from "../../../components/common/InputField";
import { Button } from "../../../components/common/Button";
import { passwordFields } from "../../../core/constants/profileFields.config";
import { submitChangePasswordBtn, cancelChangePasswordBtn } from "../../../core/constants/profileBtns.config";

export class ProfilePasswordRenderer {

  renderPasswordSection(): HTMLElement {
    const section = document.createElement("section");
    section.id = "passwordSection";
    section.classList.add("profile-section", "hidden");

    const title = document.createElement("h2");
    title.classList.add("profile-section-title");
    title.textContent = "Change Password";

    const form = document.createElement("form");
    form.id = "changePasswordForm";

    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    fieldsWrapper.append(
      ...passwordFields.map(config =>
        new InputField({
          ...config,
          className: "input-b-border",
          required: true,
        }).render()
      )
    );

    const actions = document.createElement("menu");
    actions.classList.add("profile-actions");
    actions.append(
      new Button({ ...submitChangePasswordBtn }).renderBtn(),
      new Button({ ...cancelChangePasswordBtn }).renderBtn(),
    );

    fieldset.append(fieldsWrapper, actions);
    form.appendChild(fieldset);
    section.append(title, form);
    return section;
  }
}
