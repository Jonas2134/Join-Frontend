import { AuthLayout } from '../layouts/AuthLayout';
import { router } from '../core/router';
import { authStore } from '../store/AuthStore';
import { InputField } from '../components/InputField';
import { BasePage } from '../core/BasePage';

import User from "../assets/icons/user.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export class LoginPage extends BasePage {
  constructor() {
    super(new AuthLayout());
  }

  render() {
    const form = document.createElement('form');
    form.id = 'loginForm';
    form.classList.add('w-full');

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('flex', 'flex-col', 'items-center', 'w-full');

    const legend = document.createElement('legend');
    legend.classList.add('auth-legend');
    legend.textContent = 'Login';
    fieldset.appendChild(legend);

    const usernameField = new InputField({
      type: 'text',
      placeholder: 'Username',
      icon: User,
      name: 'username',
      required: true,
    });
    const passwordField = new InputField({
      type: 'password',
      placeholder: 'Password',
      icon: LockOn,
      name: 'password',
      required: true,
    });

    fieldset.append(usernameField.render(), passwordField.render());

    const checkboxWrapper = document.createElement('label');
    checkboxWrapper.classList.add('checkboxItem', 'my-3');
    checkboxWrapper.innerHTML = `
      <input type="checkbox" name="checkbox" value="Remember me" class="checkbox" />
      Remember me
    `;
    fieldset.appendChild(checkboxWrapper);

    const nav = document.createElement('nav');
    nav.classList.add('flex', 'gap-4');

    const loginBtn = document.createElement('button');
    loginBtn.type = 'submit';
    loginBtn.classList.add('btn-blue', 'transition-all');
    loginBtn.textContent = 'Login';

    const guestBtn = document.createElement('button');
    guestBtn.type = 'button';
    guestBtn.classList.add('btn-blue', 'transition-all');
    guestBtn.textContent = 'Guest Login';
    guestBtn.addEventListener('click', () => router.navigate('/dashboard'));

    nav.append(loginBtn, guestBtn);
    fieldset.append(nav);

    form.append(fieldset);

    return this.wrapWithLayout(form);
  }

  mount() {
    const form = document.getElementById('loginForm') as HTMLFormElement;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;
      try {
        await authStore.login(username, password);
        router.navigate('/dashboard');
      } catch (err: any) {
        alert("Login failed: " + err.message);
      }
    });
  }

  unmount() {
    const form = document.getElementById('loginForm');
    if (form) form.replaceWith(form.cloneNode(true));
  }
}
