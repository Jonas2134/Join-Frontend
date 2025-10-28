import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";

export class BoardPage extends BasePage {
  private element: HTMLElement;

  constructor() {
    super(new AppLayout());
    this.element = document.createElement("main");
  }

  render() {
    this.element.innerHTML = /*html*/ `
      <h1>Board</h1>
      <section>
        <div>Task 1</div>
        <div>Task 2</div>
        <div>Task 3</div>
      </section>
    `;

    return this.wrapWithLayout(this.element);
  }
}
