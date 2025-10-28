import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";

export class DashboardPage extends BasePage {
  private element: HTMLElement;

  constructor() {
    super(new AppLayout());
    this.element = document.createElement("main");
  }

  render() {
    this.element.innerHTML = /*html*/ `
      <h1>Dashboard</h1>
      <section>
        <div>Board 1</div>
        <div>Board 2</div>
        <div>Board 3</div>
      </section>
    `;

    return this.wrapWithLayout(this.element);
  }
}
