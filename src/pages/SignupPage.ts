import { AuthLayout } from '../layouts/AuthLayout';

export class SignupPage {
  private layout: AuthLayout;

  constructor() {
    this.layout = new AuthLayout();
  }

  render() {
    const content = document.createElement('section');
    content.innerHTML = `
      <h2>Sign Up</h2>
      <form>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Create Account</button>
      </form>
    `;
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
