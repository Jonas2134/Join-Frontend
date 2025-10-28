import { AuthLayout } from '../layouts/AuthLayout';
import { router } from '../core/router';
import { InputField } from '../components/InputField';
import { BasePage } from '../core/BasePage';

import Email from "../assets/icons/email.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export class LoginPage extends BasePage {
  constructor() {
    super(new AuthLayout());
  }

  render() {
    const content = document.createElement('section');
    content.classList.add('px-28', 'py-12', 'rounded-4xl', 'shadow-large', 'max-w-4xl', 'w-full');
    const form = document.createElement('form');
    form.id = 'loginForm';
    form.classList.add('w-full');

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('flex', 'flex-col', 'items-center', 'w-full');

    const legend = document.createElement('legend');
    legend.classList.add(
      'text-4xl',
      'w-full',
      'text-center',
      'font-semibold',
      'pb-2',
      'mb-6',
      'border-b-2',
      'border-(--color-light-blue)'
    );
    legend.textContent = 'Login';
    fieldset.appendChild(legend);

    const emailField = new InputField({
      type: 'email',
      placeholder: 'Email',
      icon: Email,
      name: 'email',
      required: true,
    });
    const passwordField = new InputField({
      type: 'password',
      placeholder: 'Password',
      icon: LockOn,
      name: 'password',
      required: true,
    });

    fieldset.append(emailField.render(), passwordField.render());

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
    guestBtn.addEventListener('click', () => router.navigate('/board'));

    nav.append(loginBtn, guestBtn);
    fieldset.append(nav);

    form.append(fieldset);
    content.append(form);

    return this.wrapWithLayout(content);
  }

  mount() {
    const form = document.getElementById('loginForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Logged in!');
      router.navigate('/board');
    });
  }

  unmount() {
    const form = document.getElementById('loginForm');
    if (form) form.replaceWith(form.cloneNode(true));
  }
}
