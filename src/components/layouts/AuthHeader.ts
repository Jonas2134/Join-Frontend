import LogoRaw from "/logo.svg?raw";

export class AuthHeader {
  private element: HTMLElement;
  private colorLogo?: HTMLElement;

  constructor() {
    this.element = document.createElement('header');
    this.colorLogo = this.createLogo();
  }

  private createLogo(): HTMLElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(LogoRaw, 'image/svg+xml');
    const logo = svgDoc.documentElement as HTMLElement;

    logo.querySelectorAll('[fill]').forEach((el) => {
      el.setAttribute('fill', 'currentColor');
    });
    logo.classList.add('w-[95px]', 'text-(--color-light-blue)');
    return logo;
  };

  render(): HTMLElement {
    this.element.innerHTML = /*html*/ `
      <nav class="flex gap-3">
        <a href="/login" data-link>Login</a>
        <a href="/signup" data-link>Signup</a>
      </nav>
    `;

    if (this.colorLogo) this.element.prepend(this.colorLogo);
    return this.element;
  }
}
