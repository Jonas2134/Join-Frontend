import { createInput } from "../components/createInput";

import Email from "../assets/icons/email.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export function Login() {
  const template = document.createElement("template");
  template.innerHTML = /*html*/ `
    <section class="flex justify-center items-center flex-col px-28 py-12 rounded-4xl shadow-large max-w-4xl w-full">
      <form aria-label="Login form" class="w-full">
        <fieldset class="flex flex-col items-center w-full">
          <legend class="text-4xl w-full text-center font-semibold pb-2 mb-6 border-b-2 border-(--color-light-blue)">Login</legend>
          <nav>
            <button class="btn-blue transition-all" type="submit">Login</button>
            <button class="btn-blue transition-all">Sign up</button>
          </nav>
        </fieldset>
      </form>
      <a href="/signup" data-link>Sign up</a>
    </section>
  `;

  const section = template.content.firstElementChild as HTMLElement;
  const emailInput = createInput({
    id: "email",
    type: "email",
    label: "Email",
    svgIcon: Email,
  });
  const passwordInput = createInput({
    id: "password",
    type: "password",
    label: "Password",
    svgIcon: LockOn,
  });

  const fieldset = section.querySelector("fieldset")!;
  fieldset.insertBefore(emailInput, fieldset.querySelector("nav"));
  fieldset.insertBefore(passwordInput, fieldset.querySelector("nav"));

  return section;
}
