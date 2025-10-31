import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";

export class DashboardPage extends BasePage {
  constructor() {
    super(new AppLayout());
  }

  render() {
    const element = document.createElement('section');
    element.innerHTML = /*html*/ `
      <h1>Dashboard</h1>
      <section>
        <div>Board 1</div>
        <div>Board 2</div>
        <div>Board 3</div>
      </section>
    `;

    return this.wrapWithLayout(element);
  }
}
