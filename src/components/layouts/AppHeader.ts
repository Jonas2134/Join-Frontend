import { Button } from "../common/Button";
import { burgerMenuBtn } from "../../core/constants/appLayoutBtns.config";

import LogoRaw from "/logo.svg?raw";

export class AppHeader {
  private element: HTMLElement;
  private colorLogo?: HTMLElement;

  constructor() {
    this.element = document.createElement("header");
    this.element.classList.add("app-header");
    this.colorLogo = this.createLogo();
  }

  private createLogo(): HTMLElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(LogoRaw, "image/svg+xml");
    const logo = svgDoc.documentElement as HTMLElement;

    logo.querySelectorAll("[fill]").forEach((el) => {
      el.setAttribute("fill", "currentColor");
    });
    logo.classList.add("w-[55px]", "text-white");
    return logo;
  }

  render(): HTMLElement {
    const burgerBtn = new Button(burgerMenuBtn).renderBtn();
    if (this.colorLogo) this.element.append(this.colorLogo, burgerBtn);
    return this.element;
  }
}
