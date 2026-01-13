import { AuthHeader } from '../components/layouts/AuthHeader';
import { AuthFooter } from '../components/layouts/AuthFooter';

export class AuthLayout {
  private element: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('auth-layout');

    const header = new AuthHeader();
    this.main = document.createElement('main');
    const footer = new AuthFooter();

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
