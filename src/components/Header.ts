import LogoRaw from "/logo.svg?raw";

export class Header {
  private element: HTMLElement;
  private colorLogo?: HTMLElement;

  constructor() {
    this.element = document.createElement('header');
    this.element.classList.add('fixed', 'top-0', 'right-0', 'left-0', 'px-10', 'py-5', 'flex', 'justify-between', 'items-center');
    this.colorLogo = this.createLogo();
  }

  private createLogo(): HTMLElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(LogoRaw, 'image/svg+xml');
    const logo = svgDoc.documentElement as HTMLElement;

    logo.querySelectorAll('[fill]').forEach((el) => {
      el.setAttribute('fill', 'currentColor');
    });
    logo.classList.add('icon', 'blue');
    return logo;
  };

  render(): HTMLElement {
    this.element.innerHTML = /*html*/ `
      <nav>
        <a href="/" data-link>Login</a>
        <a href="/signup" data-link>Signup</a>
      </nav>
    `;

    if (this.colorLogo) this.element.prepend(this.colorLogo);

    return this.element;
  }
}
