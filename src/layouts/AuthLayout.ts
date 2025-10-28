import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export class AuthLayout {
  private element: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('auth-layout');

    const header = new Header();
    this.main = document.createElement('main');
    const footer = new Footer();

    this.element.append(header.render(), this.main, footer.render());
  }

  setContent(content: HTMLElement) {
    this.main.innerHTML = '';
    this.main.appendChild(content);
  }

  render() {
    return this.element;
  }
}
