import { AuthLayout } from '../layouts/AuthLayout';
import { router } from '../router';
import { InputField } from '../components/InputField';

import User from "../assets/icons/user.svg?raw";
import Email from "../assets/icons/email.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export class SignupPage {
  private layout: AuthLayout;

  constructor() {
    this.layout = new AuthLayout();
  }

  render() {
    const content = document.createElement('section');
    content.classList.add('px-28', 'py-12', 'rounded-4xl', 'shadow-large', 'max-w-4xl', 'w-full');
    const form = document.createElement('form');
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
    legend.textContent = 'Signup';
    fieldset.appendChild(legend);


    const usernameField = new InputField({
      type: 'text',
      placeholder: 'Username',
      icon: User,
      required: true,
    });
    const emailField = new InputField({
      type: 'email',
      placeholder: 'Email',
      icon: Email,
      required: true,
    });
    const passwordField = new InputField({
      type: 'password',
      placeholder: 'Password',
      icon: LockOn,
      required: true,
    });
    const confPasswordField = new InputField({
      type: 'password',
      placeholder: 'Confirm Password',
      icon: LockOn,
      required: true,
    });

    fieldset.append(usernameField.render(), emailField.render(), passwordField.render(), confPasswordField.render());

    const checkboxWrapper = document.createElement('label');
    checkboxWrapper.classList.add('checkboxItem', 'my-3');
    checkboxWrapper.innerHTML = `
      <input type="checkbox" name="checkbox" value="Remember me" class="checkbox" />
      Remember me
    `;
    fieldset.appendChild(checkboxWrapper);

    const signupBtn = document.createElement('button');
    signupBtn.type = 'submit';
    signupBtn.classList.add('btn-blue', 'transition-all');
    signupBtn.textContent = 'Signup';
    signupBtn.addEventListener('click', () => router.navigate('/'));

    fieldset.append(signupBtn);
    form.append(fieldset);
    content.append(form);

    this.layout.setContent(content);
    return this.layout.render();
  }
}





// import { createInput } from "../components/createInput";
// import User from "../assets/icons/user.svg?raw";
// import Email from "../assets/icons/email.svg?raw";
// import LockOn from "../assets/icons/lock-on.svg?raw";
// export function Signup() {
//   const template = document.createElement("template");
//   template.innerHTML = /*html*/ `
//     <section class="px-28 py-12 rounded-4xl shadow-large max-w-4xl w-full">
//       <form aria-label="Signup form" class="w-full">
//         <fieldset class="flex flex-col items-center w-full">
//           <legend class="text-4xl w-full text-center font-semibold pb-2 mb-10 border-b-2 border-(--color-light-blue)">Signup</legend>
//           <label class="checkboxItem my-3">
//             <input type="checkbox" name="checkbox" value="Option 1" class="checkbox" />
//             <p>
//               I accept the
//               <a class="text-(--color-light-blue) hover:text-(--color-dark-blue)"> Privacy policy</a>
//             </p>
//           </label>
//           <button class="btn-blue transition-all" type="submit">Signup</button>
//         </fieldset>
//       </form>
//     </section>
//   `;
//   const section = template.content.firstElementChild as HTMLElement;
//   const nameInput = createInput({
//     id: "username",
//     type: "text",
//     label: "Username",
//     svgIcon: User,
//   });
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
//   const confPasswordInput = createInput({
//     id: "confpassword",
//     type: "password",
//     label: "Confirm Password",
//     svgIcon: LockOn,
//   });
//   const fieldset = section.querySelector("fieldset");
//   if (fieldset) {
//     fieldset.insertBefore(nameInput, fieldset.querySelector("legend"));
//     fieldset.insertBefore(emailInput, fieldset.querySelector("legend"));
//     fieldset.insertBefore(passwordInput, fieldset.querySelector("legend"));
//     fieldset.insertBefore(confPasswordInput, fieldset.querySelector("legend"));
//   }
//   return section;
// }
