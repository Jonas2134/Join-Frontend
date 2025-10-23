import { createInput } from "../components/createInput";

import Email from "../assets/icons/email.svg?raw";
import LockOn from "../assets/icons/lock-on.svg?raw";

export function Login() {
  const template = document.createElement("template");
  template.innerHTML = /*html*/ `
    <section class="px-28 py-12 rounded-4xl shadow-large max-w-4xl w-full">
      <form aria-label="Login form" class="w-full">
        <fieldset class="flex flex-col items-center w-full">
          <legend class="text-4xl w-full text-center font-semibold pb-2 mb-6 border-b-2 border-(--color-light-blue)">Login</legend>
          <label class="checkboxItem my-3">
            <input type="checkbox" name="checkbox" value="Option 1" class="checkbox" />
            Remember me
          </label>
          <nav class="flex gap-4">
            <button class="btn-blue transition-all" type="submit">Login</button>
            <button class="btn-blue transition-all" type="button">Guast Login</button>
          </nav>
        </fieldset>
      </form>
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
  fieldset.insertBefore(emailInput, fieldset.querySelector("legend"));
  fieldset.insertBefore(passwordInput, fieldset.querySelector("legend"));

  return section;
}
