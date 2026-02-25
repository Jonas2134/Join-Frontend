import { InputField } from "../../../components/common/InputField";
import { Button } from "../../../components/common/Button";
import { passwordFields } from "../../../core/constants/profileFields.config";
import { changePasswordBtns } from "../../../core/constants/profileBtns.config";

export class ProfilePasswordRenderer {

  renderPasswordSection(section: HTMLElement): HTMLElement {
    const form = document.createElement("form");
    form.id = "changePasswordForm";

    const fieldset = this.renderPasswordFieldset();

    form.appendChild(fieldset);
    section.append(form);
    return section;
  }

  private renderPasswordFieldset(): HTMLElement {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const legend = document.createElement("legend");
    legend.classList.add("profile-section-title");
    legend.textContent = "Change Password";

    const fieldsWrapper = this.renderPasswordFields();
    const menu = this.renderPasswordMenu();

    fieldset.append(legend, fieldsWrapper, menu);
    return fieldset;
  }

  private renderPasswordFields(): HTMLElement {
    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    const fields = passwordFields.map(config =>
      new InputField({ ...config }).render(),
    );

    fieldsWrapper.append(...fields);
    return fieldsWrapper;
  }

  private renderPasswordMenu(): HTMLElement {
    const actions = document.createElement("menu");
    actions.classList.add("profile-actions");

    const btns = changePasswordBtns.map((config) =>
      new Button({ ...config }).renderBtn()
    );

    actions.append(...btns);
    return actions;
  }
}
