import { BaseLayout } from "../components/bases/BaseLayout";
import { Button } from "../components/common/Button";
import { burgerMenuBtn, sidebarToggleBtn } from "../core/constants/appLayoutBtns.config";
import { AppLayoutController } from "./AppLayoutController";

import DashboardIcon from "../assets/icons/dashboard.svg?raw";
import ContactsIcon from "../assets/icons/contacts.svg?raw";
import PrivacyIcon from "../assets/icons/privacy.svg?raw";
import LegalIcon from "../assets/icons/legal.svg?raw";

interface SidebarLink {
  href: string;
  icon: string;
  text: string;
}

const mainLinks: SidebarLink[] = [
  { href: "/dashboard", icon: DashboardIcon, text: "Dashboard" },
  { href: "/contacts", icon: ContactsIcon, text: "Contacts" },
];

const footerLinks: SidebarLink[] = [
  { href: "/privacy", icon: PrivacyIcon, text: "Privacy Policy" },
  { href: "/legal", icon: LegalIcon, text: "Legal notice" },
];

const MOBILE_QUERY = "(max-width: 767px)";

export class AppLayout extends BaseLayout {
  private header: HTMLElement;
  private sidebar: HTMLElement;
  private controller = new AppLayoutController();
  private mediaQuery = window.matchMedia(MOBILE_QUERY);
  private mediaHandler = (e: MediaQueryListEvent) => this.setCollapsed(e.matches);

  constructor() {
    super();
    this.element.classList.add("app-layout");

    this.header = this.createHeader();
    this.sidebar = this.createSidebar();
    this.main.classList.add("app-main");

    this.element.append(this.header, this.sidebar, this.main);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.classList.add("app-header");

    const logo = this.createLogo(["w-[55px]", "text-white"]);
    const burgerBtn = new Button(burgerMenuBtn).renderBtn();

    header.append(logo, burgerBtn);
    return header;
  }

  private createSidebar(): HTMLElement {
    const aside = document.createElement("aside");
    aside.classList.add("app-aside");

    const mainNav = this.createNav(mainLinks);
    const footerNav = this.createNav(footerLinks);
    const toggleBtn = new Button(sidebarToggleBtn).renderBtn();

    aside.append(mainNav, footerNav, toggleBtn);
    return aside;
  }

  private createNav(links: SidebarLink[]): HTMLElement {
    const nav = document.createElement("nav");
    nav.classList.add("sidebar-nav");

    for (const link of links) {
      nav.appendChild(this.createSidebarLink(link));
    }

    return nav;
  }

  private createSidebarLink(link: SidebarLink): HTMLAnchorElement {
    const a = document.createElement("a");
    a.href = link.href;
    a.classList.add("sidebar-link");
    a.dataset.link = "";

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("sidebar-link-icon");
    iconSpan.innerHTML = link.icon;

    const textSpan = document.createElement("span");
    textSpan.classList.add("sidebar-link-text");
    textSpan.textContent = link.text;

    a.append(iconSpan, textSpan);
    return a;
  }

  private setCollapsed(collapsed: boolean): void {
    this.element.classList.toggle("sidebar-collapsed", collapsed);
  }

  render(): HTMLElement {
    return this.element;
  }

  mount() {
    this.events.on(this.header, "click", (e: Event) => {
      this.controller.registerHeaderClickListener(e, this.header);
    });

    this.events.on(this.sidebar, "click", (e: Event) => {
      const toggle = (e.target as HTMLElement).closest("#sidebar-toggle-btn");
      if (toggle) {
        this.element.classList.toggle("sidebar-collapsed");
      }
    });

    this.setCollapsed(this.mediaQuery.matches);
    this.mediaQuery.addEventListener("change", this.mediaHandler);
  }

  unmount() {
    this.mediaQuery.removeEventListener("change", this.mediaHandler);
    this.controller.cleanup();
    super.unmount();
  }
}
