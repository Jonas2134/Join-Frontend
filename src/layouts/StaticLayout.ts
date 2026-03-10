import { BaseLayout } from "../components/bases/BaseLayout";

export class StaticLayout extends BaseLayout {
  constructor() {
    super();
    this.element.classList.add("static-layout");

    const header = this.createHeader();
    this.main.classList.add("static-main");
    const footer = this.createFooter();

    this.element.append(header, this.main, footer);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.classList.add("static-header");

    const logo = this.createLogo(["w-[55px]", "text-white"]);

    const backLink = document.createElement("a");
    backLink.classList.add("static-back-link");
    backLink.textContent = "Back";

    header.append(logo, backLink);
    return header;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.classList.add("static-footer");
    footer.innerHTML = `<small>&copy; 2025 My App</small>`;
    return footer;
  }

  mount() {
    const backLink = this.element.querySelector<HTMLAnchorElement>(".static-back-link");
    if (backLink) {
      this.events.on(backLink, "click", (e: Event) => {
        e.preventDefault();
        history.back();
      });
    }
  }

  render(): HTMLElement {
    return this.element;
  }
}
