import { AuthLayout } from "../layouts/AuthLayout";
import { router } from "../core/router";
import { authStore } from "../core/store/AuthStore";
import { toastManager } from "../core/ToastManager";
import { InputField } from "../components/common/InputField";
import { BasePage } from "../components/bases/BasePage";

import { loginFields } from "../core/constants/authFields.config";

export class LoginPage extends BasePage {
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

  renderLoginLegend() {
    const legend = document.createElement("legend");
    legend.classList.add("base-legend");
    legend.textContent = "Login";
    return legend;
  }

  renderLoginFieldsWrapper() {
    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.classList.add("fields-wrapper");

    fieldsWrapper.append(
      ...loginFields.map(config =>
        new InputField({ ...config, className: "input-b-border", required: true }).render()
      )
    );

    return fieldsWrapper;
  }

  renderLoginCheckboxWrapper() {
    const checkboxWrapper = document.createElement("label");
    checkboxWrapper.classList.add("checkboxItem", "my-3");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "remember";
    checkbox.classList.add("checkbox");

    const labelText = document.createElement("span");
    labelText.textContent = "Remember me";

    checkboxWrapper.append(checkbox, labelText);
    return checkboxWrapper;
  }

  renderLoginMenu() {
    const menu = document.createElement("menu");
    menu.classList.add("flex", "gap-6");

    const subBtn = document.createElement("button");
    subBtn.type = "submit";
    subBtn.classList.add("btn", "btn-blue");
    subBtn.title = "Login";
    subBtn.textContent = "Login";

    const guestBtn = document.createElement("button");
    guestBtn.type = "button";
    guestBtn.id = "guestLoginBtn";
    guestBtn.classList.add("btn", "btn-white");
    guestBtn.title = "Guest login";
    guestBtn.textContent = "Guest Login";

    menu.append(subBtn, guestBtn);
    return menu;
  }

  renderLoginFieldset() {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("base-fieldset");

    const legend = this.renderLoginLegend();
    const fieldsWrapper = this.renderLoginFieldsWrapper();
    const checkboxWrapper = this.renderLoginCheckboxWrapper();
    const menu = this.renderLoginMenu();

    fieldset.append(legend, fieldsWrapper, checkboxWrapper, menu);
    return fieldset;
  }

  renderLoginForm(element: HTMLElement) {
    const form = document.createElement("form");
    form.id = "loginForm";
    form.append(this.renderLoginFieldset());
    element.appendChild(form);
  }

  // ============================================
  // Lifecycle
  // ============================================

  updateLoginUI(): void {
    const element = document.getElementById("auth-main-content");
    if (!element) return;
    element.innerHTML = "";
    this.renderLoginForm(element);
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  mount() {
    this.updateLoginUI();

    const form = document.getElementById("loginForm") as HTMLFormElement;
    if (!form) throw new Error("form not found!");
    this.events.on(form, "submit", async (e: Event) => this.registerLoginFormListener(e, form));

    const guestBtn = document.getElementById("guestLoginBtn");
    if (guestBtn) {
      this.events.on(guestBtn, "click", async () => this.handleGuestLogin());
    }
  }

  async handleGuestLogin() {
    try {
      await authStore.guestLogin();
      router.navigate("/dashboard");
    } catch (err: any) {
      toastManager.error("Guest Login fehlgeschlagen: " + err.message);
    }
  }

  async registerLoginFormListener(e: Event, form: HTMLFormElement) {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    try {
      await authStore.login(username, password);
      router.navigate("/dashboard");
    } catch (err: any) {
      toastManager.error("Login fehlgeschlagen: " + err.message);
    }
  }
}
