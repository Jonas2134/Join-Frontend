import { InputField } from "../../../components/common/InputField";
import { Button } from "../../../components/common/Button";
import { passwordFields } from "../../../core/constants/profileFields.config";
import { changePasswordBtn } from "../../../core/constants/profileBtns.config";

export class ProfilePasswordRenderer {

  renderPasswordSection(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("profile-section");

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
    actions.appendChild(new Button({ ...changePasswordBtn }).renderBtn());

    fieldset.append(fieldsWrapper, actions);
    form.appendChild(fieldset);
    section.append(title, form);
    return section;
  }
}
