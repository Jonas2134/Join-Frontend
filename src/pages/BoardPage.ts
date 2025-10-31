import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";

export class BoardPage extends BasePage {

  constructor() {
    super(new AppLayout());
  }

  render() {
    const element = document.createElement('section');
    element.innerHTML = /*html*/ `
      <h1>Board</h1>
      <section>
        <div>Task 1</div>
        <div>Task 2</div>
        <div>Task 3</div>
      </section>
    `;

    return this.wrapWithLayout(element);
  }
}
