import { BaseLayout } from "../components/bases/BaseLayout";
import { Button } from "../components/common/Button";
import { burgerMenuBtn } from "../core/constants/appLayoutBtns.config";
import { AppLayoutController } from "./AppLayoutController";

export class AppLayout extends BaseLayout {
  private header: HTMLElement;
  private controller = new AppLayoutController();

  constructor() {
    super();
    this.element.classList.add("app-layout");

    this.header = this.createHeader();
    const sidebar = this.createSidebar();
    this.main.classList.add("app-main");

    this.element.append(this.header, sidebar, this.main);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.classList.add("app-header");

    const logo = this.createLogo(["w-[55px]", "text-white"]);
    const burgerBtn = new Button(burgerMenuBtn).renderBtn();

    header.append(logo, burgerBtn);
    return header;
  }

  private createSidebar(): HTMLElement {
    const aside = document.createElement("aside");
    aside.classList.add("app-aside");
    aside.innerHTML = /*html*/ `
      <nav class="flex flex-col items-center gap-3">
        <a href="/dashboard" data-link>Dashboard</a>
        <a href="/contacts" data-link>Contacts</a>
      </nav>
      <nav class="flex flex-col items-center gap-3">
        <a href="/privacy" data-link>Privacy Policy</a>
        <a href="/legal" data-link>Legal notice</a>
      </nav>
    `;
    return aside;
  }

  render(): HTMLElement {
    return this.element;
  }

  mount() {
    this.events.on(this.header, "click", (e: Event) => {
      this.controller.registerHeaderClickListener(e, this.header);
    });
  }

  unmount() {
    this.controller.cleanup();
    super.unmount();
  }
}
