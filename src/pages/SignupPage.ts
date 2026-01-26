import { AuthLayout } from '../layouts/AuthLayout';
import { router } from '../core/router';
import { authStore } from '../core/store/AuthStore';
import { InputField } from '../components/common/InputField';
import { BasePage } from '../components/bases/BasePage';

import User from "../assets/icons/user.svg?raw";
import Email from "../assets/icons/email.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export class SignupPage extends BasePage {
  constructor() {
    super(new AuthLayout());
  }

  render() {
    const form = document.createElement('form');
    form.id = 'signupForm';
    form.classList.add('w-full');

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('flex', 'flex-col', 'items-center', 'w-full');

    const legend = document.createElement('legend');
    legend.classList.add('auth-legend');
    legend.textContent = 'Signup';
    fieldset.appendChild(legend);

    const usernameField = new InputField({
      label: "Enter your Username:",
      name: "username",
      type: "text",
      placeholder: "Username",
      className: "input-b-border",
      icon: User,
      autocomplete: "username",
      required: true,
    });
    const emailField = new InputField({
      label: "Enter your Email:",
      name: "email",
      type: "email",
      placeholder: "Email",
      className: "input-b-border",
      icon: Email,
      autocomplete: "email",
      required: true,
    });
    const passwordField = new InputField({
      label: "Enter your Password:",
      name: "password",
      type: "password",
      placeholder: "Password",
      className: "input-b-border",
      icon: LockOn,
      autocomplete: "new-password",
      required: true,
    });
    const confPasswordField = new InputField({
      label: "Repeat your Password:",
      name: "confpassword",
      type: "password",
      placeholder: "Confirm Password",
      className: "input-b-border",
      icon: LockOn,
      autocomplete: "new-password",
      required: true,
    });

    fieldset.append(usernameField.render(), emailField.render(), passwordField.render(), confPasswordField.render());

    const checkboxWrapper = document.createElement('label');
    checkboxWrapper.classList.add('checkboxItem', 'my-3');
    checkboxWrapper.innerHTML = `
      <input type="checkbox" name="checkbox" value="Remember me" class="checkbox" />
      I accept the
      <a href="/privacy" data-link"> Privacy policy</a>
    `;
    fieldset.appendChild(checkboxWrapper);

    const signupBtn = document.createElement("button");
    signupBtn.type = 'submit';
    signupBtn.classList.add("btn", "btn-blue");
    signupBtn.textContent = "Signup";

    fieldset.append(signupBtn);
    form.append(fieldset);
    return this.wrapWithLayout(form);
  }

  mount() {
    const form = document.getElementById('signupForm') as HTMLFormElement;

    form.addEventListener('submit', async (e) => {
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
    });
  }

  unmount() {
    const form = document.getElementById('signupForm');
    if (form) form.replaceWith(form.cloneNode(true));
  }
}
