import { BaseLayout } from "../components/bases/BaseLayout";

export class AuthLayout extends BaseLayout {
  constructor() {
    super();
    this.element.classList.add("auth-layout");

    const header = this.createHeader();
    this.main.classList.add("auth-main");
    const footer = this.createFooter();

    this.element.append(header, this.main, footer);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.classList.add("auth-header");

    const logo = this.createLogo(["w-[95px]", "text-(--color-light-blue)"]);
    header.innerHTML = /*html*/ `
      <nav class="flex gap-3">
        <a href="/login" data-link>Login</a>
        <a href="/signup" data-link>Signup</a>
      </nav>
    `;
    header.prepend(logo);
    return header;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.classList.add("auth-footer");
    footer.innerHTML = `<small>&copy; 2025 My App</small>`;
    return footer;
  }

  render(): HTMLElement {
    return this.element;
  }
}
