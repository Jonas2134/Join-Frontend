import LogoRaw from "/logo.svg?raw";

export class AppHeader {
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
    logo.classList.add('w-[55px]', 'text-white');
    return logo;
  };

  render(): HTMLElement {
    this.element.innerHTML = /*html*/ `
      <nav class="flex gap-3">
        <a class="text-white" href="/dashboard" data-link>Dashboard</a>
        <a class="text-white" href="/board" data-link>Board</a>
      </nav>
    `;

    if (this.colorLogo) this.element.prepend(this.colorLogo);
    return this.element;
  }
}
