import { EventManager } from "../../core/EventManager";
import type { Layout } from "./BasePage";

export abstract class BaseLayout implements Layout {
  protected element: HTMLElement;
  protected main: HTMLElement;
  protected events = new EventManager();

  constructor() {
    this.element = document.createElement("div");
    this.main = document.createElement("main");
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
