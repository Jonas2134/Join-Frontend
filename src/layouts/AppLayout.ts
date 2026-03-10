import { BaseLayout } from "../components/bases/BaseLayout";
import { AppHeader } from "../components/layouts/AppHeader";
import { AppSidebar } from "../components/layouts/AppSidebar";
import { AppLayoutController } from "./AppLayoutController";

export class AppLayout extends BaseLayout {
  private header: HTMLElement;
  private controller = new AppLayoutController();

  constructor() {
    super();
    this.element.classList.add("app-layout");

    const appHeader = new AppHeader();
    const sidebar = new AppSidebar();
    this.header = appHeader.render();
    this.main.classList.add("app-main");

    this.element.append(this.header, sidebar.render(), this.main);
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
