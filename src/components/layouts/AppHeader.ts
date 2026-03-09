import { BurgerMenuDropdown } from "./BurgerMenuDropdown";
import { Button } from "../common/Button";
import { burgerMenuBtn } from "../../core/constants/appLayoutBtns.config";

import LogoRaw from "/logo.svg?raw";

export class AppHeader {
  private element: HTMLElement;
  private colorLogo?: HTMLElement;
  private menuDropdown: BurgerMenuDropdown | null = null;

  constructor() {
    this.element = document.createElement("header");
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

  createHeader(): HTMLElement {
    this.render();
    this.mount();

    return this.element;
  }

  private render() {
    const burgerBtn = new Button(burgerMenuBtn).renderBtn();
    if (this.colorLogo) this.element.append(this.colorLogo, burgerBtn);
  }

  private mount() {
    const menuBtn = this.element.querySelector("#burger-menu-btn") as HTMLButtonElement;
    if (menuBtn) {
      
      menuBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.menuDropdown = new BurgerMenuDropdown(menuBtn);
        this.element.appendChild(this.menuDropdown.render());
        this.menuDropdown?.toggle();
      });
    }
  }
}
