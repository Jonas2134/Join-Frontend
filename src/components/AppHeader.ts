import { BurgerMenuDialog } from "./BurgerMenuDialog";

import LogoRaw from "/logo.svg?raw";
import Burgermenu from "../assets/icons/menu.svg?raw";

export class AppHeader {
  private element: HTMLElement;
  private colorLogo?: HTMLElement;
  menuDialog: BurgerMenuDialog | null = null;

  constructor() {
    this.element = document.createElement('header');
    this.element.classList.add("app-header")
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
      <button id="menu" class="menu">
        ${Burgermenu}
      </button>
    `;

    if (this.colorLogo) this.element.prepend(this.colorLogo);

    const menuBtn = this.element.querySelector('#menu');
    if (menuBtn) {
      this.menuDialog = new BurgerMenuDialog();
      document.body.appendChild(this.menuDialog.render());

      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Burgermenu clicked!");
        this.menuDialog?.open();
      });
    }

    return this.element;
  }
}
