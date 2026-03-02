import LogoRaw from "/logo.svg?raw";

export class StaticLayout {
  private element: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('static-layout');

    const header = this.createHeader();
    this.main = document.createElement('main');
    this.main.classList.add('static-main');
    const footer = this.createFooter();

    this.element.append(header, this.main, footer);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('header');
    header.classList.add('static-header');

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(LogoRaw, 'image/svg+xml');
    const logo = svgDoc.documentElement as HTMLElement;
    logo.querySelectorAll('[fill]').forEach((el) => {
      el.setAttribute('fill', 'currentColor');
    });
    logo.classList.add('w-[55px]', 'text-white');

    const backLink = document.createElement('a');
    backLink.classList.add('static-back-link');
    backLink.textContent = 'Back';
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      history.back();
    });

    header.append(logo, backLink);
    return header;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.classList.add('static-footer');
    footer.innerHTML = `<small>&copy; 2025 My App</small>`;
    return footer;
  }

  setContent(content: HTMLElement) {
    this.main.innerHTML = '';
    this.main.appendChild(content);
  }

  render() {
    return this.element;
  }
}
