import { BasePage } from "../components/bases/BasePage";
import LogoRaw from "/logo.svg?raw";

interface LinkConfig {
  href: string;
  text: string;
  classes?: string[];
  attributes?: Record<string, string>;
}

const FEATURES = [
  {
    title: "Boards",
    text: "Create boards to organize your projects and keep an overview of all your work.",
  },
  {
    title: "Tasks",
    text: "Break down your work into tasks, set priorities, and track progress through columns.",
  },
  {
    title: "Collaboration",
    text: "Invite team members, assign tasks, and work together towards your goals.",
  },
];

export class StartPage extends BasePage {
  private element: HTMLElement;

  constructor() {
    super();
    this.element = document.createElement("div");
    this.element.classList.add("start-page");
  }

  // ============================================
  // Logo helper
  // ============================================
  

  private createLogo(classes: string[]): HTMLElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(LogoRaw, "image/svg+xml");
    const logo = svgDoc.documentElement as HTMLElement;
    logo.querySelectorAll("[fill]").forEach((el) => {
      el.setAttribute("fill", "currentColor");
    });
    logo.classList.add(...classes);
    return logo;
  }

  // ============================================
  // Header
  // ============================================

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.classList.add("start-header");

    const logo = this.createLogo(["w-[70px]", "md:w-[95px]", "text-(--color-light-blue)"]);
    const nav = this.renderHeaderNav();
    
    header.append(logo, nav);
    return header;
  }

  private renderHeaderNav(): HTMLElement {
    const nav = document.createElement("nav");
    nav.classList.add("flex", "gap-6", "text-sm");

    const privacyLink = this.createLink({ href: "/privacy", text: "Privacy Policy", attributes: { "data-link": "" } });
    const legalLink = this.createLink({ href: "/legal", text: "Legal Notice", attributes: { "data-link": "" } });

    nav.append(privacyLink, legalLink);
    return nav;
  }

  // ============================================
  // Hero section
  // ============================================

  private createHero(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("start-hero");

    const logo = this.createLogo(["w-[160px]", "text-(--color-light-blue)"]);

    const headline = document.createElement("h1");
    headline.textContent = "Kanban Project Management";

    const description = document.createElement("p");
    description.classList.add("text-lg", "text-(--color-blue-gray)", "max-w-xl");
    description.textContent = "Organize your work with boards, track tasks from idea to completion, and collaborate with your team — all in one place.";

    const cta = this.renderCtaLinks();
    
    section.append(logo, headline, description, cta);
    return section;
  }

  private renderCtaLinks(): HTMLElement {
    const cta = document.createElement("div");
    cta.classList.add("flex", "gap-6", "mt-2");

    const loginLink = this.createLink({ href: "/login", text: "Login", classes: ["btn", "btn-blue"], attributes: { "data-link": "" } });
    const signupLink = this.createLink({ href: "/signup", text: "Sign up", classes: ["btn", "btn-white"], attributes: { "data-link": "" } });

    cta.append(loginLink, signupLink);
    return cta;
  }

  // ============================================
  // Features section
  // ============================================

  private createFeatures(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("start-features");

    for (const feature of FEATURES) {
      const card = document.createElement("div");
      card.classList.add("start-feature-card");

      const title = document.createElement("h3");
      title.classList.add("text-lg", "font-semibold", "text-(--color-light-blue)");
      title.textContent = feature.title;

      const text = document.createElement("p");
      text.classList.add("text-sm", "text-(--color-blue-gray)");
      text.textContent = feature.text;

      card.append(title, text);
      section.appendChild(card);
    }

    return section;
  }

  // ============================================
  // Footer
  // ============================================

  private createFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.classList.add("start-footer");

    const note = document.createElement("p");
    note.classList.add("text-sm", "text-(--color-blue-gray)", "italic", "text-center");
    note.textContent = "This is a portfolio project and not a commercial application.";

    const links = this.renderFooterLinks();

    const copy = document.createElement("small");
    copy.textContent = "&copy; 2026 Join";

    footer.append(note, links, copy);
    return footer;
  }

  private renderFooterLinks(): HTMLElement {
    const links = document.createElement("nav");
    links.classList.add("flex", "gap-4", "text-sm");

    const frontGithubLink = this.createLink({ href: "https://github.com/Jonas2134/Join-Frontend", text: "Frontend-GitHub", attributes: { target: "_blank" } });
    const backGithubLink = this.createLink({ href: "https://github.com/Jonas2134/Join-Backend", text: "Backend-GitHub", attributes: { target: "_blank" } });
    const portfolioLink = this.createLink({ href: "https://portfolio.jonas-stiefer.com", text: "My Portfolio", attributes: { target: "_blank" } });

    links.append(frontGithubLink, backGithubLink, portfolioLink);
    return links;
  }

  // ============================================
  // Utility function
  // ============================================

  private createLink({ href, text, classes, attributes }: LinkConfig): HTMLAnchorElement {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    if (classes) link.classList.add(...classes);
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        link.setAttribute(key, value);
      }
    }
    return link;
  }

  // ============================================
  // Render
  // ============================================

  render(): HTMLElement {
    this.element.append(
      this.createHeader(),
      this.createHero(),
      this.createFeatures(),
      this.createFooter(),
    );
    return this.element;
  }
}
