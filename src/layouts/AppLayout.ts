import { AppHeader } from "../components/AppHeader";
import { AppSidebar } from "../components/AppSidebar";

export class AppLayout {
  private element: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('app-layout');

    const header = new AppHeader();
    this.main = document.createElement('main');
    const sidebar = new AppSidebar();

    this.element.append(header.render(), this.main, sidebar.render());
  }

  setContent(content: HTMLElement) {
    this.main.innerHTML = '';
    this.main.appendChild(content);
  }

  render() {
    return this.element;
  }
}
