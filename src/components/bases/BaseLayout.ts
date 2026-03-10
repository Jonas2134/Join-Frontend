import { EventManager } from "../../core/EventManager";
import type { Layout } from "./BasePage";

import LogoRaw from "/logo.svg?raw";

export abstract class BaseLayout implements Layout {
  protected element: HTMLElement;
  protected main: HTMLElement;
  protected events = new EventManager();

  constructor() {
    this.element = document.createElement("div");
    this.main = document.createElement("main");
  }

  protected createLogo(classes: string[]): HTMLElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(LogoRaw, "image/svg+xml");
    const logo = svgDoc.documentElement as HTMLElement;
    logo.querySelectorAll("[fill]").forEach((el) => {
      el.setAttribute("fill", "currentColor");
    });
    logo.classList.add(...classes);
    return logo;
  }

  abstract render(): HTMLElement;

  mount(): void {}

  unmount(): void {
    this.events.clearAll();
  }

  setContent(content: HTMLElement): void {
    this.main.innerHTML = "";
    this.main.appendChild(content);
  }
}
