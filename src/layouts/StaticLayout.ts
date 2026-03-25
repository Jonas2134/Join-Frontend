import { BaseLayout } from "../components/bases/BaseLayout";

export class StaticLayout extends BaseLayout {
  constructor() {
    super();
    this.element.classList.add("static-layout");

    const header = this.createHeader();
    this.main.classList.add("flex", "justify-center", "px-4", "py-12");
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

    const copy = document.createElement("small");
    copy.textContent = "\u00A9 2026 Join";

    footer.appendChild(copy);
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
