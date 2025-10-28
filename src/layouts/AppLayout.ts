import { AppHeader } from "../components/AppHeader";

export class AppLayout {
  private element: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('board-layout');

    const header = new AppHeader();
    this.main = document.createElement('main');

    this.element.append(header.render(), this.main);
  }

  setContent(content: HTMLElement) {
    this.main.innerHTML = '';
    this.main.appendChild(content);
  }

  render() {
    return this.element;
  }
}
