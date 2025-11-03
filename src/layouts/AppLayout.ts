import { AppHeader } from "../components/AppHeader";
import { AppSidebar } from "../components/AppSidebar";

export class AppLayout {
  private element: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('app-layout');

    const header = new AppHeader();
    const sidebar = new AppSidebar();
    this.main = document.createElement('main');

    this.element.append(header.render(), sidebar.render(), this.main);
  }

  setContent(content: HTMLElement) {
    this.main.innerHTML = '';
    this.main.appendChild(content);
  }

  render() {
    return this.element;
  }
}
