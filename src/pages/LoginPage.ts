import { AuthLayout } from '../layouts/AuthLayout';
import { router } from '../router';
import { InputField } from '../components/InputField';

import Email from "../assets/icons/email.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export class LoginPage {
  private layout: AuthLayout;

  constructor() {
    this.layout = new AuthLayout();
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

    this.layout.setContent(content);
    return this.layout.render();
  }

  mount() {
    const form = document.getElementById('loginForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      router.navigate('/board');
    });
  }
}




// import { createInput } from "../components/createInput";
// import Email from "../assets/icons/email.svg?raw";
// import LockOn from "../assets/icons/lock-on.svg?raw";
// export function Login() {
//   const template = document.createElement("template");
//   template.innerHTML = /*html*/ `
//     <section class="px-28 py-12 rounded-4xl shadow-large max-w-4xl w-full">
//       <form aria-label="Login form" class="w-full">
//         <fieldset class="flex flex-col items-center w-full">
//           <legend class="text-4xl w-full text-center font-semibold pb-2 mb-6 border-b-2 border-(--color-light-blue)">Login</legend>
//           <label class="checkboxItem my-3">
//             <input type="checkbox" name="checkbox" value="Remember me" class="checkbox" />
//             Remember me
//           </label>
//           <nav class="flex gap-4">
//             <button class="btn-blue transition-all" type="submit">Login</button>
//             <button class="btn-blue transition-all" type="button">Guast Login</button>
//           </nav>
//         </fieldset>
//       </form>
//     </section>
//   `;
//   const section = template.content.firstElementChild as HTMLElement;
//   const fieldset = section.querySelector("fieldset");
//   const emailInput = createInput({
//     id: "email",
//     type: "email",
//     label: "Email",
//     svgIcon: Email,
//   });
//   const passwordInput = createInput({
//     id: "password",
//     type: "password",
//     label: "Password",
//     svgIcon: LockOn,
//   });
//   if (fieldset) {
//     fieldset.insertBefore(emailInput, fieldset.querySelector("legend"));
//     fieldset.insertBefore(passwordInput, fieldset.querySelector("legend"));
//   }
//   return section;
// }
