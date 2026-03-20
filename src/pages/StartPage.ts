import { BasePage } from "../components/bases/BasePage";
import LogoRaw from "/logo.svg?raw";

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

    const nav = document.createElement("nav");
    nav.classList.add("flex", "gap-6", "text-sm");

    const privacyLink = document.createElement("a");
    privacyLink.href = "/privacy";
    privacyLink.textContent = "Privacy Policy";
    privacyLink.setAttribute("data-link", "");

    const legalLink = document.createElement("a");
    legalLink.href = "/legal";
    legalLink.textContent = "Legal Notice";
    legalLink.setAttribute("data-link", "");

    nav.append(privacyLink, legalLink);
    header.append(logo, nav);
    return header;
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
    description.textContent =
      "Organize your work with boards, track tasks from idea to completion, and collaborate with your team — all in one place.";

    const cta = document.createElement("div");
    cta.classList.add("flex", "gap-6", "mt-2");

    const loginLink = document.createElement("a");
    loginLink.href = "/login";
    loginLink.textContent = "Login";
    loginLink.classList.add("btn", "btn-blue");
    loginLink.setAttribute("data-link", "");

    const signupLink = document.createElement("a");
    signupLink.href = "/signup";
    signupLink.textContent = "Sign up";
    signupLink.classList.add("btn", "btn-white");
    signupLink.setAttribute("data-link", "");

    cta.append(loginLink, signupLink);
    section.append(logo, headline, description, cta);
    return section;
  }

  // ============================================
  // Features section
  // ============================================

  private createFeatures(): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("start-features");

    const features = [
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

    for (const feature of features) {
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
    note.textContent =
      "This is a portfolio project and not a commercial application.";

    const links = document.createElement("div");
    links.classList.add("flex", "gap-4", "text-sm");

    const frontGithubLink = document.createElement("a");
    frontGithubLink.href = "https://github.com/Jonas2134/Join-Frontend";
    frontGithubLink.target = "_blank";
    frontGithubLink.textContent = "Frontend-GitHub";

    const backGithubLink = document.createElement("a");
    backGithubLink.href = "https://github.com/Jonas2134/Join-Backend";
    backGithubLink.target = "_blank";
    backGithubLink.textContent = "Backend-GitHub";

    const portfolioLink = document.createElement("a");
    portfolioLink.href = "https://portfolio.jonas-stiefer.com";
    portfolioLink.target = "_blank";
    portfolioLink.textContent = "My Portfolio";

    links.append(frontGithubLink, backGithubLink, portfolioLink);

    const copy = document.createElement("small");
    copy.innerHTML = "&copy; 2025 My App";

    footer.append(note, links, copy);
    return footer;
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
