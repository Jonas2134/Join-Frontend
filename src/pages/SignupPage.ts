import { AuthLayout } from '../layouts/AuthLayout';
import { router } from '../core/router';
import { authStore } from '../core/store/AuthStore';
import { InputField } from '../components/common/InputField';
import { BasePage } from '../components/bases/BasePage';

import { signupFields } from '../core/constants/authFields.config';

export class SignupPage extends BasePage {
  constructor() {
    super(new AuthLayout());
  }

  // ============================================
  // Base render
  // ============================================

  render() {
    const container = document.createElement("div");
    container.classList.add("auth-main-content");
    container.id = "auth-main-content";
    return this.wrapWithLayout(container);
  }

  // ============================================
  // render Login section
  // ============================================

  renderSignupLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("base-legend");
    legend.textContent = "Signup";
    return legend;
  }

  renderSignupFieldsWrapper() {
    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    fieldsWrapper.append(
      ...signupFields.map(config =>
        new InputField({ ...config, className: "input-b-border", required: true }).render()
      )
    );

    return fieldsWrapper;
  }

  renderPrivacyCheckboxWrapper() {
    const checkboxWrapper = document.createElement("label");
    checkboxWrapper.classList.add("checkboxItem", "my-3");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "remember";
    checkbox.classList.add("checkbox");

    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.innerHTML += `
      I accept the
      <a href="/privacy" data-link"> Privacy policy</a>
    `;
    return checkboxWrapper;
  }

  renderSignupFieldset() {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const legend = this.renderSignupLegend();
    const fieldsWrapper = this.renderSignupFieldsWrapper();
    const checkboxWrapper = this.renderPrivacyCheckboxWrapper();

    const subBtn = document.createElement("button");
    subBtn.type = "submit";
    subBtn.classList.add("btn", "btn-blue");
    subBtn.textContent = "Signup";

    fieldset.append(legend, fieldsWrapper, checkboxWrapper, subBtn);
    return fieldset;
  }

  renderSignupForm(element: HTMLElement) {
    const form = document.createElement("form");
    form.id = "signupForm";
    form.classList.add("w-full");
    form.append(this.renderSignupFieldset());
    element.appendChild(form);
  }

  // ============================================
  // Lifecycle
  // ============================================

  updateSignupUI(): void {
    const element = document.getElementById("auth-main-content");
    if (!element) return;
    element.innerHTML = "";
    this.renderSignupForm(element);
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  mount() {
    this.updateSignupUI();

    const form = document.getElementById("signupForm") as HTMLFormElement;
    if (!form) throw new Error("form not found!");

    this.events.on(form, "submit", async (e: Event) => this.registerSignupFormListener(e, form));    
  }

  async registerSignupFormListener(e: Event, form: HTMLFormElement) {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeated_password = formData.get("confpassword") as string;
    try {
      await authStore.register(username, email, password, repeated_password);
      router.navigate('/login');
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    }
  }
}
