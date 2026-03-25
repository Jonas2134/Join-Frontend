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

    const logo = this.createLogo(["w-[70px]", "md:w-[95px]", "text-(--color-light-blue)"]);
    const nav = this.renderHeaderNav();

    header.append(logo, nav);
    return header;
  }

  private renderHeaderNav(): HTMLElement {
    const nav = document.createElement("nav");
    nav.classList.add("flex", "gap-1");

    const isLoginPage = location.pathname === "/login";
    const label = document.createElement("span");
    label.textContent = isLoginPage ? "Not a member?" : "Already a member?";
    const link = document.createElement("a");
    link.href = isLoginPage ? "/signup" : "/login";
    link.textContent = isLoginPage ? "Signup" : "Login";
    link.setAttribute("data-link", "");

    nav.append(label, link);
    return nav;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.classList.add("auth-footer");

    const copy = document.createElement("small");
    copy.textContent = "&copy; 2026 Join";

    footer.appendChild(copy);
    return footer;
  }

  render(): HTMLElement {
    return this.element;
  }
}
