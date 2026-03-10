import { BaseLayout } from "../components/bases/BaseLayout";
import { AuthHeader } from "../components/layouts/AuthHeader";
import { AuthFooter } from "../components/layouts/AuthFooter";

export class AuthLayout extends BaseLayout {
  constructor() {
    super();
    this.element.classList.add("auth-layout");

    const header = new AuthHeader();
    this.main.classList.add("auth-main");
    const footer = new AuthFooter();

    this.element.append(header.render(), this.main, footer.render());
  }

  render(): HTMLElement {
    return this.element;
  }
}
